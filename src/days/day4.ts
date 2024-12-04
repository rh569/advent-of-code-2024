import { makeMessageHandler } from "../libs/worker"

function part1(input: string) {
    const grid = input.split('\n').map(line => line.split(''))

    let nFound = 0;

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === 'X') {
                nFound += findXMAS(i, j, grid)
            }
        }
    }

    return nFound
}

function part2(input: string) {
    const grid = input.split('\n').map(line => line.split(''))

    let nFound = 0;

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === 'A') {
                nFound += findX_MAS(i, j, grid)
            }
        }
    }

    return nFound
}

/**
 * Assumes given grid[i][j] is 'X'
 * Searches horizontally, vertically and diagonally for full 'XMAS' matches
 */
function findXMAS(i: number, j: number, grid: string[][]): number {
    const searchDirections = [
        [-1, 0], // N
        [-1, 1], // NE
        [0, 1], // E
        [1, 1], // SE
        [1, 0], // S
        [1, -1], // SW
        [0, -1], // W
        [-1, -1], // NW
    ]

    const validDirections = searchDirections.filter(([di, dj]) => {
        const remaining = ['M', 'A', 'S']
        let si = i; let sj = j;

        while (remaining.length) {
            const expected = remaining.shift()
            const actual = getCharAtOffset(si + di, sj + dj, grid)
            if (expected !== actual) return false
            si = si + di
            sj = sj + dj
        }

        return true
    })

    return validDirections.length
}

/**
 * Assumes given grid[i][j] is 'A'
 * Checks forwards and backwards diagonals for two crossing MAS
 */
function findX_MAS(i: number, j: number, grid: string[][]): number {
    const diagonals = [
        [[-1, 1], [1, -1]], // NE, SW
        [[-1, -1], [1, 1]] // NW, SE
    ]

    const validDiagonals = diagonals.filter((corners) => {
        const diagonalChars = {
            'M': 0,
            'S': 0
        }

        for (const [di, dj] of corners) {
            const actual = getCharAtOffset(i + di, j + dj, grid)
            if (actual === 'M' || actual === 'S') diagonalChars[actual] += 1
        }

        return diagonalChars['M'] === 1 && diagonalChars['S'] === 1
    })

    return validDiagonals.length === 2 ? 1 : 0
}

function getCharAtOffset(i: number, j: number, grid: string[][]): string | undefined {
    try {
        return grid[i][j]
    } catch {
        return undefined
    }
}

onmessage = makeMessageHandler(part1, part2)