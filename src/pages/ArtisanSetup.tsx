import { useState, useEffect } from "react";
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
import { Sparkles, Loader2 } from "lucide-react";

const ArtisanSetup = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    craftType: "",
    yearsOfExperience: "",
    specialties: "",
    workshopLocation: "",
    story: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from("artisan_profiles")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      if (existingProfile) {
        toast.error("Artisan profile already exists");
        navigate("/artisan-dashboard");
        return;
      }

      // Create artisan profile
      const { error } = await supabase.from("artisan_profiles").insert({
        user_id: user?.id,
        craft_type: formData.craftType,
        years_of_experience: parseInt(formData.yearsOfExperience) || null,
        specialties: formData.specialties.split(",").map((s) => s.trim()),
        workshop_location: formData.workshopLocation,
        story: formData.story,
        certification_level: "verified",
      });

      if (error) throw error;

      toast.success("Artisan profile created successfully!");
      navigate("/artisan-dashboard");
    } catch (error: any) {
      console.error("Error creating artisan profile:", error);
      toast.error("Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Welcome, Artisan!</h1>
              <p className="text-muted-foreground">Tell us about your craft so we can help you succeed</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="craftType">What type of craft do you create? *</Label>
                <Input
                  id="craftType"
                  required
                  value={formData.craftType}
                  onChange={(e) => setFormData({ ...formData, craftType: e.target.value })}
                  placeholder="e.g., Pottery, Textile Weaving, Wood Carving"
                />
              </div>

              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                  placeholder="10"
                />
              </div>

              <div>
                <Label htmlFor="specialties">Your Specialties (comma-separated)</Label>
                <Input
                  id="specialties"
                  value={formData.specialties}
                  onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                  placeholder="Blue pottery, Traditional designs, Custom orders"
                />
              </div>

              <div>
                <Label htmlFor="location">Workshop Location</Label>
                <Input
                  id="location"
                  value={formData.workshopLocation}
                  onChange={(e) => setFormData({ ...formData, workshopLocation: e.target.value })}
                  placeholder="Jaipur, Rajasthan, India"
                />
              </div>

              <div>
                <Label htmlFor="story">Your Story (Optional)</Label>
                <Textarea
                  id="story"
                  rows={5}
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  placeholder="Tell customers about your journey, craft tradition, and what makes your work special..."
                />
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => navigate("/")} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" variant="hero" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    "Create Profile"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ArtisanSetup;
