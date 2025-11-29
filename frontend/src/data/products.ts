export type Currency = "NGN" | "USD";

export type ProductCategory = "Bitters" | "Elixirs" | "Aperitifs" | "Limited";

export type ProductVariant = {
  id?: string;
  name: string;
  sku?: string;
  bottleSize: string;
  priceNGN: number;
  priceUSD: number;
  image?: string;
  stock: number;
  isActive: boolean;
  sortOrder?: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: { NGN: number; USD: number };
  sku: string;
  stock: number;
  isFeatured: boolean;
  image: string;
  tastingNotes: string[];
  category: ProductCategory;
  size: string;
  variants?: ProductVariant[];
};

export const products: Product[] = [
  {
    id: "essence-bitter",
    slug: "essence-bitter",
    name: "Essence Bitter Tonic",
    description:
      "A revitalizing blend of kola nut, bitter leaf, and botanical bitters that awaken the senses.",
    price: { NGN: 12000, USD: 38 },
    sku: "KA-EB-001",
    stock: 120,
    isFeatured: true,
    image: "/images/products/essence-bitter.jpg",
    tastingNotes: ["Citrus peel", "Roasted kola", "Velvet finish"],
    category: "Bitters",
    size: "750 ml",
  },
  {
    id: "velvet-root",
    slug: "velvet-root",
    name: "Velvet Root Elixir",
    description:
      "Smooth, restorative blend with ginseng, ginger, and wild honey for calm evenings.",
    price: { NGN: 14500, USD: 46 },
    sku: "KA-VR-002",
    stock: 80,
    isFeatured: true,
    image: "/images/products/velvet-root.jpg",
    tastingNotes: ["Wild honey", "Warm ginger", "Soft spice"],
    category: "Elixirs",
    size: "700 ml",
  },
  {
    id: "noir-botanica",
    slug: "noir-botanica",
    name: "Noir Botanica Reserve",
    description:
      "Deep, aromatic blend for connoisseurs with matured herbs aged in charred oak.",
    price: { NGN: 19500, USD: 62 },
    sku: "KA-NB-003",
    stock: 50,
    isFeatured: false,
    image: "/images/products/noir-botanica.jpg",
    tastingNotes: ["Smoked herbs", "Dark cacao", "Long finish"],
    category: "Limited",
    size: "500 ml",
  },
  {
    id: "citrus-leaf",
    slug: "citrus-leaf",
    name: "Citrus Leaf Aperitif",
    description:
      "Bright, refreshing aperitif infused with orange zest, lemongrass, and kola bitters.",
    price: { NGN: 9800, USD: 32 },
    sku: "KA-CL-004",
    stock: 110,
    isFeatured: false,
    image: "/images/products/citrus-leaf.svg",
    tastingNotes: ["Orange blossom", "Lemongrass", "Clean finish"],
    category: "Aperitifs",
    size: "750 ml",
  },
  {
    id: "emerald-reserve",
    slug: "emerald-reserve",
    name: "Emerald Reserve",
    description:
      "Limited oak-matured bitters layered with kola bark, wild mint, and charred citrus peels.",
    price: { NGN: 21000, USD: 68 },
    sku: "KA-ER-005",
    stock: 40,
    isFeatured: true,
    image: "/images/products/emerald-reserve.svg",
    tastingNotes: ["Oak smoke", "Wild mint", "Citrus zest"],
    category: "Limited",
    size: "700 ml",
  },
  {
    id: "ruby-aperitif",
    slug: "ruby-aperitif",
    name: "Ruby Aperitif",
    description:
      "A velvet-forward aperitif featuring roselle petals, hibiscus, and honeyed ginger.",
    price: { NGN: 13500, USD: 44 },
    sku: "KA-RA-006",
    stock: 95,
    isFeatured: false,
    image: "/images/products/ruby-aperitif.svg",
    tastingNotes: ["Hibiscus", "Honeyed ginger", "Velvet finish"],
    category: "Aperitifs",
    size: "750 ml",
  },
  {
    id: "obsidian-bitter",
    slug: "obsidian-bitter",
    name: "Obsidian Bitter",
    description:
      "Bold and aromatic tonic with kola nut, espresso roast cacao, and forest spices.",
    price: { NGN: 15800, USD: 50 },
    sku: "KA-OB-007",
    stock: 75,
    isFeatured: false,
    image: "/images/products/obsidian-bitter.svg",
    tastingNotes: ["Espresso cacao", "Forest spice", "Resonant finish"],
    category: "Bitters",
    size: "700 ml",
  },
  {
    id: "sunrise-tonic",
    slug: "sunrise-tonic",
    name: "Sunrise Vitality Tonic",
    description:
      "Daytime energiser with turmeric, lemongrass, and kola aromatics for uplifting rituals.",
    price: { NGN: 11800, USD: 36 },
    sku: "KA-ST-008",
    stock: 130,
    isFeatured: true,
    image: "/images/products/sunrise-tonic.svg",
    tastingNotes: ["Turmeric warmth", "Lemongrass", "Bright citrus"],
    category: "Elixirs",
    size: "750 ml",
  },
];
