import { MessageType } from "./constants";

type PartFunction = (input: string) => string | number

export function makeMessageHandler(part1Fn: PartFunction, part2Fn: PartFunction) {
    return onmessage = ((e: MessageEvent) => {
        const result = getResult(e.data.type, e.data.input, part1Fn, part2Fn)

        postMessage({
            type: "answer",
            result,
        })
    })
}

function getResult(type: string, input: string, part1Fn: PartFunction, part2Fn: PartFunction): string | number {
    if (type === MessageType.PART_ONE_INPUT) {
        return part1Fn(input ?? "")
    }

    if (type === MessageType.PART_TWO_INPUT) {
        return part2Fn(input ?? "")
    }

    throw new Error(`Unhandled message type: ${type}`)
}


