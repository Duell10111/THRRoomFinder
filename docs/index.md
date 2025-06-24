(welcome)=

# THRRoomfinder

![icon.png](icon.png)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Duell10111_THRRoomFinder&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Duell10111_THRRoomFinder)
[![THRRoomfinder](https://img.shields.io/endpoint?url=https://cloud.cypress.io/badge/simple/2zo3t1/main&style=flat&logo=cypress)](https://cloud.cypress.io/projects/2zo3t1/runs)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Duell10111_THRRoomFinder&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Duell10111_THRRoomFinder)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=Duell10111_THRRoomFinder&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=Duell10111_THRRoomFinder)

THRRoomfinder is a helpful tool designed to assist students, staff, and visitors in quickly finding rooms and lecture halls on campus. Whether you’re late for a lecture or looking for a seminar room you’ve never heard of—Roomfinder has you covered.

You can access the latest version here: [https://thrroomfinder.duell10111.de/](https://thrroomfinder.duell10111.de/).  
To save costs, the instance shuts down when idle. As a result, the first load may take a few seconds if the site hasn't been accessed recently. You may need to refresh once, as the backend starts only after a request from the frontend has been made.

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

### 🔑 API Keys

You need the following API keys to build and run the application successfully:

- Maptiler API Key (used for light theme of map):
  For development you can [create](https://www.maptiler.com/) a free account and use the API Key from there, the quota should be enough for your use case.
- Indoor Equal (used to fetch indoor map tiles):
  You can generate a free API key using your email address from [Indoor Equal](https://indoorequal.com/).
- Firebase API Key (used for IDP authentication for admin dashboard):
  An API key can be obtained by creating your own Firebase project for development.

  **Important**: Make sure to also update the `authDomain` in your Firebase configuration to enable authentication.
  Filepath: `frontend/src/admin/auth.ts`

🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Duell10111/THRRoomFinder.git
   cd THRRoomFinder
   ```

2. Add the API keys as build arguments to the frontend build.
    - Required API keys as the following environment variables:
        - **NEXT_PUBLIC_MAPTILER_API_KEY**
        - **NEXT_PUBLIC_INDOOR_CONTROL_API_KEY** (enter Indoor Equal API Key from above)
        - **NEXT_PUBLIC_FIREBASE_API_KEY**

3. Run the docker compose:
   ```bash
   docker-compose up -d
   ```

4. Open app in browser:
   ```
   http://localhost:80
   ```

### ▶️ GitHub Actions

The GitHub workflows are structured as follows:

- `Sonarqube Workflow` - Analyzes both frontend and backend by running tests and submitting the results to SonarCloud.
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
test-concept
c4

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
