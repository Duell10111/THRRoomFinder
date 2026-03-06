import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/ical
 *
 * Proxy endpoint that forwards iCal requests to the backend.
 * The `url` query parameter should contain a Base64-encoded iCal URL.
 *
 * @param request - The incoming request with the Base64-encoded URL
 * @returns The proxied response from the backend or an error response
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const encodedUrl = searchParams.get("iCalUrl")

        if (!encodedUrl) {
            return NextResponse.json(
                { error: "Missing iCalUrl parameter" },
                { status: 400 }
            )
        }

        // Get the backend URL from environment variables
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

        // Forward the request to the backend
        const backendResponse = await fetch(
            `${backendUrl}/api/v1/calendar/?iCalUrl=${encodedUrl}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "text/calendar",
                    ...Object.fromEntries(
                        request.headers.entries()
                    ),
                },
            }
        )

        if (!backendResponse.ok) {
            return NextResponse.json(
                { error: `Backend error: ${backendResponse.statusText}` },
                { status: backendResponse.status }
            )
        }

        // Get the response data
        const data = await backendResponse.text()

        // Return the iCal data with appropriate headers
        return new NextResponse(data, {
            status: 200,
            headers: {
                "Content-Type": "text/calendar; charset=utf-8",
                "Content-Disposition": "inline; filename=calendar.ics",
                "Cache-Control": "no-cache, no-store, must-revalidate",
            },
        })
    } catch (error) {
        console.error("iCal proxy error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

