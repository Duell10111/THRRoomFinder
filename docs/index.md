(welcome)=

# THRRoomfinder

![icon.png](icon.png)

THRRoomfinder is a helpful tool designed to assist students, staff, and visitors in quickly finding rooms and lecture halls on campus. Whether you’re late for a lecture or looking for a seminar room you’ve never heard of—Roomfinder has you covered.

### 🔍 Features
- Room Search: Find rooms by entering the room number or name.
- Campus Map Integration: Visual guidance on where the room is located.
- Building Overview: Browse all buildings and their floor plans.
- Mobile Friendly: Use it easily on smartphones and tablets.

### 🏫 Supported Locations

Currently supports:
- Main campus (Hochschulstraße 1)
- Buildings A through C, S
- Additional locations (e.g. campuses in Mühldorf, Burghausen) coming soon

### 🛠️ Built With
- React / Next.js
- Mantine UI
- TypeScript
- MapLibre (for map display)
- Kotlin / Spring Boot 3 (backend)

🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Duell10111/THRRoomFinder.git
   cd THRRoomFinder
   ```
   
2. Add API keys as build args to frontend build.
    - Needed API Keys as following env variables:
      - **NEXT_PUBLIC_MAPTILER_API_KEY** (used for light mode map tiles)
      - **NEXT_PUBLIC_INDOOR_CONTROL_API_KEY** (used for indoor map data)
      - **NEXT_PUBLIC_FIREBASE_API_KEY** (used for admin dashboard identity provider)
   
3. Run the docker compose:
   ```bash
   docker-compose up -d
   ```
   
4. Open app in browser:
   ```
   http://localhost:80
   ```
   
### ▶️ Github Actions

The Github workflows are structured in the following way:

- `Sonarqube Workflow` - Used to analyses frontend and backend by running their tests and then sending them to the Sonarcloud.
Runs on pull requests and pushes on the main branch.
- `E2E Tests` - Runs cypress e2e tests on pull requests and pushes on the main branch.
- `Code analysis` - Runs unit and integration tests of the frontend and backend on every commit.
- `Release Please` - Runs release please on every main branch commit.
- `Deployment Frontend` - Deploys the frontend on workflow dispatch or on every main commit.
- `Deployment Backend` - Deploys the backend on workflow dispatch or on every main commit.

### 📄 Documentation

The documentation is spread in multiple files. These files can be found here:

- [Backend](backend.md)
- [Backend API](api.rst)
- [Arc42](arc42/arc42.md)

### 🤝 Contributing

We welcome contributions! Please open an issue first to discuss what you would like to change.

```{toctree}
---
maxdepth: 3
hidden:
caption: Contents
---
self
frontend
backend
api.rst
```

```{toctree}
---
maxdepth: 1
hidden:
caption: Arc42
---
arc42/arc42
```
