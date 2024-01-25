export const f = () => {
    let v = [1, 2, 3];
    let q = v.map((x) => x * 2);
    return q.map((x) => x * 2);
};
export const sad = () => {
    () => 0;
    return () => 0;
};
export const suite = () => {
    let v = [1, 2, 3];
    return v.map((x) => {
        let n = 10;
        n *= 20;
        if (false) {
            return 0;
        }
        for (;;) {
            break;
        }
        return x * n;
    });
};
export const wait = () => {
    let v = [1, 2, 3];
    return v.forEach(async (x) => {
        console.log('one');
        await timeout();
        return console.log('two');
    });
};
export const timeout = () => {
    return new Promise((resolve) => {
        return setTimeout(resolve, 1000);
    });
};
export const add = (a, b) => a + b;
export let sub = (a, b) => a - b;
export const main = () => {
    console.log(f());
    console.log(sad());
    console.log(suite());
    wait();
    console.log(add(1, 2));
    return console.log(sub(1, 2));
};
