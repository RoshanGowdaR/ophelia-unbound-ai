import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Heart, Star, MapPin, Loader2, ShoppingCart, 
  Camera, Package, Truck, Award, User, Eye, Shield
} from "lucide-react";
import VerificationBadge from "@/components/VerificationBadge";

interface Product {
  id: string;
  title: string;
  description: string;
  story: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  materials: string[];
  dimensions: string;
  stock_quantity: number;
  views: number;
  favorites: number;
  tags: string[];
  certificate?: {
    certificate_hash: string;
    issue_date: string;
    is_active: boolean;
  };
  artisan?: {
    id: string;
    user_id: string;
    craft_type: string;
    years_of_experience: number;
    specialties: string[];
    workshop_location: string;
    certification_level: string;
    total_sales: number;
    rating: number;
    user: {
      full_name: string;
      country: string;
      avatar_url: string;
    };
  };
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProduct();
      incrementViews();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          artisan:artisan_profiles(
            *,
            user:profiles(full_name, country, avatar_url)
          ),
          certificate:product_certificates(
            certificate_hash,
            issue_date,
            is_active
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      const formattedProduct = {
        ...data,
        artisan: {
          ...data.artisan,
          user: data.artisan?.user,
        },
        certificate: data.certificate?.[0] || null,
      };

      setProduct(formattedProduct);
    } catch (error: any) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
      navigate("/marketplace");
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ views: (product?.views || 0) + 1 })
        .eq("id", id);
      
      if (error) console.error("Error incrementing views:", error);
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-8 text-sm text-muted-foreground">
            <button onClick={() => navigate("/marketplace")} className="hover:text-primary">
              Marketplace
            </button>
            {" / "}
            <span className="text-foreground">{product.title}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Images & AR */}
            <div className="space-y-6">
              {/* Main Image */}
              <Card className="overflow-hidden aspect-square">
                <img
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </Card>

              {/* Thumbnail Gallery */}
              <div className="flex gap-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-smooth ${
                      selectedImage === index ? "border-primary" : "border-border"
                    }`}
                  >
                    <img src={image} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* AR Preview Button */}
              <Card className="p-6 glass-effect">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold mb-1">View in Your Space</h3>
                    <p className="text-sm text-muted-foreground">See how this craft looks in your home</p>
                  </div>
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <Button variant="hero" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Launch AR Preview
                </Button>
              </Card>
            </div>

            {/* Right: Product Info */}
            <div className="space-y-6">
              {/* Title & Verified Badge */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-4xl font-bold">{product.title}</h1>
                  <Button variant="ghost" size="icon">
                    <Heart className="w-6 h-6" />
                  </Button>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <VerificationBadge
                    certificateHash={product.certificate?.certificate_hash}
                    issueDate={product.certificate?.issue_date}
                    artisanName={product.artisan?.user.full_name}
                    productTitle={product.title}
                    isActive={product.certificate?.is_active}
                    size="lg"
                    showDetails={true}
                  />
                  <Badge>{product.category}</Badge>
                  {product.tags?.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Price & Stats */}
              <Card className="p-6">
                <div className="flex items-baseline gap-4 mb-4">
                  <div className="text-4xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">4.8</span>
                    <span className="text-sm">(127 reviews)</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {product.views} views
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    {product.favorites} favorites
                  </div>
                </div>
              </Card>

              {/* Add to Cart */}
              <div className="flex gap-4">
                <Button variant="hero" size="lg" className="flex-1">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  Buy Now
                </Button>
              </div>

              {/* Artisan Info */}
              {product.artisan && (
                <Card className="p-6 glass-effect">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                      {product.artisan.user.avatar_url ? (
                        <img
                          src={product.artisan.user.avatar_url}
                          alt={product.artisan.user.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-full h-full p-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{product.artisan.user.full_name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {product.artisan.workshop_location}, {product.artisan.user.country}
                      </div>
                    </div>
                    {product.artisan.certification_level && (
                      <Badge variant="secondary" className="gap-1">
                        <Award className="w-3 h-3" />
                        {product.artisan.certification_level}
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Experience</div>
                      <div className="font-medium">{product.artisan.years_of_experience} years</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Total Sales</div>
                      <div className="font-medium">{product.artisan.total_sales}</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    View Artisan Profile
                  </Button>
                </Card>
              )}

              {/* Shipping Info */}
              <Card className="p-4 flex items-center gap-3 text-sm">
                <Truck className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <span className="font-medium">Free shipping</span> on orders over $50 • Arrives in 5-7 business days
                </div>
              </Card>
            </div>
          </div>

          {/* Tabs: Description, Story, Details */}
          <div className="mt-16">
            <Tabs defaultValue="story">
              <TabsList className="w-full justify-start mb-8">
                <TabsTrigger value="story">Product Story</TabsTrigger>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="provenance">Provenance</TabsTrigger>
              </TabsList>

              <TabsContent value="story" className="max-w-3xl">
                <Card className="p-8">
                  <h3 className="text-2xl font-bold mb-4">The Story Behind This Craft</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {product.story || "Every craft has a story to tell..."}
                  </p>
                </Card>
              </TabsContent>

              <TabsContent value="description" className="max-w-3xl">
                <Card className="p-8">
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="max-w-3xl">
                <Card className="p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    {product.materials && product.materials.length > 0 && (
                      <div>
                        <div className="font-bold mb-2 flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          Materials
                        </div>
                        <div className="text-muted-foreground">
                          {product.materials.join(", ")}
                        </div>
                      </div>
                    )}
                    {product.dimensions && (
                      <div>
                        <div className="font-bold mb-2">Dimensions</div>
                        <div className="text-muted-foreground">{product.dimensions}</div>
                      </div>
                    )}
                    <div>
                      <div className="font-bold mb-2">Availability</div>
                      <div className="text-muted-foreground">
                        {product.stock_quantity > 0 
                          ? `${product.stock_quantity} in stock` 
                          : "Made to order"}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold mb-2">Craft Type</div>
                      <div className="text-muted-foreground">{product.artisan?.craft_type}</div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="provenance" className="max-w-3xl">
                <Card className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="text-xl font-bold">Certificate of Authenticity</h3>
                      <p className="text-sm text-muted-foreground">Blockchain-verified provenance</p>
                    </div>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between p-4 bg-muted rounded-lg">
                      <span className="text-muted-foreground">Creator</span>
                      <span className="font-medium">{product.artisan?.user.full_name}</span>
                    </div>
                    <div className="flex justify-between p-4 bg-muted rounded-lg">
                      <span className="text-muted-foreground">Origin</span>
                      <span className="font-medium">{product.artisan?.workshop_location}</span>
                    </div>
                    <div className="flex justify-between p-4 bg-muted rounded-lg">
                      <span className="text-muted-foreground">Craft Type</span>
                      <span className="font-medium">{product.artisan?.craft_type}</span>
                    </div>
                    <div className="flex justify-between p-4 bg-muted rounded-lg">
                      <span className="text-muted-foreground">Materials</span>
                      <span className="font-medium">{product.materials?.join(", ")}</span>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
