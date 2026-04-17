type ImageVariant = "hero" | "section" | "card";
import { BrandData } from "@/components/BrandInput";

type ImageCategory =
  | "spa" | "coffee" | "restaurant" | "fitness" | "tech" | "beauty"
  | "realEstate" | "travel" | "medical" | "education" | "pets" | "automotive"
  | "legal" | "construction" | "cleaning" | "events" | "florist" | "finance"
  | "gaming" | "luxury" | "agriculture" | "corporate"
  | "bakery" | "photography" | "music" | "yoga" | "dental" | "fashion"
  | "barber" | "tattoo" | "brewery" | "gym" | "hotel" | "daycare"
  | "plumbing" | "electrical" | "landscaping" | "moving" | "painting"
  | "general";

// Curated high-quality Unsplash photo IDs per category (8-12 per category)
const IMAGE_ID_LIBRARY: Record<ImageCategory, string[]> = {
  spa: ["1544161515-4ab6ce6db874", "1540555700478-4be289fbec6d", "1600334089648-b0d9d3028eb2", "1545205597-3d9d02c29597", "1507652313519-d4e9174996dd", "1515377905703-c4788e51af15", "1596178060671-7a80dc8059ea", "1600334129128-685c5582fd35"],
  coffee: ["1495474472287-4d71bcdd2085", "1501339847302-ac426a4a7cbb", "1509042239860-f550ce710b93", "1559496417-e7f25cb247f3", "1442512595331-e89e73853f31", "1498804103079-a6351b050096", "1511920170033-f8396924c348", "1461023058943-07fcbe16d735"],
  restaurant: ["1504674900247-0877df9cc836", "1555396273-367ea4eb4db5", "1517248135467-4c7edcad34c4", "1414235077428-338989a2e8c0", "1476224203421-9ac39bcb3327", "1552566626-98f62b96471a", "1424847651672-bf20a4b0982b", "1537047902294-62a40c20a6ae"],
  fitness: ["1517649763962-0c623066013b", "1461896836934-bd45ba055097", "1534438327276-14e5300c3a48", "1552674605-db6ffd4facb5", "1571019614242-c5c5dee9f50b", "1549060279-7aa2d77dd74e", "1581009146145-b5ef050c2e1e", "1574680096145-d05b13a5fd37"],
  tech: ["1518770660439-4636190af475", "1461749280684-dccba630e2f6", "1504384308090-c894fdcc538d", "1519389950473-47ba0277781c", "1550751827-4bd374c3f58b", "1526374965328-7f61d4dc18c5", "1531297484001-80022131f31a", "1550745165-9bc0b252726f"],
  beauty: ["1445205170230-053b83016050", "1490481651871-ab68de25d43d", "1469334031218-e382a71b716b", "1560066984-138dadb4c035", "1522337360788-8b13dee7a37e", "1487412720507-e7ab37603c6f", "1596462502278-27bfdc403348", "1570172619644-dfd03ed5d3c7"],
  realEstate: ["1560518883-ce09059eeffa", "1564013799919-ab600027ffc6", "1512917774080-9991f1c4c750", "1600596542815-ffad4c1539a9", "1570129477492-45c003edd2be", "1560185007-cde436f6a4d0", "1600585154340-be6161a56a0c", "1582268611958-863e19afd5be"],
  travel: ["1476514525535-07fb3b4ae5f1", "1488085061387-422e29b40080", "1507525428034-b723cf961d3e", "1530789253388-582c481c54b0", "1469854523086-cc02fe5d8800", "1504150558240-0b4fd8946624", "1506929562872-bb421503ef21", "1501785888108-9e10aca35602"],
  medical: ["1576091160399-112ba8d25d1d", "1505751172876-fa1923c5c528", "1559757175-5700dde675bc", "1532938911079-1b06ac7ceec7", "1579684385127-1ef15d508118", "1551190822-a9ec5186ab9f", "1538108149393-fbbd81895907", "1631815588090-d4bfec5b1b89"],
  education: ["1503676260728-1c00da094a0b", "1523050854058-8df90110c8f1", "1509062522246-3755977927d7", "1497633762265-9d179a990aa6", "1481627834876-b7833e8f5570", "1524178232363-1fb2b075b655", "1427504350561-60ff4e8f5e6f", "1503676260728-1c00da094a0b"],
  pets: ["1548199973-03cce0bbc87b", "1587300003388-59208cc962cb", "1601758228041-f3b2795255f1", "1450778869180-41d0601e046e", "1583511655857-d19b40a7a54e", "1574158622682-e40e69881006", "1587764379990-55ded888e1f3", "1537151625747-768eb6cf92b2"],
  automotive: ["1492144534655-ae79c964c9d7", "1503376780353-7e6692767b70", "1580273916550-e323be2ae537", "1549317661-bd32c8ce0db2", "1494976388531-d1058494cdd8", "1533473359331-d2618f9ce7df", "1568605117036-5fe5e7765c17", "1542362567-b07ad671b4e2"],
  legal: ["1589829545856-d10d557cf95f", "1505664194779-8beaceb93744", "1450101499163-c8848e968f44", "1479142506502-19b3a3b7ff33", "1575505586569-646b2ca898fc", "1521587760476-6c12a4b040da", "1507679799987-c73779587ccf", "1454165804606-c3d57bc86b40"],
  construction: ["1503387762-592deb58ef4e", "1504307651254-35680f356dfd", "1541888946425-d81bb19240f5", "1487958449943-2429e8be8625", "1581094794329-c8112a89af12", "1590644365607-1db10ee3de9e", "1504307651254-35680f356dfd", "1513467535987-fd81bc7d62f8"],
  cleaning: ["1581578731548-c64695cc6952", "1527515545081-5db817172677", "1558317374-067fb5f30001", "1563453392212-326f5e854473", "1585421514738-01798e348b17", "1628177142898-93e36e4e3a50", "1556909114-f6e7ad7d3136", "1585421514738-01798e348b17"],
  events: ["1519741497674-611481863552", "1511285560929-80b456fea0bc", "1469371670807-013ccf25f16a", "1478146896981-b80fe463b330", "1519167758481-83f550bb49b3", "1464366400600-7168b8af9bc3", "1531058020387-3be344556be6", "1492684223066-81342ee5ff30"],
  florist: ["1490750967868-88aa4f44baee", "1487530811176-3780de880c2d", "1416879595882-3373a0480b5b", "1455659817273-f96807779a8a", "1490750967868-88aa4f44baee", "1526047932273-341f2a7631f9", "1561181286-d3fee7d55364", "1487530811176-3780de880c2d"],
  finance: ["1554224155-6726b3ff858f", "1460925895917-afdab827c52f", "1579532537598-459ecdaf39cc", "1611974789855-9c2a0a7236a3", "1554224155-6726b3ff858f", "1563013544-824ae1b704d3", "1551288049-bebda4e38f71", "1554224155-6726b3ff858f"],
  gaming: ["1542751371-adc38448a05e", "1538481199705-c710c4e965fc", "1552820728-8b83bb6b2b28", "1493711662062-fa541adb3fc8", "1511512578047-dfb367046420", "1538481199705-c710c4e965fc", "1542751110-97427bbecf20", "1550745165-9bc0b252726f"],
  luxury: ["1515562141207-7a88fb7ce338", "1535632066927-ab7c9ab60908", "1506630448388-4e683c67ddb0", "1573408301185-9146fe634ad0", "1541123356219-284ebe98ae80", "1617038260897-41a1f14a8ca0", "1600607687939-ce8a6c25118c", "1582719508461-905c673752f4"],
  agriculture: ["1500595046743-cd271d694d30", "1464226184884-fa280b87c399", "1574943320219-553eb213f72d", "1625246333195-78d9c38ad449", "1500595046743-cd271d694d30", "1592982537447-6d17f819c70f", "1530836369250-ef72a3f5cda8", "1500595046743-cd271d694d30"],
  corporate: ["1454165804606-c3d57bc86b40", "1507679799987-c73779587ccf", "1486406146926-c627a92ad1ab", "1573164713988-8665fc963095", "1556761175-5973dc0f32e7", "1497366216548-37526070297c", "1497366754770-54fc7d425f52", "1568992688065-536aad8a12f6"],
  bakery: ["1509440159596-0249088772ff", "1558961363-fa8fdf82db35", "1486427944544-d2052751f603", "1517433670267-08bbd4be890f", "1555507036-ab1f4038024a", "1509440159596-0249088772ff", "1517433670267-08bbd4be890f", "1486427944544-d2052751f603"],
  photography: ["1516035069371-29a1b244cc32", "1452587925148-ce544e77e70d", "1554080353-a576cf803bda", "1471341971476-ae15ff5dd4ea", "1542038784456-1ea8e935640e", "1510127034890-ba27508e9f1c", "1554080353-a576cf803bda", "1516035069371-29a1b244cc32"],
  music: ["1511379938547-c1f69419868d", "1514320291840-2e0a9bf2a9ae", "1493225457124-a3eb161ffa5f", "1507838153414-b4b713384a76", "1470225620780-dba8ba36b745", "1511379938547-c1f69419868d", "1514320291840-2e0a9bf2a9ae", "1507838153414-b4b713384a76"],
  yoga: ["1544367567-0f2fcb009e0b", "1506126613332-22ea3c5e6b26", "1575052814086-f385e2e2ad1b", "1599447421416-3414500d18a5", "1544367567-0f2fcb009e0b", "1506126613332-22ea3c5e6b26", "1575052814086-f385e2e2ad1b", "1599447421416-3414500d18a5"],
  dental: ["1606811971618-4486d14f3f99", "1588776814546-1ffcf47267a5", "1629909613654-28e377c37b09", "1606811971618-4486d14f3f99", "1588776814546-1ffcf47267a5", "1629909613654-28e377c37b09", "1576091160399-112ba8d25d1d", "1505751172876-fa1923c5c528"],
  fashion: ["1558618666-fcd25c85f82e", "1445205170230-053b83016050", "1490481651871-ab68de25d43d", "1441986300917-64674bd600d8", "1515886657613-9f3515b0c78f", "1558618666-fcd25c85f82e", "1445205170230-053b83016050", "1490481651871-ab68de25d43d"],
  barber: ["1503951914875-452162b0f3f1", "1585747860019-024e754e8f54", "1621605815971-fbc98d665033", "1503951914875-452162b0f3f1", "1585747860019-024e754e8f54", "1621605815971-fbc98d665033", "1503951914875-452162b0f3f1", "1585747860019-024e754e8f54"],
  tattoo: ["1611501275019-9b5cda994e8d", "1590246815003-c3d7e2ae4d3a", "1611501275019-9b5cda994e8d", "1590246815003-c3d7e2ae4d3a", "1611501275019-9b5cda994e8d", "1590246815003-c3d7e2ae4d3a", "1611501275019-9b5cda994e8d", "1590246815003-c3d7e2ae4d3a"],
  brewery: ["1558642452-9d2a7deb7f62", "1535958636474-b021ee887b13", "1436076863939-06870fe779c2", "1558642452-9d2a7deb7f62", "1535958636474-b021ee887b13", "1436076863939-06870fe779c2", "1558642452-9d2a7deb7f62", "1535958636474-b021ee887b13"],
  gym: ["1534438327276-14e5300c3a48", "1517649763962-0c623066013b", "1571019614242-c5c5dee9f50b", "1534438327276-14e5300c3a48", "1517649763962-0c623066013b", "1571019614242-c5c5dee9f50b", "1534438327276-14e5300c3a48", "1517649763962-0c623066013b"],
  hotel: ["1566073771259-6a6150012585", "1520250497591-112f2f40a3f4", "1551882547-ff40c63fe5fa", "1566073771259-6a6150012585", "1520250497591-112f2f40a3f4", "1551882547-ff40c63fe5fa", "1566073771259-6a6150012585", "1520250497591-112f2f40a3f4"],
  daycare: ["1587654780541-e71f7168dfb7", "1544367567-0f2fcb009e0b", "1587654780541-e71f7168dfb7", "1544367567-0f2fcb009e0b", "1587654780541-e71f7168dfb7", "1544367567-0f2fcb009e0b", "1587654780541-e71f7168dfb7", "1544367567-0f2fcb009e0b"],
  plumbing: ["1504307651254-35680f356dfd", "1581094794329-c8112a89af12", "1504307651254-35680f356dfd", "1581094794329-c8112a89af12", "1504307651254-35680f356dfd", "1581094794329-c8112a89af12", "1504307651254-35680f356dfd", "1581094794329-c8112a89af12"],
  electrical: ["1504307651254-35680f356dfd", "1581094794329-c8112a89af12", "1504307651254-35680f356dfd", "1581094794329-c8112a89af12", "1504307651254-35680f356dfd", "1581094794329-c8112a89af12", "1504307651254-35680f356dfd", "1581094794329-c8112a89af12"],
  landscaping: ["1500595046743-cd271d694d30", "1558171813-2264205b7a67", "1500595046743-cd271d694d30", "1558171813-2264205b7a67", "1500595046743-cd271d694d30", "1558171813-2264205b7a67", "1500595046743-cd271d694d30", "1558171813-2264205b7a67"],
  moving: ["1600585154340-be6161a56a0c", "1600585154340-be6161a56a0c", "1600585154340-be6161a56a0c", "1600585154340-be6161a56a0c", "1600585154340-be6161a56a0c", "1600585154340-be6161a56a0c", "1600585154340-be6161a56a0c", "1600585154340-be6161a56a0c"],
  painting: ["1513467535987-fd81bc7d62f8", "1513467535987-fd81bc7d62f8", "1513467535987-fd81bc7d62f8", "1513467535987-fd81bc7d62f8", "1513467535987-fd81bc7d62f8", "1513467535987-fd81bc7d62f8", "1513467535987-fd81bc7d62f8", "1513467535987-fd81bc7d62f8"],
  general: ["1454165804606-c3d57bc86b40", "1556761175-5973dc0f32e7", "1486406146926-c627a92ad1ab", "1573164713988-8665fc963095", "1497366216548-37526070297c", "1507679799987-c73779587ccf", "1497366754770-54fc7d425f52", "1568992688065-536aad8a12f6"],
};

