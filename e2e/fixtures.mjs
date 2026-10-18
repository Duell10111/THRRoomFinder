// Synthetic campus rooms shared by the Overpass and vector tile fixtures.
export const rooms = [
    { name: "A0.04", level: "0", lng: 12.10722, lat: 47.86746 },
    { name: "A5.04", level: "5", lng: 12.10722, lat: 47.86746 },
    { name: "A5.00", level: "5", lng: 12.10765, lat: 47.86746 },
]

export function polygon(room) {
    const { lng, lat } = room
    return [
        [lng - 0.00014, lat - 0.00007],
        [lng + 0.00014, lat - 0.00007],
        [lng + 0.00014, lat + 0.00007],
        [lng - 0.00014, lat + 0.00007],
        [lng - 0.00014, lat - 0.00007],
    ]
}
