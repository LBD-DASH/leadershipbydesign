import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Tag, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OrderBump {
  title: string;
  price: number;
  priceDisplay: string;
  description: string;
}

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  price: number; // Price in ZAR
  priceDisplay: string;
  successPath?: string; // Custom success page path
  orderBump?: OrderBump;
}

const colors = {
  navy: "#1B2A4A",
  gold: "#C8A864",
};

// Valid discount codes
const DISCOUNT_CODES: Record<string, number> = {
  "LEADERFREE100": 100, // 100% off
};

export function CheckoutModal({ 
  open, 
  onOpenChange, 
  productName, 
  price,
  priceDisplay,
  successPath = "/new-manager-kit/success",
  orderBump,
}: CheckoutModalProps) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bumpChecked, setBumpChecked] = useState(false);

  const basePrice = appliedDiscount ? price * (1 - appliedDiscount / 100) : price;
  const finalPrice = basePrice + (bumpChecked && orderBump ? orderBump.price : 0);

  const handleApplyDiscount = () => {
    const code = discountCode.trim().toUpperCase();
    if (DISCOUNT_CODES[code]) {
      setAppliedDiscount(DISCOUNT_CODES[code]);
      toast.success(`Discount applied: ${DISCOUNT_CODES[code]}% off!`);
    } else {
      toast.error("Invalid discount code");
      setAppliedDiscount(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    // If 100% discount, skip payment and go directly to success
    if (finalPrice === 0) {
      toast.success("Discount applied! Redirecting to your download...");
      onOpenChange(false);
      const bumpParam = bumpChecked && orderBump ? "&bump=true" : "";
      navigate(`${successPath}?reference=FREE_DISCOUNT&trxref=FREE_DISCOUNT${bumpParam}`);
      return;
    }

    try {
      const bumpParam = bumpChecked && orderBump ? "?bump=true" : "";
      const callbackUrl = `${window.location.origin}${successPath}${bumpParam}`;
      const productLabel = bumpChecked && orderBump ? `${productName} + ${orderBump.title}` : productName;
      
      const { data, error } = await supabase.functions.invoke('paystack-checkout', {
        body: {
          email: email.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          amount: finalPrice * 100, // Convert to kobo/cents
          productName: productLabel,
          callbackUrl,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.authorization_url) {
        // Redirect to Paystack checkout
        window.location.href = data.authorization_url;
      } else {
        throw new Error("No authorization URL received");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to initialize payment. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle 
            className="text-2xl font-serif text-center"
            style={{ color: colors.navy }}
          >
            Complete Your Purchase
          </DialogTitle>
        </DialogHeader>

        <div className="text-center mb-6">
          <p className="text-gray-600 text-sm">{productName}</p>
          {appliedDiscount === 100 ? (
            <div className="mt-2">
              <span className="text-gray-400 line-through text-xl mr-2">{priceDisplay}</span>
              <span className="text-3xl font-bold text-green-600">FREE</span>
            </div>
          ) : (
            <p className="text-3xl font-bold mt-2" style={{ color: colors.gold }}>
              {priceDisplay}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Surname</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">
              Your receipt and download link will be sent here
            </p>
          </div>

          {/* Discount Code */}
          <div className="space-y-2">
            <Label htmlFor="discountCode">Discount Code (optional)</Label>
            <div className="flex gap-2">
              <Input
                id="discountCode"
                placeholder="Enter code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                disabled={isLoading || appliedDiscount !== null}
                className="flex-1"
              />
              {appliedDiscount !== null ? (
                <div className="flex items-center gap-1 px-3 text-green-600 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Applied
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleApplyDiscount}
                  disabled={isLoading || !discountCode.trim()}
                >
                  <Tag className="w-4 h-4 mr-1" />
                  Apply
                </Button>
              )}
            </div>
          </div>

          {/* Order Bump */}
          {orderBump && (
            <div 
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                bumpChecked ? "border-primary bg-primary/5" : "border-dashed border-border hover:border-primary/50"
              }`}
              onClick={() => setBumpChecked(!bumpChecked)}
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bumpChecked}
                  onChange={(e) => setBumpChecked(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-primary"
                  disabled={isLoading}
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    ✅ Add {orderBump.title} for {orderBump.priceDisplay}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {orderBump.description}
                  </p>
                </div>
              </label>
            </div>
          )}

          <Button
            type="submit"
            className="w-full text-lg py-6 font-semibold transition-all duration-300"
            style={{ backgroundColor: colors.gold, color: colors.navy }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : finalPrice === 0 ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Get Free Access
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Pay R{finalPrice} Securely
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Lock className="w-3 h-3" />
            <span>Secured by Paystack • 256-bit encryption</span>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}