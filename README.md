## Ophelia AI – AI-Powered Artisan Marketplace 🧶✨

Ophelia AI is a modern, AI-first marketplace that connects **global artisans** with **buyers** through immersive storytelling, authenticity verification, and smart automation.  
Artisans can upload their handcrafted products, generate rich descriptions and stories with AI, certify authenticity on-chain-style, and track analytics – while buyers discover verified, emotionally rich crafts from around the world.

---

## Features

- **Landing Experience**
  - Beautiful hero page with sections for navigation, features, AI agents, and call-to-action.
  - Multi-language support with `i18next` for localized experiences (e.g. English + Indian languages).

- **Buyer Journey**
  - **Marketplace**: Browse products with emotional filters (Joyful, Peaceful, Elegant, Festive, etc.), full-text search, and quick stats.
  - **Product Detail**: Rich product page with:
    - Image gallery & thumbnails
    - AI-generated **story**, materials, dimensions, availability
    - Verified artisan & provenance section (certificate info)
    - “View in Your Space” AR preview entry point (UI-ready)

- **Artisan Journey**
  - **Authentication**: Email/password auth via Supabase (`/auth`) with buyer/artisan roles.
  - **Artisan Setup & Dashboard**:
    - Create artisan profile, manage products, see revenue, views, favorites, and growth.
    - Tabs for Products, Analytics, and AI Mentor.
  - **Upload Product with AI Assist**:
    - Drag & drop image uploads.
    - Voice input for descriptions (Web Speech API).
    - AI-enhanced description (`enhance-product-description`).
    - AI-generated product story (`generate-product-story`).
    - AI marketing content for Instagram, Facebook, and email campaigns (`generate-marketing-content`).
    - Originality checks and **certificate generation** via Supabase RPCs.

- **Analytics & Insights**
  - Admin/analytics page with:
    - Revenue, orders, products, and active artisan stats.
    - Recharts-based graphs for monthly sales, order volume, category distribution, and trending products.

- **AI Assistants**
  - **Floating Chatbot** for buyers: powered by Supabase Edge Function `ai-chatbot` (Gemini), answering questions about the marketplace.
  - **AI Mentor** for artisans: Supabase Edge Function `ai-mentor` (Gemini via Lovable gateway) that gives business, pricing, and marketing advice.

- **Authenticity & Trust**
  - Artisan profiles and products are tied to Supabase tables (`artisan_profiles`, `products`, `product_certificates`).
  - Certificate hashes generated with stored procedures (`generate_certificate_hash`) and stored in `product_certificates`.

---

## Tech Stack

- **Frontend**
  - React 18 + TypeScript
  - Vite 5 (React SWC)
  - React Router v6
  - Tailwind CSS + `tailwindcss-animate`
  - shadcn/ui component system (Radix UI primitives)
  - Recharts for analytics visualizations
  - React Hook Form + Zod (form validation, where used)
  - React Query (TanStack Query) for async data fetching and caching
  - `sonner` + shadcn toast system for notifications

- **Backend / Platform**
  - **Supabase**
    - Postgres database (products, artisan_profiles, orders, product_certificates, profiles, etc.)
    - Auth (email/password) with RLS (Row Level Security)
    - Edge Functions (Deno) for AI and business logic:
      - `ai-chatbot` – buyer support chatbot using Google Gemini.
      - `enhance-product-description` – long-form, improved copy for product descriptions.
      - `generate-marketing-content` – multi-channel marketing copy in JSON form.
      - `generate-product-story` – emotional, cultural product storytelling.
      - `ai-mentor` – business mentor for artisans (via Lovable AI gateway).
    - RPC functions:
      - `check_product_originality`
      - `generate_certificate_hash`

- **Other**
  - i18next + react-i18next + language detector
  - Lucide React icons
  - Embla carousel, Radix UI primitives for rich UI components

---

## High-Level Architecture & UML Diagram

Below is a simplified UML-style component diagram of the system:

