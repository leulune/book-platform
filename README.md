# Booking Platform Demo

Мини-платформа для создания и бронирования залов / студий.

## 🚀 Стек

- Next.js (App Router)
- TypeScript
- Supabase (Auth, DB, RLS)
- TailwindCSS
- PDF-lib

### Роли:

- **Admin**:
  - регистрация / вход
  - создание залов
  - просмотр только своих залов
  - email-уведомление при создании зала
  - скачивание PDF с данными зала

- **User**:
  - регистрация / вход
  - просмотр всех залов
  - карточка объекта
  - PDF-файл по залу

## 📁 Структура

```
src/
├── app/
│   ├── auth/         — регистрация, логин
│   ├── admin/halls/  — панель админа
│   ├── halls/        — каталог объектов
│   ├── api/          — email, PDF
│   └── page.tsx      — главная
├── lib/
│   └── supabase.ts   — client/server
public/
└── fonts/            — кастомные шрифты
```

## ⚙️ .env

Создайте `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

## 🧩 Установка

```bash
npm install
npm run dev
```

## 📸 Демо

Запустить `localhost:3000`

## 🛑 Примечания

- Stripe Checkout не реализован
- Email-уведомления — симулируются через API route