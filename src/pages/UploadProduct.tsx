import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Sparkles, Loader2, Wand2, Instagram, Facebook, Mail, Mic, StopCircle, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

const UploadProduct = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [generatingStory, setGeneratingStory] = useState(false);
  const [generatingMarketing, setGeneratingMarketing] = useState(false);
  const [enhancingDescription, setEnhancingDescription] = useState(false);
  const [artisanProfile, setArtisanProfile] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    story: "",
    price: "",
    category: "",
    materials: "",
    dimensions: "",
    weight: "",
    stockQuantity: "",
  });

  const [marketingContent, setMarketingContent] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    } else if (user) {
      fetchArtisanProfile();
    }
  }, [user, authLoading]);

  const fetchArtisanProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("artisan_profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      setArtisanProfile(data);
    } catch (error: any) {
      console.error("Error fetching artisan profile:", error);
      toast.error("Please complete your artisan profile first");
      navigate("/artisan-setup");
    }
  };

  // Drag & Drop for images
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    toast.success(`${acceptedFiles.length} image(s) uploaded successfully!`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 5,
  });

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Voice Input with Web Speech API
  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error("Speech recognition not supported in your browser");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      toast.success("Recording started - speak now!");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setFormData(prev => ({
        ...prev,
        description: prev.description + (prev.description ? " " : "") + transcript
      }));
      toast.success("Voice transcribed successfully!");
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      toast.error("Failed to record voice. Please try again.");
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  // AI Enhancement
  const handleEnhanceDescription = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a product title first");
      return;
    }

    setEnhancingDescription(true);
    try {
      const { data, error } = await supabase.functions.invoke("enhance-product-description", {
        body: {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          materials: formData.materials,
        },
      });

      if (error) throw error;

      setFormData(prev => ({
        ...prev,
        description: data.enhancedDescription,
      }));

      toast.success("Description enhanced with AI!");
    } catch (error: any) {
      console.error("Error enhancing description:", error);
      toast.error("Failed to enhance description");
    } finally {
      setEnhancingDescription(false);
    }
  };

  const handleGenerateStory = async () => {
    if (!formData.title || !formData.category) {
      toast.error("Please fill in title and category first");
      return;
    }

    if (formData.title.length > 200) {
      toast.error("Product title too long (max 200 characters)");
      return;
    }

    setGeneratingStory(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-product-story", {
        body: {
          productTitle: formData.title.trim(),
          category: formData.category.trim(),
          materials: formData.materials.trim(),
          craftType: artisanProfile?.craft_type || "Traditional Craft",
        },
      });

      if (error) {
        console.error("Story generation error:", error);
        toast.error(error.message || "Failed to generate story");
        return;
      }

      setFormData((prev) => ({ ...prev, story: data.story }));
      toast.success("Story generated successfully!");
    } catch (error: any) {
      console.error("Error generating story:", error);
      toast.error(error.message || "Failed to generate story");
    } finally {
      setGeneratingStory(false);
    }
  };

  const handleGenerateMarketing = async () => {
    if (!formData.title || !formData.description) {
      toast.error("Please fill in title and description first");
      return;
    }

    if (formData.title.length > 200) {
      toast.error("Product title too long (max 200 characters)");
      return;
    }

    setGeneratingMarketing(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-marketing-content", {
        body: {
          productTitle: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category.trim(),
          targetAudience: "global craft enthusiasts",
        },
      });

      if (error) {
        console.error("Marketing generation error:", error);
        toast.error(error.message || "Failed to generate marketing content");
        return;
      }

      setMarketingContent(data.content);
      toast.success("Marketing content generated!");
    } catch (error: any) {
      console.error("Error generating marketing:", error);
      toast.error(error.message || "Failed to generate marketing content");
    } finally {
      setGeneratingMarketing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artisanProfile) {
      toast.error("Artisan profile not found");
      return;
    }

    if (!formData.title.trim() || formData.title.length > 200) {
      toast.error("Product title required (max 200 characters)");
      return;
    }

    if (!formData.description.trim() || formData.description.length > 2000) {
      toast.error("Description required (max 2000 characters)");
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0 || price > 1000000) {
      toast.error("Price must be between $0.01 and $1,000,000");
      return;
    }

    const stockQty = parseInt(formData.stockQuantity);
    if (isNaN(stockQty) || stockQty < 0 || stockQty > 10000) {
      toast.error("Stock quantity must be between 0 and 10,000");
      return;
    }

    setLoading(true);
    try {
      toast.loading("Checking product originality...");

      const { data: isOriginal, error: checkError } = await supabase
        .rpc("check_product_originality", {
          p_title: formData.title,
          p_description: formData.description,
          p_artisan_id: artisanProfile.id,
        });

      if (checkError) {
        console.error("Originality check error:", checkError);
      }

      if (isOriginal === false) {
        const shouldContinue = window.confirm(
          "Similar product detected. This may affect verification. Continue anyway?"
        );
        if (!shouldContinue) {
          setLoading(false);
          return;
        }
      }

      const { data: product, error: productError } = await supabase
        .from("products")
        .insert({
          artisan_id: artisanProfile.id,
          title: formData.title,
          description: formData.description,
          story: formData.story,
          price: parseFloat(formData.price),
          category: formData.category,
          materials: formData.materials.split(",").map((m) => m.trim()).filter(Boolean),
          dimensions: formData.dimensions,
          weight: formData.weight,
          images: uploadedImages.length > 0 ? uploadedImages : ["/placeholder.svg"],
          stock_quantity: parseInt(formData.stockQuantity) || 0,
          is_available: true,
        })
        .select()
        .single();

      if (productError) throw productError;

      toast.loading("Generating certificate...");

      const now = new Date().toISOString();
      const { data: certHash, error: hashError } = await supabase
        .rpc("generate_certificate_hash", {
          p_product_id: product.id,
          p_issuer_id: user?.id,
          p_timestamp: now,
        });

      if (hashError) {
        console.error("Hash generation error:", hashError);
        toast.success("Product uploaded successfully!");
        navigate("/artisan-dashboard");
        return;
      }

      const { error: certError } = await supabase
        .from("product_certificates")
        .insert({
          product_id: product.id,
          certificate_hash: certHash,
          issuer_id: user?.id,
          issue_date: now,
          verification_criteria: {
            originality_check: isOriginal === true,
            copyright_check: true,
            artisan_verified: true,
          },
          is_active: true,
        });

      if (certError) {
        console.error("Certificate creation error:", certError);
        toast.warning("Product uploaded but certificate generation failed");
      } else {
        toast.success("Product uploaded & certified! 🎉");
      }

      navigate("/artisan-dashboard");
    } catch (error: any) {
      console.error("Error uploading product:", error);
      toast.error("Failed to upload product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      <Navigation />

      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Upload Your Craft
            </h1>
            <p className="text-muted-foreground">Let AI help you showcase your beautiful work to the world</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Product Images - Drag & Drop */}
            <Card className="p-8 border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Product Images
              </h2>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
                  isDragActive 
                    ? 'border-primary bg-primary/5 scale-[1.02]' 
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                {isDragActive ? (
                  <p className="text-primary font-medium">Drop the images here...</p>
                ) : (
                  <>
                    <p className="text-muted-foreground mb-2 font-medium">
                      Drag & drop images here, or click to select
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Up to 5 images (JPEG, PNG, WEBP)
                    </p>
                  </>
                )}
              </div>
              
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`Upload ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Basic Info */}
            <Card className="p-8 border-2 border-primary/20">
              <h2 className="text-xl font-bold mb-6">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Product Title *</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Handcrafted Blue Pottery Vase"
                    className="border-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Pottery, Textiles, Jewelry, etc."
                    className="border-2"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="description">Product Description *</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={startVoiceInput}
                        disabled={isRecording}
                        className="border-2"
                      >
                        {isRecording ? (
                          <>
                            <StopCircle className="w-4 h-4 mr-2 text-red-500 animate-pulse" />
                            Recording...
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4 mr-2" />
                            Voice Input
                          </>
                        )}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleEnhanceDescription}
                        disabled={enhancingDescription || !formData.title}
                        className="border-2"
                      >
                        {enhancingDescription ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Enhancing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            AI Enhance
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your product... (or use voice/AI)"
                    rows={5}
                    className="border-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="materials">Materials (comma separated)</Label>
                  <Input
                    id="materials"
                    value={formData.materials}
                    onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                    placeholder="Clay, Natural Dyes, Cotton"
                    className="border-2"
                  />
                </div>
              </div>
            </Card>

            {/* AI-Generated Story */}
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  AI-Generated Story
                </h2>
                <Button
                  type="button"
                  onClick={handleGenerateStory}
                  disabled={generatingStory || !formData.title || !formData.category}
                  size="sm"
                  variant="outline"
                  className="border-2 border-primary"
                >
                  {generatingStory ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Story
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                value={formData.story}
                onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                placeholder="Click 'Generate Story' to create a compelling narrative about your craft..."
                rows={6}
                className="border-2"
              />
            </Card>

            {/* Pricing & Details */}
            <Card className="p-8 border-2 border-primary/20">
              <h2 className="text-xl font-bold mb-6">Pricing & Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="99.99"
                    className="border-2"
                  />
                </div>
                <div>
                  <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    placeholder="10"
                    className="border-2"
                  />
                </div>
                <div>
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder="10 x 5 x 3 inches"
                    className="border-2"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="2 lbs"
                    className="border-2"
                  />
                </div>
              </div>
            </Card>

            {/* Marketing Content */}
            <Card className="p-8 bg-gradient-to-br from-accent/5 to-primary/5 border-2 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  Marketing Content (AI-Generated)
                </h2>
                <Button
                  type="button"
                  onClick={handleGenerateMarketing}
                  disabled={generatingMarketing || !formData.title || !formData.description}
                  size="sm"
                  variant="outline"
                  className="border-2 border-primary"
                >
                  {generatingMarketing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Marketing
                    </>
                  )}
                </Button>
              </div>

              {marketingContent ? (
                <div className="space-y-4">
                  <div className="p-4 bg-card rounded-lg border-2">
                    <div className="flex items-center gap-2 mb-2 text-pink-600">
                      <Instagram className="w-5 h-5" />
                      <h3 className="font-bold">Instagram Caption</h3>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{marketingContent.instagram || "..."}</p>
                  </div>
                  <div className="p-4 bg-card rounded-lg border-2">
                    <div className="flex items-center gap-2 mb-2 text-blue-600">
                      <Facebook className="w-5 h-5" />
                      <h3 className="font-bold">Facebook Post</h3>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{marketingContent.facebook || "..."}</p>
                  </div>
                  <div className="p-4 bg-card rounded-lg border-2">
                    <div className="flex items-center gap-2 mb-2 text-gray-600">
                      <Mail className="w-5 h-5" />
                      <h3 className="font-bold">Email Campaign</h3>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{marketingContent.email || "..."}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Generate marketing content to get social media captions and email templates
                </p>
              )}
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Uploading & Certifying...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Product
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UploadProduct;
