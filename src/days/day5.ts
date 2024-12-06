import { makeMessageHandler } from "../libs/worker"

type PageRule = {
    comesAfter: Set<number>
    comesBefore: Set<number>
}

function part1(input: string) {
    const [updates, rulesByPage] = parseInput(input)

    return updates.filter(u => isUpdateOrdered(u, rulesByPage))
        .reduce((acc, curr) => acc + getMiddle(curr), 0)
}

function part2(input: string) {
    const [updates, rulesByPage] = parseInput(input)

    return updates.filter(u => !isUpdateOrdered(u, rulesByPage))
        .map(u => sortUpdate(u, rulesByPage))
        .reduce((acc, curr) => acc + getMiddle(curr), 0)
}

function parseInput(input: string): [number[][], Record<number, PageRule>] {
    const [rulesBlock, updatesBlock] = input.split('\n\n')
    const rules = rulesBlock.split('\n')
        .map(l => l.split('|').map(Number))
    const updates = updatesBlock.split('\n')
        .map(l => l.split(',').map(Number))

    const rulesByPage = getRulesByPage(rules)

    return [updates, rulesByPage]
}

/**
 * Transforms the list of before|after rules into a
 * bi-directional map so that any page can be looked up against another
 */
function getRulesByPage(rules: number[][]) {
    const rulesByPage: Record<number, PageRule> = {}

    for (const [first, second] of rules) {
        if (!(first in rulesByPage)) rulesByPage[first] = makePageRule();
        rulesByPage[first].comesBefore.add(second);

        if (!(second in rulesByPage)) rulesByPage[second] = makePageRule();
        rulesByPage[second].comesAfter.add(first);
    }

    return rulesByPage
}

function makePageRule() {
    return {
        comesAfter: new Set<number>(),
        comesBefore: new Set<number>()
    }
}

/**
 * Checks every page in the update to check it doesn't break any rules
 * 
 * Uses 3 positions:
 *   - i: the current page we're checking
 *   - b: ranges from 0 to i-1 (the pages that appear before)
 *   - a: ranges from i+1 to length (the pages that appear after)
 * 
 * e.g.
 * [ 1, 7, 3, 11, 5]
 *      ^  ^   ^
 *      b  i   a
 */
function isUpdateOrdered(update: number[], rulesByPage: Record<number, PageRule>): boolean {
    for (let i = 0; i < update.length; i++) {
        const currentPage = update[i]

        if (i > 0) {
            // Check that the page that is listed in the update before the current page we're on
            // doesn't have a rule that says it needs to come after it
            for (let b = i - 1; b >= 0; b--) {
                const beforePage = update[b]

                if (rulesByPage[beforePage].comesAfter.has(currentPage)) {
                    return false
                }
            }
        }

        if (i < update.length - 1) {
            // Check that the page that is listed in the update after the current page we're on
            // doesn't have a rule that says it needs to come before it
            for (let a = i + 1; a < update.length; a++) {
                const afterPage = update[a]

                if (rulesByPage[afterPage].comesBefore.has(currentPage)) {
                    return false
                }
            }
        }
    }

    return true
}

function sortUpdate(update: number[], rulesByPage: Record<number, PageRule>): number[] {
    update.sort((a, b) => {
        if (rulesByPage[a].comesBefore.has(b)) {
            return -1
        } else if (rulesByPage[a].comesAfter.has(b)) {
            return 1
        } else {
            return 0
        }
    })

    return update
}

function getMiddle<T>(arr: T[]): T {
    return arr[Math.floor(arr.length / 2)]
}

onmessage = makeMessageHandler(part1, part2)