export interface DayDefinition {
    num: number
    title: string
    modulePath: string
}

export const DAYS: DayDefinition[] = [
    {
        num: 1,
        modulePath: import.meta.resolve(`./day1`),
        title: 'Historian Hysteria'
    },
    {
        num: 2,
        modulePath: import.meta.resolve(`./day2`),
        title: 'Red-Nosed Reports'
    },
    {
        num: 3,
        modulePath: import.meta.resolve(`./day3`),
        title: 'Mull It Over'
    },
    {
        num: 4,
        modulePath: import.meta.resolve(`./day4`),
        title: 'Ceres Search'
    },
    {
        num: 5,
        modulePath: import.meta.resolve(`./day5`),
        title: 'Print Queue'
    },
    {
        num: 6,
        modulePath: import.meta.resolve(`./day6`),
        title: 'Guard Gallivant'
    },
]
