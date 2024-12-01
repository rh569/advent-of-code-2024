import { makeMessageHandler } from "../libs/worker"

function part1(input: string) {
    const [a, b] = input.split('\n')
        .map(l => l.split(/\s+/))
        .reduce<[number[], number[]]>((acc, curr) => {
            acc[0].push(Number(curr[0]))
            acc[1].push(Number(curr[1]))

            return acc
        }, [[], []])

    a.sort()
    b.sort()

    return a.reduce((acc, curr, idx) => {
        const diff = Math.abs(curr - b[idx])
        return acc + diff
    }, 0)
}

function part2(input: string) {
    const lines = input.split('\n')
        .map(l => l.split(/\s+/))

    const a: number[] = []
    const b: Record<number, number> = {}

    for (const l of lines) {
        const aNum = Number(l[0])
        const bNum = Number(l[1])

        a.push(aNum)

        if (bNum in b) {
            b[bNum]++
        } else {
            b[bNum] = 1
        }
    }

    return a.reduce((acc, curr) => {
        const similarityIncrease = curr * (b[curr] ?? 0)

        return acc + similarityIncrease
    }, 0)
}

onmessage = makeMessageHandler(part1, part2)