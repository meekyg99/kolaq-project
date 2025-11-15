"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const products = [
    {
        slug: 'essence-bitter',
        name: 'Essence Bitter Tonic',
        description: 'A revitalizing blend of kola nut, bitter leaf, and botanical bitters that awaken the senses.',
        image: '/images/products/essence-bitter.jpg',
        category: 'Bitters',
        size: '750 ml',
        isFeatured: true,
        prices: [
            { currency: 'NGN', amount: 12000 },
            { currency: 'USD', amount: 38 },
        ],
    },
    {
        slug: 'velvet-root',
        name: 'Velvet Root Elixir',
        description: 'Smooth, restorative blend with ginseng, ginger, and wild honey for calm evenings.',
        image: '/images/products/velvet-root.jpg',
        category: 'Elixirs',
        size: '700 ml',
        isFeatured: true,
        prices: [
            { currency: 'NGN', amount: 14500 },
            { currency: 'USD', amount: 46 },
        ],
    },
    {
        slug: 'noir-botanica',
        name: 'Noir Botanica Reserve',
        description: 'Deep, aromatic blend for connoisseurs with matured herbs aged in charred oak.',
        image: '/images/products/noir-botanica.jpg',
        category: 'Limited',
        size: '500 ml',
        isFeatured: false,
        prices: [
            { currency: 'NGN', amount: 19500 },
            { currency: 'USD', amount: 62 },
        ],
    },
    {
        slug: 'citrus-leaf',
        name: 'Citrus Leaf Aperitif',
        description: 'Bright, refreshing aperitif infused with orange zest, lemongrass, and kola bitters.',
        image: '/images/products/citrus-leaf.svg',
        category: 'Aperitifs',
        size: '750 ml',
        isFeatured: false,
        prices: [
            { currency: 'NGN', amount: 9800 },
            { currency: 'USD', amount: 32 },
        ],
    },
    {
        slug: 'emerald-reserve',
        name: 'Emerald Reserve',
        description: 'Limited oak-matured bitters layered with kola bark, wild mint, and charred citrus peels.',
        image: '/images/products/emerald-reserve.svg',
        category: 'Limited',
        size: '700 ml',
        isFeatured: true,
        prices: [
            { currency: 'NGN', amount: 21000 },
            { currency: 'USD', amount: 68 },
        ],
    },
    {
        slug: 'ruby-aperitif',
        name: 'Ruby Aperitif',
        description: 'A velvet-forward aperitif featuring roselle petals, hibiscus, and honeyed ginger.',
        image: '/images/products/ruby-aperitif.svg',
        category: 'Aperitifs',
        size: '750 ml',
        isFeatured: false,
        prices: [
            { currency: 'NGN', amount: 13500 },
            { currency: 'USD', amount: 44 },
        ],
    },
    {
        slug: 'obsidian-bitter',
        name: 'Obsidian Bitter',
        description: 'Bold and aromatic tonic with kola nut, espresso roast cacao, and forest spices.',
        image: '/images/products/obsidian-bitter.svg',
        category: 'Bitters',
        size: '700 ml',
        isFeatured: false,
        prices: [
            { currency: 'NGN', amount: 15800 },
            { currency: 'USD', amount: 50 },
        ],
    },
    {
        slug: 'sunrise-tonic',
        name: 'Sunrise Vitality Tonic',
        description: 'Daytime energiser with turmeric, lemongrass, and kola aromatics for uplifting rituals.',
        image: '/images/products/sunrise-tonic.svg',
        category: 'Elixirs',
        size: '750 ml',
        isFeatured: true,
        prices: [
            { currency: 'NGN', amount: 11800 },
            { currency: 'USD', amount: 36 },
        ],
    },
];
async function main() {
    console.log('🌱 Seeding products...');
    for (const productData of products) {
        const { prices, ...productInfo } = productData;
        const product = await prisma.product.upsert({
            where: { slug: productInfo.slug },
            update: {},
            create: {
                ...productInfo,
                prices: {
                    create: prices.map((price) => ({
                        currency: price.currency,
                        amount: price.amount,
                    })),
                },
            },
        });
        console.log(`✅ Created/Updated product: ${product.name}`);
    }
    console.log('🎉 Seeding completed!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-products.js.map