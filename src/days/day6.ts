import { makeMessageHandler } from "../libs/worker"

type Pos = [number, number]
const DIR_ORDER = ['up', 'right', 'down', 'left']

function part1(input: string) {
    const [guardPos, obstaclePos, grid] = parseInput(input)

    const visited = simulateGuard(guardPos, obstaclePos, grid[0].length)
    logGrid(grid, visited)

    return visited.size
}

function part2(input: string) {
    const [guardPos, obstaclePos, grid] = parseInput(input)

    const visited = simulateGuard(guardPos, obstaclePos, grid[0].length)
    visited.delete(`${guardPos}`)

    let loopVariantCount = 0

    for (const vPosStr of visited) {
        // loop over all visited points bar the start and alter the grid to include obs there
        const extraObstacle = vPosStr.split(',').map(Number) as Pos

        if (pathHasLoop(guardPos, grid, extraObstacle)) loopVariantCount++
    }

    return loopVariantCount
}

function parseInput(input: string): [Pos, Pos[], string[][]] {
    let guardPos: Pos | null = null
    const obstaclePos: Pos[] = []

    const grid = input.split('\n')
        .map((l, i) => l.split('').map((c, j) => {
            if (c === '^') guardPos = [i, j]
            if (c === '#') obstaclePos.push([i, j])
            return c
        }))

    if (!guardPos) throw new Error('Found no guard!')

    return [guardPos, obstaclePos, grid]
}

function simulateGuard(guardPos: Pos, obstaclePos: Pos[], gridLength: number): Set<string> {
    const visited = new Set([`${guardPos}`])

    let pos = guardPos
    let dir = 'up'

    while (true) {
        const obstacle = getNextObstacle(pos, dir, obstaclePos)

        if (obstacle === null) {
            visitPointsToEdge(visited, pos, dir, gridLength)
            break;
        } else {
            visitPointsToObstacle(visited, pos, dir, obstacle)
        }

        pos = getNextPos(obstacle, dir)
        dir = getNextDir(dir)
    }

    return visited
}

function getNextObstacle(pos: Pos, dir: string, obstaclePos: Pos[]): Pos | null {
    const obstaclesInPath = getObstaclesInPath(pos, dir, obstaclePos)
    if (obstaclesInPath.length === 0) return null

    return obstaclesInPath.reduce(([ai, aj], [oi, oj]) => {
        switch (dir) {
            case 'up':
                return [Math.max(oi, ai), oj]
            case 'right':
                return [oi, Math.min(oj, aj)]
            case 'down':
                return [Math.min(oi, ai), oj]
            default:
                return [oi, Math.max(oj, aj)]
        }
    }, obstaclesInPath[0])
}

function getObstaclesInPath(pos: Pos, dir: string, obstaclePos: Pos[]) {
    return obstaclePos.filter(([oi, oj]) => {
        switch (dir) {
            case 'up':
                return oi < pos[0] && oj === pos[1]
            case 'right':
                return oi === pos[0] && oj > pos[1]
            case 'down':
                return oi > pos[0] && oj === pos[1]
            default:
                return oi === pos[0] && oj < pos[1]
        }
    })
}

function getNextPos(oPos: Pos, dir: string): Pos {
    const [i, j] = oPos;
    switch (dir) {
        case 'up':
            return [i + 1, j]
        case 'right':
            return [i, j - 1]
        case 'down':
            return [i - 1, j]
        default:
            return [i, j + 1]
    }
}

function getNextDir(d: string): string {
    const i = DIR_ORDER.indexOf(d);
    return DIR_ORDER[(i + 1) % DIR_ORDER.length]
}

function visitPointsToEdge(visited: Set<string>, pos: Pos, dir: string, gridLength: number): void {
    const [pi, pj] = pos
    switch (dir) {
        case 'up':
            for (let i = pi; i >= 0; i--) {
                visited.add(`${[i, pj]}`)
            }
            break
        case 'right':
            for (let j = pj; j < gridLength; j++) {
                visited.add(`${[pi, j]}`)
            }
            break
        case 'down':
            for (let i = pi; i < gridLength; i++) {
                visited.add(`${[i, pj]}`)
            }
            break
        default:
            for (let j = pj; j >= 0; j--) {
                visited.add(`${[pi, j]}`)
            }
            break
    }
}

function visitPointsToObstacle(visited: Set<string>, pos: Pos, dir: string, obstacle: Pos): void {
    const [pi, pj] = pos
    const [oi, oj] = obstacle
    switch (dir) {
        case 'up':
            for (let i = pi; i > oi; i--) {
                visited.add(`${[i, pj]}`)
            }
            break
        case 'right':
            for (let j = pj; j < oj; j++) {
                visited.add(`${[pi, j]}`)
            }
            break
        case 'down':
            for (let i = pi; i < oi; i++) {
                visited.add(`${[i, pj]}`)
            }
            break
        default:
            for (let j = pj; j > oj; j--) {
                visited.add(`${[pi, j]}`)
            }
            break
    }
}

function pathHasLoop(start: Pos, grid: string[][], extraObstacle: Pos): boolean {
    const directionsByVisitedPositions = new Map<string, string[]>()

    let currentDirection = 'up'
    let currentPosition = start

    while (true) {
        const visitedDirs = directionsByVisitedPositions.get(`${currentPosition}`)
        // already been here while facing this way, so must be in a loop
        if (visitedDirs?.includes(currentDirection)) return true

        const facingPos = getFacingPos(currentPosition, currentDirection)

        // check if we reached the edge
        if (!isInBounds(facingPos, grid.length)) return false

        // turn / move
        if (
            grid[facingPos[0]][facingPos[1]] === '#' ||
            (facingPos[0] === extraObstacle[0] && facingPos[1] === extraObstacle[1])
        ) {
            currentDirection = getNextDir(currentDirection)
        } else {
            directionsByVisitedPositions.set(`${currentPosition}`,
                [...(directionsByVisitedPositions.get(`${currentPosition}`) ?? []), currentDirection]
            )
            currentPosition = facingPos
        }
    }
}

function getFacingPos(pos: Pos, direction: string): Pos {
    switch (direction) {
        case 'up':
            return [pos[0] - 1, pos[1]]
        case 'right':
            return [pos[0], pos[1] + 1]
        case 'down':
            return [pos[0] + 1, pos[1]]
        default:
            return [pos[0], pos[1] - 1]
    }
}

function isInBounds(facingPos: Pos, size: number): boolean {
    return facingPos[0] >= 0 && facingPos[0] < size
        && facingPos[1] >= 0 && facingPos[1] < size
}

function logGrid(grid: string[][], visited: Set<string>) {
    for (let i = 0; i < grid.length; i++) {
        let line = '';
        for (let j = 0; j < grid[0].length; j++) {
            if (visited.has(`${[i, j]}`)) {
                if (grid[i][j] === '#') {
                    line += 'X'
                } else {
                    line += 'O'
                }
            } else {
                line += grid[i][j]
            }
        }
        console.log(line)
    }
}

onmessage = makeMessageHandler(part1, part2)