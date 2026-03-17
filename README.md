# 🛒 Online Shop - Интернет-магазин девайсов

Полнофункциональное веб-приложение для онлайн-торговли электроникой с современной архитектурой, аналитикой продаж и удобным интерфейсом.

[![NestJS](https://img.shields.io/badge/NestJS-11.0-red)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7.0-red)](https://redis.io/)

---

## ✨ Основные возможности

### Для покупателей

- 🛍️ **Каталог товаров** - просмотр и поиск товаров с фильтрацией по категориям
- 🛒 **Корзина** - добавление товаров с синхронизацией между устройствами
- 📦 **Заказы** - оформление и отслеживание статуса заказов
- 👤 **Личный кабинет** - управление профилем и историей покупок
- 🔐 **Безопасная авторизация** - JWT токены, 2FA, OAuth (Google)

### Для администраторов

- 📊 **Аналитическая панель** - статистика продаж, графики, топ товаров
- 📦 **Управление товарами** - CRUD операции с товарами и категориями
- 🎯 **Управление заказами** - просмотр и изменение статусов
- 👥 **Управление пользователями** - роли и права доступа
- 📈 **Отчеты** - детальная аналитика по периодам

### Технические особенности

- ⚡ **Высокая производительность** - Redis кеширование, оптимизация запросов
- 🔒 **Безопасность** - защита от XSS, CSRF, SQL injection
- 📱 **Адаптивный дизайн** - работает на всех устройствах
- 🎨 **Современный UI** - shadcn/ui, TailwindCSS
- 🏗️ **Масштабируемая архитектура** - Feature-Sliced Design на фронтенде

---

## 🚀 Технологический стек

### Backend (NestJS API)

| Категория          | Технологии                         |
| ------------------ | ---------------------------------- |
| **Фреймворк**      | NestJS 11, Express                 |
| **База данных**    | PostgreSQL 16, Prisma ORM          |
| **Кеширование**    | Redis 7, ioredis                   |
| **Аутентификация** | JWT, Argon2, Passport              |
| **Email**          | Nodemailer, React Email            |
| **Валидация**      | class-validator, class-transformer |
| **Безопасность**   | Google reCAPTCHA, Cookie-parser    |

### Frontend (Next.js App)

| Категория            | Технологии                           |
| -------------------- | ------------------------------------ |
| **Фреймворк**        | Next.js 15, React 19                 |
| **Архитектура**      | Feature-Sliced Design (FSD)          |
| **Стейт менеджмент** | Zustand 5, TanStack Query 5          |
| **Формы**            | React Hook Form 7, Zod 3             |
| **Стилизация**       | TailwindCSS 3.4, shadcn/ui, Radix UI |
| **Визуализация**     | Recharts 3                           |
| **UI компоненты**    | Lucide React, Sonner                 |

---

## 🏗️ Архитектура проекта

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                 |
│  ┌──────────┬──────────┬──────────┬──────────────────┐  │
│  │   App    │ Processes│ Widgets  │    Features      │  │
│  │ (Router) │(Checkout)│ (Header) │(Auth, Cart, etc) │  │
│  └──────────┴──────────┴──────────┴──────────────────┘  │
│  ┌──────────────────────────────────────────────────┐   |
│  │         Entities (User, Product, Order)          │   |
│  └──────────────────────────────────────────────────┘   |
│  ┌──────────────────────────────────────────────────┐   |
│  │      Shared (UI Kit, API, Hooks, Utils)          │   |
│  └──────────────────────────────────────────────────┘   |
└─────────────────────────────────────────────────────────┘
```

```
▼ HTTP/REST API
┌─────────────────────────────────────────────────────────┐
│                     Backend (NestJS)                    |
│  ┌──────────────────────────────────────────────────┐   |
│  │    Controllers (Auth, Product, Order, User)      │   |
│  └──────────────────────────────────────────────────┘   |
│  ┌──────────────────────────────────────────────────┐   |
│  │         Services (Business Logic)                │   |
│  └──────────────────────────────────────────────────┘   |
│  ┌──────────────────────────────────────────────────┐   |
│  │           Prisma ORM (Database Layer)            │   |
│  └──────────────────────────────────────────────────┘   |
└─────────────────────────────────────────────────────────┘
▼                              ▼
┌──────────────────┐          ┌──────────────────┐
│   PostgreSQL     │          │      Redis       │
│  (Main Database) │          │    (Sessions,    │
│                  │          │     Caching)     │
└──────────────────┘          └──────────────────┘
```

---

## 💻 Системные требования

### Обязательные зависимости

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (рекомендуется) или npm >= 9.0.0
- **PostgreSQL** >= 14.0
- **Redis** >= 6.0

### Дополнительные инструменты

- **MailDev** (для разработки, перехват email)
- **Git** для версионирования

---

## ⚡ Быстрый старт

### 1. Клонирование репозитория

```
git clone <repository-url>
cd online-shop
```

### 2. Установка зависимостей

##### Backend

```
cd back-end
pnpm install
```

##### Frontend

```
cd ../front-end
pnpm install
```

### 3. Настройка окружения

#### 3.1 Запуск PostgreSQL

##### Создайте базу данных

```
createdb online_shop_db
```

#### 3.2 Запуск Redis

##### Linux/macOS

```
redis-server
```

#### Windows (через WSL)

```
sudo service redis-server start
```

#### 3.3 Настройка Backend

Создайте back-end/.env:

##### Application

```
NODE_ENV=development
APPLICATION_PORT=4200
APPLICATION_URL=http://localhost:4200
ALLOWED_ORIGIN=http://localhost:3000
```

##### Database

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=online_shop_db
POSTGRES_URI=postgresql://postgres:your_password@localhost:5432/online_shop_db?schema=public
```

##### Redis

```
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URI=redis://localhost:6379
```

###### Session

```
SESSION_SECRET=super-secret-session-key-change-in-production
SESSION_NAME=online_shop.sid
SESSION_DOMAIN=localhost
SESSION_MAX_AGE=2592000000
SESSION_HTTP_ONLY=true
SESSION_SECURE=false
```

##### Cookies

```
COOKIES_SECRET=super-secret-cookie-key-change-in-production
```

##### Mail (для development используйте MailDev)

```
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_LOGIN=test@example.com
MAIL_PASSWORD=test1234
```

###### Google OAuth (опционально)

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

##### Google reCAPTCHA

```
GOOGLE_RECAPCHA_SECRET_KEY=your_recaptcha_secret_key
```

#### 3.4 Настройка Frontend

Создайте front-end/.env:

##### Backend API URL

```
NEXT_PUBLIC_SERVER_URL=http://localhost:4200
```

##### Google reCAPTCHA (должен совпадать с backend)

```
GOOGLE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

##### Cloudinary (для загрузки изображений)

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL=https://api.cloudinary.com/v1_1/your_cloud_name/image/upload
```

### 4. Инициализация базы данных

```
cd back-end
```

##### Применить миграции

```
npx prisma migrate dev
```

##### Сгенерировать Prisma Client

```
npx prisma generate
```

#### 5. Запуск приложения

- Terminal 1: Backend

```
cd back-end
pnpm start:dev
```

Сервер запустится на http://localhost:4200

- Terminal 2: MailDev (для перехвата email)

```
npx maildev
```

Откройте http://localhost:1080 для просмотра писем

- Terminal 3: Frontend

```
cd front-end
pnpm dev
```

Приложение откроется на http://localhost:3000

## 📁 Структура проекта

```
online-shop/
│
├── back-end/                    # Backend API (NestJS)
│   ├── prisma/                  # Prisma схема и миграции
│   │   ├── schema/
│   │   │   ├── user.prisma
│   │   │   ├── product.prisma
│   │   │   ├── order.prisma
│   │   │   └── ...
│   │   ├── migrations/          # История миграций
│   │   └── seed.ts              # Тестовые данные
│   │
│   ├── src/
│   │   ├── auth/                # Аутентификация и авторизация
│   │   │   ├── email-confirmation/
│   │   │   ├── password-recovery/
│   │   │   ├── two-factor-auth/
│   │   │   └── provider/        # OAuth провайдеры
│   │   │
│   │   ├── user/                # Управление пользователями
│   │   ├── product/             # Управление товарами
│   │   ├── category/            # Управление категориями
│   │   ├── cart/                # Корзина покупок
│   │   ├── order/               # Обработка заказов
│   │   ├── analytics/           # Аналитика и статистика
│   │   │
│   │   ├── libs/                # Общие библиотеки
│   │   │   ├── common/          # Утилиты и декораторы
│   │   │   └── mail/            # Email сервис
│   │   │
│   │   ├── config/              # Конфигурация
│   │   ├── prisma/              # Prisma сервис
│   │   ├── redis/               # Redis сервис
│   │   └── main.ts              # Точка входа
│   │
│   ├── .env                     # Переменные окружения
│   ├── nest-cli.json
│   ├── tsconfig.json
│   └── package.json
│
├── front-end/                   # Frontend App (Next.js)
│   ├── src/
│   │   ├── app/                 # Next.js App Router (pages)
│   │   │   ├── (auth)/          # Группа роутов авторизации
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── ...
│   │   │   ├── dashboard/       # Админ панель
│   │   │   ├── products/        # Каталог товаров
│   │   │   ├── cart/            # Корзина
│   │   │   ├── checkout/        # Оформление заказа
│   │   │   ├── orders/          # История заказов
│   │   │   ├── layout.tsx       # Root layout
│   │   │   └── page.tsx         # Главная страница
│   │   │
│   │   ├── processes/           # Бизнес-процессы (FSD)
│   │   │   └── checkout/        # Многошаговый checkout
│   │   │       ├── model/       # Zustand store
│   │   │       └── ui/          # UI компоненты шагов
│   │   │
│   │   ├── widgets/             # Составные UI блоки (FSD)
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   ├── product-card/
│   │   │   ├── cart-dropdown/
│   │   │   └── analytics/
│   │   │
│   │   ├── features/            # Фичи (FSD)
│   │   │   ├── auth/            # Авторизация
│   │   │   ├── add-to-cart/     # Добавление в корзину
│   │   │   ├── checkout/        # Оформление заказа
│   │   │   ├── product-sort/    # Сортировка товаров
│   │   │   ├── admin-products/  # Управление товарами
│   │   │   └── admin-orders/    # Управление заказами
│   │   │
│   │   ├── entities/            # Бизнес-сущности (FSD)
│   │   │   ├── user/
│   │   │   ├── product/
│   │   │   ├── order/
│   │   │   ├── cart/
│   │   │   ├── category/
│   │   │   └── analytics/
│   │   │
│   │   ├── shared/              # Общие ресурсы (FSD)
│   │   │   ├── ui/              # UI kit (Button, Input, Card...)
│   │   │   │   └── primitives/  # shadcn/ui компоненты
│   │   │   ├── api/             # API клиент
│   │   │   ├── lib/             # Утилиты
│   │   │   ├── hooks/           # Общие хуки
│   │   │   ├── providers/       # React провайдеры
│   │   │   ├── styles/          # Глобальные стили
│   │   │   └── utils/           # Вспомогательные функции
│   │   │
│   │   └── middleware.ts        # Next.js middleware (защита роутов)
│   │
│   ├── public/                  # Статические файлы
│   ├── .env                     # Переменные окружения
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── .gitignore
├── CLAUDE.md                    # Правила для AI агента
└── README.md                    # Этот файл
```

## 👥 Пользователи системы

### 🔐 Администратор

Возможности:

- Полный доступ ко всем функциям
- Управление товарами и категориями
- Просмотр и управление заказами
- Доступ к аналитике продаж
- Управление пользователями

Тестовый аккаунт:

```
Email: admin@gmail.com
Password: 123456
Role: ADMIN
```

### 🛍️ Покупатель (зарегистрированный)

Возможности:

- Просмотр каталога товаров
- Добавление товаров в корзину
- Оформление заказов
- Просмотр истории заказов
- Управление профилем

Тестовые аккаунты:

```
Email: 1@gm.com
Password: 123456
Role: USER

Email: artem@gmail.com
Password: 123456
Role: USER
```

### 👤 Гость (неавторизованный)

Возможности:

- Просмотр каталога товаров
- Поиск и фильтрация
- Детальная информация о товарах
  _Для оформления заказа требуется регистрация_

## 📜 Команды разработки

**Backend (NestJS)**

### Разработка

```
pnpm start:dev              # Запуск с hot-reload
pnpm start:debug            # Запуск с debugger
```

### Production

```
pnpm build                  # Сборка проекта
pnpm start:prod             # Запуск production версии
```

### База данных

```
npx prisma migrate dev      # Создать и применить миграцию
npx prisma migrate deploy   # Применить миграции (production)
npx prisma generate         # Сгенерировать Prisma Client
npx prisma studio           # Открыть Prisma Studio GUI
npx prisma db seed          # Заполнить БД тестовыми данными
npx prisma db push          # Синхронизировать схему без миграций
```

**Frontend (Next.js)**

### Разработка

```
pnpm dev                    # Запуск dev сервера
```

### Production

```
pnpm build                  # Сборка проекта
pnpm start                  # Запуск production версии
```

## 📚 Документация

### Внешние ресурсы

#### Backend

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/postgres)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/) -[Redis Documentation](https://redis.io/docs/latest/)

#### Frontend

- [React Documentation](https://react.dev/)
- [Next.js Documentation](https://nextjs.org/)
- [Feature-Sliced Design](https://feature-sliced.github.io/documentation/ru/docs/get-started/overview)
- [TailwindCSS Docs](https://tailwindcss.com/docs/installation/using-vite)
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Zustand Guide](https://zustand.docs.pmnd.rs/guides/tutorial-tic-tac-toe)

Made with ❤️ using NestJS, Next.js
