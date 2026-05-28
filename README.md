# GeoAuto Market

Geolokatsiyaga asoslangan avtomobil savdo platformasi. Loyiha O‘zbekiston bozori uchun ishlatilgan avtomobillarni sotish, qidirish, saqlash, xaritada ko‘rish va seller bilan real-time yozishish funksiyalarini beradi.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn/ui uslubidagi Radix komponentlar, TanStack Query, React Hook Form, Zod, Zustand, Framer Motion, React Router DOM, Leaflet
- Backend: Node.js, Express.js, TypeScript, JWT, Multer, Supabase SDK, Prisma ORM, REST API, MVC pattern, Socket.IO
- Database: Supabase PostgreSQL
- Deployment: Frontend Vercel, Backend Render.com

## Folder Structure

```text
geo-auto-marketplace/
├── frontend/
│   ├── src/app
│   ├── src/components
│   ├── src/features
│   ├── src/lib
│   ├── src/pages
│   └── src/stores
├── backend/
│   ├── prisma/schema.prisma
│   └── src
│       ├── config
│       ├── controllers
│       ├── middlewares
│       ├── routes
│       ├── services
│       ├── sockets
│       ├── utils
│       └── validators
├── supabase/migrations
├── docker-compose.yml
└── package.json
```

## Installation

```bash
npm install
npm run prisma:generate -w backend
```

Backend va frontend uchun env fayllarni yarating:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

## Environment Setup

Backend `.env`:

- `PORT`: API porti, default `8080`
- `CLIENT_URL`: frontend URL, masalan `http://localhost:5173`
- `DATABASE_URL`: Supabase PostgreSQL connection string
- `JWT_SECRET`: kamida 32 belgili maxfiy kalit
- `JWT_EXPIRES_IN`: masalan `7d`
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: storage upload va server-side operatsiyalar uchun service role key
- `SUPABASE_STORAGE_BUCKET`: `car-images`

Frontend `.env`:

- `VITE_API_URL`: `http://localhost:8080/api`
- `VITE_SOCKET_URL`: `http://localhost:8080`

## Supabase Setup

1. Supabase’da yangi project yarating.
2. SQL editor orqali `supabase/migrations/001_initial_schema.sql` faylini ishga tushiring.
3. Storage bucket yarating: `car-images`.
4. Bucket public bo‘lishi kerak, chunki listing rasmlari marketplace’da ochiq ko‘rinadi.
5. Project settings’dan PostgreSQL connection stringni `DATABASE_URL` ga yozing.
6. Service role keyni faqat backend `.env` ichida saqlang.

Prisma client:

```bash
npm run prisma:generate -w backend
```

## API Docs

Base URL: `/api`

Auth:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Listings:

- `GET /listings`
- `GET /listings/:id`
- `POST /listings` multipart form-data, `images` field bilan
- `PUT /listings/:id`
- `DELETE /listings/:id`
- `POST /listings/:id/favorite`
- `DELETE /listings/:id/favorite`
- `GET /favorites`
- `GET /listings/:id/similar`
- `POST /listings/:id/report`

Messages:

- `GET /messages`
- `POST /messages`
- `GET /messages/:id`
- `POST /messages/:id`

Admin:

- `GET /admin/dashboard`
- `GET /admin/users`
- `PATCH /admin/listings/:id/status`

Socket.IO:

- auth handshake: `{ token }`
- `conversation:join`
- `message:send`
- `message:new`

## Vercel Deploy

1. Vercel’da root sifatida `frontend` ni tanlang.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variables:
   - `VITE_API_URL=https://your-render-api.onrender.com/api`
   - `VITE_SOCKET_URL=https://your-render-api.onrender.com`

## Render Deploy

1. Render Web Service yarating.
2. Root directory: `backend`
3. Build command: `npm install && npm run prisma:generate && npm run build`
4. Start command: `npm run start`
5. Environment variables backend `.env.example` bo‘yicha qo‘shiladi.

## Scripts

- `npm run dev`: frontend va backend parallel ishlaydi
- `npm run build`: ikkala app build qilinadi
- `npm run typecheck`: TypeScript tekshiradi
- `npm run prisma:generate -w backend`: Prisma client yaratadi

## Security Notes

- Parollar `bcrypt` bilan hash qilinadi.
- JWT faqat backend `JWT_SECRET` orqali imzolanadi.
- Protected route va admin route alohida middleware bilan himoyalangan.
- Multer file type va size limit bilan sozlangan.
- Express `helmet`, `cors`, `rate-limit` va `compression` ishlatadi.
- Supabase service role key frontendga berilmaydi.

## Optimization Notes

- Frontend listinglar `loading="lazy"` bilan rasm yuklaydi.
- TanStack Query cache va stale time sozlangan.
- Skeleton loading state mavjud.
- Listing API pagination parametrlarini qabul qiladi.
- Leaflet xarita listing joylashuvlarini ko‘rsatadi.
- SEO `react-helmet-async` orqali har sahifada sozlanadi.
