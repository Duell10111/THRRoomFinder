// @ts-expect-error maplibre-gl-indoorequal does not have a type definition library
import IndoorEqual from 'maplibre-gl-indoorequal';
import {useControl, useMap} from "react-map-gl/maplibre";

export function IndoorControls() {
    const {current} = useMap();
    useControl(() => new IndoorEqual(current!.getMap(), {
        apiKey: `${process.env.NEXT_PUBLIC_INDOOR_CONTROL_API_KEY}`,
        heatmap: false
    }));

    return null;
}
