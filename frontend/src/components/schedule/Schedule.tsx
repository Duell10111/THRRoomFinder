import {ScheduleData} from "@/utils/data";
import {format, isSameDay, parseISO} from "date-fns";
import {Box, Paper, Stack, Text} from "@mantine/core";

interface ScheduleProps {
    date: Date;
    schedule: ScheduleData[];
}

const getHour = (date: string) => new Date(date).getHours();

export function Schedule({date, schedule}: ScheduleProps) {
    const filteredSchedule = schedule
        .filter((item) => isSameDay(parseISO(item.startTime), date))
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    // TODO: Make dynamic?
    const hours = Array.from({ length: 11 }, (_, i) => 8 + i); // 8:00 to 18:00

    return (
        <Box
            p="md"
            style={{
                backgroundColor: "#1a1a1a",
                borderRadius: "10px",
                border: "1px solid #333",
                width: "100%",
            }}
        >
            <Text size="xl" fw={700} ta="center" mb="xs" c="gray.0">
                {format(date, "EEEE")}
            </Text>
            <Text size="md" ta="center" mb="md" c="gray.4">
                {format(date, "dd.MM.yyyy")}
            </Text>

            <Stack gap={"sm"}>
                {hours.map((hour) => {
                    const items = filteredSchedule.filter((item) => getHour(item.startTime) === hour);
                    return (
                        <Box key={hour}>
                            <Text size="xs" c="gray.5" mb={2}>
                                {hour}:00
                            </Text>
                            {items.map((item, idx) => (
                                <Paper
                                    key={idx}
                                    p="xs"
                                    radius="md"
                                    withBorder
                                    style={{
                                        backgroundColor: idx % 2 === 0 ? "#5a4500" : "#004733",
                                        color: "white",
                                    }}
                                >
                                    <Text size="sm" fw={700}>
                                        {item.room}
                                    </Text>
                                    <Text size="sm">{item.name}</Text>
                                    <Text size="xs" c="gray.3" fw={500}>
                                        {item.lecturer}
                                    </Text>
                                    <Text size="xs" c="gray.5">
                                        {item.relevantDegrees}
                                    </Text>
                                    <Text size="xs" c="gray.4" mt={4}>
                                        {format(parseISO(item.startTime), "HH:mm")} –{" "}
                                        {format(parseISO(item.endTime), "HH:mm")}
                                    </Text>
                                </Paper>
                            ))}
                        </Box>
                    );
                })}
            </Stack>
        </Box>
    );
}
