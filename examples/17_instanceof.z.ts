export class Str { constructor(
    public s:string) {}
    static struct = (o:{ s:string }) => {
        return new Str(o.s)
    }
}

export class Num { constructor(
    public n:number) {}
    static struct = (o:{ n:number }) => {
        return new Num(o.n)
    }
}

export type f = (x:(Str | Num)) => void
export const f:f = (x) => {
    if(x instanceof Str) {
        console.log('Str', x.s)
    }
    if(x instanceof Num) {
        console.log('Num', x.n)
    }
}

export type main = () => void
export const main:main = () => {
    f(new Str('hello'))
    return f(new Num(777))
}
