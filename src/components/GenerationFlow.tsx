import { useEffect, useState } from "react";
import { Code2, LayoutGrid, Globe, Check } from "lucide-react";

interface Props {
  isComplete: boolean;
  streamProgress: number; // 0-100 based on content length
}

const STEPS = [
  { icon: Code2, label: "Generating tokens", desc: "AI is writing your website code..." },
  { icon: LayoutGrid, label: "Building components", desc: "Assembling sections and layouts..." },
  { icon: Globe, label: "Assembling website", desc: "Finalizing design and images..." },
];

const GenerationFlow = ({ isComplete, streamProgress }: Props) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (isComplete) {
      setActiveStep(3);
      return;
    }
    if (streamProgress < 30) setActiveStep(0);
    else if (streamProgress < 70) setActiveStep(1);
    else setActiveStep(2);
  }, [streamProgress, isComplete]);

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-fade-in-up">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-foreground">
            {isComplete ? "Website Ready! ✨" : "Crafting Your Website"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isComplete ? "Your website has been generated successfully." : "This usually takes 15-30 seconds..."}
          </p>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 rounded-full bg-border overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${isComplete ? 100 : streamProgress}%` }}
          />
          {!isComplete && (
            <div className="absolute inset-0 shimmer-overlay" />
          )}
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isDone = activeStep > i || isComplete;
            const isActive = activeStep === i && !isComplete;

            return (
              <div
                key={i}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${
                  isActive
                    ? "border-primary/50 bg-primary/5 shadow-sm"
                    : isDone
                      ? "border-border bg-accent/50"
                      : "border-border/50 opacity-40"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    isDone
                      ? "bg-primary/15 text-primary"
                      : isActive
                        ? "bg-primary text-primary-foreground animate-pulse"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isDone || isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{step.desc}</p>
                </div>
                {isActive && (
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary typing-dot" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary typing-dot" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary typing-dot" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GenerationFlow;
