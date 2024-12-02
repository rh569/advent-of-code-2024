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
]
