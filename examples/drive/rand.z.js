export const mulberry32 = (a) => {
    return () => {
        a += 1831565813;
        let t = a;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t = t ^ t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
};
export const random_seed = (seed, n) => {
    let v = [];
    let f = mulberry32(seed * 100000);
    for (let i = 0; i < n; i += 1) {
        v.push(f());
    }
    return v;
};
export const main = () => {
    return console.log(random_seed(1, 5));
};
