import { useState } from "react";
import { apiFetch, setToken } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { AuthResponse } from "@/types/database";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle2, ShieldCheck, RefreshCw } from "lucide-react";

export function AuthDialog({ children }: { children: React.ReactNode }) {
  const { refreshUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP Verification Step
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otp, setOtp] = useState("");

  // Forgot Password Flow
  const [showReset, setShowReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setOtp("");
    setIsOtpStep(false);
    setShowPassword(false);
    setShowReset(false);
    setResetSent(false);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiFetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setToken(data.token);
      await refreshUser();

      toast.success("✨ Welcome back! Logged in successfully.");
      setIsOpen(false);
      resetForm();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Authentication failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await apiFetch<{ message: string }>("/api/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setIsOtpStep(true);
      toast.success("📧 Verification code sent to your email!");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to send verification code";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.trim().length !== 6) {
      toast.error("Please enter the 6-digit OTP code sent to your email");
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiFetch<AuthResponse>("/api/auth/verify-otp-signup", {
        method: "POST",
        body: JSON.stringify({ email, password, otp: otp.trim() }),
      });

      setToken(data.token);
      await refreshUser();

      toast.success("🎉 Email verified & account created! Welcome to SiteFlow AI.");
      setIsOpen(false);
      resetForm();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Verification failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }

    setIsLoading(true);
    try {
      await apiFetch<{ message: string }>("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setResetSent(true);
      toast.success("Password reset link sent! Check your inbox.");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Password reset failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border border-primary/20 bg-background/95 backdrop-blur-xl shadow-2xl rounded-3xl">
        
        {/* Glowing Top Banner */}
        <div className="relative px-6 pt-8 pb-6 bg-gradient-to-br from-primary/15 via-sky-500/10 to-transparent border-b border-border/50 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-3 shadow-lg shadow-primary/20 animate-logo-pulse">
            {isOtpStep ? <ShieldCheck className="w-6 h-6 text-primary" /> : <Sparkles className="w-6 h-6 text-primary" />}
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">
            {showReset ? "Reset Password" : isOtpStep ? "Verify Your Email" : "SiteFlow AI"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1 max-w-[300px] mx-auto">
            {showReset
              ? "Enter your email address and we'll send you a secure Brevo reset link."
              : isOtpStep
              ? `We sent a 6-digit verification code to ${email}`
              : "Build high-converting websites in seconds powered by Gemini AI."}
          </DialogDescription>
        </div>

        {/* Modal Form Body */}
        <div className="p-6">
          {showReset ? (
            <div className="space-y-4">
              {resetSent ? (
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-primary mx-auto" />
                  <h4 className="text-sm font-semibold text-foreground">Reset Email Sent!</h4>
                  <p className="text-xs text-muted-foreground">
                    We've dispatched a password reset link to <strong className="text-foreground">{email}</strong>. Check your inbox to set a new password.
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-xs text-primary hover:text-primary"
                    onClick={() => { setShowReset(false); setResetSent(false); }}
                  >
                    Back to Sign In
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="reset-email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 rounded-xl border-border/80 focus:ring-2 focus:ring-primary/40"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full h-11 rounded-xl font-semibold btn-glowing-border"
                    onClick={handlePasswordReset}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Send Reset Link <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setShowReset(false)}
                  >
                    Back to Sign In
                  </Button>
                </>
              )}
            </div>
          ) : isOtpStep ? (
            /* STEP 2: 6-DIGIT OTP VERIFICATION SCREEN */
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp-input" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  6-Digit OTP Code
                </Label>
                <div className="relative">
                  <Input
                    id="otp-input"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="h-12 text-center text-2xl font-bold tracking-[10px] rounded-xl border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/30"
                    autoFocus
                  />
                </div>
              </div>

              <Button
                className="w-full h-11 rounded-xl font-semibold btn-glowing-border mt-2"
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Verify & Create Account <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setIsOtpStep(false)}
                >
                  ← Edit Email
                </button>

                <button
                  type="button"
                  className="text-primary font-medium hover:underline inline-flex items-center gap-1"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                >
                  <RefreshCw className="w-3 h-3" /> Resend OTP Code
                </button>
              </div>
            </div>
          ) : (
            /* STEP 1: LOGIN / SIGNUP FORM */
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/60 rounded-xl mb-4">
                <TabsTrigger value="login" className="rounded-lg text-xs font-semibold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg text-xs font-semibold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  Create Account
                </TabsTrigger>
              </TabsList>

              {/* SIGN IN TAB */}
              <TabsContent value="login" className="space-y-4 mt-0">
                <div className="space-y-1.5">
                  <Label htmlFor="login-email" className="text-xs font-medium text-foreground">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 rounded-xl border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/30"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password" className="text-xs font-medium text-foreground">
                      Password
                    </Label>
                    <button
                      type="button"
                      className="text-xs font-medium text-primary hover:underline"
                      onClick={() => setShowReset(true)}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 rounded-xl border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/30"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  className="w-full h-11 rounded-xl font-semibold btn-glowing-border mt-2"
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Sign In <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </TabsContent>

              {/* CREATE ACCOUNT TAB */}
              <TabsContent value="signup" className="space-y-4 mt-0">
                <div className="space-y-1.5">
                  <Label htmlFor="signup-email" className="text-xs font-medium text-foreground">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 rounded-xl border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/30"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="signup-password" className="text-xs font-medium text-foreground">
                    Password (6+ characters)
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 rounded-xl border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/30"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  className="w-full h-11 rounded-xl font-semibold btn-glowing-border mt-2"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Send 6-Digit OTP Code <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
