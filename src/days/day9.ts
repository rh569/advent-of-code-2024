import { makeMessageHandler } from "../libs/worker"

function part1(input: string) {
    const [fileBlocksByID, freeBlocksByID] = mapFilesystemFromInput(input)
    const defragged = defragByBlock(fileBlocksByID, freeBlocksByID)
    return defragged.reduce((acc, curr, i) => acc + curr * i, 0)
}

function part2(input: string) {
    const [fileBlocksByID, freeBlocksByID] = mapFilesystemFromInput(input)
    const defragged = defragByFile(fileBlocksByID, freeBlocksByID)
    console.log(defragged.join(''))
    return defragged.reduce<number>((acc, curr, i) => (typeof curr === 'string') ? acc : acc + curr * i, 0)
}

function mapFilesystemFromInput(input: string): [Map<number, number[]>, Map<number, string[]>] {
    const digits = input.split('')

    const fileBlocksByID: Map<number, number[]> = new Map()
    const freeBlocksByID: Map<number, string[]> = new Map()

    for (const [i, d] of digits.entries()) {
        const isFileBlock = i % 2 === 0
        const id = Math.floor(i / 2)

        if (isFileBlock) {
            const block = new Array(Number(d)).fill(id)
            fileBlocksByID.set(id, block)
        } else {
            const block = new Array(Number(d)).fill('.')
            freeBlocksByID.set(id, block)
        }
    }

    return [fileBlocksByID, freeBlocksByID]
}

function defragByBlock(fileBlocksByID: Map<number, number[]>, freeBlocksByID: Map<number, string[]>): number[] {
    const defragged: number[] = []

    let i = 0;
    let highestFileBlockID = [...fileBlocksByID.keys()].reduce((a, c) => Math.max(a, c))

    while (fileBlocksByID.size > 0) {
        defragged.push(...(fileBlocksByID.get(i) ?? []))
        fileBlocksByID.delete(i)

        const freeBlock = freeBlocksByID.get(i) ?? []
        for (let j = 0; j < freeBlock.length; j++) {
            if (highestFileBlockID <= i) {
                break
            }

            const highestFileBlock = fileBlocksByID.get(highestFileBlockID) ?? []

            const block = highestFileBlock.pop()
            if (block !== undefined) {
                defragged.push(block)
                continue
            }

            fileBlocksByID.delete(highestFileBlockID)
            highestFileBlockID--
            j-- // try again
        }

        i++
    }

    return defragged
}

function defragByFile(fileBlocksByID: Map<number, Array<string | number>>, freeBlocksByID: Map<number, Array<string | number>>): Array<number | string> {
    for (let i = fileBlocksByID.size - 1; i >= 0; i--) {
        const file = fileBlocksByID.get(i) as Array<string | number>

        for (let j = 0; j < i; j++) {
            const freeBlock = freeBlocksByID.get(j) as Array<string | number>
            const remainingFree = freeBlock.filter(b => b === '.').length

            if (remainingFree >= file.length) {
                const start = freeBlock.indexOf('.')
                freeBlock.splice(start, file.length, ...file)
                fileBlocksByID.set(i, new Array<string>(file.length).fill('.'))
                break
            }
        }
    }

    const defragged: Array<number | string> = []
    for (let i = 0; i < fileBlocksByID.size; i++) {
        const file = fileBlocksByID.get(i) ?? []
        const wasFree = freeBlocksByID.get(i) ?? []

        defragged.push(...file, ...wasFree)
    }

    return defragged
}

onmessage = makeMessageHandler(part1, part2)