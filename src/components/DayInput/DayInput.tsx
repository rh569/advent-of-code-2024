import { ChangeEvent, MutableRefObject, useEffect, useRef, useState } from "react"
import { DayDefinition } from "../../days"
import { MessageType } from "../../libs/constants"

import './styles.css'
import { useSelectedDay } from "./useSelectedDay"


type DayInputProps = {
    days: DayDefinition[]
}

enum State {
    INITIAL,
    HAS_INPUT,
    WORKING,
    HAS_ANSWER
}

export function DayInput({ days }: DayInputProps) {
    const [state, setState] = useState(State.INITIAL)
    const [selectedDay, setSelectedDay] = useSelectedDay()
    const [answer, setAnswer] = useState<string | null>(null)
    const [inputData, setInputData] = useState<string>('')
    const workerRef = useRef<Worker | null>(null)

    const handleAnswer = (answer: string) => {
        setAnswer(answer)
        setState(State.HAS_ANSWER)
    }

    useEffect(() => {
        const dayDef = days.find((d) => d.num === selectedDay)

        if (dayDef !== undefined) {
            initializeWorker(workerRef, handleAnswer, dayDef)
        }
    }, [selectedDay, days])

    const handleInputData = ((e: ChangeEvent<HTMLTextAreaElement>) => {
        setInputData(e.target.value)

        if (e.target.value) {
            setState(State.HAS_INPUT)
        }
    })

    const handleSubmit = (part: "one" | "two") => {
        if (workerRef.current === null) {
            throw Error("Worker not initialised")
        }

        const type = part === "one" ? MessageType.PART_ONE_INPUT : MessageType.PART_TWO_INPUT

        workerRef.current.postMessage({
            type,
            input: inputData
        })
        setState(State.WORKING)
    }

    return (
        <form className="container" onSubmit={(e) => e.preventDefault()}>
            <select value={selectedDay} onChange={(e) => { setSelectedDay(Number(e.target.value)) }}>
                {days.map((day) =>
                    <option key={day.modulePath} value={day.num}>{day.num} - {day.title}</option>
                )}
            </select>

            <textarea rows={10} placeholder="Paste input here..." value={inputData} onChange={handleInputData} disabled={state === State.WORKING} />

            <button type='button' onClick={() => handleSubmit("one")} disabled={!inputData}>Run Part One</button>
            <button type='button' onClick={() => handleSubmit("two")} disabled={!inputData}>Run Part Two</button>

            {state === State.WORKING ? <div>Working ...</div> : null}
            {state === State.HAS_ANSWER ? <div>{answer}</div> : null}
        </form>
    )
}

function initializeWorker(workerRef: MutableRefObject<Worker | null>, handleAnswer: (a: string) => void, day: DayDefinition) {
    if (workerRef.current) {
        workerRef.current.terminate()
    }

    workerRef.current = new Worker(day.modulePath, { type: "module" })
    workerRef.current.onmessage = (e: MessageEvent) => {
        if (e.data.type === "answer") {
            handleAnswer(e.data.result)
        }
    }
}
