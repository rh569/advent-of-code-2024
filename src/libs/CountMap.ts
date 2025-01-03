export class CountMap extends Map<string | number, number> {

    /**
     * Increases the count at the given key by 1, or the step amount if given.
     * If the key does not appear in the map, set it to 1, or the step amount if given.
     */
    increment(key: string | number, step = 1): this {
        const current = this.get(key)

        if (current === undefined) {
            this.set(key, step)
        } else {
            this.set(key, current + step)
        }

        return this
    }

    /**
     * Decreases the count at the given key by 1, or the step amount if given.
     * If the key does not appear in the map, set it to -1, or the negative step amount if given.
     */
    decrement(key: string | number, step = 1): this {
        const current = this.get(key)

        if (current === undefined) {
            this.set(key, -1 * step)
        } else {
            this.set(key, current - step)
        }

        return this
    }
}