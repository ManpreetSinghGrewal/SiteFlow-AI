type ImageCategory =
  | "spa"
  | "coffee"
  | "restaurant"
  | "fitness"
  | "tech"
  | "beauty"
  | "realEstate"
  | "travel"
  | "medical"
  | "education"
  | "pets"
  | "automotive"
  | "legal"
  | "construction"
  | "cleaning"
  | "events"
  | "florist"
  | "finance"
  | "gaming"
  | "luxury"
  | "agriculture"
  | "corporate"
  | "general";

type ImageVariant = "hero" | "section" | "card";

const IMAGE_ID_LIBRARY: Record<ImageCategory, string[]> = {
  spa: ["1544161515-4ab6ce6db874", "1540555700478-4be289fbec6d", "1600334089648-b0d9d3028eb2", "1545205597-3d9d02c29597"],
  coffee: ["1495474472287-4d71bcdd2085", "1501339847302-ac426a4a7cbb", "1509042239860-f550ce710b93", "1559496417-e7f25cb247f3"],
  restaurant: ["1504674900247-0877df9cc836", "1555396273-367ea4eb4db5", "1517248135467-4c7edcad34c4", "1509440159596-0249088772ff"],
  fitness: ["1517649763962-0c623066013b", "1461896836934-bd45ba055097", "1534438327276-14e5300c3a48", "1552674605-db6ffd4facb5"],
  tech: ["1518770660439-4636190af475", "1461749280684-dccba630e2f6", "1504384308090-c894fdcc538d", "1519389950473-47ba0277781c"],
  beauty: ["1445205170230-053b83016050", "1490481651871-ab68de25d43d", "1469334031218-e382a71b716b", "1560066984-138dadb4c035"],
  realEstate: ["1560518883-ce09059eeffa", "1564013799919-ab600027ffc6", "1512917774080-9991f1c4c750", "1600596542815-ffad4c1539a9"],
  travel: ["1476514525535-07fb3b4ae5f1", "1488085061387-422e29b40080", "1507525428034-b723cf961d3e", "1530789253388-582c481c54b0"],
  medical: ["1576091160399-112ba8d25d1d", "1505751172876-fa1923c5c528", "1559757175-5700dde675bc", "1532938911079-1b06ac7ceec7"],
  education: ["1503676260728-1c00da094a0b", "1523050854058-8df90110c8f1", "1509062522246-3755977927d7", "1497633762265-9d179a990aa6"],
  pets: ["1548199973-03cce0bbc87b", "1587300003388-59208cc962cb", "1601758228041-f3b2795255f1", "1450778869180-41d0601e046e"],
  automotive: ["1492144534655-ae79c964c9d7", "1503376780353-7e6692767b70", "1580273916550-e323be2ae537", "1549317661-bd32c8ce0db2"],
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

const CATEGORY_MATCHERS: Array<{ category: ImageCategory; keywords: string[] }> = [
  { category: "spa", keywords: ["spa", "wellness", "massage", "facial", "sauna", "retreat", "aromatherapy"] },
  { category: "coffee", keywords: ["coffee", "cafe", "café", "espresso", "roastery"] },
  { category: "restaurant", keywords: ["restaurant", "food", "bakery", "pizza", "burger", "bistro", "dining", "chef"] },
  { category: "fitness", keywords: ["gym", "fitness", "sport", "sports", "athlete", "workout", "training", "crossfit"] },
  { category: "tech", keywords: ["tech", "software", "saas", "startup", "app", "ai", "agency", "it", "digital"] },
  { category: "beauty", keywords: ["salon", "beauty", "cosmetic", "hair", "skincare", "makeup", "fashion"] },
  { category: "realEstate", keywords: ["real estate", "property", "realtor", "interior", "home", "apartment", "villa"] },
  { category: "travel", keywords: ["travel", "hotel", "resort", "tourism", "vacation", "destination"] },
  { category: "medical", keywords: ["doctor", "clinic", "medical", "health", "hospital", "dentist", "dental"] },
  { category: "education", keywords: ["school", "education", "academy", "course", "training", "tutoring", "college"] },
  { category: "pets", keywords: ["pet", "veterinary", "veterinarian", "dog", "cat", "grooming", "animal"] },
  { category: "automotive", keywords: ["car", "garage", "automotive", "auto repair", "detailing", "vehicle"] },
  { category: "legal", keywords: ["law", "legal", "attorney", "lawyer", "litigation", "firm"] },
  { category: "construction", keywords: ["construction", "architecture", "builder", "renovation", "contractor"] },
  { category: "cleaning", keywords: ["cleaning", "maid", "housekeeping", "janitorial", "sanitation"] },
  { category: "events", keywords: ["wedding", "event", "planner", "celebration", "venue"] },
  { category: "florist", keywords: ["florist", "flower", "garden", "bouquet", "plants"] },
  { category: "finance", keywords: ["finance", "accounting", "bank", "tax", "wealth", "investment", "insurance"] },
  { category: "gaming", keywords: ["gaming", "esports", "stream", "arcade", "tournament"] },
  { category: "luxury", keywords: ["jewelry", "luxury", "premium", "watch", "diamond"] },
  { category: "agriculture", keywords: ["farm", "agriculture", "organic", "crop", "harvest"] },
  { category: "corporate", keywords: ["corporate", "consulting", "business", "enterprise", "professional"] },
];

const BROKEN_IMAGE_SOURCES = ["source.unsplash.com", "picsum.photos", "via.placeholder.com", "placeholder.com", "placehold.co"];

function buildUnsplashUrl(id: string, variant: ImageVariant): string {
  const dimensions = {
    hero: { width: 1600, height: 900 },
    section: { width: 1200, height: 800 },
    card: { width: 700, height: 500 },
  }[variant];

  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${dimensions.width}&h=${dimensions.height}&q=80`;
}

function inferImageCategory(html: string): ImageCategory {
  const text = html.toLowerCase();
  const match = CATEGORY_MATCHERS.find(({ keywords }) => keywords.some((keyword) => text.includes(keyword)));
  return match?.category ?? "general";
}

function normalizeUrl(url: string): string {
  const value = url.trim();

  if (!value) return value;
  if (value.startsWith("//")) return `https:${value}`;
  if (/^(images\.unsplash\.com|picsum\.photos|images\.pexels\.com)\//i.test(value)) return `https://${value}`;

  return value;
}

function isLogoLikeAsset(url: string, descriptor: string): boolean {
  const normalized = normalizeUrl(url).toLowerCase();
  const context = descriptor.toLowerCase();

  return /logo|favicon|icon|brand-mark|avatar/.test(context) || /\.(svg|ico)([?#].*)?$/i.test(normalized) || normalized.startsWith("data:image/svg");
}

function isSemanticPlaceholder(url: string): boolean {
  return !/^(https?:|data:|blob:|\/)/i.test(url) && /hero|image|photo|gallery|team|service|about|testimonial|background|banner/i.test(url);
}

function shouldReplaceImageUrl(url: string, descriptor = ""): boolean {
  const normalized = normalizeUrl(url);

  if (!normalized || normalized.startsWith("data:") || normalized.startsWith("blob:")) return false;
  if (isLogoLikeAsset(normalized, descriptor)) return false;
  if (isSemanticPlaceholder(normalized)) return true;
  if (BROKEN_IMAGE_SOURCES.some((source) => normalized.includes(source))) return true;
  if (/^https?:\/\//i.test(normalized)) return true;
  if (/^(images\.unsplash\.com|picsum\.photos)\//i.test(url)) return true;

  return false;
}

function sanitizeGeneratedHtml(html: string): string {
  if (typeof DOMParser === "undefined") return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const category = inferImageCategory(doc.documentElement.outerHTML);
  const pool = [...IMAGE_ID_LIBRARY[category], ...IMAGE_ID_LIBRARY.general];
  let imageIndex = 0;

  const nextImage = (variant: ImageVariant = "section") => {
    const id = pool[imageIndex % pool.length];
    imageIndex += 1;
    return buildUnsplashUrl(id, variant);
  };

  doc.querySelectorAll("picture source").forEach((source) => {
    source.removeAttribute("srcset");
    source.removeAttribute("sizes");
  });

  doc.querySelectorAll("img").forEach((img, index) => {
    const currentSrc = img.getAttribute("src") ?? "";
    const descriptor = `${img.getAttribute("alt") ?? ""} ${img.id} ${img.className}`;

    if (!shouldReplaceImageUrl(currentSrc, descriptor)) {
      const normalized = normalizeUrl(currentSrc);
      if (normalized && normalized !== currentSrc) img.setAttribute("src", normalized);
      return;
    }

    const loweredDescriptor = descriptor.toLowerCase();
    const variant: ImageVariant = /hero|banner|masthead/.test(loweredDescriptor) || index === 0
      ? "hero"
      : /card|service|feature|gallery/.test(loweredDescriptor)
        ? "card"
        : "section";

    img.setAttribute("src", nextImage(variant));
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");

    if (!img.getAttribute("alt")) {
      img.setAttribute("alt", `${category.replace(/([A-Z])/g, " $1").trim()} website image ${index + 1}`);
    }

    if (index > 0 && !img.getAttribute("loading")) {
      img.setAttribute("loading", "lazy");
    }
  });

  const replaceCssUrls = (cssText: string, variant: ImageVariant = "section") =>
    cssText.replace(/url\((['"]?)(.*?)\1\)/gi, (match, quote, rawUrl) => {
      const normalized = normalizeUrl(String(rawUrl));

      if (!shouldReplaceImageUrl(normalized)) {
        if (normalized && normalized !== rawUrl) return `url(${quote}${normalized}${quote})`;
        return match;
      }

      return `url(${quote}${nextImage(variant)}${quote})`;
    });

  doc.querySelectorAll<HTMLElement>("[style*='url(']").forEach((element) => {
    const style = element.getAttribute("style");
    if (!style) return;

    const descriptor = `${element.id} ${element.className}`.toLowerCase();
    const variant: ImageVariant = /hero|banner|masthead/.test(descriptor) ? "hero" : "section";
    element.setAttribute("style", replaceCssUrls(style, variant));
  });

  doc.querySelectorAll("style").forEach((styleTag) => {
    const css = styleTag.textContent;
    if (!css || !css.includes("url(")) return;
    styleTag.textContent = replaceCssUrls(css, "section");
  });

  return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
}

export function extractHtmlFromMessage(content: string): string | null {
  const match = content.match(/```html\s*\n([\s\S]*?)```/);
  return match ? sanitizeGeneratedHtml(match[1].trim()) : null;
}

export function hasHtmlCode(content: string): boolean {
  return /```html\s*\n/.test(content);
}
