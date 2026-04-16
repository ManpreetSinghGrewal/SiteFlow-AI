import { useState, useMemo } from "react";
import {
  Eye, EyeOff, Download, RotateCcw, Sparkles,
  Monitor, Tablet, Smartphone, ExternalLink, ChevronRight, Image,
} from "lucide-react";
import ImageSwapPanel from "./ImageSwapPanel";

interface Props {
  html: string;
  onBack: () => void;
  onRegenerate: () => void;
  brandName: string;
  brandType: string;
  onHtmlChange?: (html: string) => void;
}

interface Section {
  id: string;
  label: string;
  enabled: boolean;
  insight: string;
}

const DEFAULT_SECTIONS: Section[] = [
  { id: "nav", label: "Navigation Bar", enabled: true, insight: "Sticky nav improves user engagement by 22%" },
  { id: "hero", label: "Hero Section", enabled: true, insight: "Strong CTA above the fold drives 3x more conversions" },
  { id: "about", label: "About Us", enabled: true, insight: "Builds trust and emotional connection with visitors" },
  { id: "services", label: "Services", enabled: true, insight: "Card layout lets users quickly scan offerings" },
  { id: "features", label: "Why Choose Us", enabled: true, insight: "Social proof and differentiators reduce bounce rate" },
  { id: "testimonials", label: "Testimonials", enabled: true, insight: "Reviews increase conversion by up to 34%" },
  { id: "contact", label: "Contact / CTA", enabled: true, insight: "Bottom CTA captures visitors ready to act" },
  { id: "footer", label: "Footer", enabled: true, insight: "Essential for SEO and navigation completeness" },
];

type RightTab = "insights" | "images";

const HumanReview = ({ html, onBack, onRegenerate, brandName, brandType, onHtmlChange }: Props) => {
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [rightTab, setRightTab] = useState<RightTab>("insights");
  const [currentHtml, setCurrentHtml] = useState(html);

  const iframeWidth = device === "mobile" ? "375px" : device === "tablet" ? "768px" : "100%";

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleHtmlChange = (newHtml: string) => {
    setCurrentHtml(newHtml);
    onHtmlChange?.(newHtml);
  };

  const openInNewTab = () => {
    const win = window.open("", "_blank");
    if (win) { win.document.write(currentHtml); win.document.close(); }
  };

  const downloadHtml = () => {
    const blob = new Blob([currentHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brandName.replace(/\s+/g, "-").toLowerCase() || "website"}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeInsight = useMemo(() => {
    if (selectedSection) return sections.find((s) => s.id === selectedSection);
    return null;
  }, [selectedSection, sections]);

  return (
    <div className="flex h-full bg-background overflow-hidden">
      {/* Left Column: Section Controls */}
      <div className="w-72 border-r border-border flex flex-col bg-card">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Section Controls</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Toggle and review each section</p>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-1.5">
          {sections.map((section) => (
            <div
              key={section.id}
              onClick={() => setSelectedSection(section.id === selectedSection ? null : section.id)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                selectedSection === section.id
                  ? "bg-primary/10 border border-primary/30"
                  : "hover:bg-accent border border-transparent"
              }`}
            >
              <button
                onClick={(e) => { e.stopPropagation(); toggleSection(section.id); }}
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  section.enabled
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <span className={`text-sm flex-1 ${section.enabled ? "text-foreground font-medium" : "text-muted-foreground line-through"}`}>
                {section.label}
              </span>
              <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${selectedSection === section.id ? "rotate-90" : ""}`} />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="p-3 border-t border-border space-y-2">
          <button
            onClick={downloadHtml}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Download className="w-4 h-4" />
            Download HTML
          </button>
          <div className="flex gap-2">
            <button
              onClick={onRegenerate}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Regenerate
            </button>
            <button
              onClick={onBack}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
            >
              ← Edit Brief
            </button>
          </div>
        </div>
      </div>

      {/* Center: Live Preview */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card/80 backdrop-blur-sm">
          <span className="text-xs font-medium text-muted-foreground">Live Preview</span>
          <div className="flex items-center gap-1">
            {([
              { key: "desktop" as const, Icon: Monitor },
              { key: "tablet" as const, Icon: Tablet },
              { key: "mobile" as const, Icon: Smartphone },
            ]).map(({ key, Icon }) => (
              <button
                key={key}
                onClick={() => setDevice(key)}
                className={`p-1.5 rounded-md transition-colors ${device === key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
            <div className="w-px h-4 bg-border mx-1" />
            <button onClick={openInNewTab} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-start justify-center overflow-auto bg-muted/50 p-3">
          <div
            className="bg-background rounded-lg shadow-lg overflow-hidden transition-all duration-300 h-full"
            style={{ width: iframeWidth, maxWidth: "100%" }}
          >
            <iframe
              srcDoc={currentHtml}
              title="Website Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </div>

      {/* Right Column: Tabbed - Insights / Images */}
      <div className="w-72 border-l border-border flex flex-col bg-card">
        {/* Tab header */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setRightTab("insights")}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-medium transition-colors ${
              rightTab === "insights"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Insights
          </button>
          <button
            onClick={() => setRightTab("images")}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-medium transition-colors ${
              rightTab === "images"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            Edit Images
          </button>
        </div>

        {rightTab === "insights" ? (
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
              <p className="text-xs font-medium text-primary">Brand Summary</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>{brandName || "Your business"}</strong> — {brandType || "General"} category.
                Website optimized for engagement and conversions.
              </p>
            </div>

            {activeInsight ? (
              <div className="p-3 rounded-xl border border-border space-y-2 animate-fade-in-up">
                <p className="text-xs font-medium text-foreground">{activeInsight.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{activeInsight.insight}</p>
                <div className="flex items-center gap-1.5 pt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-[10px] text-primary font-medium">AI Recommendation</span>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl border border-dashed border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Click a section to see AI insights
                </p>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-xs font-medium text-foreground">Design Decisions</p>
              {[
                { title: "Color Palette", desc: "Chosen to match brand personality and improve readability" },
                { title: "Typography", desc: "Google Fonts selected for visual hierarchy and load speed" },
                { title: "Layout", desc: "Mobile-first responsive grid with optimal content flow" },
                { title: "Images", desc: "Contextual imagery matched to business category" },
              ].map((item) => (
                <div key={item.title} className="flex gap-2">
                  <div className="w-1 rounded-full bg-primary/30 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ImageSwapPanel html={currentHtml} onHtmlChange={handleHtmlChange} businessType={brandType} />
        )}
      </div>
    </div>
  );
};

export default HumanReview;
