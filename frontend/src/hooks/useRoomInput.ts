import {useMap} from "react-map-gl/maplibre";
import {getRoom} from "@/utils/data";
import {useRoomContext} from "@/context/RoomContext";


export default function useRoomInput() {
    const {campus} = useMap()
    const {setRoomData} = useRoomContext()

    // TODO: Get list of already known rooms

    const jumpToRoom = async (roomName: string) => {
        const room = await getRoom(roomName)
        if(room && campus) {
            console.log(room)
            setRoomData(room)
            campus.flyTo({center: [room.location.lng, room.location.lat], zoom: 20})
        } else {
            console.warn("No map available")
        }

    }

    return {jumpToRoom}
}
