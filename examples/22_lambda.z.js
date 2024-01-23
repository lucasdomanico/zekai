export const f = () => {
    let v = [1, 2, 3];
    return v.map((x) => x * 2);
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
export const main = () => {
    console.log(f());
    console.log(suite());
    return wait();
};
