"use client"

import Map, {FullscreenControl} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import 'maplibre-gl-indoorequal/maplibre-gl-indoorequal.css';
import {IndoorControls} from "@/components/IndoorControls";
import {RoomClicker} from "@/components/RoomClicker";

export function CampusMap() {
    return (
        <Map
            initialViewState={{
                longitude: 12.107220832011787,
                latitude: 47.86746398383466,
                zoom: 18
            }}
            style={{width: 1200, height: 700}}
            // mapStyle="https://s3.amazonaws.com/cdn.brianbancroft.io/assets/osmstyle.json"
            mapStyle={`https://api.maptiler.com/maps/openstreetmap/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
            // mapStyle="https://demotiles.maplibre.org/style.json"
            // onClick={console.log}
            // onContextMenu={console.log}
            // interactiveLayerIds={["indoor-polygon"]}
        >
            <IndoorControls />
            <RoomClicker />
            <FullscreenControl />
        </Map>
    );
}
