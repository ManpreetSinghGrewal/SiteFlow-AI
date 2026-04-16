import { useState, useEffect, useMemo } from "react";
import { Image, RefreshCw, X, Search } from "lucide-react";

interface ImageInfo {
  index: number;
  src: string;
  alt: string;
  variant: "hero" | "section" | "card";
}

interface Props {
  html: string;
  onHtmlChange: (html: string) => void;
}

type ImageCategory =
  | "spa" | "coffee" | "restaurant" | "fitness" | "tech" | "beauty"
  | "realEstate" | "travel" | "medical" | "education" | "pets" | "automotive"
  | "legal" | "construction" | "cleaning" | "events" | "florist" | "finance"
  | "gaming" | "luxury" | "agriculture" | "corporate" | "general";

const IMAGE_LIBRARY: Record<ImageCategory, string[]> = {
  spa: ["1544161515-4ab6ce6db874", "1540555700478-4be289fbec6d", "1600334089648-b0d9d3028eb2", "1545205597-3d9d02c29597", "1507652313519-d4e9174996dd", "1515377905703-c4788e51af15"],
  coffee: ["1495474472287-4d71bcdd2085", "1501339847302-ac426a4a7cbb", "1509042239860-f550ce710b93", "1559496417-e7f25cb247f3", "1442512595331-e89e73853f31", "1498804103079-a6351b050096"],
  restaurant: ["1504674900247-0877df9cc836", "1555396273-367ea4eb4db5", "1517248135467-4c7edcad34c4", "1509440159596-0249088772ff", "1414235077428-338989a2e8c0", "1476224203421-9ac39bcb3327"],
  fitness: ["1517649763962-0c623066013b", "1461896836934-bd45ba055097", "1534438327276-14e5300c3a48", "1552674605-db6ffd4facb5", "1571019614242-c5c5dee9f50b", "1549060279-7aa2d77dd74e"],
  tech: ["1518770660439-4636190af475", "1461749280684-dccba630e2f6", "1504384308090-c894fdcc538d", "1519389950473-47ba0277781c", "1550751827-4bd374c3f58b", "1526374965328-7f61d4dc18c5"],
  beauty: ["1445205170230-053b83016050", "1490481651871-ab68de25d43d", "1469334031218-e382a71b716b", "1560066984-138dadb4c035", "1522337360788-8b13dee7a37e", "1487412720507-e7ab37603c6f"],
  realEstate: ["1560518883-ce09059eeffa", "1564013799919-ab600027ffc6", "1512917774080-9991f1c4c750", "1600596542815-ffad4c1539a9", "1570129477492-45c003edd2be", "1560185007-cde436f6a4d0"],
  travel: ["1476514525535-07fb3b4ae5f1", "1488085061387-422e29b40080", "1507525428034-b723cf961d3e", "1530789253388-582c481c54b0", "1469854523086-cc02fe5d8800", "1504150558240-0b4fd8946624"],
  medical: ["1576091160399-112ba8d25d1d", "1505751172876-fa1923c5c528", "1559757175-5700dde675bc", "1532938911079-1b06ac7ceec7", "1579684385127-1ef15d508118", "1551190822-a9ec5186ab9f"],
  education: ["1503676260728-1c00da094a0b", "1523050854058-8df90110c8f1", "1509062522246-3755977927d7", "1497633762265-9d179a990aa6", "1481627834876-b7833e8f5570", "1524178232363-1fb2b075b655"],
  pets: ["1548199973-03cce0bbc87b", "1587300003388-59208cc962cb", "1601758228041-f3b2795255f1", "1450778869180-41d0601e046e", "1583511655857-d19b40a7a54e", "1574158622682-e40e69881006"],
  automotive: ["1492144534655-ae79c964c9d7", "1503376780353-7e6692767b70", "1580273916550-e323be2ae537", "1549317661-bd32c8ce0db2", "1494976388531-d1058494cdd8", "1533473359331-2f218c7dfe6b"],
  legal: ["1589829545856-d10d557cf95f", "1505664194779-8beaceb93744", "1450101499163-c8848e968f44", "1479142506502-19b3a3b7ff33"],
  construction: ["1503387762-592deb58ef4e", "1504307651254-35680f356dfd", "1541888946425-d81bb19240f5", "1487958449943-2429e8be8625"],
  cleaning: ["1581578731548-c64695cc6952", "1527515545081-5db817172677", "1558317374-067fb5f30001", "1563453392212-326f5e854473"],
  events: ["1519741497674-611481863552", "1511285560929-80b456fea0bc", "1469371670807-013ccf25f16a", "1478146896981-b80fe463b330"],
  florist: ["1490750967868-88aa4f44baee", "1487530811176-3780de880c2d", "1416879595882-3373a0480b5b", "1455659817273-f96807779a8a"],
  finance: ["1554224155-6726b3ff858f", "1460925895917-afdab827c52f", "1579532537598-459ecdaf39cc", "1611974789855-9c2a0a7236a3"],
  gaming: ["1542751371-adc38448a05e", "1538481199705-c710c4e965fc", "1552820728-8b83bb6b2b28", "1493711662062-fa541adb3fc8"],
  luxury: ["1515562141207-7a88fb7ce338", "1535632066927-ab7c9ab60908", "1506630448388-4e683c67ddb0", "1573408301185-9146fe634ad0"],
  agriculture: ["1500595046743-cd271d694d30", "1464226184884-fa280b87c399", "1574943320219-553eb213f72d", "1625246333195-78d9c38ad449"],
  corporate: ["1454165804606-c3d57bc86b40", "1507679799987-c73779587ccf", "1486406146926-c627a92ad1ab", "1573164713988-8665fc963095"],
  general: ["1454165804606-c3d57bc86b40", "1556761175-5973dc0f32e7", "1486406146926-c627a92ad1ab", "1573164713988-8665fc963095"],
};

