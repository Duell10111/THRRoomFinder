import { expect } from "vitest"
import { render } from "../../test-utils"
import { CampusMap } from "@/components/map/CampusMap"

describe("CampusMap", () => {
    it("Init", () => {
        const { container } = render(<CampusMap />)
        const element = container.querySelector("#campus")
        expect(element).toBeDefined()
    })
})
