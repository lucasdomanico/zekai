export const or = (a, b) => a || b;
export const and = (a, b) => a && b;
export const bit_or = (a, b) => a | b;
export const bit_xor = (a, b) => a ^ b;
export const bit_and = (a, b) => a & b;
export const eq = (a, b) => a === b;
export const neq = (a, b) => a !== b;
export const gte = (a, b) => a >= b;
export const gt = (a, b) => a > b;
export const lte = (a, b) => a <= b;
export const lt = (a, b) => a < b;
export const not = (x) => !x;
export const bit_not = (x) => ~x;
export const neg = (x) => -x;
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
export const main = () => {
    let n = 0;
    n = 1;
    n += 2;
    n -= 3;
    n *= 4;
    n /= 5;
    n %= 6;
    console.log(and(true, false));
    let v = [1, 2, 3];
    console.log(v[1]);
    v[1] = 7;
    console.log(v);
    let p = new Point(1, 2);
    console.log(p.x);
    p.y = 9;
    return console.log(p);
};
