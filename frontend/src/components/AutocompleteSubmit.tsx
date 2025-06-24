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

/**
 * Props for the AutocompleteSubmit component.
 *
 * @property label - Optional label for the input field.
 * @property placeholder - Optional placeholder text for the input.
 * @property onSubmit - Callback invoked when a value is submitted (either selected or entered manually).
 */
interface AutocompleteSubmitProps {
    label?: string
    placeholder?: string
    onSubmit: (value: string) => void
}

/**
 * A controlled autocomplete input with grouped room suggestions from useAllRooms.
 *
 * Users can select an existing room or enter a new value manually.
 * Matching entries are filtered case-insensitively.
 *
 * @param props - Component props including label, placeholder, and onSubmit callback.
 * @returns A JSX element that renders the combobox input with dynamic suggestions.
 */
export function AutocompleteSubmit({
    label,
    placeholder,
    onSubmit,
}: Readonly<AutocompleteSubmitProps>) {
    const roomData = useAllRooms()

    const [data, setData] = useState<string[]>([])
    const [value, setValue] = useState("")
    const combobox = useCombobox()

    const filteredData = data.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
    )

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
                    data-testid={"autocomplete-input"}
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
