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
    const pebbles: number[] = input.split(' ').map(Number);

    const nextByValue = new Map<number, number[]>()
    let countPerValue = new Map<number, number>()

    for (const p of pebbles) {
        countPerValue.set(p, (countPerValue.get(p) ?? 0) + 1)
    }

    for (let i = 0; i < 75; i++) {
        const blinkSet = Array.from(countPerValue.entries())
        const newCountPerValue = new Map<number, number>()

        for (const [v, c] of blinkSet) {
            if (c === 0) continue;

            const next = nextByValue.get(v) ?? getNext(v)

            if (!nextByValue.has(v)) {
                nextByValue.set(v, next)
            }

            const [nextA, nextB] = next
            newCountPerValue.set(nextA,
                (newCountPerValue.get(nextA) ?? 0)
                + c
            )

            if (nextB !== undefined) {
                newCountPerValue.set(nextB,
                    (newCountPerValue.get(nextB) ?? 0)
                    + c
                )
            }
        }

        countPerValue = newCountPerValue
    }

    return Array.from(countPerValue.values()).reduce((acc, curr) => acc + curr)
}

function getNext(p: number): number[] {
    if (p === 0) {
        return [1];
    } else if (`${p}`.length % 2 === 0) {
        const valueString = `${p}`
        return [
            Number(valueString.slice(0, valueString.length / 2)),
            Number(valueString.slice(valueString.length / 2))
        ];
    } else {
        return [p *= 2024]
    }
}

function blinkN(pebbles: Pebble[], n = 25): void {
    for (let i = 0; i < n; i++) {
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