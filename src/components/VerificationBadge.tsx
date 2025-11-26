import { useState } from "react";
import { Shield, CheckCircle, Calendar, User, Hash, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

interface VerificationBadgeProps {
  certificateHash?: string;
  issueDate?: string;
  artisanName?: string;
  productTitle?: string;
  isActive?: boolean;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
}

const VerificationBadge = ({
  certificateHash,
  issueDate,
  artisanName,
  productTitle,
  isActive = true,
  size = "md",
  showDetails = true,
}: VerificationBadgeProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!certificateHash) {
    return null;
  }

  const sizeClasses = {
    sm: "text-xs py-1 px-2",
    md: "text-sm py-1.5 px-3",
    lg: "text-base py-2 px-4",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateHash = (hash: string) => {
    return `${hash.substring(0, 15)}...${hash.substring(hash.length - 8)}`;
  };

  const BadgeContent = () => (
    <Badge
      variant="secondary"
      className={`gap-1.5 glass-effect cursor-pointer hover:scale-105 transition-smooth ${
        isActive
          ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/40"
          : "bg-muted"
      } ${sizeClasses[size]}`}
    >
      <Shield className={`${iconSizes[size]} ${isActive ? "text-green-500" : "text-muted-foreground"}`} />
      <span className="font-semibold">Ophelia Certified</span>
    </Badge>
  );

  if (!showDetails) {
    return <BadgeContent />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="inline-block">
          <BadgeContent />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Award className="w-8 h-8 text-primary" />
            Certificate of Authenticity
          </DialogTitle>
          <DialogDescription>
            This product has been verified and certified by Ophelia
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Certificate Status */}
          <Card className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <h3 className="font-bold text-lg">Verified Authentic</h3>
                <p className="text-sm text-muted-foreground">
                  This craft has passed all authenticity and originality checks
                </p>
              </div>
            </div>

            {/* Verification Criteria */}
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Original Design</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Copyright Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Artisan Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Quality Assured</span>
              </div>
            </div>
          </Card>

          {/* Certificate Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted">
              <Hash className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-muted-foreground mb-1">Certificate ID</div>
                <div className="font-mono text-sm break-all">{certificateHash}</div>
              </div>
            </div>

            {productTitle && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted">
                <Award className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Product</div>
                  <div className="font-medium">{productTitle}</div>
                </div>
              </div>
            )}

            {artisanName && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted">
                <User className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Certified Artisan</div>
                  <div className="font-medium">{artisanName}</div>
                </div>
              </div>
            )}

            {issueDate && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted">
                <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Issue Date</div>
                  <div className="font-medium">{formatDate(issueDate)}</div>
                </div>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium mb-1">Tamper-Proof Certificate</p>
                <p className="text-muted-foreground">
                  This certificate uses cryptographic hashing to ensure authenticity. Each certificate is
                  unique and cannot be forged or duplicated.
                </p>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>
              Close
            </Button>
            <Button variant="hero" className="flex-1">
              <Shield className="w-4 h-4 mr-2" />
              Verify Certificate
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationBadge;
