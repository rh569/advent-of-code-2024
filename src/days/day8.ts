import { makeMessageHandler } from "../libs/worker"

type Pos = [number, number]
type Vec = Pos

function part1(input: string) {
    const map = input.split('\n')
        .map(l => l.split(''))

    const positionsByFreq = getPositionsByFreq(map)
    const antinodesByFreq = getAntinodesByFreq(positionsByFreq)

    const uniqueAntinodes = new Set<string>()

    for (const [, antinodes] of antinodesByFreq) {
        for (const antinode of antinodes) {
            if (isInRange(antinode, map)) {
                uniqueAntinodes.add(`${antinode}`)
            }
        }
    }

    return uniqueAntinodes.size
}

function part2(input: string) {
    return input.length
}

function getPositionsByFreq(map: string[][]): Map<string, Pos[]> {
    const positionsByFreq = new Map<string, Pos[]>()

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            const f = map[i][j]
            if (f === '.') continue;
            if (!positionsByFreq.has(f)) {
                positionsByFreq.set(f, [[i, j]])
            } else {
                positionsByFreq.set(f,
                    [...(positionsByFreq.get(f) ?? []), [i, j]]
                )
            }
        }
    }

    return positionsByFreq
}

function getAntinodesByFreq(positionsByFreq: Map<string, Pos[]>): Map<string, Pos[]> {
    const antinodesByFreq = new Map<string, Pos[]>()

    for (const [f, positions] of positionsByFreq) {
        for (let i = 0; i < positions.length - 1; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                const [au, av] = positions[i]
                const [bu, bv] = positions[j]
                const distance: Vec = [au - bu, av - bv]
                const antinodes: Pos[] = [
                    [au + distance[0], av + distance[1]],
                    [bu - distance[0], bv - distance[1]]
                ]

                if (!antinodesByFreq.has(f)) {
                    antinodesByFreq.set(f, antinodes)
                } else {
                    antinodesByFreq.set(f,
                        [
                            ...(antinodesByFreq.get(f) ?? []),
                            ...antinodes
                        ]
                    )
                }
            }
        }
    }

    return antinodesByFreq
}

function isInRange(pos: Pos, map: string[][]): boolean {
    return pos[0] >= 0 && pos[0] < map.length
        && pos[1] >= 0 && pos[1] < map[0].length
}

onmessage = makeMessageHandler(part1, part2)