import { expect, test } from "vitest"
import { render, screen } from "./test-utils"
import Impressum from "@/sites/Impressum"
import Layout from "@/app/(subpages)/layout"

test("Impressum", () => {
    render(
        <Layout>
            <Impressum />
        </Layout>
    )
    expect(
        screen.getByRole("heading", { level: 1, name: "Impressum" })
    ).toBeDefined()
    expect(
        screen.getByRole("heading", { level: 4, name: "Haftung für Links" })
    ).toBeDefined()
})
