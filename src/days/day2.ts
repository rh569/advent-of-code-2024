import { makeMessageHandler } from "../libs/worker"

function part1(input: string) {
    const reports = input.split('\n')
        .map(l => l.split(' '))
        .map(l => l.map(n => Number(n)))

    let nSafe = 0;

    for (const report of reports) {
        if (isReportSafe(report)) {
            nSafe++;
        }
    }

    return nSafe
}

function part2(input: string) {
    const reports = input.split('\n')
        .map(l => l.split(' '))
        .map(l => l.map(n => Number(n)))

    let nSafe = 0;

    for (const report of reports) {
        if (isReportSafe(report)) {
            nSafe++;
        } else {
            for (let i = 0; i < report.length; i++) {
                const dampedReport = [...report]
                dampedReport.splice(i, 1)

                
                if (isReportSafe(dampedReport)) {
                    nSafe++;
                    break;
                }
            }
        }
    }

    return nSafe
}

function isReportSafe(l: number[]): boolean {
    const initialDifference = l[1] - l[0]

    if (!isStepMagnitudeSafe(initialDifference)) {
        return false
    }

    const sign = initialDifference / Math.abs(initialDifference)

    for (let i = 1; i < l.length - 1; i++) {
        const step = l[i+1] - l[i]
        if (!isStepMagnitudeSafe(step)) return false
        if (!isStepDirectionSafe(sign, step)) return false
    }

    return true
}

function isStepMagnitudeSafe(d: number): boolean {
    return d !== 0 && Math.abs(d) <= 3
}

function isStepDirectionSafe(expectedSign: number, step: number): boolean {
    const stepSign = step / Math.abs(step)
    return stepSign === expectedSign
}

onmessage = makeMessageHandler(part1, part2)