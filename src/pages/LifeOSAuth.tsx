import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const LifeOSAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, resetPassword, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/life-os");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isForgotPassword) {
        const { error } = await resetPassword(email);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Password reset email sent! Check your inbox.");
          setIsForgotPassword(false);
        }
      } else if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Welcome back, Sovereign");
          navigate("/life-os");
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Check your email to confirm your account");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="life-os min-h-screen bg-[hsl(var(--los-background))] flex items-center justify-center p-6">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-[hsl(var(--los-gold)/0.05)] via-transparent to-[hsl(var(--los-wisdom)/0.05)]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Glass card */}
        <div className="backdrop-blur-xl bg-[hsl(var(--los-glass)/0.6)] border border-[hsl(var(--los-border))] rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--los-gold))] to-[hsl(var(--los-gold-dim))] mb-4"
            >
              <Crown className="w-8 h-8 text-[hsl(var(--los-background))]" />
            </motion.div>
            <h1 className="text-2xl font-semibold text-[hsl(var(--los-foreground))] tracking-tight">
              The Sovereign
            </h1>
            <p className="text-[hsl(var(--los-muted-foreground))] mt-2 text-sm">
              {isForgotPassword 
                ? "Enter your email to reset your password" 
                : isLogin 
                  ? "Welcome back to your Life-OS" 
                  : "Begin your sovereign journey"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[hsl(var(--los-gold))] font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--los-muted-foreground))]" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sovereign@example.com"
                  required
                  className="pl-11 h-12 bg-[hsl(var(--los-muted))] border-[hsl(var(--los-border))] text-[hsl(var(--los-foreground))] placeholder:text-[hsl(var(--los-muted-foreground))] rounded-xl focus:border-[hsl(var(--los-gold))] focus:ring-[hsl(var(--los-gold)/0.2)]"
                />
              </div>
            </div>

            {!isForgotPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-wider text-[hsl(var(--los-gold))] font-medium">
                    Password
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-xs text-[hsl(var(--los-muted-foreground))] hover:text-[hsl(var(--los-gold))] transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--los-muted-foreground))]" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="pl-11 pr-11 h-12 bg-[hsl(var(--los-muted))] border-[hsl(var(--los-border))] text-[hsl(var(--los-foreground))] placeholder:text-[hsl(var(--los-muted-foreground))] rounded-xl focus:border-[hsl(var(--los-gold))] focus:ring-[hsl(var(--los-gold)/0.2)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[hsl(var(--los-muted-foreground))] hover:text-[hsl(var(--los-foreground))] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-[hsl(var(--los-gold))] to-[hsl(var(--los-gold-dim))] hover:opacity-90 text-[hsl(var(--los-background))] font-semibold rounded-xl transition-all duration-300"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-2 border-[hsl(var(--los-background))] border-t-transparent rounded-full"
                />
              ) : (
                <>
                  {isForgotPassword ? "Send Reset Link" : isLogin ? "Enter the Realm" : "Create Account"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                if (isForgotPassword) {
                  setIsForgotPassword(false);
                } else {
                  setIsLogin(!isLogin);
                }
              }}
              className="text-sm text-[hsl(var(--los-muted-foreground))] hover:text-[hsl(var(--los-gold))] transition-colors"
            >
              {isForgotPassword 
                ? "Back to sign in" 
                : isLogin 
                  ? "New here? Create an account" 
                  : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[hsl(var(--los-gold)/0.1)] rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[hsl(var(--los-wisdom)/0.1)] rounded-full blur-3xl" />
      </motion.div>
    </div>
  );
};

export default LifeOSAuth;
