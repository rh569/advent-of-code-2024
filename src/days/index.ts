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
]
