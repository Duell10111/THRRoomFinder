import {useMap} from "react-map-gl/maplibre";
import {backendUrl} from "@/utils/const";
import {RoomData} from "@/utils/data";


export default function useRoomInput() {
    const {current} = useMap()

    const jumpToRoom = async (roomName: string) => {
        const room = await getRoom(roomName)
        if(room && current) {
            current.jumpTo({center: [room.location.lat, room.location.lng]})
        }
    }

    const getRoom = async (roomName: string) => {
        const data = await fetch(`${backendUrl}/api/v1/room/${roomName}`)
        if(data.ok) {
            return await data.json() as RoomData;
        } else if(data.status === 404) {
            return undefined;
        } else {
            throw new Error("Could not find room with status code: " + data.status);
        }
    }

    return {jumpToRoom}
}
