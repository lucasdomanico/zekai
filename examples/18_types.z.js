export let i = 1;
export let s = 2;
export let b = true;
export const my_array = () => {
    let v = [];
    v.push(2);
    v.push('x');
    return v;
};
export const my_map = () => {
    let m = new Map();
    m.set('x', 1);
    m.set('y', 2);
    return m;
};
export const my_object = () => {
    let m = my_map();
    let o = Object.fromEntries(m);
    return console.log(o);
};
export class None {
    constructor() { }
    static struct = (o) => {
        return new None();
    };
}
export class State {
    value;
    constructor(value) {
        this.value = value;
    }
    static struct = (o) => {
        return new State(o.value);
    };
}
export const my_union = (x) => {
    if (x instanceof None) {
        console.log('None');
    }
    if (x instanceof State) {
        console.log('State', x.value);
    }
};
export const my_tuple = (x) => {
    return console.log(x[0], x[1]);
};
export const twice = (f) => {
    f(1);
    return f(2);
};
export class Class {
    get_x;
    set_x;
    constructor(get_x, set_x) {
        this.get_x = get_x;
        this.set_x = set_x;
    }
    static struct = (o) => {
        return new Class(o.get_x, o.set_x);
    };
}
export const new_class = () => {
    let x = 0;
    return new Class(() => x, (n) => x = n);
};
export let foo = new_class();
export const main = () => {
    console.log(my_array());
    console.log(my_map());
    my_object();
    my_union(new None());
    my_union(new State(7));
    my_tuple([1, 'z']);
    let n = 0;
    twice((x) => n += x);
    console.log(n);
    let c = new_class();
    c.set_x(9);
    console.log(c.get_x());
    return console.log(foo);
};
