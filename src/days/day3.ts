import { makeMessageHandler } from "../libs/worker"

function part1(input: string) {
    return computeMuls(input)
}

function part2(input: string) {
    const parts = input.split('do()')
        .map(section => section.split("don't()").shift() ?? "")

    return parts.reduce((acc, curr) => acc + computeMuls(curr), 0)
}

function computeMuls(s: string): number {
    const matches = s.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g);

    return Array.from(matches).reduce((acc, curr) => (
        acc + (Number(curr.pop()) * Number(curr.pop()))
    ), 0)
}

onmessage = makeMessageHandler(part1, part2)