# Auth backend plan and implementation status

## Goal
Build a secure authentication backend with:
- login/register
- access token + refresh token flow
- refresh token rotation
- server-side session revocation
- consistent API errors
- protected routes

## Plan that was used

### Phase 1 — Base auth endpoints
1. Add register endpoint with transaction.
2. Add login endpoint with bcrypt password check.
3. Add refresh endpoint to renew access token.
4. Add logout endpoint to clear refresh cookie.

Status: ✅ done.

### Phase 2 — Security hardening
1. Make `JWT_SECRET` mandatory.
2. Harden DB schema initialization (`DB_SCHEMA` validation + `search_path`).
3. Normalize role aggregation SQL (`COALESCE + FILTER`).
4. Add secure cookie options and shared cookie helper.

Status: ✅ done.

### Phase 3 — Session-backed refresh token flow
1. Hash refresh tokens before DB storage.
2. Save refresh sessions on login.
3. Verify DB session on refresh.
4. Rotate refresh sessions in transaction.
5. Revoke session on logout.

Status: ✅ done.

### Phase 4 — API consistency and guards
1. Add shared `okResponse`/`errorResponse`.
2. Add payload validators for login/register.
3. Add access-token guard with optional role checks.
4. Add middleware for secured API paths.

Status: ✅ done.

### Phase 5 — Operations
1. Add cleanup endpoint for expired/revoked sessions.
2. Improve server vs auth error separation.
3. Add auth tests and CI checks.

Status: 🟡 in progress (1 and 2 done, tests pending).

## What is already done in project
- Session-backed login/refresh/logout.
- Refresh token rotation with DB revocation.
- Protected route middleware (`/api/secure/*`).
- `GET /api/auth/me` endpoint for token check.
- Validation and standardized API error payloads.
- Session cleanup endpoint for admin users.

## DB tables currently used by auth module
- `gothelph.users`
- `gothelph.roles`
- `gothelph.user_roles`
- `gothelph.user_sessions`

## Full database table list shared for this project
- `gothelph.admin_audit_log`
- `gothelph.brands`
- `gothelph.cart`
- `gothelph.cart_items`
- `gothelph.categories`
- `gothelph.collections`
- `gothelph.colors`
- `gothelph.gender`
- `gothelph.order_items`
- `gothelph.order_statuses`
- `gothelph.orders`
- `gothelph.product_collections`
- `gothelph.product_images`
- `gothelph.product_seasons`
- `gothelph.product_species`
- `gothelph.product_variants`
- `gothelph.products`
- `gothelph.roles`
- `gothelph.seasons`
- `gothelph.sizes`
- `gothelph.stock_movements`
- `gothelph.user_roles`
- `gothelph.user_sessions`
- `gothelph.users`

## Remaining backend tasks (next)
1. Add automated integration tests for auth flow.
2. Add rate-limit for login/refresh endpoints.
3. Add metrics/alerts for auth failures and token refresh anomalies.
