export class Str {
    s;
    constructor(s) {
        this.s = s;
    }
    static struct = (o) => {
        return new Str(o.s);
    };
}
export class Num {
    n;
    constructor(n) {
        this.n = n;
    }
    static struct = (o) => {
        return new Num(o.n);
    };
}
export const f = (x) => {
    if (x instanceof Str) {
        console.log('Str', x.s);
    }
    if (x instanceof Num) {
        console.log('Num', x.n);
    }
};
export const main = () => {
    f(new Str('hello'));
    return f(new Num(777));
};