const CATEGORY_LABELS: Record<ImageCategory, string> = {
  spa: "Spa & Wellness", coffee: "Coffee & Café", restaurant: "Food & Restaurant",
  fitness: "Fitness & Gym", tech: "Tech & Software", beauty: "Beauty & Salon",
  realEstate: "Real Estate", travel: "Travel & Hotel", medical: "Medical & Health",
  education: "Education", pets: "Pets & Animals", automotive: "Automotive",
  legal: "Legal", construction: "Construction", cleaning: "Cleaning",
  events: "Events", florist: "Florist", finance: "Finance",
  gaming: "Gaming", luxury: "Luxury", agriculture: "Agriculture",
  corporate: "Corporate", general: "General",
};

function buildUrl(id: string, w = 800, h = 600): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}

function extractImages(html: string): ImageInfo[] {
  if (typeof DOMParser === "undefined") return [];
  const doc = new DOMParser().parseFromString(html, "text/html");
  const images: ImageInfo[] = [];
  doc.querySelectorAll("img").forEach((img, i) => {
    const src = img.getAttribute("src") || "";
    if (!src || src.startsWith("data:") || /logo|favicon|icon/i.test(src + " " + (img.getAttribute("alt") || ""))) return;
    const alt = img.getAttribute("alt") || `Image ${i + 1}`;
    const desc = (alt + " " + img.className).toLowerCase();
    const variant = /hero|banner/.test(desc) ? "hero" as const : /card|service/.test(desc) ? "card" as const : "section" as const;
    images.push({ index: i, src, alt, variant });
  });
  return images;
}

function replaceImageInHtml(html: string, oldSrc: string, newSrc: string): string {
  // Escape special regex chars in the old src
  const escaped = oldSrc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.replace(new RegExp(escaped, "g"), newSrc);
}

const ImageSwapPanel = ({ html, onHtmlChange }: Props) => {
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory>("general");
  const [searchTerm, setSearchTerm] = useState("");

  const images = useMemo(() => extractImages(html), [html]);

  // Detect category from html
  useEffect(() => {
    const text = html.toLowerCase();
    const cats = Object.keys(IMAGE_LIBRARY) as ImageCategory[];
    for (const cat of cats) {
      if (cat !== "general" && text.includes(cat.toLowerCase())) {
        setSelectedCategory(cat);
        return;
      }
    }
  }, [html]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return Object.keys(IMAGE_LIBRARY) as ImageCategory[];
    return (Object.keys(IMAGE_LIBRARY) as ImageCategory[]).filter(
      (c) => CATEGORY_LABELS[c].toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSwap = (imageId: string) => {
    if (!selectedImage) return;
    const dims = selectedImage.variant === "hero" ? [1600, 900] : selectedImage.variant === "card" ? [700, 500] : [1200, 800];
    const newSrc = buildUrl(imageId, dims[0], dims[1]);
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
        <p className="text-xs text-muted-foreground mt-0.5">Click an image to swap it</p>
      </div>

      {/* Image list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {!selectedImage ? (
          images.map((img) => (
            <button
              key={img.index}
              onClick={() => setSelectedImage(img)}
              className="w-full group relative rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-20 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
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
            {/* Back + current image */}
            <button
              onClick={() => setSelectedImage(null)}
              className="flex items-center gap-1 text-xs text-primary hover:underline mb-2"
            >
              ← Back to images
            </button>

            <div className="rounded-lg overflow-hidden border border-primary/30 mb-3">
              <img src={selectedImage.src} alt={selectedImage.alt} className="w-full h-24 object-cover" />
              <div className="px-2 py-1.5 bg-primary/5">
                <p className="text-[11px] text-foreground font-medium truncate">{selectedImage.alt}</p>
              </div>
            </div>

            {/* Category search */}
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

            {/* Category chips */}
            <div className="flex flex-wrap gap-1 mb-3">
              {filteredCategories.slice(0, 10).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>

            {/* Replacement options */}
            <div className="grid grid-cols-2 gap-1.5">
              {IMAGE_LIBRARY[selectedCategory].map((id) => (
                <button
                  key={id}
                  onClick={() => handleSwap(id)}
                  className="rounded-md overflow-hidden border border-border hover:border-primary/50 transition-all hover:scale-[1.02]"
                >
                  <img
                    src={buildUrl(id, 400, 300)}
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
