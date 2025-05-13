import {
    Combobox,
    ComboboxDropdown,
    ComboboxGroup,
    ComboboxOption,
    ComboboxOptions,
    ComboboxTarget,
    InputBase,
    useCombobox,
} from "@mantine/core"
import { useState } from "react"
import useAllRooms from "@/hooks/useAllRooms"

interface AutocompleteSubmitProps {
    label?: string
    placeholder?: string
    onSubmit: (value: string) => void
}

export function AutocompleteSubmit({
    label,
    placeholder,
    onSubmit,
}: AutocompleteSubmitProps) {
    const roomData = useAllRooms()

    const [data, setData] = useState<string[]>([])
    const [value, setValue] = useState("")
    const combobox = useCombobox()

    const filteredData = data.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
    )

    // console.log(roomData)

    const handleOptionSubmit = (val: string) => {
        // wenn der Wert nicht existiert, fügen wir ihn hinzu
        if (!data.includes(val)) {
            setData((prev) => [...prev, val])
        }
        setValue(val)
        combobox.closeDropdown()
        onSubmit?.(val)
    }

    return (
        <Combobox store={combobox} onOptionSubmit={handleOptionSubmit}>
            <ComboboxTarget>
                <InputBase
                    label={label}
                    placeholder={placeholder}
                    value={value}
                    onChange={(event) => {
                        setValue(event.currentTarget.value)
                        combobox.openDropdown()
                    }}
                    onClick={() => combobox.openDropdown()}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault()
                            handleOptionSubmit(value)
                        }
                    }}
                />
            </ComboboxTarget>

            <ComboboxDropdown>
                {filteredData.map((item) => (
                    <ComboboxOption key={item} value={item}>
                        {item}
                    </ComboboxOption>
                ))}
                <ComboboxOptions>
                    {Object.entries(roomData).map(([key, value]) => (
                        <ComboboxGroup key={key} label={`Building ${key}`}>
                            {value.map((item) => (
                                <ComboboxOption
                                    key={item.name}
                                    value={item.name}
                                >
                                    {item.name}
                                </ComboboxOption>
                            ))}
                        </ComboboxGroup>
                    ))}
                </ComboboxOptions>
            </ComboboxDropdown>
        </Combobox>
    )
}
