export const frontendEnv = {
    ...process.env,
    NEXT_PUBLIC_TEST_ENV: "true",
    NEXT_PUBLIC_BACKEND_URL: "http://localhost:18080",
    NEXT_PUBLIC_FIREBASE_API_KEY: "e2e-api-key",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: "demo-roomfinder",
    NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL: "http://localhost:19099",
    NEXT_PUBLIC_INDOOR_CONTROL_API_KEY: "e2e-api-key",
    NEXT_PUBLIC_MAPTILER_API_KEY: "e2e-api-key",
}
