import { makeMessageHandler } from "../libs/worker"

const DIR_ORDER = ['up', 'right', 'down', 'left']

function part1(input: string) {
    let guardPos: [number, number] | null = null
    const obstaclePos: [number, number][] = []

    const grid = input.split('\n')
        .map((l, i) => l.split('').map((c, j) => {
            if (c === '^') guardPos = [i, j]
            if (c === '#') obstaclePos.push([i, j])
            return c
        }))

    if (!guardPos) throw new Error('Found no guard!')

    const visted = simulateGuard(guardPos, obstaclePos, grid[0].length)

    logGrid(grid, visted)

    return visted.size
}

// TODO
function part2(input: string) {
    return input.length
}

function simulateGuard(guardPos: [number, number], obstaclePos: [number, number][], gridLength: number): Set<string> {
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

function getNextObstacle(pos: [number, number], dir: string, obstaclePos: [number, number][]): [number, number] | null {
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

function getObstaclesInPath(pos: [number, number], dir: string, obstaclePos: [number, number][]) {
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

function getNextPos(oPos: [number, number], dir: string): [number, number] {
    const [i, j] = oPos;
    switch (dir) {
        case 'up':
            return [i+1, j]
        case 'right':
            return [i, j-1]
        case 'down':
            return [i-1, j]
        default:
            return [i, j+1]
    }
}

function getNextDir(d: string): string {
    const i = DIR_ORDER.indexOf(d);
    return DIR_ORDER[(i + 1) % DIR_ORDER.length]
}

function visitPointsToEdge(visited: Set<string>, pos: [number, number], dir: string, gridLength: number): void {
    const [pi, pj] = pos
    switch (dir) {
        case 'up':
            for (let i = pi; i >= 0; i--) {
                visited.add(`${[i,pj]}`)
            }
            break
        case 'right':
            for (let j = pj; j < gridLength; j++) {
                visited.add(`${[pi,j]}`)
            }
            break
        case 'down':
            for (let i = pi; i < gridLength; i++) {
                visited.add(`${[i,pj]}`)
            }
            break
        default:
            for (let j = pj; j >= 0; j--) {
                visited.add(`${[pi,j]}`)
            }
            break
    }
}

function visitPointsToObstacle(visited: Set<string>, pos: [number, number], dir: string, obstacle: [number, number]): void {
    const [pi, pj] = pos
    const [oi, oj] = obstacle
    switch (dir) {
        case 'up':
            for (let i = pi; i > oi; i--) {
                visited.add(`${[i,pj]}`)
            }
            break
        case 'right':
            for (let j = pj; j < oj; j++) {
                visited.add(`${[pi,j]}`)
            }
            break
        case 'down':
            for (let i = pi; i < oi; i++) {
                visited.add(`${[i,pj]}`)
            }
            break
        default:
            for (let j = pj; j > oj; j--) {
                visited.add(`${[pi,j]}`)
            }
            break
    }
}

function logGrid(grid: string[][], visited: Set<string>) {
    for (let i = 0; i < grid.length; i++) {
        let line = '';
        for (let j = 0; j < grid[0].length; j++) {
            if (visited.has(`${[i,j]}`)) {
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