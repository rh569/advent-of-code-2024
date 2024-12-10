import { makeMessageHandler } from "../libs/worker"

type Pos = [number, number]

function part1(input: string) {
    const topology: number[][] = input.split('\n')
        .map(l => l.split('').map(Number))

    let trailheadsScore = 0

    for (let i = 0; i < topology.length; i++) {
        for (let j = 0; j < topology[0].length; j++) {
            if (topology[i][j] !== 0) continue;
            trailheadsScore += getTrailheadScore([i, j], topology)
        }
    }

    return trailheadsScore
}

function part2(input: string) {
    const topology: number[][] = input.split('\n')
        .map(l => l.split('').map(Number))

    let trailheadsRating = 0

    for (let i = 0; i < topology.length; i++) {
        for (let j = 0; j < topology[0].length; j++) {
            if (topology[i][j] !== 0) continue;
            const rating = getTrailheadRating([i, j], topology)
            trailheadsRating += rating
        }
    }

    return trailheadsRating
}

function getTrailheadScore(trailheadPos: Pos, topology: number[][]): number {
    const checkedPositions = new Set<string>()
    const positionsToCheck = [trailheadPos]

    while (positionsToCheck.length > 0) {
        const pos = positionsToCheck.pop() as Pos
        const unvistedNeighbours = getNeighbours(pos, topology.length)
            .filter(p => !checkedPositions.has(`${p}`))

        const tileHeight = topology[pos[0]][pos[1]]

        for (const [ni, nj] of unvistedNeighbours) {
            const height = topology[ni][nj]

            if (height === tileHeight + 1) {
                positionsToCheck.push([ni, nj])
            }
        }

        checkedPositions.add(`${pos}`)
    }

    return Array.from(checkedPositions)
        .map(s => s.split(',').map(Number))
        .filter(([i, j]) => topology[i][j] === 9).length
}

function getTrailheadRating(trailheadPos: Pos, topology: number[][]): number {
    // note trail head !== trailhead
    const distinctTrailHeads: Pos[] = [trailheadPos]
    let distinctNines = 0

    while (distinctTrailHeads.length > 0) {
        const trailHead = distinctTrailHeads.pop() as Pos
        const neighbours = getNeighbours(trailHead, topology.length)

        const trailHeadHeight = topology[trailHead[0]][trailHead[1]]

        for (const [ni, nj] of neighbours) {
            const height = topology[ni][nj]

            if (height === trailHeadHeight + 1) {
                if (height === 9) {
                    distinctNines++
                } else {
                    distinctTrailHeads.push([ni, nj])
                }
            }
        }
    }

    return distinctNines
}

function getNeighbours(pos: Pos, max: number): Pos[] {
    const [pi, pj] = pos
    const neighbours: Pos[] = [
        [pi - 1, pj],
        [pi, pj + 1],
        [pi + 1, pj],
        [pi, pj - 1],
    ]

    return neighbours.filter(([i, j]) => i >= 0 && i < max && j >= 0 && j < max)
}

onmessage = makeMessageHandler(part1, part2)