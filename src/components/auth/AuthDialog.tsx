import { useState, useEffect } from "react";
import { apiFetch, setToken, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { AuthResponse } from "@/types/database";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  
  // OTP Verification Step & 60s Cooldown Timer
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(60);

  // Forgot Password Flow
  const [showReset, setShowReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // 60-second Resend Cooldown Countdown Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOtpStep && cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpStep, cooldown]);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setOtp("");
    setIsOtpStep(false);
    setCooldown(60);
    setShowPassword(false);
    setShowReset(false);
    setResetSent(false);
  };

  const startOtpFlow = () => {
    setIsOtpStep(true);
    setCooldown(60);
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
        body: JSON.stringify({ email: email.trim(), password }),
      });

      setToken(data.token);
      await refreshUser();

      toast.success("✨ Welcome back! Logged in successfully.");
      setIsOpen(false);
      resetForm();
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 403) {
        startOtpFlow();
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
    if (!emailToUse || !emailToUse.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await apiFetch<{ ok: boolean; message: string }>("/api/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ email: emailToUse.trim(), password }),
      });

      startOtpFlow();
      toast.success("📧 6-Digit Verification code sent to your email!");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to send code";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    let googleEmail = email.trim();
    if (!googleEmail || !googleEmail.includes("@")) {
      const inputEl = document.getElementById("signup-email") as HTMLInputElement;
      if (inputEl) inputEl.focus();
      toast.info("Please enter your email address to sign up with Google");
      return;
    }

    setIsLoading(true);
    try {
      await apiFetch<{ requiresOtp: boolean; message: string }>("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({ email: googleEmail }),
      });

      startOtpFlow();
      toast.success(`🚀 Google verification code sent to ${googleEmail}!`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Google sign-in failed";
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

    if (!password || password.length < 6) {
      toast.error("Please set a password (minimum 6 characters) for future direct sign-in");
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiFetch<AuthResponse>("/api/auth/verify-otp", {
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
        body: JSON.stringify({ email: email.trim() }),
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
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border border-primary/30 bg-card/95 backdrop-blur-3xl shadow-[0_0_50px_rgba(56,189,248,0.18)] rounded-3xl text-foreground">
        
        {/* Glowing Top Banner Header */}
        <div className="relative px-6 pt-8 pb-6 bg-gradient-to-br from-primary/20 via-sky-500/10 to-transparent border-b border-border/40 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center mb-3 shadow-lg shadow-primary/20 animate-logo-pulse">
            {isOtpStep ? <ShieldCheck className="w-7 h-7 text-primary" /> : <Sparkles className="w-7 h-7 text-primary" />}
          </div>
          <DialogTitle className="text-2xl font-extrabold text-foreground tracking-tight">
            {showReset ? "Reset Password" : isOtpStep ? "Verify Email & Set Password" : "Sign Up for SiteFlow AI"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1.5 max-w-[320px] mx-auto leading-relaxed">
            {showReset
              ? "Enter your email address to receive a secure Brevo reset link."
              : isOtpStep
              ? `We sent a 6-digit verification code to ${email}`
              : "Create an account to start generating websites in seconds."}
          </DialogDescription>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 space-y-4">
          {showReset ? (
            <div className="space-y-4">
              {resetSent ? (
                <div className="p-5 rounded-2xl bg-primary/10 border border-primary/30 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-primary mx-auto" />
                  <h4 className="text-sm font-semibold text-foreground">Reset Email Sent!</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We've dispatched a password reset link to <strong className="text-foreground">{email}</strong>. Check your inbox to set a new password.
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-xs text-primary hover:text-primary font-semibold"
                    onClick={() => { setShowReset(false); setResetSent(false); }}
                  >
                    Back to Sign In
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
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
                        className="pl-10 h-12 rounded-xl border-border/80 bg-muted/40 focus:bg-background focus:ring-2 focus:ring-primary/40 text-sm font-medium"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 rounded-xl font-bold btn-glowing-border shadow-lg shadow-primary/20"
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
                    className="w-full text-xs text-muted-foreground hover:text-foreground font-medium"
                    onClick={() => setShowReset(false)}
                  >
                    Back to Sign In
                  </Button>
                </>
              )}
            </div>
          ) : isOtpStep ? (
            /* STEP 2: 6-DIGIT OTP VERIFICATION + PASSWORD SETUP SCREEN (WITH 60S COOLDOWN) */
            <div className="space-y-4">
              <div className="space-y-1.5">
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
                  className="h-14 text-center text-2xl font-bold tracking-[10px] rounded-xl border-primary/40 bg-primary/10 text-primary focus:ring-2 focus:ring-primary/40"
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="otp-password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Create Password for Direct Sign-In
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="otp-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password (6+ chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 rounded-xl border-border/80 bg-muted/40 focus:bg-background focus:ring-2 focus:ring-primary/40 text-sm font-medium"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                className="w-full h-12 rounded-xl font-bold btn-glowing-border shadow-lg shadow-primary/20 mt-2 text-base"
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.length !== 6 || password.length < 6}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Verify OTP & Complete Sign Up <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-border/40">
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground font-medium"
                  onClick={() => setIsOtpStep(false)}
                >
                  ← Change Email
                </button>

                <button
                  type="button"
                  className={`font-semibold inline-flex items-center gap-1.5 transition-colors ${
                    cooldown > 0 ? "text-muted-foreground cursor-not-allowed" : "text-primary hover:underline"
                  }`}
                  onClick={() => {
                    if (cooldown === 0) handleSendOtp();
                  }}
                  disabled={isLoading || cooldown > 0}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                  {cooldown > 0 ? `Resend Code (${cooldown}s)` : "Resend OTP Code"}
                </button>
              </div>
            </div>
          ) : (
            /* STEP 1: SIGN UP / SIGN IN TABS WITH GOOGLE OPTION */
            <div className="space-y-4">
              {/* GOOGLE 1-CLICK SSO BUTTON */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-xl border-border/80 bg-muted/30 hover:bg-muted/60 font-semibold flex items-center justify-center gap-3 transition-all text-sm active:scale-[0.99]"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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

              {/* SEAMLESS DIVIDER */}
              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-border/50 w-full" />
                <span className="bg-card px-3 py-1 rounded-full text-[10px] font-bold text-muted-foreground uppercase tracking-widest border border-border/40 shrink-0">
                  or continue with email
                </span>
                <div className="border-t border-border/50 w-full" />
              </div>

              <Tabs defaultValue="signup" className="w-full">
                <TabsList className="grid w-full grid-cols-2 p-1.5 bg-muted/50 rounded-2xl mb-4 border border-border/40">
                  <TabsTrigger value="signup" className="rounded-xl text-xs font-bold transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md">
                    Sign Up
                  </TabsTrigger>
                  <TabsTrigger value="login" className="rounded-xl text-xs font-bold transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md">
                    Sign In
                  </TabsTrigger>
                </TabsList>

                {/* CREATE ACCOUNT (SIGN UP) TAB */}
                <TabsContent value="signup" className="space-y-4 mt-0">
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
                        className="pl-10 h-12 rounded-xl border-border/80 bg-muted/40 focus:bg-background focus:ring-2 focus:ring-primary/40 text-sm font-medium"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 rounded-xl font-bold btn-glowing-border shadow-lg shadow-primary/20 text-sm"
                    onClick={() => handleSendOtp()}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Sign Up & Send OTP Code <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </TabsContent>

                {/* SIGN IN TAB */}
                <TabsContent value="login" className="space-y-4 mt-0">
                  <div className="space-y-1.5">
                    <Label htmlFor="login-email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
                        className="pl-10 h-12 rounded-xl border-border/80 bg-muted/40 focus:bg-background focus:ring-2 focus:ring-primary/40 text-sm font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Password
                      </Label>
                      <button
                        type="button"
                        className="text-xs font-semibold text-primary hover:underline"
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
                        className="pl-10 pr-10 h-12 rounded-xl border-border/80 bg-muted/40 focus:bg-background focus:ring-2 focus:ring-primary/40 text-sm font-medium"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 rounded-xl font-bold btn-glowing-border shadow-lg shadow-primary/20 text-sm"
                    onClick={handleLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Sign In <ArrowRight className="ml-2 h-5 w-5" />
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
