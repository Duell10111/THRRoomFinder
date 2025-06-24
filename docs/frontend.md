# Frontend

The frontend is built using Next.js with PWA support.

### 🌍 Tech Stack
- **Framework**: Next.js (React + SSR)
- **UI Library**: Mantine UI
- **Maps**: MapLibre GL JS with MapTiler tiles
- **Auth**: Firebase Authentication
- **Testing**: Sonarqube, Vitest, Cypress
- **Language**: TypeScript

### 🚀 Features
- 🔎 Search for rooms by name
- 🗺️ View indoor locations on a map
- 🕒 Show room-specific schedule (from StarPlan)
- 🧭 Mobile-first, responsive design
- 🛠 Admin dashboard for:
  - Clearing cached schedules
  - Deleting and refreshing room entries from OSM
- 📱 PWA Support for more mobile-friendly usage

### ⚙️ Environment Variables

Create a .env file with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_MAPTILER_KEY=...
```

### 🧪 Testing

We use Cypress for end-to-end testing.
For e2e testing, we need to set a further environment variable to inject a mapgrab to enable map testing.

.env:
```
...
NEXT_PUBLIC_TEST_ENV=true
```
Run tests:
```bash
npm run test         # Run unit tests
npx cypress open     # Run E2E tests interactively
```

### 🔐 Authentication
- Admin dashboard is secured using Firebase Auth.
- Only users with a valid ID token can access admin functionality.
- Public pages (room map, schedule) are accessible without login.
