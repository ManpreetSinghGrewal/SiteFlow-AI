import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, Loader2, Sparkles, CheckCircle2 } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid password reset link");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await apiFetch<{ message: string }>("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword }),
      });

      setIsSuccess(true);
      toast.success("Password updated successfully!");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to reset password";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-hidden">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="w-full max-w-md bg-card/80 border border-primary/20 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-2 shadow-lg shadow-primary/20 animate-logo-pulse">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Set New Password</h1>
            <p className="text-xs text-muted-foreground">
              Choose a secure new password for your SiteFlow AI account.
            </p>
          </div>

          {isSuccess ? (
            <div className="p-6 rounded-2xl bg-primary/10 border border-primary/30 text-center space-y-4">
              <CheckCircle2 className="w-10 h-10 text-primary mx-auto" />
              <h3 className="text-base font-semibold">Password Reset Complete!</h3>
              <p className="text-xs text-muted-foreground">
                Your password has been updated. You can now log into your SiteFlow AI account.
              </p>
              <Button
                className="w-full h-11 rounded-xl font-semibold btn-glowing-border"
                onClick={() => navigate("/")}
              >
                Go to Homepage & Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="new-password" className="text-xs font-medium">
                  New Password (6+ characters)
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                className="w-full h-11 rounded-xl font-semibold btn-glowing-border mt-2"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update Password"}
              </Button>
            </form>
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground z-10">
        &copy; {new Date().getFullYear()} SiteFlow AI. All rights reserved.
      </footer>
    </div>
  );
}
