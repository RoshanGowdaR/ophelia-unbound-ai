import { useState } from "react";
import { Shield, Check, Calendar, User, FileText, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VerifiedBadgeProps {
  productId: string;
  variant?: "default" | "secondary";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

interface Certificate {
  id: string;
  certificate_hash: string;
  issue_date: string;
  verification_criteria: any;
  issuer_id: string;
  product: {
    title: string;
    category: string;
    artisan: {
      user: {
        full_name: string;
      };
    };
  };
}

const VerifiedBadge = ({ 
  productId, 
  variant = "secondary",
  size = "md",
  showLabel = true 
}: VerifiedBadgeProps) => {
  const [open, setOpen] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(false);

  const sizeClasses = {
    sm: "gap-1 text-xs px-2 py-1",
    md: "gap-1.5 text-sm",
    lg: "gap-2 text-base px-4 py-2"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4"
  };

  const fetchCertificate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("product_certificates")
        .select(`
          *,
          product:products(
            title,
            category,
            artisan:artisan_profiles(
              user:profiles(full_name)
            )
          )
        `)
        .eq("product_id", productId)
        .eq("is_active", true)
        .single();

      if (error) throw error;

      setCertificate(data as any);
      setOpen(true);
    } catch (error: any) {
      console.error("Error fetching certificate:", error);
      toast.error("Could not load certificate details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Badge
        variant={variant}
        className={`cursor-pointer hover:opacity-80 transition-smooth ${sizeClasses[size]}`}
        onClick={fetchCertificate}
      >
        <Shield className={iconSizes[size]} />
        {showLabel && "Ophelia Certified"}
      </Badge>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Ophelia Certified</DialogTitle>
                <DialogDescription>
                  Certificate of Authenticity & Provenance
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {loading ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading certificate details...
            </div>
          ) : certificate ? (
            <div className="space-y-6">
              {/* Certificate Badge */}
              <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border-2 border-primary/20">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <h3 className="text-center text-xl font-bold mb-2">
                  This craft is verified authentic
                </h3>
                <p className="text-center text-sm text-muted-foreground">
                  Protected by Ophelia's provenance system
                </p>
              </div>

              {/* Certificate Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <FileText className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">Product Name</div>
                    <div className="font-medium">{certificate.product.title}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <User className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">Artisan</div>
                    <div className="font-medium">
                      {certificate.product.artisan?.user?.full_name || "Unknown Artisan"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">Issue Date</div>
                    <div className="font-medium">
                      {new Date(certificate.issue_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Hash className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">Certificate ID</div>
                    <div className="font-mono text-xs break-all">
                      {certificate.certificate_hash}
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Criteria */}
              {certificate.verification_criteria && 
               Object.keys(certificate.verification_criteria).length > 0 && (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    Verification Criteria Met
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {certificate.verification_criteria.originality_check && (
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Originality verified - no duplicates found</span>
                      </li>
                    )}
                    {certificate.verification_criteria.copyright_check && (
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Copyright compliance verified</span>
                      </li>
                    )}
                    {certificate.verification_criteria.artisan_verified && (
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Artisan identity confirmed</span>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Footer */}
              <div className="text-center text-xs text-muted-foreground pt-4 border-t">
                This certificate is tamper-proof and cryptographically secured.
                <br />
                Certificate ID can be verified at any time.
              </div>

              <Button 
                variant="hero" 
                className="w-full"
                onClick={() => {
                  navigator.clipboard.writeText(certificate.certificate_hash);
                  toast.success("Certificate ID copied to clipboard");
                }}
              >
                Copy Certificate ID
              </Button>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              Certificate details not available
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VerifiedBadge;
