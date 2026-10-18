import { spawnSync } from "node:child_process"
import { cpSync } from "node:fs"
import { frontendEnv } from "./env.mjs"

const result = spawnSync("npm", ["run", "build"], {
    cwd: new URL("../frontend", import.meta.url),
    env: frontendEnv,
    stdio: "inherit",
})
if (result.status !== 0) process.exit(result.status ?? 1)

// Match the production Docker image: serve the standalone output with its assets.
const frontend = new URL("../frontend/", import.meta.url)
cpSync(
    new URL("public", frontend),
    new URL(".next-e2e/standalone/public", frontend),
    { recursive: true }
)
cpSync(
    new URL(".next-e2e/static", frontend),
    new URL(".next-e2e/standalone/.next-e2e/static", frontend),
    { recursive: true }
)
