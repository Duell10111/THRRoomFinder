# Testing concept

The tests are structured in the following hierarchy:

         UI / E2E Tests                             ← Cypress
       Integration Tests, Penetatration Tests    ← SpringBootTest, WebTestClient, Testcontainers
     Unit Tests                                ← JUnit5, MockK, Vitest

### 🧰 Tools & Libraries

| Testlayer     | Tools                          |
|---------------|--------------------------------|
| Unit          | JUnit5, MockK, Vitest          |
| Integration   | SpringBootTest, Testcontainers |
| E2E           | Cypress                        |
| Static Checks | Sonarqube, ESLint              |
| Coverage      | JaCoCo, Sonarqube              |

### 🕵️ Coverage Strategy

- Targets 80+% line coverage combined on frontend and backend controlled by Sonarqube.
- Reports are added on new PRs by SonarQube.

### 🛠 CI Integration

GitHub Actions runs on pull requests to `main`, pushes to `main`, and merge queues:
- Linting
- Unit + integration tests

Additional checks on pull requests and main branch commits:
- E2E tests (headless)
- Coverage reports

### 🧪 Running Tests

Backend (Kotlin) in _roomfinder-backend_ folder:

```bash
./gradlew test
./gradlew jacocoTestReport
```

Frontend (Next.js) in _frontend_ folder:
```bash
npm run test         # Unit tests
```

For the complete local E2E stack, use the commands below.

### 📌 Notes

- External API dependencies are mocked or stubbed during tests to ensure repeatability, using Wiremock.
- Testcontainers are used to spin up real PostgreSQL/PostGIS instances for reliable integration tests.
- Caching layers are tested for hit/miss logic and manual invalidation.

### Deterministic E2E suite

The `E2E Tests` workflow builds the frontend and backend from the tested commit.
It runs the complete Cypress suite twice in Chrome, with retries disabled. A
failure in either run fails the `cypress` check. It also runs for merge queues.
No repository secrets, Cypress Cloud account, registry push permissions, or
production credentials are needed.

The browser exercises the real Next.js application, MapLibre, IndoorEqual,
Firebase client SDK, Spring backend and PostGIS database. Only external data
services are replaced:

- `e2e/server.mjs` supplies synthetic Overpass and StarPlan responses and vector
  tiles. Font glyphs are checked in, so map rendering needs no CDN.
- Firebase Authentication runs in its local emulator with the demo project
  `demo-roomfinder`; each admin test creates its own local account.
- Room data and caches are reset before each map/admin test. Admin tests verify
  HTTP responses and persisted changes, including a simulated failed deletion.
- Uncaught application exceptions fail tests. A dedicated bootstrap marker in
  E2E builds prevents Cypress's own script injection from breaking React
  hydration ([Cypress documentation](https://docs.cypress.io/app/references/error-messages#React-Hydration-Errors)).

Backend authorization uses the existing `no-auth` profile here. Production JWT
validation and authorization remain the responsibility of the backend security
integration tests. These E2E tests also do not verify production API availability,
real map coverage, infrastructure or deployment permissions.

Run from the repository root with Node.js 24, Java 25, Docker and Chrome installed:

```bash
npm ci --prefix frontend
npm ci --prefix e2e
docker compose -f e2e/compose.yml up -d --wait
(cd roomfinder-backend && ./gradlew bootJar)
npm run build:frontend --prefix e2e
E2E_REPEAT=2 npm test --prefix e2e
docker compose -f e2e/compose.yml down -v
```

The runner starts and stops its own services. It uses frontend port `3100`,
backend port `18080`, fixture port `19090`, auth port `19099`, and a separate
PostGIS database on port `5433`. Existing application services on ports 3000/8080
are unaffected; the runner refuses to start if one of its own ports is occupied.
The E2E frontend build lives in `frontend/.next-e2e`.
Service logs are in `e2e/logs`, screenshots and videos in `frontend/cypress`.
CI uploads diagnostics even on failure. `E2E_REPEAT` defaults to `1` locally;
`E2E_BROWSER` defaults to `chrome`.

### Using the checks for Renovate automerge

After this workflow has passed on GitHub, make its `cypress` check a required
status check in the branch protection/ruleset for `main`. Also require the
frontend and backend analysis checks so lint, unit, integration and architecture
tests continue to gate dependency updates. Keep Renovate subject to these rules.

For platform automerge, enable **Allow auto-merge** in repository settings. Then
add a package rule to `renovate.json` for the dependencies you want to merge
automatically, for example npm minor/patch updates of packages at version 1+:

```json
{
  "matchManagers": ["npm"],
  "matchUpdateTypes": ["minor", "patch"],
  "matchCurrentVersion": "!/^0/",
  "automerge": true,
  "automergeType": "pr"
}
```

Keep major updates and changes to infrastructure outside this initial scope.
Do not disable status-check enforcement with `ignoreTests` or
`"statusCheckNames": null`. The example is intentionally not activated by this
change. See [Renovate's automerge documentation](https://docs.renovatebot.com/key-concepts/automerge/).
