import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch, setToken } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { AuthResponse } from "@/types/database";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ShieldCheck, Loader2, Sparkles, ArrowRight, RefreshCw, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!otp || otp.trim().length !== 6) {
      toast.error("Please enter the 6-digit verification code");
      return;
    }

    if (!password || password.length < 6) {
      toast.error("Please set a password (minimum 6 characters) for future direct sign-ins");
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

      toast.success("🎉 Email verified & password saved successfully! Welcome to SiteFlow AI.");
      navigate("/builder");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Verification failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }

    setIsResending(true);
    try {
      await apiFetch<{ message: string }>("/api/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
      });

      toast.success("📧 A new 6-digit verification code has been sent to your email!");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to resend verification code";
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-hidden">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="w-full max-w-md bg-card/80 border border-primary/20 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-3 shadow-lg shadow-primary/20 animate-logo-pulse">
              <ShieldCheck className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Verify Email & Set Password</h1>
            <p className="text-xs text-muted-foreground max-w-[300px] mx-auto">
              Please enter your 6-digit OTP code and choose a password for future direct sign-ins.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email-target" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email-target"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-border/80 focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="otp-code" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                6-Digit OTP Verification Code
              </Label>
              <Input
                id="otp-code"
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="h-14 text-center text-3xl font-extrabold tracking-[12px] rounded-xl border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/40 text-primary bg-primary/5"
                autoFocus
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password-set" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Create Password for Direct Sign-In
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password-set"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password (6+ chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 rounded-xl border-border/80 focus:ring-2 focus:ring-primary/40"
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
              type="submit"
              className="w-full h-12 rounded-xl font-semibold text-base btn-glowing-border mt-2"
              disabled={isLoading || otp.length !== 6 || password.length < 6}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <>
                  Verify OTP & Save Password <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50">
            <span className="text-muted-foreground">Didn't receive the code?</span>
            <button
              type="button"
              className="text-primary font-semibold hover:underline inline-flex items-center gap-1.5"
              onClick={handleResend}
              disabled={isResending}
            >
              {isResending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              Resend Code
            </button>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground z-10">
        &copy; {new Date().getFullYear()} SiteFlow AI. All rights reserved.
      </footer>
    </div>
  );
}
