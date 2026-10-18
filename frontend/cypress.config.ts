import { defineConfig } from "cypress"

export default defineConfig({
    viewportWidth: 1440,
    viewportHeight: 900,
    defaultCommandTimeout: 10000,
    video: true,
    // A flaky run must fail the merge check, rather than pass on a retry.
    retries: 0,

    e2e: {
        baseUrl: "http://localhost:3100",
        setupNodeEvents(on) {
            on("before:browser:launch", (browser, launchOptions) => {
                if (browser.family === "chromium") {
                    launchOptions.args.push("--enable-unsafe-swiftshader")
                }
                return launchOptions
            })
        },
    },

    component: {
        devServer: {
            framework: "next",
            bundler: "webpack",
        },
    },
})
