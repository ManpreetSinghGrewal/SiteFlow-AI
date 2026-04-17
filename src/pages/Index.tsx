import { useState, useCallback, useRef, useEffect, useMemo } from "react";

import BrandInput, { BrandData } from "@/components/BrandInput";
import GenerationFlow from "@/components/GenerationFlow";
import HumanReview from "@/components/HumanReview";
import { streamChat, ChatMessage } from "@/lib/streamChat";
import { extractHtmlFromMessage } from "@/lib/htmlExtractor";
import { useAuth } from "@/context/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { UserAccountNav } from "@/components/auth/UserAccountNav";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type AppStep = "input" | "generating" | "review";

function buildPrompt(data: BrandData): string {
  const parts = [`Create a website for "${data.businessName}"`];
  if (data.businessType) parts.push(`Business type: ${data.businessType}`);
  if (data.services) parts.push(`Services: ${data.services}`);
  if (data.location) parts.push(`Location: ${data.location}`);
  if (data.personality.length) parts.push(`Tone/personality: ${data.personality.join(", ")}`);
  if (data.goals.length) {
    const goalMap: Record<string, string> = {
      leads: "lead generation", bookings: "bookings/reservations",
      sales: "product sales", awareness: "brand awareness",
    };
    parts.push(`Goals: ${data.goals.map((g) => goalMap[g] || g).join(", ")}`);
  }
  if (data.extraNotes) parts.push(`Additional notes: ${data.extraNotes}`);
  return parts.join(". ") + ".";
}

const Index = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [step, setStep] = useState<AppStep>("input");
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [streamProgress, setStreamProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const contentRef = useRef("");

  const handleBrandSubmit = useCallback((data: BrandData) => {
    setBrandData(data);
    setStep("generating");
    setStreamProgress(0);
    setGeneratedHtml(null);
    contentRef.current = "";

    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);

    const prompt = buildPrompt(data);
    const messages: ChatMessage[] = [{ role: "user", content: prompt }];

    streamChat({
      messages,
      onDelta: (chunk) => {
        contentRef.current += chunk;
        // Estimate progress based on content length (typical site ~8000 chars)
        const progress = Math.min(95, (contentRef.current.length / 8000) * 100);
        setStreamProgress(progress);
      },
      onDone: () => {
        setStreamProgress(100);
        setIsLoading(false);
        const html = extractHtmlFromMessage(contentRef.current, data);
        if (html) {
          setGeneratedHtml(html);
        } else {
          console.error("Failed to parse HTML from AI response:", contentRef.current.substring(0, 500));
          toast("Generation failed: The AI did not return a valid website format. Please try again.");
          setStep("input");
        }
      },
      onError: (err) => {
        setIsLoading(false);
        console.error("Generation error:", err);
        toast(`Generation Error: ${err}`);
        setStep("input");
      },
      signal: controller.signal,
    }).catch((e) => {
      if ((e as Error).name !== "AbortError") {
        setIsLoading(false);
        const errorMessage = e instanceof Error ? e.message : "Unknown connection error";
        toast(`Network Error: ${errorMessage}`);
        console.error("Fetch threw an error:", e);
        setStep("input");
      }
    });
  }, []);

  // Auto-advance to review when generation completes
  useEffect(() => {
    if (!isLoading && generatedHtml && step === "generating") {
      const timer = setTimeout(() => setStep("review"), 1200);
      return () => clearTimeout(timer);
    }
  }, [isLoading, generatedHtml, step]);

  const handleRegenerate = useCallback(() => {
    if (brandData) {
      handleBrandSubmit(brandData);
    }
  }, [brandData, handleBrandSubmit]);

  const handleBackToInput = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
    setStep("input");
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-2">
          <img src="/siteflow-logo.png" alt="SiteFlow AI" className="w-7 h-7 rounded-lg object-cover" />
          <h1 className="font-semibold text-sm text-foreground">SiteFlow AI</h1>
          <a href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-6">Home</a>
          <a href="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-4">About Us</a>
        </div>

        <div className="flex items-center gap-1.5 mx-auto">
          {(["input", "generating", "review"] as AppStep[]).map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full transition-colors ${s === step ? "bg-primary" : step === "review" || (step === "generating" && i === 0) ? "bg-primary/40" : "bg-border"
                }`} />
              <span className={`text-xs hidden sm:inline ${s === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {s === "input" ? "Brief" : s === "generating" ? "Generate" : "Review"}
              </span>
              {i < 2 && <div className="w-4 h-px bg-border" />}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {!isAuthLoading && (
            <>
              {user ? (
                <UserAccountNav />
              ) : (
                <AuthDialog>
                  <Button variant="ghost" size="sm" className="text-xs font-semibold">
                    Sign In
                  </Button>
                </AuthDialog>
              )}
            </>
          )}
        </div>
      </header>

      {/* Content */}
      {step === "input" && <BrandInput onSubmit={handleBrandSubmit} />}
      {step === "generating" && (
        <GenerationFlow isComplete={!!generatedHtml && !isLoading} streamProgress={streamProgress} />
      )}
      {step === "review" && generatedHtml && brandData && (
        <HumanReview
          html={generatedHtml}
          onBack={handleBackToInput}
          onRegenerate={handleRegenerate}
          brandName={brandData.businessName}
          brandType={brandData.businessType}
          onHtmlChange={(newHtml) => setGeneratedHtml(newHtml)}
        />
      )}
    </div>
  );
};

export default Index;
