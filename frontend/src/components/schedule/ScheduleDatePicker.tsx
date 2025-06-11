import { DatePickerInput } from "@mantine/dates"
import { useRoomContext } from "@/context/RoomContext"

export function ScheduleDatePicker() {
    const { data, setDate } = useRoomContext()

    return (
        <DatePickerInput
            aria-label="Schedule date"
            placeholder="Pick date for scheduling"
            defaultValue={new Date()}
            value={data?.date}
            onChange={(d) => setDate(d ?? undefined)}
        />
    )
}
