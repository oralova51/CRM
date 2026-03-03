# 📱 Мобильный личный кабинет клиента — Студия «Идеальное тело»

> **MVP** · Node.js + Express + PostgreSQL · React + Vite + FSD · 4 разработчика · 1 неделя

---

## Содержание

1. [Декомпозиция задач](#1-декомпозиция-задач)
2. [Разделение работы в команде](#2-разделение-работы-в-команде)
3. [REST API](#3-rest-api)
4. [Модели базы данных](#4-модели-базы-данных)
5. [Аутентификация и авторизация](#5-аутентификация-и-авторизация)
6. [FSD-структура фронтенда](#6-fsd-структура-фронтенда)
7. [7-дневный план разработки](#7-7-дневный-план-разработки)
8. [Границы MVP](#8-границы-mvp)
9. [Анализ рисков и стратегия упрощений](#9-анализ-рисков-и-стратегия-упрощений)
10. [Рекомендации по интеграции AI-ассистента](#10-рекомендации-по-интеграции-ai-ассистента)

---

## 1. Декомпозиция задач

### 🔧 Backend

#### Модуль: Пользователи / Auth
- [x] Регистрация и аутентификация (уже реализовано)
- [ ] Middleware проверки JWT из cookie
- [ ] Middleware проверки роли (`isAdmin`, `isClient`)
- [ ] Эндпоинт `/me` — получение текущего пользователя

#### Модуль: Программа лояльности
- [ ] Таблица `loyalty_levels` с порогами и скидками
- [ ] Расчёт текущего уровня по сумме трат клиента
- [ ] Эндпоинт получения статуса лояльности клиента

#### Модуль: Процедуры
- [ ] CRUD процедур (только admin)
- [ ] Получение списка процедур (client + admin)

#### Модуль: Записи (Booking)
- [ ] Создание записи клиентом
- [ ] Получение предстоящих и прошедших визитов клиента
- [ ] Управление записями администратором (просмотр, изменение статуса)

#### Модуль: Замеры (Measurements)
- [ ] Добавление замеров администратором
- [ ] Редактирование замеров
- [ ] Получение замеров по клиенту (клиент видит свои, admin — любые)

#### Модуль: AI-ассистент
- [ ] Эндпоинт приёма сообщения и возврата ответа
- [ ] Сохранение истории чата в БД (опционально для MVP)
- [ ] Интеграция с OpenAI API (или мок)

#### Модуль: Admin
- [ ] Получение списка всех клиентов
- [ ] Просмотр профиля клиента с его данными

---

### 🖥️ Frontend

#### Инфраструктура
- [ ] Настройка роутинга (React Router): публичные и приватные маршруты
- [ ] Redux Toolkit: `authSlice`, базовые selectors
- [ ] Axios instance с перехватчиком (baseURL, withCredentials)
- [ ] Защищённые маршруты по роли

#### Страница: Профиль / Программа лояльности
- [ ] Компонент уровня лояльности с прогресс-баром
- [ ] Отображение скидки, потрачено, сэкономлено, до следующего уровня

#### Страница: Визиты
- [ ] Список предстоящих визитов
- [ ] История прошедших визитов
- [ ] Форма записи на процедуру

#### Страница: Прогресс (замеры)
- [ ] Карточки «до / после» с замерами
- [ ] Отображение динамики

#### Страница: AI-ассистент
- [ ] Чат-интерфейс (ввод / вывод сообщений)
- [ ] Индикатор загрузки ответа

#### Панель администратора
- [ ] Список клиентов
- [ ] Форма добавления/редактирования замеров
- [ ] Управление записями

---

## 2. Разделение работы в команде

### Вариант A: Backend vs Frontend (горизонтальное разделение)

| Роль | Разработчики | Зона ответственности |
|------|-------------|----------------------|
| Backend | 2 чел. | Express, PostgreSQL, Sequelize, REST API |
| Frontend | 2 чел. | React, Redux, страницы, UI |

**Плюсы:** чёткие зоны, нет конфликтов по коду.  
**Минусы:** фронтенд блокируется без готового API → нужны моки; сложнее ревьюить чужой стек; интеграция в конце недели — зона повышенного риска.

---

### Вариант B: Вертикальные слайсы по фичам (рекомендуемый ✅)

Каждый разработчик владеет фичей от БД до UI:

| Разработчик | Фичи |
|-------------|------|
| Dev 1 | Auth/Профиль, Программа лояльности |
| Dev 2 | Процедуры, Записи (Booking) |
| Dev 3 | Замеры (Measurements), Панель администратора |
| Dev 4 | AI-ассистент, Инфраструктура (роутинг, Axios, Redux base) |

**Плюсы:**
- Каждый разработчик видит полный стек своей фичи — меньше коммуникационных разрывов
- Фичи можно интегрировать и тестировать независимо
- При блокере один человек не стопорит всю команду
- Ревью понятнее: видно бизнес-контекст изменения

**Минусы:** требует договорённостей об общих интерфейсах (типы, Axios-инстанс, Redux store) в самом начале.

### ✅ Рекомендация

**Использовать вертикальные слайсы** с обязательным стартовым alignment-митингом в Day 1:
- Зафиксировать общий Axios instance, базовые типы User/Auth, структуру Redux store
- Определить контракт API (хотя бы URL + тело запроса/ответа) до начала кодирования
- Dev 4 в первые 1,5 дня сосредоточен на инфраструктуре, которая нужна всем

---

## 3. REST API

> Базовый префикс: `/api`  
> Все защищённые маршруты требуют JWT в cookie `token`.

### Auth

| Метод | URL | Доступ | Описание |
|-------|-----|--------|----------|
| POST | `/auth/register` | Public | Регистрация |
| POST | `/auth/login` | Public | Вход, установка cookie |
| POST | `/auth/logout` | Auth | Выход, удаление cookie |
| GET | `/auth/me` | Auth | Текущий пользователь |

### Пользователи (Admin)

| Метод | URL | Доступ | Описание |
|-------|-----|--------|----------|
| GET | `/users` | Admin | Список клиентов |
| GET | `/users/:id` | Admin | Профиль клиента |

### Программа лояльности

| Метод | URL | Доступ | Описание |
|-------|-----|--------|----------|
| GET | `/loyalty/status` | Client | Статус лояльности текущего клиента |
| GET | `/loyalty/levels` | Auth | Все уровни программы |

### Процедуры

| Метод | URL | Доступ | Описание |
|-------|-----|--------|----------|
| GET | `/procedures` | Auth | Список всех процедур |
| POST | `/procedures` | Admin | Создать процедуру |
| PUT | `/procedures/:id` | Admin | Обновить процедуру |
| DELETE | `/procedures/:id` | Admin | Удалить процедуру |

### Записи (Booking)

| Метод | URL | Доступ | Описание |
|-------|-----|--------|----------|
| GET | `/bookings/my` | Client | Мои записи (все) |
| POST | `/bookings` | Client | Создать запись |
| GET | `/bookings` | Admin | Все записи |
| PUT | `/bookings/:id/status` | Admin | Изменить статус записи |

### Замеры (Measurements)

| Метод | URL | Доступ | Описание |
|-------|-----|--------|----------|
| GET | `/measurements/my` | Client | Мои замеры |
| GET | `/measurements/:userId` | Admin | Замеры клиента |
| POST | `/measurements` | Admin | Добавить замер |
| PUT | `/measurements/:id` | Admin | Редактировать замер |

### AI-ассистент

| Метод | URL | Доступ | Описание |
|-------|-----|--------|----------|
| POST | `/ai/chat` | Client | Отправить сообщение, получить ответ |
| GET | `/ai/history` | Client | История чата (опционально) |

---

## 4. Модели базы данных

### User

```
User {
  id            SERIAL PRIMARY KEY
  email         VARCHAR(255) UNIQUE NOT NULL
  password_hash VARCHAR(255) NOT NULL
  name          VARCHAR(255)
  phone         VARCHAR(20)
  role          ENUM('client', 'admin') DEFAULT 'client'
  total_spent   DECIMAL(10, 2) DEFAULT 0   -- сумма всех оплаченных визитов
  created_at    TIMESTAMP DEFAULT NOW()
  updated_at    TIMESTAMP DEFAULT NOW()
}
```

**Связи:**
- `User` → `Booking` (One-to-Many)
- `User` → `Measurement` (One-to-Many)
- `User` → `AIMessage` (One-to-Many)

---

### LoyaltyLevel

```
LoyaltyLevel {
  id            SERIAL PRIMARY KEY
  name          VARCHAR(100) NOT NULL    -- e.g. "Серебро", "Золото"
  min_spent     DECIMAL(10, 2) NOT NULL  -- порог входа в уровень
  discount_pct  INTEGER NOT NULL         -- скидка в процентах
  created_at    TIMESTAMP DEFAULT NOW()
}
```

> Текущий уровень клиента вычисляется динамически на основе `User.total_spent` и таблицы `LoyaltyLevel`. Хранить `level_id` в `User` — опционально для MVP (денормализация для производительности).

---

### Procedure

```
Procedure {
  id            SERIAL PRIMARY KEY
  name          VARCHAR(255) NOT NULL
  description   TEXT
  duration_min  INTEGER                  -- длительность в минутах
  price         DECIMAL(10, 2)
  is_active     BOOLEAN DEFAULT TRUE
  created_at    TIMESTAMP DEFAULT NOW()
}
```

---

### Booking

```
Booking {
  id            SERIAL PRIMARY KEY
  user_id       INTEGER REFERENCES User(id) ON DELETE CASCADE
  procedure_id  INTEGER REFERENCES Procedure(id)
  scheduled_at  TIMESTAMP NOT NULL
  status        ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending'
  price_paid    DECIMAL(10, 2)           -- фиксируется на момент записи
  notes         TEXT
  created_at    TIMESTAMP DEFAULT NOW()
  updated_at    TIMESTAMP DEFAULT NOW()
}
```

**Связи:**
- `Booking` → `User` (Many-to-One)
- `Booking` → `Procedure` (Many-to-One)

> При переводе статуса в `completed` — триггер или хук Sequelize увеличивает `User.total_spent` на `price_paid`.

---

### Measurement

```
Measurement {
  id            SERIAL PRIMARY KEY
  user_id       INTEGER REFERENCES User(id) ON DELETE CASCADE
  measured_at   DATE NOT NULL
  weight_kg     DECIMAL(5, 2)
  waist_cm      DECIMAL(5, 2)
  hips_cm       DECIMAL(5, 2)
  chest_cm      DECIMAL(5, 2)
  thigh_cm      DECIMAL(5, 2)
  arms_cm       DECIMAL(5, 2)
  body_fat_pct  DECIMAL(5, 2)
  photo_before  VARCHAR(500)             -- URL или путь к файлу
  photo_after   VARCHAR(500)
  notes         TEXT                     -- комментарий администратора
  created_by    INTEGER REFERENCES User(id)  -- id администратора
  created_at    TIMESTAMP DEFAULT NOW()
  updated_at    TIMESTAMP DEFAULT NOW()
}
```

**Связи:**
- `Measurement` → `User` (Many-to-One, client)
- `Measurement` → `User` (Many-to-One, admin-author)

---

### AIMessage

```
AIMessage {
  id            SERIAL PRIMARY KEY
  user_id       INTEGER REFERENCES User(id) ON DELETE CASCADE
  role          ENUM('user', 'assistant') NOT NULL
  content       TEXT NOT NULL
  created_at    TIMESTAMP DEFAULT NOW()
}
```

> Для MVP можно не хранить историю в БД — передавать контекст на клиенте и отправлять в каждом запросе. Таблица нужна только если требуется персистентность истории между сессиями.

---

### Схема связей (ERD — текстовый вид)

```
User ──< Booking >── Procedure
User ──< Measurement
User ──< AIMessage
LoyaltyLevel (lookup, не FK — вычисляется по User.total_spent)
```

---

## 5. Аутентификация и авторизация

### JWT + Cookie Flow

```
1. POST /auth/login
   → Сервер проверяет email + password (bcrypt.compare)
   → Генерирует JWT: { id, email, role }, expires: 7d
   → Устанавливает httpOnly cookie: res.cookie('token', jwt, { httpOnly: true, sameSite: 'lax' })
   → Возвращает { user: { id, name, email, role } }

2. Последующие запросы
   → Браузер автоматически отправляет cookie
   → Middleware: cookieParser → req.cookies.token → jwt.verify()
   → req.user = decoded payload

3. POST /auth/logout
   → res.clearCookie('token')
   → 200 OK
```

### Middleware

```javascript
// authenticate.js — проверка JWT
const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// authorize.js — проверка роли
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ error: 'Forbidden' });
  next();
};

// Использование:
router.get('/users', authenticate, authorize('admin'), usersController.getAll);
router.get('/loyalty/status', authenticate, authorize('client'), loyaltyController.getStatus);
```

### Ролевая матрица доступа

| Ресурс | client | admin |
|--------|--------|-------|
| Свой профиль | ✅ | ✅ |
| Список клиентов | ❌ | ✅ |
| Процедуры (чтение) | ✅ | ✅ |
| Процедуры (запись) | ❌ | ✅ |
| Свои записи | ✅ | ❌ |
| Все записи | ❌ | ✅ |
| Свои замеры (чтение) | ✅ | ✅ |
| Замеры (запись/ред.) | ❌ | ✅ |
| AI-чат | ✅ | ❌ |
| Статус лояльности | ✅ | ❌ |

---

## 6. FSD-структура фронтенда

> Используется [Feature-Sliced Design](https://feature-sliced.design/). Каждый слой имеет строгие правила импортов: нижние слои не знают о верхних.

```
src/
├── app/
├── pages/
├── widgets/
├── features/
├── entities/
└── shared/
```

---

### `app/` — Инициализация приложения

```
app/
├── providers/
│   ├── RouterProvider.tsx      # React Router, защищённые маршруты
│   ├── StoreProvider.tsx       # Redux Provider
│   └── index.tsx
├── styles/
│   └── global.css
└── App.tsx
```

Здесь живут: глобальные провайдеры, настройка роутера, глобальные стили.  
**Не содержит** бизнес-логику.

---

### `pages/` — Страницы (маршруты)

```
pages/
├── LoginPage/
├── DashboardPage/          # Главная клиента (лояльность + ближайший визит)
├── BookingsPage/           # История и запись на процедуру
├── ProgressPage/           # Замеры до/после
├── AIChatPage/             # Чат с ассистентом
└── admin/
    ├── ClientsListPage/
    ├── ClientDetailPage/
    └── MeasurementsFormPage/
```

Страница = **только компоновка виджетов**. Никакой бизнес-логики и прямых API-вызовов.

---

### `widgets/` — Самостоятельные UI-блоки

```
widgets/
├── LoyaltyCard/            # Карточка уровня лояльности с прогресс-баром
├── UpcomingVisitCard/      # Ближайший визит на главной
├── BookingsList/           # Список записей (предстоящие / история)
├── MeasurementCard/        # Карточка замеров до/после
├── AIChatWindow/           # Окно чата
├── Navbar/                 # Нижняя навигация мобильного приложения
└── AdminClientTable/       # Таблица клиентов для admin
```

Виджет может использовать несколько фич и сущностей, но не знает о страницах.

---

### `features/` — Пользовательские сценарии

```
features/
├── book-procedure/         # Форма записи на процедуру
│   ├── ui/BookingForm.tsx
│   ├── model/bookingSlice.ts
│   └── api/bookingApi.ts
├── send-ai-message/        # Отправка сообщения ассистенту
│   ├── ui/ChatInput.tsx
│   └── api/aiApi.ts
├── view-loyalty-status/    # Загрузка и отображение статуса лояльности
├── add-measurement/        # Форма добавления замеров (admin)
└── edit-measurement/       # Редактирование замера (admin)
```

Фича = конкретное действие пользователя. Содержит UI, модель (slice) и API-вызов для этого действия.

---

### `entities/` — Бизнес-сущности

```
entities/
├── user/
│   ├── model/userSlice.ts      # { currentUser, isAuthenticated }
│   ├── types/User.ts
│   └── api/userApi.ts
├── booking/
│   ├── model/bookingSlice.ts
│   ├── types/Booking.ts
│   └── ui/BookingStatusBadge.tsx
├── procedure/
│   ├── types/Procedure.ts
│   └── ui/ProcedureCard.tsx
├── measurement/
│   ├── types/Measurement.ts
│   └── ui/MeasurementRow.tsx
└── loyalty/
    ├── types/LoyaltyStatus.ts
    └── ui/LoyaltyProgressBar.tsx
```

Сущность = тип данных + базовый UI для его отображения. Не содержит сложной логики взаимодействия.

---

### `shared/` — Переиспользуемый инфраструктурный код

```
shared/
├── api/
│   └── axiosInstance.ts        # Axios с baseURL и withCredentials: true
├── ui/
│   ├── Button/
│   ├── Input/
│   ├── Spinner/
│   ├── Modal/
│   └── Avatar/
├── lib/
│   ├── formatDate.ts
│   ├── formatCurrency.ts
│   └── cn.ts                   # classnames утилита
├── config/
│   └── routes.ts               # Константы маршрутов
└── types/
    └── api.ts                  # Общие типы ответов { data, error, status }
```

---

## 7. 7-дневный план разработки

> Команда: **Dev1** (Auth/Лояльность), **Dev2** (Процедуры/Booking), **Dev3** (Замеры/Admin), **Dev4** (AI/Инфраструктура)

### День 1 (Понедельник) — Alignment + Инфраструктура

| Кто | Задача |
|-----|--------|
| Все | Утренний митинг: фиксируем API-контракты, типы, структуру Redux, ветки |
| Dev4 | Настройка Axios instance, базовый Redux store, React Router + защищённые маршруты |
| Dev1 | Middleware authenticate/authorize, эндпоинт `/auth/me`, `UserSlice` |
| Dev2 | Модели `Procedure`, `Booking` в Sequelize, базовые CRUD эндпоинты |
| Dev3 | Модель `Measurement`, эндпоинты чтения/записи замеров |

---

### День 2 (Вторник) — Ядро Backend

| Кто | Задача |
|-----|--------|
| Dev1 | Модель `LoyaltyLevel`, логика расчёта уровня, эндпоинт `/loyalty/status` |
| Dev2 | Booking: создание, статусы, фильтрация по клиенту/admin |
| Dev3 | Measurement: добавление и редактирование администратором, `/users` admin-эндпоинт |
| Dev4 | Мок AI-эндпоинта, начало страниц Dashboard и AI-чат |

---

### День 3 (Среда) — Основные страницы Frontend

| Кто | Задача |
|-----|--------|
| Dev1 | `LoyaltyCard` widget + `DashboardPage` (статус лояльности) |
| Dev2 | `BookingsList` widget + `BookingsPage` (история и предстоящие) |
| Dev3 | `MeasurementCard` + `ProgressPage` |
| Dev4 | `AIChatWindow` + `AIChatPage`, Navbar |

---

### День 4 (Четверг) — Интерактивность + Формы

| Кто | Задача |
|-----|--------|
| Dev1 | Тест полного flow лояльности, правки |
| Dev2 | `BookingForm` (запись на процедуру), валидация, выбор времени |
| Dev3 | Панель Admin: `ClientsListPage`, `MeasurementsFormPage` |
| Dev4 | Подключение реального AI API (если мок готов), или расширение мока |

---

### День 5 (Пятница) — Интеграция Frontend ↔ Backend

| Кто | Задача |
|-----|--------|
| Все | Подключение реального API вместо моков, end-to-end тест каждого flow |
| Dev1 | Исправление расчёта лояльности, edge cases |
| Dev2 | Тест booking flow: создание → подтверждение → история |
| Dev3 | Тест admin flow: замеры клиентов, список клиентов |
| Dev4 | Стабилизация AI-чата, обработка ошибок |

---

### День 6 (Суббота) — Баги + Полировка

| Кто | Задача |
|-----|--------|
| Все | Bug bash: тестирование всех сценариев, фикс критических багов |
| Dev4 | Обработка ошибок (401, 403, 500), loading states, empty states |
| Dev1-3 | Правки UX, мобильная адаптация |

---

### День 7 (Воскресенье) — Финальная проверка + Deploy

| Кто | Задача |
|-----|--------|
| Все | Code freeze, финальное тестирование |
| Dev4 | Деплой (backend + frontend), ENV-переменные, CORS для prod |
| Все | Smoke test на staging, документирование известных ограничений |

---

## 8. Границы MVP

Следующее **намеренно исключено** из текущей итерации:

### Функциональность
- ❌ Онлайн-оплата и эквайринг
- ❌ Push-уведомления о записях и напоминания
- ❌ Система отзывов и оценок процедур
- ❌ Реферальная программа
- ❌ Многофилиальность (студия одна)
- ❌ Расписание мастеров и управление их рабочим временем
- ❌ Загрузка фото клиентом (только администратор добавляет фото)
- ❌ Экспорт данных (PDF-отчёты по прогрессу)

### Технические аспекты
- ❌ Refresh token / ротация токенов (JWT с фиксированным TTL 7d)
- ❌ Rate limiting и защита от брутфорса
- ❌ Email-подтверждение при регистрации
- ❌ Пагинация (для MVP достаточно лимитов на запросы)
- ❌ Полнотекстовый поиск
- ❌ Websocket (AI-ответ — синхронный запрос)
- ❌ Файловое хранилище (S3/MinIO) — URLs фото хранятся как строки

---

## 9. Анализ рисков и стратегия упрощений

| Риск | Вероятность | Влияние | Митигация |
|------|------------|---------|-----------|
| Блокировка фронтенда из-за неготового API | Высокая | Высокое | Фиксировать контракт API в День 1; использовать JSON-моки (`msw` или хардкод) |
| Сложность расчёта лояльности | Средняя | Среднее | Хранить `total_spent` в `User`, пересчитывать при каждом запросе — не триггер, а простой SELECT |
| AI API нестабилен / дорог | Средняя | Среднее | Начать с мока, добавить абстракционный слой, реальный API — в последнюю очередь |
| Конфликты в Git при параллельной разработке | Средняя | Среднее | Вертикальные слайсы минимизируют пересечения; ревью перед merge в main |
| Нехватка времени на интеграцию | Высокая | Высокое | День 5 полностью на интеграцию; не начинать новых фич после четверга |
| CORS в production | Средняя | Высокое | Настроить `cors({ origin: FRONTEND_URL, credentials: true })` с самого начала |
| Scope creep (расширение требований) | Средняя | Высокое | Чётко зафиксировать раздел «Границы MVP», любые доп. запросы — в backlog |

### Стратегия упрощений для MVP

1. **LoyaltyLevel** — засеять таблицу фиксированными данными (seed), не делать CRUD в UI
2. **Booking time slots** — свободный выбор даты/времени без проверки занятости мастера
3. **AI история** — хранить только в `localStorage` на клиенте, не в БД
4. **Фото замеров** — принимать URL-строку, не реализовывать upload
5. **Pagination** — добавить `LIMIT 50` на запросы списков, без курсорной пагинации

---

## 10. Рекомендации по интеграции AI-ассистента

### Стратегия: Мок → Абстракция → Реальный API

#### Этап 1 (День 1–2): Мок на backend

```javascript
// routes/ai.js
router.post('/chat', authenticate, authorize('client'), (req, res) => {
  const { message } = req.body;
  res.json({
    role: 'assistant',
    content: `Это мок-ответ на: "${message}". Реальный AI подключается позже.`
  });
});
```

Это позволяет фронтенду разработать полный UI чата, не завися от API-ключа.

---

#### Этап 2 (День 2–3): Абстракционный слой

```javascript
// services/aiService.js
class AIService {
  async getResponse(messages, userContext = {}) {
    if (process.env.AI_MOCK === 'true') {
      return this._getMockResponse(messages);
    }
    return this._callOpenAI(messages, userContext);
  }

  _getMockResponse(messages) {
    return { role: 'assistant', content: 'Мок-ответ ассистента.' };
  }

  async _callOpenAI(messages, userContext) {
    // OpenAI / другой провайдер
  }
}

module.exports = new AIService();
```

**Зачем абстракция важна:** смена провайдера (OpenAI → Anthropic → локальная модель) не затронет контроллер и фронтенд.

---

#### Этап 3 (День 4): Реальный API

```javascript
async _callOpenAI(messages, userContext) {
  const systemPrompt = `Ты — AI-ассистент студии коррекции фигуры «Идеальное тело».
Помогаешь клиентам с вопросами о питании, тренировках и выборе процедур.
Контекст клиента: ${JSON.stringify(userContext)}.
Отвечай коротко, по делу, дружелюбно.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',        // Экономичная модель для MVP
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ],
    max_tokens: 500,
  });

  return response.choices[0].message;
}
```

---

### Управление историей чата

**Рекомендация для MVP:** хранить историю **на клиенте** (React state / localStorage), передавать последние N сообщений в каждом запросе.

```javascript
// На клиенте: отправляем последние 10 сообщений как контекст
const payload = {
  message: userInput,
  history: chatHistory.slice(-10)
};
```

**Персистентность в БД** (таблица `AIMessage`) — только если требование зафиксировано явно. Для MVP это overhead.

---

### Контекст пользователя для AI

Чтобы ответы были персонализированы, передавайте минимальный контекст клиента:

```javascript
// В контроллере ai.js
const userContext = {
  loyaltyLevel: req.user.loyaltyLevel,
  recentProcedures: await getRecentProcedures(req.user.id),
  lastMeasurement: await getLastMeasurement(req.user.id),
};
```

Это повышает качество ответов без сложной RAG-системы.

---

### Вывод по AI-интеграции

| Аспект | Решение для MVP |
|--------|----------------|
| Старт разработки | Мок на 100% |
| Архитектура | Абстракционный слой `AIService` обязателен |
| Модель | `gpt-4o-mini` (низкая стоимость) |
| История | localStorage + передача последних 10 сообщений |
| Персистентность | Не хранить в БД для MVP |
| Переключение мок/реал | ENV-переменная `AI_MOCK=true/false` |

---

## Технический стек (справочно)

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express 4
- **ORM:** Sequelize 6 + `sequelize-cli` для миграций
- **БД:** PostgreSQL 15
- **Auth:** `jsonwebtoken`, `cookie-parser`, `bcrypt`
- **AI:** `openai` npm package
- **Env:** `dotenv`

### Frontend
- **Сборщик:** Vite 5
- **UI:** React 18
- **Роутинг:** React Router 6
- **Состояние:** Redux Toolkit
- **HTTP:** Axios (с `withCredentials: true`)
- **Архитектура:** Feature-Sliced Design
- **Стили:** CSS Modules / TailwindCSS (по договорённости команды)

---

*Документ актуален для текущего этапа MVP. После релиза подлежит обновлению.*
