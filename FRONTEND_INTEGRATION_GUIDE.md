# Frontend-Backend Integration Guide

## ✅ What's Installed
- `axios` - HTTP client
- `swr` - Data fetching & caching
- `zustand` - State management

---

## 📁 File Structure to Create

```
frontend/src/
├── lib/
│   ├── api/              ✅ Created
│   │   ├── client.ts     ✅ Created  
│   │   ├── auth.ts       📝 Need to create
│   │   ├── products.ts   📝 Need to create
│   │   ├── cart.ts       📝 Need to create
│   │   ├── orders.ts     📝 Need to create
│   │   └── index.ts      📝 Need to create
│   ├── store/
│   │   ├── authStore.ts  📝 Need to create
│   │   ├── cartStore.ts  📝 Need to create
│   │   └── index.ts      📝 Need to create
│   └── hooks/
│       ├── useProducts.ts  📝 Need to create
│       ├── useCart.ts      📝 Need to create
│       └── useAuth.ts      📝 Need to create
└── .env.local            📝 Need to create
```

---

## 🔧 Step 1: Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 🎯 Step 2: Key Integration Points

### Replace Mock Data Flow

**Current Flow** (Mock Data):
```
Page → Import products from data/products.ts → Display
```

**New Flow** (Real API):
```
Page → useProducts hook → SWR → API → Display
```

### Example Conversion:

**Before (Mock)**:
```typescript
// pages/shop/page.tsx
import { products } from '@/data/products';

export default function Shop() {
  return (
    <div>
      {products.map(product => ...)}
    </div>
  );
}
```

**After (Real API)**:
```typescript
// pages/shop/page.tsx
'use client';
import { useProducts } from '@/lib/hooks/useProducts';

export default function Shop() {
  const { products, isLoading, error } = useProducts();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;
  
  return (
    <div>
      {products?.map(product => ...)}
    </div>
  );
}
```

---

## 📦 Step 3: Create Required Files

I'll create all the necessary files for you. The key files are:

### 1. API Layer (`lib/api/`)
- ✅ `client.ts` - Base axios client with auth interceptors
- `auth.ts` - Login, refresh, profile endpoints
- `products.ts` - Product CRUD operations
- `cart.ts` - Cart management
- `orders.ts` - Order creation and tracking

### 2. State Management (`lib/store/`)
- `authStore.ts` - Auth state (user, token, login/logout)
- `cartStore.ts` - Cart state (items, add/remove/update)

### 3. React Hooks (`lib/hooks/`)
- `useProducts.ts` - Fetch products with SWR
- `useCart.ts` - Cart operations
- `useAuth.ts` - Auth helpers

---

## 🔄 Step 4: Migration Strategy

### Phase 1: Products (Easiest)
1. Keep mock data temporarily
2. Create API layer
3. Update shop page to use API
4. Test thoroughly
5. Remove mock data

### Phase 2: Cart (Medium)
1. Create cart store with Zustand
2. Generate session ID on first visit
3. Update cart page to use API
4. Test add/remove/update

### Phase 3: Checkout (Complex)
1. Create order form
2. Connect to orders API
3. Handle order confirmation
4. Email notifications (automatic from backend)

### Phase 4: Admin (Admin only)
1. Create admin login
2. Build dashboard with analytics
3. Product management UI
4. Order management UI

---

## 🎨 UI Components to Update

### 1. Product Card Component
```typescript
// Before
<ProductCard product={mockProduct} />

// After  
<ProductCard product={realProduct} />
// No changes needed if types match!
```

### 2. Add to Cart Button
```typescript
// Before
onClick={() => addToLocalCart(product)}

// After
onClick={() => addToCart(product.id, quantity)}
```

### 3. Checkout Form
```typescript
// Before
onSubmit={() => console.log('Order')}

// After
onSubmit={async (data) => {
  const order = await ordersApi.create(data);
  router.push(`/order/${order.orderNumber}`);
}}
```

---

## 🔐 Auth Flow

### Login Page
```typescript
const handleLogin = async (email: string, passcode: string) => {
  try {
    const { accessToken, refreshToken, user } = await authApi.login({
      email,
      passcode,
    });
    
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    
    router.push('/admin/dashboard');
  } catch (error) {
    setError('Invalid credentials');
  }
};
```

---

## 🛒 Cart Flow

### Session Management
```typescript
// Generate once per browser session
const getSessionId = () => {
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};
```

### Add to Cart
```typescript
const addToCart = async (productId: string, quantity: number) => {
  const sessionId = getSessionId();
  const updatedCart = await cartApi.addItem(sessionId, productId, quantity);
  setCart(updatedCart);
};
```

---

## 📊 Data Type Mappings

### Backend → Frontend

**Backend Product**:
```typescript
{
  id: string;
  slug: string;
  name: string;
  description: string;
  prices: [
    { currency: 'NGN', amount: 12000 },
    { currency: 'USD', amount: 38 }
  ];
  ...
}
```

**Frontend Needs**:
```typescript
{
  price: { NGN: 12000, USD: 38 }
}
```

**Transform Function**:
```typescript
const transformProduct = (apiProduct) => ({
  ...apiProduct,
  price: apiProduct.prices.reduce((acc, p) => {
    acc[p.currency] = p.amount;
    return acc;
  }, {}),
});
```

---

## ⚡ Performance Tips

### 1. Use SWR for Caching
```typescript
const { data } = useSWR('/api/v1/products', fetcher, {
  revalidateOnFocus: false,
  dedupingInterval: 60000, // 1 minute
});
```

### 2. Optimistic Updates
```typescript
mutate(
  '/api/v1/cart',
  (current) => ({ ...current, items: [...current.items, newItem] }),
  false // Don't revalidate immediately
);
```

### 3. Pagination
```typescript
const { products } = useProducts({ limit: 20, offset: page * 20 });
```

---

## 🧪 Testing Strategy

### 1. Test Backend First
```bash
# Backend running on localhost:4000
curl http://localhost:4000/api/v1/products
```

### 2. Test API Layer
```typescript
// In browser console
import { productsApi } from '@/lib/api';
const products = await productsApi.getAll();
console.log(products);
```

### 3. Test Components
```typescript
// Start with simple read-only pages
// Then add write operations
// Finally test full flows
```

---

## 🚀 Quick Start (30 Minutes)

### Minimal Integration
1. **Create `.env.local`** with API URL
2. **Use `client.ts`** (already created)
3. **Create products hook**:
```typescript
// lib/hooks/useProducts.ts
import useSWR from 'swr';
import { apiClient } from '../api/client';

export const useProducts = () => {
  const { data, error } = useSWR('/api/v1/products', 
    (url) => apiClient.get(url).then(res => res.data.products)
  );
  
  return {
    products: data,
    isLoading: !error && !data,
    error,
  };
};
```

4. **Update shop page**:
```typescript
'use client';
import { useProducts } from '@/lib/hooks/useProducts';

export default function Shop() {
  const { products, isLoading } = useProducts();
  
  if (isLoading) return <div>Loading...</div>;
  
  return <div>{/* existing JSX with products */}</div>;
}
```

5. **Done!** Products now load from real API

---

## 📝 Next Steps

1. **I can generate all the remaining files** for you
2. **Or guide you through step-by-step** integration
3. **Or create a working example** page first

Would you like me to:
- A) Create all the API/store/hooks files now?
- B) Start with just products integration?
- C) Create a complete example with one feature (like shop page)?

Let me know and I'll proceed!
