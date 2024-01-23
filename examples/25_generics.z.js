export class None {
    constructor() { }
    static struct = (o) => {
        return new None();
    };
}
export class Node {
    value;
    links;
    constructor(value, links) {
        this.value = value;
        this.links = links;
    }
    static struct = (o) => {
        return new Node(o.value, o.links);
    };
}
export const my_map = (v, f) => {
    let r = [];
    for (let i = 0; i < v.length; i += 1) {
        r.push(f(v[i]));
    }
    return r;
};
export const show = (t) => {
    return console.log(t);
};
export const main = () => {
    let root = new Node(1, []);
    root.links.push(new Node(2, []));
    show(root);
    return console.log(my_map([1, 2, 3], (x) => x * 2));
};
