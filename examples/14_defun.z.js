export const add = (a, b) => {
    return a + b;
};
export const mul = (a, b) => a * b;
export const hi = () => {
    return console.log('hi');
};
export const bye = () => {
    return console.log('bye');
};
export const test = (n) => {
    let q = n + 1;
    q += 10;
    return q;
};
export const wait = async () => {
    let now = Date.now();
    await timeout();
    return console.log(Date.now() - now);
};
export const timeout = () => {
    return new Promise((resolve) => {
        return setTimeout(resolve, 1000);
    });
};
export const main = () => {
    console.log(add(1, 2));
    console.log(mul(3, 4));
    hi();
    bye();
    console.log(test(8));
    return wait();
};
