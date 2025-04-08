import {useEffect, useState} from "react";
import {getAllRooms, SimpleRoomData} from "@/utils/data";


export default function useAllRooms() {
    const [rooms, setRooms] = useState<SimpleRoomData[]>([]);

    useEffect(() => {
        getAllRooms().then(setRooms).catch(console.error);
    }, [])

    return rooms;
}
