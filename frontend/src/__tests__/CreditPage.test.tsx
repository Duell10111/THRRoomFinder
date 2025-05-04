import { expect, test } from "vitest"
import { render, screen } from "./test-utils"
import Credits from "@/app/(subpages)/credits/page"
import Layout from "@/app/(subpages)/layout"

test("CreditPage", () => {
    render(
        <Layout>
            <Credits />
        </Layout>
    )
    expect(
        screen.getByRole("heading", { level: 2, name: "Our contributors" })
    ).toBeDefined()
    expect(screen.getByText("Konstantin Späth")).toBeDefined()
})
