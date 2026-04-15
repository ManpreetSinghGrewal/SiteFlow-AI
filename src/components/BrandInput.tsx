import { useState } from "react";
import {
  Zap, MapPin, Target, Sparkles, ArrowRight, Building2,
  Scissors, Coffee, Dumbbell, Laptop, Heart, Home, Plane,
  Stethoscope, GraduationCap, PawPrint, Car, Scale, HardHat,
  SprayCan, PartyPopper, Flower2, Landmark, Gamepad2, Gem, Wheat, Briefcase,
} from "lucide-react";

const BUSINESS_TYPES = [
  { id: "spa", label: "Spa & Wellness", icon: Sparkles },
  { id: "coffee", label: "Café & Coffee", icon: Coffee },
  { id: "restaurant", label: "Restaurant", icon: Coffee },
  { id: "fitness", label: "Fitness & Gym", icon: Dumbbell },
  { id: "tech", label: "Tech & SaaS", icon: Laptop },
  { id: "beauty", label: "Beauty & Salon", icon: Scissors },
  { id: "realEstate", label: "Real Estate", icon: Home },
  { id: "travel", label: "Travel & Hotels", icon: Plane },
  { id: "medical", label: "Medical & Health", icon: Stethoscope },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "pets", label: "Pets & Vet", icon: PawPrint },
  { id: "automotive", label: "Automotive", icon: Car },
  { id: "legal", label: "Legal & Law", icon: Scale },
  { id: "construction", label: "Construction", icon: HardHat },
  { id: "cleaning", label: "Cleaning", icon: SprayCan },
  { id: "events", label: "Events & Wedding", icon: PartyPopper },
  { id: "florist", label: "Florist & Garden", icon: Flower2 },
  { id: "finance", label: "Finance", icon: Landmark },
  { id: "gaming", label: "Gaming & eSports", icon: Gamepad2 },
  { id: "luxury", label: "Luxury & Jewelry", icon: Gem },
  { id: "agriculture", label: "Agriculture", icon: Wheat },
  { id: "corporate", label: "Corporate", icon: Briefcase },
];

const PERSONALITY_CHIPS = [
  "Professional", "Friendly", "Bold", "Minimalist", "Luxurious",
  "Playful", "Calm", "Energetic", "Elegant", "Modern", "Rustic", "Warm",
];

const GOAL_OPTIONS = [
  { id: "leads", label: "Generate Leads", desc: "Contact forms & CTAs" },
  { id: "bookings", label: "Drive Bookings", desc: "Scheduling & reservations" },
  { id: "sales", label: "Sell Products", desc: "E-commerce focused" },
  { id: "awareness", label: "Brand Awareness", desc: "Storytelling & presence" },
];

export interface BrandData {
  businessName: string;
  businessType: string;
  services: string;
  location: string;
  personality: string[];
  goals: string[];
  extraNotes: string;
}

interface Props {
  onSubmit: (data: BrandData) => void;
}

const BrandInput = ({ onSubmit }: Props) => {
  const [data, setData] = useState<BrandData>({
    businessName: "", businessType: "", services: "",
    location: "", personality: [], goals: [], extraNotes: "",
  });
  const [step, setStep] = useState(0);

  const toggleChip = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const canProceed = () => {
    if (step === 0) return data.businessName.trim() && data.businessType;
    if (step === 1) return data.services.trim();
    if (step === 2) return data.personality.length > 0;
    return true;
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else onSubmit(data);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
            <Zap className="w-3.5 h-3.5" />
            Step {step + 1} of 4
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            {step === 0 && "Tell us about your business"}
            {step === 1 && "What services do you offer?"}
            {step === 2 && "Define your brand personality"}
            {step === 3 && "Set your goals"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {step === 0 && "We'll craft a website that perfectly represents your brand."}
            {step === 1 && "Help us showcase what makes you unique."}
            {step === 2 && "Choose the tone and feel that matches your brand."}
            {step === 3 && "What should your website achieve?"}
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                s <= step ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>

        {/* Step 0: Business basics */}
        {step === 0 && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Business Name</label>
              <input
                type="text"
                value={data.businessName}
                onChange={(e) => setData({ ...data, businessName: e.target.value })}
                placeholder="e.g. Serenity Haven, Brew & Bean..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary/50 transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">Business Type</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto scrollbar-thin pr-1">
                {BUSINESS_TYPES.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setData({ ...data, businessType: id })}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                      data.businessType === id
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:bg-accent"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-center leading-tight">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                <MapPin className="w-3.5 h-3.5 inline mr-1" />
                Location (optional)
              </label>
              <input
                type="text"
                value={data.location}
                onChange={(e) => setData({ ...data, location: e.target.value })}
                placeholder="e.g. New York, NY"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary/50 transition-all"
              />
            </div>
          </div>
        )}

        {/* Step 1: Services */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                <Building2 className="w-3.5 h-3.5 inline mr-1" />
                Services / Offerings
              </label>
              <textarea
                value={data.services}
                onChange={(e) => setData({ ...data, services: e.target.value })}
                placeholder="List your key services, products, or offerings..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary/50 transition-all resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Extra details (optional)</label>
              <textarea
                value={data.extraNotes}
                onChange={(e) => setData({ ...data, extraNotes: e.target.value })}
                placeholder="Colors, audience, unique selling points, anything else..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary/50 transition-all resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 2: Personality */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                <Heart className="w-3.5 h-3.5 inline mr-1" />
                Brand Personality (pick 1-3)
              </label>
              <div className="flex flex-wrap gap-2">
                {PERSONALITY_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setData({ ...data, personality: toggleChip(data.personality, chip) })}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      data.personality.includes(chip)
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary text-secondary-foreground hover:bg-accent"
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Goals */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                <Target className="w-3.5 h-3.5 inline mr-1" />
                Conversion Goals
              </label>
              <div className="grid grid-cols-2 gap-3">
                {GOAL_OPTIONS.map(({ id, label, desc }) => (
                  <button
                    key={id}
                    onClick={() => setData({ ...data, goals: toggleChip(data.goals, id) })}
                    className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                      data.goals.includes(id)
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border hover:border-primary/40 hover:bg-accent"
                    }`}
                  >
                    <span className="text-sm font-medium text-foreground">{label}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">{desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Suggestions Panel */}
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI Suggestions</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {data.businessName ? (
                  <>Based on <strong>{data.businessName}</strong> as a{" "}
                  <strong>{BUSINESS_TYPES.find((b) => b.id === data.businessType)?.label ?? "business"}</strong>,
                  we'll include a hero section with compelling CTA,
                  {data.personality.length > 0 ? ` a ${data.personality.join(" & ").toLowerCase()} tone,` : ""}
                  {data.goals.includes("bookings") ? " booking integration," : ""}
                  {data.goals.includes("leads") ? " lead capture forms," : ""}
                  {" "}and optimized layout for conversions.</>
                ) : (
                  <>Fill in your details and watch AI suggestions appear here in real-time.</>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back
            </button>
          ) : <div />}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
          >
            {step === 3 ? "Generate Website" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandInput;
