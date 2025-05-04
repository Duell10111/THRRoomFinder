import { expect, test } from "vitest"
import { render, screen } from "./test-utils"
import Layout from "@/app/(subpages)/layout"
import ImpressumPage from "@/app/(subpages)/impressum/page"

test("Impressum", () => {
    render(
        <Layout>
            <ImpressumPage />
        </Layout>
    )
    expect(
        screen.getByRole("heading", { level: 1, name: "Impressum" })
    ).toBeDefined()
    expect(
        screen.getByRole("heading", { level: 4, name: "Haftung für Links" })
    ).toBeDefined()
})