const CATEGORY_MATCHERS: Array<{ category: ImageCategory; keywords: string[] }> = [
  { category: "spa", keywords: ["spa", "wellness", "massage", "facial", "sauna", "retreat", "aromatherapy", "relaxation"] },
  { category: "coffee", keywords: ["coffee", "cafe", "café", "espresso", "roastery", "latte", "cappuccino"] },
  { category: "restaurant", keywords: ["restaurant", "food", "pizza", "burger", "bistro", "dining", "chef", "eatery", "grill", "sushi", "taco", "bbq"] },
  { category: "bakery", keywords: ["bakery", "bread", "pastry", "cake", "cupcake", "dessert", "patisserie", "doughnut", "donut"] },
  { category: "fitness", keywords: ["fitness", "sport", "sports", "athlete", "workout", "training", "crossfit", "personal trainer"] },
  { category: "gym", keywords: ["gym", "weight", "bodybuilding", "strength"] },
  { category: "yoga", keywords: ["yoga", "pilates", "meditation", "mindfulness", "stretching"] },
  { category: "tech", keywords: ["tech", "software", "saas", "startup", "app", "ai", "agency", "it", "digital", "web development", "developer"] },
  { category: "beauty", keywords: ["salon", "beauty", "cosmetic", "skincare", "makeup", "nails", "manicure", "pedicure"] },
  { category: "barber", keywords: ["barber", "barbershop", "haircut", "shave", "grooming", "men's hair"] },
  { category: "fashion", keywords: ["fashion", "clothing", "apparel", "boutique", "style", "designer", "wardrobe"] },
  { category: "tattoo", keywords: ["tattoo", "piercing", "ink", "body art"] },
  { category: "realEstate", keywords: ["real estate", "property", "realtor", "interior", "home", "apartment", "villa", "house", "condo"] },
  { category: "travel", keywords: ["travel", "tourism", "vacation", "destination", "tour", "adventure", "cruise"] },
  { category: "hotel", keywords: ["hotel", "resort", "motel", "accommodation", "hostel", "lodge", "inn", "airbnb"] },
  { category: "medical", keywords: ["doctor", "clinic", "medical", "health", "hospital", "pharmacy", "healthcare"] },
  { category: "dental", keywords: ["dentist", "dental", "orthodontist", "teeth", "smile"] },
  { category: "education", keywords: ["school", "education", "academy", "course", "tutoring", "college", "university", "learning"] },
  { category: "daycare", keywords: ["daycare", "childcare", "preschool", "nursery", "kindergarten", "kids"] },
  { category: "pets", keywords: ["pet", "veterinary", "veterinarian", "dog", "cat", "grooming", "animal", "vet"] },
  { category: "automotive", keywords: ["car", "garage", "automotive", "auto repair", "detailing", "vehicle", "mechanic", "tire"] },
  { category: "legal", keywords: ["law", "legal", "attorney", "lawyer", "litigation", "firm", "notary"] },
  { category: "construction", keywords: ["construction", "architecture", "builder", "renovation", "contractor", "roofing"] },
  { category: "plumbing", keywords: ["plumbing", "plumber", "pipe", "drain", "water heater"] },
  { category: "electrical", keywords: ["electrician", "electrical", "wiring", "lighting"] },
  { category: "cleaning", keywords: ["cleaning", "maid", "housekeeping", "janitorial", "sanitation", "pressure washing"] },
  { category: "landscaping", keywords: ["landscaping", "lawn", "garden", "yard", "tree service", "mowing"] },
  { category: "moving", keywords: ["moving", "relocation", "hauling", "movers", "packing"] },
  { category: "painting", keywords: ["painting", "painter", "wall", "interior painting", "exterior painting"] },
  { category: "events", keywords: ["wedding", "event", "planner", "celebration", "venue", "party", "catering"] },
  { category: "florist", keywords: ["florist", "flower", "bouquet", "plants", "floral"] },
  { category: "photography", keywords: ["photography", "photographer", "photo", "videography", "studio", "portrait"] },
  { category: "music", keywords: ["music", "band", "recording", "studio", "dj", "instrument", "guitar", "piano"] },
  { category: "finance", keywords: ["finance", "accounting", "bank", "tax", "wealth", "investment", "insurance", "cpa", "bookkeeping"] },
  { category: "gaming", keywords: ["gaming", "esports", "stream", "arcade", "tournament"] },
  { category: "luxury", keywords: ["jewelry", "luxury", "premium", "watch", "diamond"] },
  { category: "brewery", keywords: ["brewery", "beer", "craft beer", "taproom", "pub", "winery", "wine", "distillery"] },
  { category: "agriculture", keywords: ["farm", "agriculture", "organic", "crop", "harvest", "ranch"] },
  { category: "corporate", keywords: ["corporate", "consulting", "business", "enterprise", "professional", "management"] },
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

function inferImageCategory(text: string, brandData?: BrandData): ImageCategory {
  // 1. Precise match on businessType ID from user selection
  if (brandData?.businessType) {
    const btId = brandData.businessType.toLowerCase();
    const match = CATEGORY_MATCHERS.find(m => m.category.toLowerCase() === btId);
    if (match) return match.category;
  }

  // 2. Keyword matching in user-provided description, name, and notes
  if (brandData) {
    const context = `${brandData.businessName} ${brandData.services} ${brandData.extraNotes}`.toLowerCase();
    const match = CATEGORY_MATCHERS.find(({ keywords }) =>
      keywords.some((k) => context.includes(k))
    );
    if (match) return match.category;
  }

  // 3. Fallback: Matching based on generated HTML content
  const lower = text.toLowerCase();
  const match = CATEGORY_MATCHERS.find(({ keywords }) =>
    keywords.some((keyword) => lower.includes(keyword))
  );
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

function sanitizeGeneratedHtml(html: string, brandData?: BrandData): string {
  if (typeof DOMParser === "undefined") return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const category = inferImageCategory(doc.documentElement.outerHTML, brandData);
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

export function extractHtmlFromMessage(content: string, brandData?: BrandData): string | null {
  // 1. Try matching explicitly labeled HTML block (case-insensitive)
  let match = content.match(/```html\s*\n([\s\S]*?)```/i);
  if (match) return sanitizeGeneratedHtml(match[1].trim(), brandData);

  // 2. Try matching any generic code block
  match = content.match(/```\s*\n([\s\S]*?)```/);
  if (match && match[1].trim().startsWith("<")) return sanitizeGeneratedHtml(match[1].trim(), brandData);

  // 3. If no code block, but content contains raw HTML starting with doctype or HTML tag
  const fallbackMatch = content.match(/(<!DOCTYPE html>[\s\S]*?<\/html>|<html[\s\S]*?<\/html>)/i);
  if (fallbackMatch) return sanitizeGeneratedHtml(fallbackMatch[0].trim(), brandData);

  const trimmed = content.trim();
  if (trimmed.startsWith("<")) {
    return sanitizeGeneratedHtml(trimmed, brandData);
  }

  return null;
}

export function hasHtmlCode(content: string): boolean {
  return /```(html)?\s*\n|<html|<!DOCTYPE/i.test(content);
}

// Export for ImageSwapPanel
export { IMAGE_ID_LIBRARY, CATEGORY_MATCHERS, buildUnsplashUrl, inferImageCategory };
export type { ImageCategory, ImageVariant };
