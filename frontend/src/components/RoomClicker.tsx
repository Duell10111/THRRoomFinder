import {Popup, useMap} from "react-map-gl/maplibre";
import {useEffect, useState} from "react";
import {booleanPointInPolygon} from "@turf/turf"

export function RoomClicker() {
    const {current} = useMap();
    const [popup, setPopup] = useState<{lat: number, long: number}>();
    const [name, setName] = useState<string>();

    useEffect(() => {
        const map = current?.getMap();
        if(map) {
            map.on('click', "indoor-polygon", (e) => {
                // Fetch room name
                const geometry = e.features?.[0]?.geometry;
                if(geometry && geometry.type === "Polygon") {
                    const nameFeatures = map.queryRenderedFeatures({layers: ['indoor-name']});
                    const roomName = nameFeatures.find(f => {
                        if(f.geometry.type === "Point") {
                            return booleanPointInPolygon(f.geometry, geometry);
                        }
                        // Ignore non compatible geometry
                        return false;
                    });
                    console.log("Room Name: ", roomName);
                    if(roomName) {
                        setPopup({lat: e.lngLat.lat, long: e.lngLat.lng});
                        setName(roomName?.properties.name);
                    }
                }
                console.log(map.getLayer("indoor-name"))
            })
        }
    }, [current]);

    return (
        <>
            {popup ? (
                <Popup latitude={popup.lat} longitude={popup.long} onClose={() => setPopup(undefined)}>{name}</Popup>
            ) : null}
        </>
    );
}