```mermaid
graph TD

%% Frontend
subgraph Frontend [React + Vite Frontend]
  App[App.tsx\nRouter + Providers]
  IndexPage[Index Page\nHero/Features/AI Agents]
  AuthPage[Auth Page\nSign In / Sign Up]
  MarketplacePage[Marketplace Page\nSearch + Emotion Filters]
  ProductDetailPage[Product Detail\nStory + AR + Provenance]
  ArtisanDashboardPage[Artisan Dashboard\nStats + Products + AI Mentor]
  UploadProductPage[Upload Product\nAI Story + AI Marketing]
  AnalyticsPage[Analytics Dashboard]
  ChatbotWidget[Floating Chatbot]
end

App --> IndexPage
App --> AuthPage
App --> MarketplacePage
App --> ProductDetailPage
App --> ArtisanDashboardPage
App --> UploadProductPage
App --> AnalyticsPage
App --> ChatbotWidget

%% Shared Services
subgraph Shared [Shared Client Services]
  SupabaseClient[Supabase Client\n(VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY)]
  AuthHook[useAuth Hook\nSupabase Auth Session]
  I18n[i18next + react-i18next]
end

App --> SupabaseClient
App --> AuthHook
App --> I18n

MarketplacePage --> SupabaseClient
ProductDetailPage --> SupabaseClient
ArtisanDashboardPage --> SupabaseClient
UploadProductPage --> SupabaseClient
AnalyticsPage --> SupabaseClient
ChatbotWidget --> SupabaseClient

%% Supabase Side
subgraph Supabase [Supabase Backend]
  subgraph DB[Postgres Database]
    Products[(products)]
    ArtisanProfiles[(artisan_profiles)]
    Orders[(orders)]
    ProductCertificates[(product_certificates)]
    Profiles[(profiles)]
  end

  subgraph Edge[Edge Functions (Deno)]
    FChat[ai-chatbot]
    FEnhance[enhance-product-description]
    FMarketing[generate-marketing-content]
    FStory[generate-product-story]
    FMentor[ai-mentor]
  end
end

SupabaseClient --> Products
SupabaseClient --> ArtisanProfiles
SupabaseClient --> Orders
SupabaseClient --> ProductCertificates
SupabaseClient --> Profiles

UploadProductPage --> FEnhance
UploadProductPage --> FStory
UploadProductPage --> FMarketing
ArtisanDashboardPage --> FMentor
ChatbotWidget --> FChat

%% External AI APIs
subgraph AI[External AI Providers]
  Gemini[Google Gemini API]
  LovableGateway[Lovable AI Gateway\n(uses Gemini 2.5 Flash)]
end

FChat --> Gemini
FEnhance --> Gemini
FMarketing --> Gemini
FStory --> Gemini
FMentor --> LovableGateway
LovableGateway --> Gemini
```

---

## Project Structure (Simplified)

- `index.html` – Vite entry, mounts React app at `#root`.
- `src/main.tsx` – React root + providers (React Query, i18n, Router, Auth, Chatbot, Toasts).
- `src/App.tsx` – Sets up routes:
  - `/` – Landing (Index)
  - `/auth` – Auth page
  - `/marketplace` – Product browsing
  - `/product/:id` – Product detail page
  - `/artisan-dashboard` – Artisan dashboard
  - `/artisan-setup` – Setup flow for artisans
  - `/upload-product` – Product upload with AI
  - `/analytics` – Platform analytics
- `src/pages/*` – Page-level components described above.
- `src/components/*` – UI components: navigation, hero, features, AI agents, CTAs, chatbot, verification badge, etc.
- `src/components/ui/*` – shadcn/ui component library built on Radix.
- `src/integrations/supabase/*` – Supabase client + typed database schema.
- `supabase/functions/*` – Edge Functions for AI chatbot, mentor, description/story/marketing generators.

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended – already installed on your machine).
- A Supabase project with:
  - Database schemas (you can reuse the provided migrations under `supabase/migrations`).
  - Edge Functions deployed for:
    - `ai-chatbot`
    - `ai-mentor`
    - `enhance-product-description`
    - `generate-marketing-content`
    - `generate-product-story`
  - Environment vars set (in Supabase) for:
    - `GEMINI_API_KEY`
    - `LOVABLE_API_KEY` (for `ai-mentor`).

### 1. Clone & Install

From PowerShell (Windows):

```powershell
cd "C:\Users\RoshanGowda\OneDrive\Desktop\ophelia-unbound-ai-main"
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` (or `.env`) at the project root:

```bash
VITE_SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_ANON_PUBLISHABLE_KEY"
```

Make sure the same Supabase project is where you deploy the Edge Functions and migrations.

### 3. Run the Dev Server

```powershell
npm run dev
```

Then open `http://localhost:8080` in your browser (port is configured in `vite.config.ts`).

### 4. Build & Preview (Optional)

```bash
npm run build
npm run preview
```

---

## How the App Works (User Flows)

- **Buyer**
  1. Lands on `/` and explores the hero & features.
  2. Goes to `/marketplace` to search and filter products.
  3. Clicks a product → `/product/:id` to view details, story, materials, provenance.
  4. Uses the floating chatbot for questions.

- **Artisan**
  1. Signs up on `/auth` as an **artisan**.
  2. Completes artisan profile (`/artisan-setup`).
  3. Uploads new products via `/upload-product`:
     - Uses voice input, AI-enhanced descriptions, AI story, and AI marketing content.
     - System checks originality and generates authenticity certificates.
  4. Monitors performance on `/artisan-dashboard` and `/analytics`.
  5. Asks business questions to the **AI Mentor** in the dashboard.

---

## Contributing

Contributions are welcome!  
You can:

- Improve UI/UX for artisans and buyers.
- Extend analytics and reporting.
- Add new AI prompts or additional Edge Functions (e.g., dynamic pricing advisor).

Create a feature branch, open a PR, and describe the change with screenshots if it impacts UI.

---

## License

This project is currently private for the Ophelia AI team and collaborators.  
Update this section with your preferred license (e.g., MIT, Apache-2.0) when you are ready to publish. 

