import { makeMessageHandler } from "../libs/worker"

type Pebble = {
    value: number
    next: Pebble | null
}

function part1(input: string) {
    const pebbles: Pebble[] = input.split(' ').map(Number).map((v) => ({
        value: v,
        next: null
    } as Pebble)).map((p, i, arr) => {
        p.next = arr[i + 1] ?? null
        return p
    })

    blinkN(pebbles, 25);
    listPebbles(pebbles[0])

    return pebbles.length
}

function part2(input: string) {
    return input.length
}

function blinkN(pebbles: Pebble[], n = 25): void {
    for (let i =  0; i < n; i++) {
        blink(pebbles)
    }
}

function blink(pebbles: Pebble[]): void {
    const stonesToSplit = []

    for (const p of pebbles) {
        if (p.value === 0) {
            p.value = 1;
        } else if (`${p.value}`.length % 2 === 0) {
            stonesToSplit.push(p);
        } else {
            p.value *= 2024
        }
    }

    for (const s of stonesToSplit) {
        const valueString = `${s.value}`
        s.value = Number(valueString.slice(0, valueString.length / 2))

        const newPebble: Pebble = {
            value: Number(valueString.slice(valueString.length / 2)),
            next: s.next
        }

        
        s.next = newPebble
        pebbles.push(newPebble)
    }
}

function listPebbles(p: Pebble | null): void {
    const orderedPebbles: Pebble[] = [];

    while (p !== null) {
        orderedPebbles.push(p)
        p = p.next
    }

    console.log(orderedPebbles.map(p => p.value).join(' '))
}

onmessage = makeMessageHandler(part1, part2)