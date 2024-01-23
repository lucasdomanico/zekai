export type or = (a:boolean, b:boolean) => boolean
export const or:or = (a, b) => a || b

export type and = (a:boolean, b:boolean) => boolean
export const and:and = (a, b) => a && b

export type bit_or = (a:number, b:number) => number
export const bit_or:bit_or = (a, b) => a | b

export type bit_xor = (a:number, b:number) => number
export const bit_xor:bit_xor = (a, b) => a ^ b

export type bit_and = (a:number, b:number) => number
export const bit_and:bit_and = (a, b) => a & b

export type eq = (a:number, b:number) => boolean
export const eq:eq = (a, b) => a === b

export type neq = (a:number, b:number) => boolean
export const neq:neq = (a, b) => a !== b

export type gte = (a:number, b:number) => boolean
export const gte:gte = (a, b) => a >= b

export type gt = (a:number, b:number) => boolean
export const gt:gt = (a, b) => a > b

export type lte = (a:number, b:number) => boolean
export const lte:lte = (a, b) => a <= b

export type lt = (a:number, b:number) => boolean
export const lt:lt = (a, b) => a < b

export type not = (x:boolean) => boolean
export const not:not = (x) => !x

export type bit_not = (x:number) => number
export const bit_not:bit_not = (x) => ~x

export type neg = (x:number) => number
export const neg:neg = (x) => -x

export class Point { constructor(
    public x:number,
    public y:number) {}
    static struct = (o:{ x:number, y:number }) => {
        return new Point(o.x, o.y)
    }
}

export type main = () => void
export const main:main = () => {
    let n = 0
    n = 1
    n += 2
    n -= 3
    n *= 4
    n /= 5
    n %= 6
    console.log(and(true, false))
    let v = [1, 2, 3]
    console.log(v[1])
    v[1] = 7
    console.log(v)
    let p = new Point(1, 2)
    console.log(p.x)
    p.y = 9
    return console.log(p)
}
