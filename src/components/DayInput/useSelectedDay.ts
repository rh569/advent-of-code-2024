import { Dispatch, SetStateAction, useState } from "react";

const SELECTED_DAY_KEY = "selected-day"

export function useSelectedDay(): [number, Dispatch<SetStateAction<number>>] {
    const defaultDay = 1
    const sessionDay = getSessionDay()

    const [selectedDay, setSelectedDay] = useState<number>(sessionDay ?? defaultDay)

    return [selectedDay, makeSessionSetState(setSelectedDay)]
}

function getSessionDay(): number | null {
    try {
        const sessionValue = window.sessionStorage.getItem(SELECTED_DAY_KEY)
        if (sessionValue !== null) return Number(sessionValue)
    } catch (err) {
        console.error('Failed to retrieve selected day from session storage', err)
    }

    return null
}

function makeSessionSetState(originalSetState: Dispatch<SetStateAction<number>>): Dispatch<SetStateAction<number>> {
    return (value: SetStateAction<number>) => {
        try {
            if (typeof value !== "function") {
                window.sessionStorage.setItem(SELECTED_DAY_KEY, `${value}`)
            }
        } catch (err) {
            console.error('Failed to set selected day in session storage', err)
        }

        return originalSetState(value)
    }
}