import { spawn } from "node:child_process"
import { mkdirSync, openSync, readdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { frontendEnv } from "./env.mjs"

const root = fileURLToPath(new URL("../", import.meta.url))
const cwd = fileURLToPath(new URL("./", import.meta.url))
const processes = []
mkdirSync(`${cwd}/logs`, { recursive: true })

function start(name, command, args, options = {}) {
    const log = openSync(`${cwd}/logs/${name}.log`, "w")
    const child = spawn(command, args, {
        cwd,
        env: process.env,
        detached: true,
        stdio: ["ignore", log, log],
        ...options,
    })
    child.on("error", (error) => console.error(`${name}:`, error))
    processes.push({ name, child })
    return child
}

function cleanup() {
    for (const { child } of processes.reverse()) {
        if (child.pid) {
            try {
                process.kill(-child.pid, "SIGTERM")
            } catch {
                /* Already exited. */
            }
        }
    }
}
process.on("SIGINT", () => {
    cleanup()
    process.exit(130)
})
process.on("SIGTERM", () => {
    cleanup()
    process.exit(143)
})

async function waitFor(url) {
    const deadline = Date.now() + 120_000
    while (Date.now() < deadline) {
        const stopped = processes.find(({ child }) => child.exitCode !== null)
        if (stopped)
            throw new Error(
                `${stopped.name} exited; see e2e/logs/${stopped.name}.log`
            )
        try {
            const response = await fetch(url, {
                signal: AbortSignal.timeout(2000),
            })
            if (response.ok) return
        } catch {
            /* Service is still starting. */
        }
        await new Promise((resolve) => setTimeout(resolve, 500))
    }
    throw new Error(`Timed out waiting for ${url}; see e2e/logs/`)
}

try {
    // Refuse to run against an existing developer stack: tests delete room data.
    for (const port of [3100, 18080, 19090, 19099]) {
        const { createConnection } = await import("node:net")
        const occupied = await new Promise((resolve) => {
            const socket = createConnection({ host: "127.0.0.1", port })
            socket.setTimeout(500)
            socket.on("connect", () => {
                socket.destroy()
                resolve(true)
            })
            socket.on("error", () => resolve(false))
            socket.on("timeout", () => {
                socket.destroy()
                resolve(false)
            })
        })
        if (occupied)
            throw new Error(
                `Port ${port} is already in use; stop that service before running E2E tests`
            )
    }
    const jar = readdirSync(`${root}/roomfinder-backend/build/libs`).find(
        (name) => name.endsWith(".jar") && !name.endsWith("-plain.jar")
    )
    if (!jar)
        throw new Error(
            "Build the backend first: cd roomfinder-backend && ./gradlew bootJar"
        )
    start("fixtures", process.execPath, ["server.mjs"])
    start("auth", process.execPath, [
        "node_modules/firebase-tools/lib/bin/firebase.js",
        "emulators:start",
        "--only",
        "auth",
        "--project",
        "demo-roomfinder",
        "--config",
        "firebase.json",
    ])
    start(
        "backend",
        "java",
        [
            "-jar",
            `${root}/roomfinder-backend/build/libs/${jar}`,
            "--server.port=18080",
            "--room-finder.cors.allowed-origins=http://localhost:3100",
            "--room-finder.osm.over-pass-url=http://localhost:19090/api/interpreter",
            "--room-finder.splan.url=http://localhost:19090/splan/json",
        ],
        {
            env: {
                ...process.env,
                SPRING_PROFILES_ACTIVE: "local,no-auth",
                SPRING_R2DBC_URL:
                    "r2dbc:postgresql://localhost:5433/roomFinderDB",
                SPRING_FLYWAY_URL:
                    "jdbc:postgresql://localhost:5433/roomFinderDB",
            },
        }
    )
    start("frontend", process.execPath, [".next-e2e/standalone/server.js"], {
        cwd: `${root}/frontend`,
        env: { ...frontendEnv, PORT: "3100", HOSTNAME: "127.0.0.1" },
    })
    await Promise.all([
        waitFor("http://localhost:19090/health"),
        waitFor("http://localhost:19099/"),
        waitFor("http://localhost:18080/actuator/health"),
        waitFor("http://localhost:3100"),
    ])
    const repeat = Number(process.env.E2E_REPEAT ?? 1)
    if (!Number.isInteger(repeat) || repeat < 1)
        throw new Error("E2E_REPEAT must be a positive integer")
    for (let run = 1; run <= repeat; run++) {
        console.log(`E2E run ${run}/${repeat}`)
        const child = spawn(
            process.execPath,
            [
                `${root}/frontend/node_modules/cypress/bin/cypress`,
                "run",
                "--browser",
                process.env.E2E_BROWSER ?? "chrome",
                "--config",
                `screenshotsFolder=cypress/screenshots/run-${run},videosFolder=cypress/videos/run-${run}`,
            ],
            {
                cwd: `${root}/frontend`,
                stdio: "inherit",
                detached: true,
                env: process.env,
            }
        )
        processes.push({ name: "cypress", child })
        const status = await new Promise((resolve, reject) => {
            child.on("error", reject)
            child.on("exit", (code) => resolve(code ?? 1))
        })
        processes.pop()
        if (status !== 0) {
            process.exitCode = status
            break
        }
    }
} catch (error) {
    console.error(error)
    process.exitCode = 1
} finally {
    cleanup()
}
