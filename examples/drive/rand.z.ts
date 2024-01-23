export type mulberry32 = (a:number) => () => number
export const mulberry32:mulberry32 = (a) => {
    return () => {
        a += 1831565813
        let t = a
        t = Math.imul(t ^ t >>> 15, t | 1)
        t = t ^ t + Math.imul(t ^ t >>> 7, t | 61)
        return ((t ^ t >>> 14) >>> 0) / 4294967296
    }
}

export type random_seed = (seed:number, n:number) => Array<number>
export const random_seed:random_seed = (seed, n) => {
    let v = ([] as Array<number>)
    let f = mulberry32(seed * 100000)
    for(let i = 0; i < n; i += 1) {
        v.push(f())
    }
    return v
}

export type main = () => void
export const main:main = () => {
    return console.log(random_seed(1, 5))
}
