import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Upload,
  Sparkles,
  TrendingUp,
  Package,
  MessageSquare,
  Loader2,
  Plus,
  DollarSign,
  Eye,
  Heart,
  ShoppingCart,
} from "lucide-react";

const ArtisanDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [artisanProfile, setArtisanProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalViews: 0,
    totalFavorites: 0,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchArtisanData();
    }
  }, [user]);

  const fetchArtisanData = async () => {
    try {
      setLoading(true);

      // Fetch artisan profile
      const { data: profile, error: profileError } = await supabase
        .from("artisan_profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError;
      }

      setArtisanProfile(profile);

      // If artisan profile exists, fetch products
      if (profile) {
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("artisan_id", profile.id)
          .order("created_at", { ascending: false });

        if (productsError) throw productsError;

        setProducts(productsData || []);

        // Calculate stats
        const totalViews = productsData?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;
        const totalFavorites = productsData?.reduce((sum, p) => sum + (p.favorites || 0), 0) || 0;

        setStats({
          totalSales: profile.total_sales || 0,
          totalRevenue: parseFloat(String(profile.total_sales || 0)),
          totalViews,
          totalFavorites,
        });
      }
    } catch (error: any) {
      console.error("Error fetching artisan data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArtisanProfile = () => {
    navigate("/artisan-setup");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!artisanProfile) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-32 pb-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto p-12 text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h1 className="text-3xl font-bold mb-4">Welcome, Artisan!</h1>
              <p className="text-muted-foreground mb-8">
                Let's set up your artisan profile and start showcasing your beautiful crafts to the world.
              </p>
              <Button variant="hero" size="lg" onClick={handleCreateArtisanProfile}>
                <Plus className="w-5 h-5 mr-2" />
                Create Your Artisan Profile
              </Button>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome back, {artisanProfile.craft_type} Artisan!</h1>
            <p className="text-muted-foreground">Manage your products, track sales, and grow your business</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Revenue</span>
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">+20% from last month</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Products</span>
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active listings</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Views</span>
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold">{stats.totalViews}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all products</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Favorites</span>
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold">{stats.totalFavorites}</div>
              <p className="text-xs text-muted-foreground mt-1">Customer interest</p>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="mentor">AI Mentor</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Products</h2>
                <Button variant="hero" onClick={() => navigate("/upload-product")}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Product
                </Button>
              </div>

              {products.length === 0 ? (
                <Card className="p-12 text-center">
                  <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-bold mb-2">No products yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Upload your first product and let AI help you market it to the world!
                  </p>
                  <Button variant="hero" onClick={() => navigate("/upload-product")}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload First Product
                  </Button>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-warm transition-smooth">
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-4 right-4">
                          {product.is_available ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 line-clamp-1">{product.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold text-primary">${product.price}</span>
                          <div className="flex gap-3 text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {product.views || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {product.favorites || 0}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                          Edit Product
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  Your Growth Analytics
                </h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Revenue Growth</h3>
                    <div className="h-64 flex items-end gap-4">
                      {[5000, 8500, 12000].map((value, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-gradient-primary rounded-t-lg transition-all hover:opacity-80"
                            style={{ height: `${(value / 12000) * 100}%` }}
                          />
                          <div className="mt-4 text-center">
                            <div className="font-bold text-lg">${value}</div>
                            <div className="text-xs text-muted-foreground">Month {i + 1}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-6 bg-primary/5">
                      <h4 className="font-semibold mb-2">Before Ophelia AI</h4>
                      <div className="text-3xl font-bold text-muted-foreground">$5,000/mo</div>
                      <p className="text-sm text-muted-foreground mt-1">Average revenue</p>
                    </Card>
                    <Card className="p-6 bg-primary/10">
                      <h4 className="font-semibold mb-2">After Ophelia AI</h4>
                      <div className="text-3xl font-bold text-primary">$12,000/mo</div>
                      <p className="text-sm text-primary mt-1">+140% increase!</p>
                    </Card>
                  </div>

                  <Card className="p-6 border-2 border-primary/20">
                    <div className="flex items-start gap-4">
                      <Sparkles className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-lg mb-2">AI Insights</h4>
                        <p className="text-muted-foreground">
                          Your pottery category is trending in Europe! Consider creating more blue-toned pieces.
                          Peak buying hours are 2-4 PM EST. Your response time is excellent - keep it up!
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="mentor">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Ask Ophelia</h2>
                    <p className="text-muted-foreground">Your AI business mentor</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <Card className="p-4 bg-primary/5">
                        <p>
                          Hello! I'm Ophelia, your AI mentor. I'm here to help you grow your artisan business. Ask me
                          anything about pricing, marketing, inventory, or platform features!
                        </p>
                      </Card>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input placeholder="Ask me anything about your business..." className="flex-1" />
                  <Button variant="hero">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Ask
                  </Button>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm" className="text-left justify-start h-auto py-3">
                    <span className="text-xs">💰 How should I price my pottery?</span>
                  </Button>
                  <Button variant="outline" size="sm" className="text-left justify-start h-auto py-3">
                    <span className="text-xs">📱 Help me with social media</span>
                  </Button>
                  <Button variant="outline" size="sm" className="text-left justify-start h-auto py-3">
                    <span className="text-xs">📦 Managing inventory tips</span>
                  </Button>
                  <Button variant="outline" size="sm" className="text-left justify-start h-auto py-3">
                    <span className="text-xs">🌍 Reaching global customers</span>
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ArtisanDashboard;
