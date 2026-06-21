# CaseVault — Frontend

A dark, glassmorphic frontend for the E-Cell IIT (BHU) "CaseVault" recruitment
task. Built with React + Vite + TailwindCSS. Backend is mocked in
`src/api/slidesApi.js` so the UI is fully demoable, but every function there
maps 1:1 to a real route from the spec.

## Run it

```bash
npm install
npm run dev
```

## File tree

```
src/
  main.jsx              # entry point, wraps app in BrowserRouter + AuthProvider
  App.jsx               # routes: "/" (gallery) and "/upload" (protected)
  index.css             # theme tokens, glass/button utility classes

  context/
    AuthContext.jsx      # mock JWT auth (login/register/logout), opens AuthModal

  api/
    slidesApi.js          # mock implementations of every /api/slides route

  data/
    mockSlides.js          # seed data + CATEGORIES list

  components/
    Navbar.jsx             # logo, search, Upload CTA (top-right), auth state
    FilterBar.jsx           # category pills + sort dropdown
    SlideCard.jsx           # gallery card (tag, thumbnail, title, desc, meta)
    Pagination.jsx          # numbered pager
    AuthModal.jsx           # login/register + mock Google/GitHub OAuth
    ProtectedRoute.jsx      # route guard for /upload

  pages/
    HomePage.jsx             # "The Gallery" — grid, filters, search, pagination
    UploadPage.jsx           # "Curate Your Work" — upload form
```

## How auth protection works

`AuthContext` stores a fake JWT (`mock.jwt.<base64>.<timestamp>`) in
`localStorage` after login/register. `ProtectedRoute` checks
`isAuthenticated` and redirects to `/` (while opening the login modal) if
there's no token. Clicking **Upload** in the navbar does the same check
before navigating.

## Wiring up the real backend later

Every function in `src/api/slidesApi.js` already has the right name,
signature, and JSDoc comment naming the exact route it stands in for
(`GET /api/slides`, `POST /api/slides`, etc.). To go live:

1. Replace the mock array + `delay()` logic in each function with a real
   `fetch('/api/...', { headers: { Authorization: `Bearer ${token}` } })`.
2. Keep the same return shape (`{ data, pagination }` for `fetchSlides`,
   the slide object for the others) so no component code needs to change.
3. Swap `AuthContext.login/register` to call
   `POST /api/auth/login` / `POST /api/auth/register` and store the real
   JWT instead of the mock one.

## Design notes

Theme is "Tech Noir / Cyber-Minimalism": deep slate background
(`#0B0F19`) with a faint circuit-grid texture, glassmorphic panels
(`backdrop-blur` + hairline white borders), and a three-color neon accent
system — violet for primary actions, cyan for metadata/years, emerald for
published/live states. Category tags get their own accent mapping in
`FilterBar.jsx` (`tagStyleFor`).
