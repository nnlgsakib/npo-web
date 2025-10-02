**NPO API Skeleton (TypeScript + Express)**

- Node.js 18+ recommended.
- Admin endpoints require header `x-admin-key` matching `ADMIN_KEY` in env.

Setup
- Copy `.env.example` to `.env` and set values.
- Install deps: `npm install`
- Dev server: `npm run dev` (hot reload)
- Build: `npm run build` then `npm start`

Routes
- POST `/api/create-post` (admin): body `{ title, content }`
- PATCH `/api/edit-post_by_id` (admin): body `{ id, title?, content? }`
- DELETE `/api/delete-post_by_id` (admin): query `?id=...` or body `{ id }`
- GET `/api/get_all_posts`
- GET `/api/get_post_full_by_id`: query `?id=...`
- POST `/api/record_txn_by_txn_hash_and_number`: body `{ txnHash, number, meta? }`
- GET `/api/get_txn_details` (admin): query `?txnHash=...`
- GET `/api/get_full_txn_record` (admin): query `?txnHash=...` or `?number=...`
- GET `/api/get_txn_info_by_number_or_hash` (admin): query `?txnHash=...` or `?number=...`

Notes
- Data is kept in-memory for now; restarts clear all data.
- Replace the header key auth with real auth later (JWT, OAuth, etc.).
- Status codes and payloads are minimal for scaffolding.

