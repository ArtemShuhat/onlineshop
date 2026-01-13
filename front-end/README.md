# 🛍️ Online Shop - Frontend

Современный интернет-магазин девайсов, построенный на **Next.js 15**, **React 19** и **TypeScript** с использованием архитектуры **Feature-Sliced Design (FSD)**.

## 📋 Содержание

- [Технологический стек](#технологический-стек)
- [Быстрый старт](#быстрый-старт)
- [Переменные окружения](#переменные-окружения)
- [Архитектура проекта](#архитектура-проекта)
- [Структура папок](#структура-папок)
- [Скрипты](#скрипты)
- [Стандарты кода](#стандарты-кода)
- [Основные библиотеки](#основные-библиотеки)

---

## 🚀 Технологический стек

### Core

- **[Next.js 15.1](https://nextjs.org/)** - React-фреймворк с App Router
- **[React 19](https://react.dev/)** - UI библиотека
- **[TypeScript 5](https://www.typescriptlang.org/)** - типизация

### Styling

- **[TailwindCSS 3.4](https://tailwindcss.com/)** - utility-first CSS
- **[Radix UI](https://www.radix-ui.com/)** - headless UI компоненты
- **[shadcn/ui](https://ui.shadcn.com/)** - готовые компоненты на Radix UI
- **[Lucide React](https://lucide.dev/)** - иконки

### State Management

- **[Zustand 5](https://docs.pmnd.rs/zustand)** - клиентское состояние (корзина, UI)
- **[TanStack Query 5](https://tanstack.com/query/latest)** - серверное состояние, кеширование

### Forms & Validation

- **[React Hook Form 7](https://react-hook-form.com/)** - управление формами
- **[Zod 3](https://zod.dev/)** - схемы валидации и типы

### Other

- **[Recharts 3](https://recharts.org/)** - графики и аналитика
- **[Sonner](https://sonner.emilkowal.ski/)** - toast-уведомления
- **[react-google-recaptcha](https://github.com/dozoisch/react-google-recaptcha)** - защита отботов

---

## ⚡ Быстрый старт

### Требования

- **Node.js** >= 18.x
- **pnpm** >= 8.x (рекомендуется)

### Установка

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd online-shop/front-end

# Установите зависимости
pnpm install

# Создайте файл .env
cp .env.example .env
# Заполните переменные окружения (см. ниже)

# Запустите dev-сервер
pnpm dev
Приложение откроется на http://localhost:3000
```

🔐 Переменные окружения
Создайте файл .env в корне front-end/ со следующими переменными:


### Backend API URL
```bash
NEXT_PUBLIC_SERVER_URL=http://localhost:4200
```

### Google reCAPTCHA (для форм авторизации)
```bash
GOOGLE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

### Cloudinary (для загрузки изображений)
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL=https://api.cloudinary.com/v1_1/your_cloud_name/image/upload
```
Примечание: Переменные с префиксом NEXT_PUBLIC_ доступны в браузере.


# 🏗️ Архитектура проекта
Проект использует Feature-Sliced Design (FSD) — методологию организации кода по слоям и слайсам.

### Слои (от верхнего к нижнему)

```bash
src/
├── app/           # Next.js App Router, layouts, роуты
├── processes/     # Сложные пользовательские сценарии (checkout, onboarding)
├── widgets/       # Большие составные UI блоки (header, footer, product-catalog)
├── features/      # Пользовательские действия (auth, add-to-cart, filters)
├── entities/      # Бизнес-сущности (user, product, order, category)
└── shared/        # Переиспользуемые ресурсы (ui, lib, api, hooks)
```
### Принципы FSD
- **Слоистая архитектура** - зависимости идут только вниз по слоям
- **Изоляция слайсов** - нет прямых импортов между фичами
- **Публичное API** - экспорт через index.ts
- **Бизнес-логика** в entities и features, UI в widgets
- **Документация:** Feature-Sliced Design

### 📁 Структура папок
```bash
front-end/
├── public/              # Статические файлы (images, fonts)
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── layout.tsx   # Root layout с провайдерами
│   │   ├── page.tsx     # Главная страница
│   │   ├── auth/        # /auth routes
│   │   ├── products/    # /products routes
│   │   └── ...
│   │
│   ├── processes/       # Многошаговые процессы
│   │   └── checkout/    # Процесс оформления заказа
│   │       ├── model/   # Zustand store для checkout
│   │       └── ui/      # Компоненты шагов
│   │
│   ├── widgets/         # Составные блоки
│   │   ├── header/
│   │   ├── footer/
│   │   ├── product-card/
│   │   └── ...
│   │
│   ├── features/        # Фичи
│   │   ├── auth/        # Авторизация, регистрация
│   │   ├── add-to-cart/ # Добавление в корзину
│   │   ├── checkout/    # Оформление заказа
│   │   └── ...
│   │
│   ├── entities/        # Сущности
│   │   ├── user/
│   │   ├── product/
│   │   ├── order/
│   │   ├── cart/
│   │   └── category/
│   │
│   └── shared/          # Общие ресурсы
│       ├── api/         # API клиент (axios instance)
│       ├── ui/          # UI kit (Button, Input, Card...)
│       ├── lib/         # Утилиты
│       ├── hooks/       # Общие хуки
│       ├── providers/   # React providers
│       ├── styles/      # Глобальные стили
│       └── utils/       # Вспомогательные функции
│
├── .env                 # Переменные окружения
├── tailwind.config.ts   # Настройки TailwindCSS
├── tsconfig.json        # TypeScript конфигурация
└── next.config.mjs      # Next.js конфигурация
```
### 📜 Скрипты

#### Запуск development сервера
```bash
pnpm dev
```

#### Production build
```bash
pnpm build
```

#### Запуск production сервера
```bash
pnpm start
```

#### Линтинг кода
```bash
pnpm lint
```

### Стандарты кода
Naming Conventions
- **PascalCase** — компоненты, типы, интерфейсы (ProductCard, User)
- **camelCase** — переменные, функции, хуки (useCart, handleClick)
- **kebab-case** — файлы и папки (product-card.tsx, add-to-cart/)
- **UPPERCASE** — константы, env (API_URL, MAX_ITEMS)
Структура компонента

#### 1. Импорты
```bash
import { useState } from 'react'
import { Button } from '@shared/ui'
```

#### 2. Типы
```bash
interface ProductCardProps {
  id: string
  title: string
}
```

#### 3. Компонент
```bash
export function ProductCard({ id, title }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  return (
    <div>
      <h3>{title}</h3>
      <Button onClick={() => {}}>Add to cart</Button>
    </div>
  )
}
```

#### Правила импорта
```bash
import { ProductCard } from '@widgets/product-card'
import { useAddToCart } from '@features/add-to-cart'
import { Button } from '@shared/ui'
```


```bash
@app/*       → src/app/*
@processes/* → src/processes/*
@widgets/*   → src/widgets/*
@features/*  → src/features/*
@entities/*  → src/entities/*
@shared/*    → src/shared/*
```


### 📚 Основные библиотеки
- **State Management**
- **Zustand (клиентское состояние)**
- **TanStack Query (серверное состояние)**
- **Forms**

### 🔗 Полезные ссылки
- [Next.js Documentation](https://nextjs.org/)
- [Feature-Sliced Design](https://feature-sliced.github.io/documentation/ru/docs/get-started/overview)
- [TailwindCSS Docs](https://tailwindcss.com/docs/installation/using-vite)
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Zustand Guide](https://zustand.docs.pmnd.rs/guides/tutorial-tic-tac-toe)

### 📝 Дополнительные заметки
#### Middleware
Используется Next.js middleware для защиты роутов (middleware.ts).

#### Server Components vs Client Components
- По умолчанию все компоненты в App Router - Server Components
- Используйте 'use client' только когда нужны:
- React hooks (useState, useEffect)
- Event handlers (onClick, onChange)
- Browser APIs
- Image Optimization
- Используйте next/image для автоматической оптимизации:

Made with ❤️ using Next.js and Feature-Sliced Design


