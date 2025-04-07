"use client"

import Map, {FullscreenControl} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import 'maplibre-gl-indoorequal/maplibre-gl-indoorequal.css';
import {IndoorControls} from "@/components/IndoorControls";
import {RoomClicker} from "@/components/RoomClicker";

import './map.css'

const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

export function CampusMap() {
    return (
        <Map
            // TODO: Add map bounds to only allow RO locations
            initialViewState={{
                longitude: 12.107220832011787,
                latitude: 47.86746398383466,
                zoom: 18
            }}
            style={{width: '100%', height: '100%'}}
            // style={{width:'100%', height:'100%'}}
            // mapStyle={"https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/openStreetMap.json"}
            mapStyle={isDarkMode ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" : `https://api.maptiler.com/maps/openstreetmap/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
            // mapStyle={`https://api.maptiler.com/maps/openstreetmap/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
            // onClick={console.log}
            // onContextMenu={console.log}
            // interactiveLayerIds={["indoor-polygon"]}
            attributionControl={{compact: true}}
        >
            <IndoorControls />
            <RoomClicker />
            <FullscreenControl />
        </Map>
    );
}
