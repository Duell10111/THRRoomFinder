# Testing concept

The tests are structured in the following hierarchy:

         UI / E2E Tests     ← Cypress
       Integration Tests    ← SpringBootTest, WebTestClient, Testcontainers
     Unit Tests             ← JUnit5, MockK, Vitest

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

GitHub Actions runs on every commit:
- Linting
- Unit + integration tests

Githun Actions runs on every PR/main branch commit:
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
npx cypress open     # Run E2E tests interactively
```

### 📌 Notes

- External API dependencies are mocked or stubbed during tests to ensure repeatability, using Wiremock.
- Testcontainers are used to spin up real PostgreSQL/PostGIS instances for reliable integration tests.
- Caching layers are tested for hit/miss logic and manual invalidation.
