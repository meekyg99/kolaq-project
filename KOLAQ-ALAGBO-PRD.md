# 🧾 KOLAQ ALAGBO INTERNATIONAL — PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 🥂 Brand Overview
**Company:** KOLAQ ALAGBO INTERNATIONAL  
**Industry:** Premium Herbal Drink (Health & Lifestyle)  
**Target Audience:** Nigerian and international premium drink consumers, distributors, and resellers.  
**Slogan:** *“Rooted in Nature, Refined for the World.”*

---

## PART 1 — PRODUCT & UX SPECIFICATION

### 🎯 1. Product Vision
To create a clean, modern, and functional e-commerce website that showcases and sells KOLAQ ALAGBO herbal drinks locally and internationally, providing a seamless shopping experience, high uptime, and automated support.

### 💎 2. Goals
- Build a fast, responsive website that can handle 100+ concurrent users.
- Enable international sales in ₦ (Naira) and $ (USD).
- Support retail and reseller orders.
- Include automated customer support (WhatsApp bot).
- Feature dynamic sales/promotions and analytics tracking.
- Maintain a premium black-and-white minimalist aesthetic.

---

### 🖥️ 3. Core Pages & Flows
| Page | Description | Key Features |
|------|--------------|---------------|
| Homepage | Landing page introducing KOLAQ ALAGBO. | Hero animation (bottle + floating leaves), “Shop Now” CTA, product highlights. |
| Shop Page | Product catalog with filters. | Grid layout, product cards with price toggle (₦/$), “Add to Cart.” |
| Product Detail Page | Single product view. | Product info, dynamic pricing, SKU tracking, “Buy Now” button. |
| Cart Page | Displays selected products. | Quantity update, discount/promo input, checkout link. |
| Checkout Page | Payment and order processing. | Paystack integration (card & transfer), delivery info, summary. |
| Auth Pages | Login / Signup / Reset Password. | JWT authentication, simple user onboarding. |
| User Dashboard | Order tracking and account management. | Past orders, saved addresses, reseller dashboard (phase 2). |
| Contact Page | Customer support contact. | WhatsApp bot integration, contact form. |
| Promo/Sales Page | Dedicated promotional section. | Dynamic price updates, countdown timer, call-to-action banners. |

---

### 🎨 4. Design & Branding
| Element | Description |
|----------|--------------|
| Theme Colors | Black (#000000), White (#FFFFFF), Subtle Grey (#EDEDED), Accent Green (#4ADE80). |
| Typography | Headings → Poppins; Body → Inter. |
| Layout Style | Clean, minimal, spacious. Inspired by [ekulowineworld.com](https://ekulowineworld.com). |
| Hero Animation | Floating product bottle with subtle particle and leaf motion. |
| UI Components | Rounded buttons, smooth hover transitions, high-contrast layout. |
| Responsiveness | Fully responsive for mobile, tablet, and desktop. |

---

### 💬 5. User Interactions
- Newsletter Sign-up
- CartFlow checkout process
- Sales notification banner
- WhatsApp Integration for offline support

---

### 🧠 6. Target Metrics
- Handle 1,000 daily users and 100 concurrent users.
- Page load time < 2 seconds.
- Checkout conversion > 5%.
- Error rate < 0.1%.

---

## PART 2 — TECHNICAL SPECIFICATION

### ⚙️ 1. Tech Stack
| Layer | Technology |
|-------|-------------|
| Frontend | Next.js 14 (App Router), TypeScript, TailwindCSS, Framer Motion |
| Backend | Node.js (Express), PostgreSQL |
| Auth | JWT |
| Payment | Paystack (Stripe later) |
| Deployment | Vercel (frontend), Render/AWS (backend) |
| Cache/CDN | Cloudflare |
| Analytics | Google Analytics 4 |
| Bot | WhatsApp API |

---

### 🧱 2. Core Architecture
- Monorepo: /frontend + /backend
- Backend provides REST API for auth, products, orders, promos
- Frontend uses server components and ISR caching
- JWT-protected API routes
- CDN-optimized images in /public/images

---

### 🧩 3. Database Schema (Simplified)
#### Users Table
| Field | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| name | String | User full name |
| email | String | Unique |
| password | String | Hashed password |
| role | Enum(user, admin, reseller) | Access level |
| created_at | Timestamp | Creation time |

#### Products Table
| Field | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| name | String | Product name |
| description | Text | Product info |
| price_ngn | Decimal | Price in Naira |
| price_usd | Decimal | Price in USD |
| sku | String | Unique SKU |
| stock | Integer | Quantity |
| image | String | Image URL |
| is_featured | Boolean | Featured flag |

---

### 🌐 4. API Endpoints
| Endpoint | Method | Description |
|-----------|---------|-------------|
| /api/auth/signup | POST | Register user |
| /api/auth/login | POST | Login |
| /api/products | GET | List products |
| /api/products/:id | GET | Product details |
| /api/orders | POST | Create order |
| /api/orders/:id | GET | Order detail |
| /api/promo/active | GET | Active promo |

---

### 🎥 5. Animation
- Framer Motion for bottle, text, and leaves
- Infinite float cycles (6–10s)
- Subtle background particles via CSS gradients

---

### 🔌 6. Integrations
| Service | Function |
|----------|-----------|
| Paystack | ₦ payments |
| Stripe | $ payments (future) |
| Google Analytics | Traffic tracking |
| WhatsApp Bot | Customer assistance |
| Mailchimp | Newsletter |

---

### 🧰 7. Scalability & Reliability
- ISR caching
- CDN via Cloudflare
- DB pooling (Prisma/Sequelize)
- Load balancing (Render/AWS)
- Lazy-loaded assets

---

### 🔐 8. Security
- JWT 24h expiry
- HTTPS enforcement
- Password hashing (bcrypt)
- Rate limiting & Helmet middleware

---

### 🧩 9. Performance
- TTFB < 300ms
- Lighthouse > 90%
- 100 concurrent users
- 99.9% uptime
- Gzip/Brotli compression

---

### 📦 10. Deliverables
1. Next.js frontend  
2. Node.js backend  
3. Deployment configs  
4. Documentation & README  
5. Tailwind theme system  
6. PRD handoff file

---

### 🏁 Conclusion
This PRD defines the structure and stack for **KOLAQ ALAGBO INTERNATIONAL** — AI-ready for Gemini, Cursor, or Replit to build, with clean specs, strong architecture, and scalable design.
