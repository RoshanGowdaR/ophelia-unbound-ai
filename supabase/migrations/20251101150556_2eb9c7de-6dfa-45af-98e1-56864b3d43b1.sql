-- Create product certificates table for verified badges
CREATE TABLE public.product_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL UNIQUE,
  certificate_hash TEXT NOT NULL UNIQUE,
  issue_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  issuer_id UUID REFERENCES auth.users(id) NOT NULL,
  verification_criteria JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_certificates ENABLE ROW LEVEL SECURITY;

-- Certificates are viewable by everyone
CREATE POLICY "Certificates are viewable by everyone"
ON public.product_certificates
FOR SELECT
USING (true);

-- Only artisans can create certificates for their own products
CREATE POLICY "Artisans can create certificates for own products"
ON public.product_certificates
FOR INSERT
WITH CHECK (
  auth.uid() = issuer_id AND
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.artisan_profiles ap ON p.artisan_id = ap.id
    WHERE p.id = product_id AND ap.user_id = auth.uid()
  )
);

-- Function to generate certificate hash
CREATE OR REPLACE FUNCTION public.generate_certificate_hash(
  p_product_id UUID,
  p_issuer_id UUID,
  p_timestamp TIMESTAMP WITH TIME ZONE
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_hash TEXT;
BEGIN
  -- Generate SHA256 hash from product_id + issuer_id + timestamp
  v_hash := encode(
    digest(
      p_product_id::text || p_issuer_id::text || p_timestamp::text,
      'sha256'
    ),
    'hex'
  );
  
  RETURN 'OPH-' || substring(v_hash from 1 for 32);
END;
$$;

-- Create index for faster lookups
CREATE INDEX idx_product_certificates_product_id ON public.product_certificates(product_id);
CREATE INDEX idx_product_certificates_hash ON public.product_certificates(certificate_hash);

-- Add copyright check function (basic duplicate detection)
CREATE OR REPLACE FUNCTION public.check_product_originality(
  p_title TEXT,
  p_description TEXT,
  p_artisan_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_duplicate_count INTEGER;
BEGIN
  -- Check for very similar titles from different artisans
  SELECT COUNT(*) INTO v_duplicate_count
  FROM public.products
  WHERE artisan_id != p_artisan_id
    AND (
      LOWER(title) = LOWER(p_title)
      OR similarity(title, p_title) > 0.8
    );
  
  RETURN v_duplicate_count = 0;
END;
$$;

-- Enable pg_trgm extension for similarity checking
CREATE EXTENSION IF NOT EXISTS pg_trgm;