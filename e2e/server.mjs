import { createServer } from "node:http"
import { readFileSync } from "node:fs"
import geojsonvt from "geojson-vt"
import vtpbf from "vt-pbf"
import { rooms, polygon } from "./fixtures.mjs"

const glyphs = readFileSync(new URL("./fixtures/0-255.pbf", import.meta.url))
const collection = (features) => ({ type: "FeatureCollection", features })
const feature = (room, geometry) => ({
    type: "Feature",
    properties: {
        ...room,
        "name:latin": room.name,
        "name:nonlatin": "",
        class: "room",
    },
    geometry,
})
const areas = new geojsonvt(
    collection(
        rooms.map((room) =>
            feature(room, {
                type: "Polygon",
                coordinates: [polygon(room)],
            })
        )
    ),
    { maxZoom: 20 }
)
const names = new geojsonvt(
    collection(
        rooms.map((room) =>
            feature(room, {
                type: "Point",
                coordinates: [room.lng, room.lat],
            })
        )
    ),
    { maxZoom: 20 }
)

createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    const url = new URL(req.url, "http://localhost:19090")
    const json = (data) => {
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(data))
    }
    if (url.pathname === "/health") return json({ status: "UP" })
    if (
        url.pathname.startsWith("/fonts/") &&
        url.pathname.endsWith("/0-255.pbf")
    ) {
        res.setHeader("Content-Type", "application/x-protobuf")
        return res.end(glyphs)
    }
    const tile = /^\/tiles\/(\d+)\/(\d+)\/(\d+)\.pbf$/.exec(url.pathname)
    if (tile) {
        const [z, x, y] = tile.slice(1).map(Number)
        const empty = { features: [] }
        res.setHeader("Content-Type", "application/x-protobuf")
        return res.end(
            vtpbf.fromGeojsonVt({
                area: areas.getTile(z, x, y) ?? empty,
                area_name: names.getTile(z, x, y) ?? empty,
            })
        )
    }
    if (req.method === "POST" && url.pathname === "/api/interpreter") {
        let body = ""
        for await (const chunk of req) body += chunk
        const room = rooms.find((room) =>
            body.includes(`"name"="${room.name}"`)
        )
        return json({
            elements: room
                ? [
                      {
                          type: "way",
                          id: 100,
                          nodes: [1, 2, 3, 4, 1],
                          tags: {
                              indoor: "room",
                              name: room.name,
                              level: room.level,
                          },
                      },
                      ...polygon(room)
                          .slice(0, 4)
                          .map(([lon, lat], index) => ({
                              type: "node",
                              id: index + 1,
                              lat,
                              lon,
                          })),
                  ]
                : [],
        })
    }
    if (url.pathname === "/splan/json") {
        switch (url.searchParams.get("m")) {
            case "getpus":
                // Valid regardless of when CI runs; no semester expiry.
                return json([
                    [
                        {
                            id: 1,
                            shortname: "E2E",
                            name: "E2E semester",
                            startdate: "2000-01-01",
                            enddate: "2100-12-31",
                            dateasdefault: true,
                            defaultloc: null,
                            visibleonweb: true,
                        },
                    ],
                ])
            case "getros":
                return json([
                    rooms.map((room, id) => ({
                        id: id + 1,
                        shortname: room.name,
                        name: room.name,
                    })),
                ])
            case "getTT": {
                const date = url.searchParams.get("dfc")
                const room = rooms[Number(url.searchParams.get("ro")) - 1]
                if (!room || !/^\d{4}-\d{2}-\d{2}$/.test(date)) break
                res.setHeader("Content-Type", "text/html;charset=UTF-8")
                return res.end(`<div class="ttweekdaycell" style="left:0px;"><span data-date="${date}"></span></div>
                    <div class="ttevent" style="left:0px;"><div class="tooltip">E2E lecture<br>E2E lecturer<br>Informatik<br>${room.name}<br>10:00-11:00</div></div>`)
            }
        }
    }
    console.error(`Unexpected fixture request: ${req.method} ${req.url}`)
    res.writeHead(404)
    res.end("No fixture for request")
}).listen(19090, "127.0.0.1", () =>
    console.log("E2E fixtures listening on :19090")
)
