"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    const adminEmail = 'admin@kolaqbitters.com';
    const adminPasscode = 'admin123';
    const existingAdmin = await prisma.adminUser.findUnique({
        where: { email: adminEmail },
    });
    if (!existingAdmin) {
        const passcodeHash = await bcrypt.hash(adminPasscode, 10);
        const admin = await prisma.adminUser.create({
            data: {
                email: adminEmail,
                name: 'Admin User',
                role: 'admin',
                passcodeHash,
            },
        });
        console.log('✅ Created admin user:', admin.email);
        console.log('📧 Email:', adminEmail);
        console.log('🔑 Passcode:', adminPasscode);
        console.log('⚠️  Please change the passcode after first login!');
    }
    else {
        console.log('✅ Admin user already exists');
    }
    const productCount = await prisma.product.count();
    if (productCount === 0) {
        console.log('🌱 Seeding products...');
        const products = [
            {
                slug: 'kolaq-alagbo-bitters-original',
                name: 'KOLAQ ALAGBO BITTERS - Original',
                description: 'Our signature herbal bitters blend with traditional Nigerian herbs and spices. Perfect for digestive health and overall wellness.',
                category: 'Bitters',
                size: '750ml',
                isFeatured: true,
                image: '/images/products/original-bitters.jpg',
                prices: [
                    { currency: 'NGN', amount: 15000 },
                    { currency: 'USD', amount: 35 },
                ],
            },
            {
                slug: 'kolaq-alagbo-bitters-premium',
                name: 'KOLAQ ALAGBO BITTERS - Premium',
                description: 'Enhanced formula with additional premium herbs for maximum potency and flavor.',
                category: 'Bitters',
                size: '750ml',
                isFeatured: true,
                image: '/images/products/premium-bitters.jpg',
                prices: [
                    { currency: 'NGN', amount: 25000 },
                    { currency: 'USD', amount: 55 },
                ],
            },
            {
                slug: 'kolaq-herbal-elixir',
                name: 'KOLAQ Herbal Elixir',
                description: 'A smooth herbal elixir combining traditional herbs with modern taste profiles.',
                category: 'Elixirs',
                size: '500ml',
                isFeatured: false,
                image: '/images/products/herbal-elixir.jpg',
                prices: [
                    { currency: 'NGN', amount: 18000 },
                    { currency: 'USD', amount: 42 },
                ],
            },
        ];
        for (const product of products) {
            const { prices, ...productData } = product;
            await prisma.product.create({
                data: {
                    ...productData,
                    prices: {
                        create: prices,
                    },
                },
            });
        }
        console.log('✅ Created', products.length, 'products');
    }
    else {
        console.log('✅ Products already exist');
    }
}
main()
    .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map