import { makeMessageHandler } from "../libs/worker"

function part1(input: string) {
    const calibrations = parseInput(input)

    return calibrations.filter((c) => isPossible(c))
        .reduce((acc, curr) => acc + curr[0], 0)
}

function part2(input: string) {
    const calibrations = parseInput(input)

    return calibrations.filter((c) => isPossible(c, 3))
        .reduce((acc, curr) => acc + curr[0], 0)
}

function parseInput(input: string): [number, number[]][] {
    return input.split('\n')
        .map(l => l.split(': ').map((v, i) =>
            i === 0 ? Number(v) : v.split(' ').map(Number)
        )) as [number, number[]][]
}

// Assumes either 2 or 3 operators
// [+, *] or [+, *, ||]
function isPossible(calibration: [number, number[]], nOperators = 2): boolean {
    const [testValue, sumNumbers] = calibration

    const nPermutations = Math.pow(nOperators, sumNumbers.length - 1)
    const base = nOperators
    
    for (let c = 0; c < nPermutations; c++) {
        // Binary/Ternary number representation to get all permutations easily
        const combinationStr = padLeadingZeros(c.toString(base), (nPermutations - 1).toString(base).length)

        const total = sumNumbers.reduce((acc, curr, i) => {
            if (combinationStr[i - 1] === '0') {
                return acc + curr
            } else if (combinationStr[i - 1] === '1') {
                return acc * curr
            }
            // concatenate digits
            return Number(`${acc}${curr}`)
        })

        if (total === testValue) return true
    }

    return false
}

function padLeadingZeros(s: string, d: number): string {
    while (s.length < d) {
        s = `0${s}`
    }

    return s
}

onmessage = makeMessageHandler(part1, part2)