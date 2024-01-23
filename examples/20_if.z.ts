export class Point { constructor(
    public x:number,
    public y:number) {}
    static struct = (o:{ x:number, y:number }) => {
        return new Point(o.x, o.y)
    }
}

export type f = () => void
export const f:f = () => {
    1
    2
    return 3
}

export type test = (b:boolean) => void
export const test:test = (b) => {
    if(b) {
        let n = 2
        n *= 20
        console.log(n)
    }
    else {
        if(Math.random() < 0.5) {
            console.log('yay')
        }
    }
}

export type fib = (n:number) => number
export const fib:fib = (n) => {
    if(n === 0 || n === 1) {
        return n
    }
    return fib(n - 1) + fib(n - 2)
}

export type inline = (n:number) => void
export const inline:inline = (n) => {
    if((n < 0.5)) return 'yay'
    if(n === 0.5) return 'nay'
    return 'whatever'
}

export type main = () => void
export const main:main = () => {
    test(true)
    test(false)
    console.log(fib(7))
    console.log(inline(0))
    console.log(inline(0.5))
    return console.log(inline(10))
}
