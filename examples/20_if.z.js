export class Point {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static struct = (o) => {
        return new Point(o.x, o.y);
    };
}
export const f = () => {
    1;
    2;
    return 3;
};
export class Foo {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static struct = (o) => {
        return new Foo(o.x, o.y);
    };
}
export const q = () => {
    1;
    2;
    return 3;
};
export const test = (b) => {
    if (b) {
        let n = 2;
        n *= 20;
        console.log(n);
    }
    else {
        if (Math.random() < 0.5) {
            console.log('yay');
        }
    }
};
export const fib = (n) => {
    if (n === 0 || n === 1) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
};
export const inline = (n) => {
    if ((n < 0.5))
        return 'yay';
    if (n === 0.5)
        return 'nay';
    return 'whatever';
};
export const main = () => {
    test(true);
    test(false);
    console.log(fib(7));
    console.log(inline(0));
    console.log(inline(0.5));
    return console.log(inline(10));
};
