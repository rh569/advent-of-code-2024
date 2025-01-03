import { CountMap } from "../libs/CountMap";
import { makeMessageHandler } from "../libs/worker"

type Pos = [number, number]

interface EdgedPos {
    pos: Pos;
    edges: number; // bit mask, NESW
}

const EDGES = [
    0b1000, // N
    0b0100, // E
    0b0010, // S
    0b0001, // W
]

function part1(input: string) {
    const garden = input.split('\n')
        .map(l => l.split(''));

    const getNextId = makeGetNextId()
    const plantTypeByRegionId = new Map<number, string>();
    const areaByRegionId: CountMap = new CountMap();
    const perimeterByRegionId: CountMap = new CountMap();
    const visitedPlots = new Set<string>();

    for (let i = 0; i < garden.length; i++) {
        for (let j = 0; j < garden[0].length; j++) {
            if (visitedPlots.has(`${i},${j}`)) continue;

            const plantType = garden[i][j]
            const regionId = getNextId()
            plantTypeByRegionId.set(regionId, plantType)
            const toVisit: Pos[] = [[i, j]]

            while (toVisit.length > 0) {
                const checkPos = toVisit.pop() as Pos
                if (visitedPlots.has(`${checkPos}`)) continue;

                areaByRegionId.increment(regionId)

                const likeNeighbours = getInBoundNeighbours(checkPos, garden)
                    .filter(n => garden[n[0]][n[1]] === plantType)
                perimeterByRegionId.increment(regionId, 4 - likeNeighbours.length)

                toVisit.push(...likeNeighbours.filter(n => !visitedPlots.has(`${n[0]},${n[1]}`)))
                visitedPlots.add(`${checkPos[0]},${checkPos[1]}`)
            }
        }
    }

    return Array.from(areaByRegionId.entries()).reduce<number>((acc, [id, area]) => {
        return acc + area * (perimeterByRegionId.get(id) ?? 1)
    }, 0)
}

function part2(input: string) {
    const garden = input.split('\n')
        .map(l => l.split(''));

    const getNextId = makeGetNextId()
    const plantTypeByRegionId = new Map<number, string>();
    const areaByRegionId: CountMap = new CountMap();
    const edgedPlotsByRegionId = new Map<number, EdgedPos[]>();
    const visitedPlots = new Set<string>();

    for (let i = 0; i < garden.length; i++) {
        for (let j = 0; j < garden[0].length; j++) {
            if (visitedPlots.has(`${i},${j}`)) continue;

            const plantType = garden[i][j]
            const regionId = getNextId()
            plantTypeByRegionId.set(regionId, plantType)
            edgedPlotsByRegionId.set(regionId, [])
            const toVisit: Pos[] = [[i, j]]

            while (toVisit.length > 0) {
                const checkPos = toVisit.pop() as Pos
                if (visitedPlots.has(`${checkPos}`)) continue;

                areaByRegionId.increment(regionId)

                const likeNeighbours = getInBoundNeighbours(checkPos, garden)
                    .filter(n => garden[n[0]][n[1]] === plantType)

                const edgeMask = getEdgeMaskOfPlot(checkPos, garden)
                edgedPlotsByRegionId.get(regionId)?.push({
                    pos: checkPos,
                    edges: edgeMask
                })

                toVisit.push(...likeNeighbours.filter(n => !visitedPlots.has(`${n[0]},${n[1]}`)))
                visitedPlots.add(`${checkPos[0]},${checkPos[1]}`)
            }
        }
    }

    return Array.from(areaByRegionId.entries()).reduce<number>((acc, [id, area]) => {
        const nEdges = getRegionEdgeCount(edgedPlotsByRegionId.get(id as number) ?? [])
        return acc + area * nEdges
    }, 0)
}

function makeGetNextId() {
    let id = 1;
    return () => {
        return id++;
    }
}

function getInBoundNeighbours(p: Pos, garden: string[][]): Pos[] {
    const possibleNeighbours: Pos[] = [
        [p[0] - 1, p[1]],
        [p[0], p[1] + 1],
        [p[0] + 1, p[1]],
        [p[0], p[1] - 1],
    ]

    return possibleNeighbours.filter(n =>
        n[0] >= 0 && n[0] < garden.length
        && n[1] >= 0 && n[1] < garden[0].length
    )
}

function getEdgeMaskOfPlot(p: Pos, garden: string[][]): number {
    let mask = 0b000;

    const possibleNeighbours: Pos[] = [
        [p[0] - 1, p[1]],
        [p[0], p[1] + 1],
        [p[0] + 1, p[1]],
        [p[0], p[1] - 1],
    ]

    for (let i = 0; i < 4; i++) {
        const n = possibleNeighbours[i]
        if ((garden[n[0]] ?? [])[n[1]] !== (garden[p[0]] ?? [])[p[1]]) {
            mask = mask | EDGES[i]
        }
    }

    return mask
}

function getRegionEdgeCount(plots: EdgedPos[]): number {
    let count = 0

    for (const e of EDGES) {
        count += countEdge(e, plots)
    }

    return count
}

function countEdge(e: number, plots: EdgedPos[]): number {
    const plotsWithEdge: Pos[] = plots.filter(p => (p.edges & e) === e)
        .map(p => [...p.pos]);

    switch (e) {
        case EDGES[0]:
            return countHorizontalEdges(plotsWithEdge)
        case EDGES[1]:
            return countVerticalEdges(plotsWithEdge)
        case EDGES[2]:
            return countHorizontalEdges(plotsWithEdge)
        default:
            return countVerticalEdges(plotsWithEdge)
    }
}

function countHorizontalEdges(plots: Pos[]): number {
    const byRow: Record<number, number[]> = {}

    for (const p of plots) {
        if (byRow[p[0]] === undefined) {
            byRow[p[0]] = []
        }
        
        byRow[p[0]].push(p[1])
    }

    let distinctEdges = 0
    for (const r of Object.values(byRow)) {
        distinctEdges += getDistinctSequences(r)
    }
    return distinctEdges
}

function countVerticalEdges(plots: Pos[]): number {
    const byCol: Record<number, number[]> = {}

    for (const p of plots) {
        if (byCol[p[1]] === undefined) {
            byCol[p[1]] = []
        }
        
        byCol[p[1]].push(p[0])
    }

    let distinctEdges = 0
    for (const r of Object.values(byCol)) {
        distinctEdges += getDistinctSequences(r)
    }
    return distinctEdges
}

function getDistinctSequences(nums: number[]): number {
    if (nums.length < 2) return 1;

    nums.sort((a, b) => a - b)
    let count = 1

    for (let i = 1; i < nums.length; i++) {
        if (nums[i] - nums[i-1] > 1) count++
    }

    return count
}

onmessage = makeMessageHandler(part1, part2)