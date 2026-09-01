import { useState } from "react";
import { apiFetch, setToken, ApiError } from "@/lib/api";
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
      if (error instanceof ApiError && error.status === 403) {
        setIsOtpStep(true);
        toast.info("📧 Please verify your email first. A new 6-digit OTP code has been sent!");
      } else {
        const message = error instanceof Error ? error.message : "Authentication failed";
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (targetEmail?: string) => {
    const emailToUse = targetEmail || email;
    if (!emailToUse) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      await apiFetch<{ ok: boolean; message: string }>("/api/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ email: emailToUse, password }),
      });

      setIsOtpStep(true);
      toast.success("📧 Verification code sent to your email!");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to send code";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    let googleEmail = email.trim();
    if (!googleEmail) {
      const prompted = prompt("Please enter your Google Email address to receive your 6-digit verification code:");
      if (!prompted || !prompted.includes("@")) {
        toast.error("Valid Google Email address is required");
        return;
      }
      googleEmail = prompted.trim();
      setEmail(googleEmail);
    }

    toast.info(`🚀 Starting Google verification for ${googleEmail}...`);
    await handleSendOtp(googleEmail);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.trim().length !== 6) {
      toast.error("Please enter the 6-digit OTP code sent to your email");
      return;
    }

    if (!password || password.length < 6) {
      toast.error("Please set a password (minimum 6 characters) for future direct sign-in");
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiFetch<AuthResponse>("/api/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), otp: otp.trim(), password }),
      });

      setToken(data.token);
      await refreshUser();

      toast.success("🎉 Email verified & password saved! Welcome to SiteFlow AI.");
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
            {showReset ? "Reset Password" : isOtpStep ? "Verify Email & Set Password" : "Sign Up for SiteFlow AI"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1 max-w-[300px] mx-auto">
            {showReset
              ? "Enter your email address and we'll send you a secure Brevo reset link."
              : isOtpStep
              ? `We sent a 6-digit verification code to ${email}`
              : "Create an account to start generating websites in seconds."}
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
            /* STEP 2: 6-DIGIT OTP VERIFICATION + PASSWORD SETUP SCREEN */
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp-input" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  6-Digit OTP Verification Code
                </Label>
                <Input
                  id="otp-input"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="h-12 text-center text-2xl font-bold tracking-[10px] rounded-xl border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/30 text-primary bg-primary/5"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp-password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Set Password for Direct Sign-In
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="otp-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password (6+ chars)"
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
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.length !== 6 || password.length < 6}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Verify OTP & Save Password <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setIsOtpStep(false)}
                >
                  ← Change Email
                </button>

                <button
                  type="button"
                  className="text-primary font-medium hover:underline inline-flex items-center gap-1"
                  onClick={() => handleSendOtp()}
                  disabled={isLoading}
                >
                  <RefreshCw className="w-3 h-3" /> Resend OTP Code
                </button>
              </div>
            </div>
          ) : (
            /* STEP 1: SIGN UP / SIGN IN TABS WITH GOOGLE OPTION */
            <div className="space-y-4">
              {/* GOOGLE SIGN IN BUTTON */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 rounded-xl border-border/80 hover:bg-muted/50 font-medium flex items-center justify-center gap-3 transition-colors"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Sign up with Google
              </Button>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-border/60 w-full" />
                <span className="bg-background px-3 text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
                  or continue with email
                </span>
                <div className="border-t border-border/60 w-full" />
              </div>

              <Tabs defaultValue="signup" className="w-full">
                <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/60 rounded-xl mb-4">
                  <TabsTrigger value="signup" className="rounded-lg text-xs font-semibold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                    Sign Up
                  </TabsTrigger>
                  <TabsTrigger value="login" className="rounded-lg text-xs font-semibold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                    Sign In
                  </TabsTrigger>
                </TabsList>

                {/* CREATE ACCOUNT (SIGN UP) TAB */}
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

                  <Button
                    className="w-full h-11 rounded-xl font-semibold btn-glowing-border mt-2"
                    onClick={() => handleSendOtp()}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Sign Up & Send OTP Code <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </TabsContent>

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
              </Tabs>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
