import { defineConfig } from "cypress"

export default defineConfig({
    projectId: "2zo3t1",

    e2e: {
        setupNodeEvents() {},
    },

    component: {
        devServer: {
            framework: "next",
            bundler: "webpack",
        },
    },
})
