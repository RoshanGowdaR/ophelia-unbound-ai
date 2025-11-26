import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Heart, Star, Loader2, MapPin, Sparkles } from "lucide-react";
import VerificationBadge from "@/components/VerificationBadge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  artisan?: {
    full_name: string;
    country: string;
  };
  certificate?: {
    certificate_hash: string;
    issue_date: string;
    is_active: boolean;
  };
}

const emotionTags = [
  { name: "Joyful", emoji: "✨", color: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30" },
  { name: "Peaceful", emoji: "🌿", color: "from-green-500/20 to-teal-500/20 border-green-500/30" },
  { name: "Elegant", emoji: "💎", color: "from-purple-500/20 to-pink-500/20 border-purple-500/30" },
  { name: "Festive", emoji: "🎉", color: "from-red-500/20 to-orange-500/20 border-red-500/30" },
  { name: "Cozy", emoji: "🏡", color: "from-amber-500/20 to-brown-500/20 border-amber-500/30" },
  { name: "Artistic", emoji: "🎨", color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30" },
];

const Marketplace = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          artisan:artisan_profiles(
            user:profiles(full_name, country)
          ),
          certificate:product_certificates(
            certificate_hash,
            issue_date,
            is_active
          )
        `)
        .eq("is_available", true)
        .order("created_at", { ascending: false })
        .limit(12);

      if (error) throw error;

      const formattedProducts = data?.map((product: any) => ({
        ...product,
        artisan: product.artisan?.user,
        certificate: product.certificate?.[0] || null,
      })) || [];

      setProducts(formattedProducts);
    } catch (error: any) {
      toast.error("Failed to load products");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesEmotion = !selectedEmotion || 
      product.category.toLowerCase().includes(selectedEmotion.toLowerCase()) ||
      product.description.toLowerCase().includes(selectedEmotion.toLowerCase());

    return matchesSearch && matchesEmotion;
  });

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-warm">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-5xl font-bold mb-4">
              Discover Authentic
              <br />
              <span className="text-gradient">Handcrafted Treasures</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore unique products from talented artisans around the world
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by feeling: 'joyful', 'peaceful', 'festive'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14"
                />
              </div>
              <Button variant="hero" size="lg" className="h-14">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </Button>
            </div>

            {/* Emotion Filters */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              <Button
                variant={selectedEmotion === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedEmotion(null)}
                className="flex-shrink-0"
              >
                All Products
              </Button>
              {emotionTags.map((emotion) => (
                <Button
                  key={emotion.name}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedEmotion(emotion.name)}
                  className={`flex-shrink-0 gap-2 ${
                    selectedEmotion === emotion.name
                      ? `bg-gradient-to-r ${emotion.color} border-2`
                      : ""
                  }`}
                >
                  <span>{emotion.emoji}</span>
                  {emotion.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {loading ? "..." : products.length}+
              </div>
              <div className="text-sm text-muted-foreground">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">50K+</div>
              <div className="text-sm text-muted-foreground">Artisans</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">100+</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                {searchQuery ? "No products found matching your search." : "No products available yet."}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Check back soon for amazing handcrafted items!
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">
                  {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
                </h2>
                <p className="text-muted-foreground">
                  {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-warm transition-smooth group cursor-pointer"
                    onClick={() => window.location.href = `/product/${product.id}`}
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                      />
                      <Button
                        variant="glass"
                        size="icon"
                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-smooth"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <VerificationBadge
                          certificateHash={product.certificate?.certificate_hash}
                          issueDate={product.certificate?.issue_date}
                          artisanName={product.artisan?.full_name}
                          productTitle={product.title}
                          isActive={product.certificate?.is_active}
                          size="sm"
                          showDetails={false}
                        />
                        <Badge className="glass-effect">{product.category}</Badge>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 line-clamp-1">{product.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Artisan Info */}
                      {product.artisan && (
                        <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>
                            {product.artisan.full_name} • {product.artisan.country}
                          </span>
                        </div>
                      )}

                      {/* Price and Rating */}
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold text-primary">
                          ${product.price.toFixed(2)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">4.8</span>
                        </div>
                      </div>

                      <Button variant="hero" className="w-full mt-4" onClick={(e) => e.stopPropagation()}>
                        <Sparkles className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Marketplace;
