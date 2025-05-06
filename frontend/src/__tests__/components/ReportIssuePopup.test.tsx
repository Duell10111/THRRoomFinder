import { expect, test } from "vitest"
import { render, screen, fireEvent } from "../test-utils"
import { ReportIssuePopupNavBarItem } from "@/components/ReportIssuePopup"

test("ReportIssuePopup", () => {
    render(<ReportIssuePopupNavBarItem />)
    const navLink = screen.getByTestId(
        "nav-link-report-issue-popup-nav-bar-item"
    )
    expect(navLink).toBeDefined()
    fireEvent.click(navLink)
    // expect(screen.getByText("Found Issue?")).toBeDefined()
})
