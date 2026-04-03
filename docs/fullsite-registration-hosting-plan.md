# План: как довести проект до полноценного сайта (регистрация + хостинг)

## 1) Цели и критерии готовности

### Бизнес-цели
- Пользователь может зарегистрироваться, войти, выйти, восстановить доступ.
- Администратор может модерировать контент (коллекции/товары).
- Сайт стабильно работает в продакшене с мониторингом и резервным копированием.

### Критерии готовности (Definition of Done)
- Core user flows проходят e2e: регистрация, вход, refresh, logout, CRUD товаров.
- Нет критичных уязвимостей (OWASP Top 10 baseline).
- Настроены CI/CD, staging и production окружения.
- Есть алерты, логи, метрики, backup/restore runbook.

---

## 2) Архитектура и стек (рекомендуемый baseline)

- **Frontend**: Next.js (App Router) + TypeScript.
- **Backend API**: Route Handlers Next.js (можно оставить монолитом на старте).
- **DB**: PostgreSQL (managed: Neon/Supabase/RDS).
- **Auth**: JWT access + refresh token в HttpOnly cookie (у вас уже близко к этому).
- **Cache/Queue (по мере роста)**: Redis.
- **Object Storage**: S3-совместимое хранилище (Cloudflare R2 / AWS S3).
- **Infra**: Vercel (быстрый старт) или Docker + VPS/Render/Fly.io.

---

## 3) Регистрация и безопасность аккаунтов

### 3.1 Минимально необходимое
1. Регистрация с валидацией email/пароля.
2. Подтверждение email (verification token с TTL).
3. Вход + refresh с ротацией refresh token.
4. Logout текущей сессии и logout all sessions.
5. Reset password (one-time token + истечение).

### 3.2 Усиление безопасности
- Хэш пароля: `bcrypt`/`argon2` (предпочтительно argon2id).
- Rate limit на login/register/reset.
- Защита от brute force: временные блокировки по IP/user/email.
- CSRF защита для cookie-based операций.
- Cookie-флаги: `HttpOnly`, `Secure`, `SameSite` (обычно `Lax` для UX).
- Хранить в БД только hash refresh token (не сам токен).
- Аудит-события: login success/fail, password reset, role change.

### 3.3 Роли и доступ
- RBAC: `user`, `admin`.
- Защита API на уровне middleware/guards + проверка ролей в каждом критичном handler.
- Отдельные admin-роуты и журнал действий администратора.

---

## 4) Данные и миграции

1. Подключить инструмент миграций (Prisma Migrate / Drizzle / Knex).
2. Ввести явные схемы таблиц:
   - `users`, `roles`, `user_roles`, `user_sessions`,
   - `email_verification_tokens`, `password_reset_tokens`.
3. Индексы:
   - `users(email)` unique,
   - `user_sessions(user_id, revoked_at, expires_at)`,
   - TTL/cleanup jobs.
4. Seeds для dev/staging.

---

## 5) Frontend-слой (продуктовый уровень)

1. Страницы: login, register, forgot/reset password, profile, admin.
2. Состояния UI: loading/success/error + дружелюбные сообщения.
3. Формы на `react-hook-form` + `zod` (единая валидация клиент/сервер).
4. UX-полировка:
   - show/hide password,
   - индикатор сложности пароля,
   - i18n (ru/en),
   - доступность (a11y: aria, фокус-ловушка для модалок).

---

## 6) Тестирование (обязательно до продакшена)

### Unit
- Валидация payload, JWT utils, guards, сервисы работы с БД.

### Integration
- API auth: register/login/refresh/logout/reset + edge cases.

### E2E
- Playwright/Cypress:
  - новый пользователь регистрируется и подтверждает email,
  - логин, перезапуск браузера, refresh,
  - logout current/all sessions,
  - admin CRUD.

### Security tests
- SQLi/XSS/CSRF smoke checks.
- Проверка rate-limits и lockout.

---

## 7) CI/CD и окружения

1. **Environments**: `local`, `staging`, `production`.
2. **Pipeline** (GitHub Actions):
   - install → lint → typecheck → test → build.
3. При merge в `main`:
   - deploy в staging,
   - smoke tests,
   - manual approval → production.
4. Миграции БД запускаются автоматически и идемпотентно.

---

## 8) Хостинг (практичный сценарий)

## Вариант A: Vercel + Managed Postgres
- Плюсы: самый быстрый запуск Next.js, preview deploys, простая интеграция env.
- Минусы: vendor lock-in, ограничения serverless-паттернов.

### Шаги
1. Поднять БД (Neon/Supabase), создать production/staging базы.
2. Подключить репозиторий к Vercel.
3. Добавить env vars:
   - `JWT_SECRET`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SCHEMA`.
4. Настроить домен + HTTPS.
5. Настроить CRON для cleanup sessions.
6. Подключить мониторинг и алерты.

## Вариант B: Docker + VPS/Render/Fly
- Плюсы: гибкость и контроль.
- Минусы: больше DevOps-работы.

### Шаги
1. Написать `Dockerfile` и `docker-compose` для app + reverse proxy.
2. Настроить managed PostgreSQL отдельно.
3. CI пушит образ в registry, CD выкатывает новую версию.
4. Nginx/Caddy для SSL и маршрутизации.

---

## 9) Наблюдаемость и эксплуатация

1. Логи: структурированные (json), correlation-id.
2. Метрики: p95 latency, error rate, auth fail rate, DB pool saturation.
3. Трейсинг: OpenTelemetry + APM.
4. Алерты: 5xx spikes, рост login failures, недоступность БД.
5. Backup:
   - ежедневные бэкапы БД,
   - периодический restore-тест.

---

## 10) Дорожная карта по спринтам (пример)

### Sprint 1 (1 неделя): Auth Foundation
- Выравнивание валидации клиент/сервер.
- Email verify + reset password.
- Базовые rate limits.

### Sprint 2 (1 неделя): Качество и безопасность
- Unit/integration/e2e.
- CSRF, audit logs, session management UI.

### Sprint 3 (1 неделя): Deploy
- CI/CD + staging/prod.
- Домены, SSL, env, миграции, cron cleanup.

### Sprint 4 (1 неделя): Наблюдаемость и hardening
- Мониторинг, алерты, backup/restore drills.
- Нагрузочные smoke-тесты.

---

## 11) Чеклист запуска в production

- [ ] Все секреты в secret manager, не в репозитории.
- [ ] `JWT_SECRET` ротация описана и протестирована.
- [ ] CSP, HSTS, secure headers включены.
- [ ] Privacy policy / terms / cookie notice готовы.
- [ ] Согласованы SLA/SLO.
- [ ] Есть rollback-план на случай неудачного релиза.

---

## 12) Что сделать прямо сейчас в этом проекте

1. Перевести `next/font/google` на self-hosted/local fonts для стабильной сборки в ограниченных сетях.
2. Добавить подтверждение email и reset password endpoint-ы.
3. Ввести миграции БД и seed-скрипты.
4. Подключить Playwright smoke e2e для auth.
5. Настроить GitHub Actions (lint + build + tests).
6. Выкатить staging на Vercel и прогнать smoke тесты перед production.
