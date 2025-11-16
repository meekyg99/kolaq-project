# Product Variants Feature

## Overview
Added comprehensive product variant management system for handling different bottle sizes, prices, and inventory per variant.

## Database Schema

### ProductVariant Model
```prisma
model ProductVariant {
  id          String   @id @default(cuid())
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId   String
  name        String
  sku         String?  @unique
  bottleSize  String
  priceNGN    Decimal  @db.Decimal(12, 2)
  priceUSD    Decimal  @db.Decimal(12, 2)
  image       String?
  stock       Int      @default(0)
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## API Endpoints

### Create Product Variant
**POST** `/api/v1/products/:productId/variants`
- **Auth Required**: Yes (Admin only)
- **Body**:
```json
{
  "name": "750ml Bottle",
  "sku": "KOL-ORIG-750",
  "bottleSize": "750ml",
  "priceNGN": 8500.00,
  "priceUSD": 12.00,
  "image": "https://example.com/image.jpg",
  "stock": 100,
  "isActive": true,
  "sortOrder": 1
}
```

### Get Product Variants
**GET** `/api/v1/products/:productId/variants?activeOnly=true`
- **Auth Required**: No
- **Query Params**:
  - `activeOnly` (optional): Filter by active variants only

### Get Single Variant
**GET** `/api/v1/products/variants/:variantId`
- **Auth Required**: No

### Update Variant
**PATCH** `/api/v1/products/variants/:variantId`
- **Auth Required**: Yes (Admin only)
- **Body**: (partial update supported)
```json
{
  "name": "750ml Premium Bottle",
  "priceNGN": 9000.00,
  "stock": 150
}
```

### Update Variant Stock
**PATCH** `/api/v1/products/variants/:variantId/stock`
- **Auth Required**: Yes (Admin only)
- **Body**:
```json
{
  "stock": 200
}
```

### Delete Variant
**DELETE** `/api/v1/products/variants/:variantId`
- **Auth Required**: Yes (Admin only)

## Admin Dashboard Integration

The dashboard now includes:
- **Total Variants Count**: Total number of product variants
- **Active Variants Count**: Count of active variants
- **Low Stock Variants**: Variants with stock ≤ 10 units

### Dashboard Stats Response
```json
{
  "overview": {
    "totalProducts": 25,
    "totalVariants": 75,
    "activeVariants": 68,
    "totalOrders": 150,
    "totalCustomers": 45,
    "revenue": {
      "NGN": 1250000,
      "USD": 1800
    }
  },
  "lowStockVariants": [
    {
      "id": "variant_123",
      "name": "750ml Bottle",
      "sku": "KOL-ORIG-750",
      "bottleSize": "750ml",
      "stock": 5,
      "product": {
        "id": "prod_123",
        "name": "Kolaq Original Bitters",
        "slug": "kolaq-original"
      }
    }
  ]
}
```

## Usage Examples

### Creating Variants for a Product
1. Create the base product
2. Add variants with different bottle sizes:
   - 200ml bottle (₦3,500 / $5)
   - 375ml bottle (₦6,000 / $8)
   - 750ml bottle (₦8,500 / $12)
   - 1000ml bottle (₦11,000 / $15)

### Variant Pricing Strategy
- Each variant has independent pricing for NGN and USD
- Allows for flexible pricing per market and bottle size
- Stock is tracked individually per variant

### Frontend Integration
When displaying products:
1. Fetch product with `/api/v1/products/:id` (includes active variants)
2. Show variant selector with bottle sizes
3. Display appropriate price based on selected variant
4. Show variant-specific images if available
5. Check variant stock before allowing purchase

## Features

✅ Multiple bottle size variants per product
✅ Independent pricing (NGN & USD) per variant
✅ Variant-specific images
✅ Individual stock tracking per variant
✅ Unique SKU per variant
✅ Active/inactive status per variant
✅ Sort order control for display
✅ Dashboard integration with low stock alerts
✅ Cascade delete (when product is deleted, variants are removed)

## Notes
- SKU is optional but must be unique if provided
- Variants are ordered by `sortOrder` (asc) then `createdAt` (asc)
- Only active variants are shown to customers by default
- Low stock threshold is 10 units
- Product queries automatically include active variants
