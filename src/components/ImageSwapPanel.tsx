import { useState, useMemo } from "react";
import { Image, RefreshCw, Search } from "lucide-react";
import {
  IMAGE_ID_LIBRARY, CATEGORY_MATCHERS, buildUnsplashUrl, inferImageCategory,
  type ImageCategory, type ImageVariant,
} from "@/lib/htmlExtractor";

interface ImageInfo {
  index: number;
  src: string;
  alt: string;
  variant: ImageVariant;
}

interface Props {
  html: string;
  onHtmlChange: (html: string) => void;
  businessType?: string;
}

const CATEGORY_LABELS: Record<ImageCategory, string> = {
  spa: "Spa & Wellness", coffee: "Coffee & Café", restaurant: "Food & Restaurant",
  fitness: "Fitness", tech: "Tech & Software", beauty: "Beauty & Salon",
  realEstate: "Real Estate", travel: "Travel", medical: "Medical & Health",
  education: "Education", pets: "Pets & Animals", automotive: "Automotive",
  legal: "Legal", construction: "Construction", cleaning: "Cleaning",
  events: "Events", florist: "Florist", finance: "Finance",
  gaming: "Gaming", luxury: "Luxury", agriculture: "Agriculture",
  corporate: "Corporate", bakery: "Bakery", photography: "Photography",
  music: "Music", yoga: "Yoga", dental: "Dental", fashion: "Fashion",
  barber: "Barber", tattoo: "Tattoo", brewery: "Brewery", gym: "Gym",
  hotel: "Hotel", daycare: "Daycare", plumbing: "Plumbing",
  electrical: "Electrical", landscaping: "Landscaping", moving: "Moving",
  painting: "Painting", general: "General",
};

function extractImages(html: string): ImageInfo[] {
  if (typeof DOMParser === "undefined") return [];
  const doc = new DOMParser().parseFromString(html, "text/html");
  const images: ImageInfo[] = [];
  doc.querySelectorAll("img").forEach((img, i) => {
    const src = img.getAttribute("src") || "";
    if (!src || src.startsWith("data:") || /logo|favicon|icon/i.test(src + " " + (img.getAttribute("alt") || ""))) return;
    const alt = img.getAttribute("alt") || `Image ${i + 1}`;
    const desc = (alt + " " + img.className).toLowerCase();
    const variant: ImageVariant = /hero|banner/.test(desc) ? "hero" : /card|service/.test(desc) ? "card" : "section";
    images.push({ index: i, src, alt, variant });
  });
  return images;
}

function replaceImageInHtml(html: string, oldSrc: string, newSrc: string): string {
  const escaped = oldSrc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.replace(new RegExp(escaped, "g"), newSrc);
}

const ImageSwapPanel = ({ html, onHtmlChange, businessType }: Props) => {
  const detectedCategory = useMemo(() => inferImageCategory(html, businessType), [html, businessType]);
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory>(detectedCategory);
  const [searchTerm, setSearchTerm] = useState("");

  const images = useMemo(() => extractImages(html), [html]);

  const filteredCategories = useMemo(() => {
    const cats = Object.keys(IMAGE_ID_LIBRARY) as ImageCategory[];
    if (!searchTerm) return cats;
    return cats.filter((c) => CATEGORY_LABELS[c].toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  // Put detected category first
  const sortedCategories = useMemo(() => {
    const filtered = filteredCategories.filter((c) => c !== detectedCategory);
    return [detectedCategory, ...filtered].filter((c) => filteredCategories.includes(c) || c === detectedCategory);
  }, [filteredCategories, detectedCategory]);

  const handleSwap = (imageId: string) => {
    if (!selectedImage) return;
    const dims: [number, number] = selectedImage.variant === "hero" ? [1600, 900] : selectedImage.variant === "card" ? [700, 500] : [1200, 800];
    const newSrc = buildUnsplashUrl(imageId, selectedImage.variant);
    onHtmlChange(replaceImageInHtml(html, selectedImage.src, newSrc));
    setSelectedImage({ ...selectedImage, src: newSrc });
  };

  if (images.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground text-xs">
        <Image className="w-8 h-8 mx-auto mb-2 opacity-40" />
        No editable images found
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Image className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Edit Images</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Category: <span className="text-primary font-medium">{CATEGORY_LABELS[detectedCategory]}</span> • Click to swap
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {!selectedImage ? (
          images.map((img) => (
            <button
              key={img.index}
              onClick={() => { setSelectedImage(img); setSelectedCategory(detectedCategory); }}
              className="w-full group relative rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all"
            >
              <img src={img.src} alt={img.alt} className="w-full h-20 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-primary" />
              </div>
              <div className="px-2 py-1.5 bg-card">
                <p className="text-[11px] text-muted-foreground truncate">{img.alt}</p>
              </div>
            </button>
          ))
        ) : (
          <>
            <button onClick={() => setSelectedImage(null)} className="flex items-center gap-1 text-xs text-primary hover:underline mb-2">← Back to images</button>

            <div className="rounded-lg overflow-hidden border border-primary/30 mb-3">
              <img src={selectedImage.src} alt={selectedImage.alt} className="w-full h-24 object-cover" />
              <div className="px-2 py-1.5 bg-primary/5">
                <p className="text-[11px] text-foreground font-medium truncate">{selectedImage.alt}</p>
              </div>
            </div>

            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
                className="w-full pl-7 pr-2 py-1.5 text-xs rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {sortedCategories.slice(0, 12).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : cat === detectedCategory
                        ? "bg-primary/20 text-primary hover:bg-primary/30"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                  {cat === detectedCategory && " ★"}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {/* Deduplicate IDs */}
              {[...new Set(IMAGE_ID_LIBRARY[selectedCategory])].map((id) => (
                <button
                  key={id}
                  onClick={() => handleSwap(id)}
                  className="rounded-md overflow-hidden border border-border hover:border-primary/50 transition-all hover:scale-[1.02]"
                >
                  <img
                    src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&h=300&q=80`}
                    alt="Replacement option"
                    className="w-full h-16 object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageSwapPanel;
