import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  price: number; // Price in ZAR
  priceDisplay: string;
}

const colors = {
  navy: "#1B2A4A",
  gold: "#C8A864",
};

export function CheckoutModal({ 
  open, 
  onOpenChange, 
  productName, 
  price,
  priceDisplay 
}: CheckoutModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

    try {
      const callbackUrl = `${window.location.origin}/new-manager-kit/success`;
      
      const { data, error } = await supabase.functions.invoke('paystack-checkout', {
        body: {
          email: email.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          amount: price * 100, // Convert to kobo/cents
          productName,
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
          <p className="text-3xl font-bold mt-2" style={{ color: colors.gold }}>
            {priceDisplay}
          </p>
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
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Pay {priceDisplay} Securely
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
