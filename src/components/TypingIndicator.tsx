import { Sparkles } from "lucide-react";

const TypingIndicator = () => (
  <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md w-fit shadow-sm my-1">
    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
    <span className="text-xs font-semibold text-primary tracking-wide">AI Thinking</span>
    <div className="flex items-center gap-1.5 ml-1">
      <div className="w-2 h-2 rounded-full bg-primary ai-thinking-dot" />
      <div className="w-2 h-2 rounded-full bg-primary ai-thinking-dot" />
      <div className="w-2 h-2 rounded-full bg-primary ai-thinking-dot" />
    </div>
  </div>
);

export default TypingIndicator;
