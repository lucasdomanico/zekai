const $extends = (a, b) => {
    let o = { ...a, ...b };
    Object.setPrototypeOf(o, Object.getPrototypeOf(b));
    Object.setPrototypeOf(Object.getPrototypeOf(o), Object.getPrototypeOf(a));
    return o;
};
export class Animal {
    name;
    constructor(name) {
        this.name = name;
    }
    static struct = (o) => {
        return new Animal(o.name);
    };
}
export class Bear {
    roar;
    constructor(roar) {
        this.roar = roar;
    }
    static struct = (o) => {
        return new Bear(o.roar);
    };
}
export const animal = (a) => {
    console.log(a instanceof Animal);
    return console.log(a.name);
};
export const bear = (b) => {
    console.log(b instanceof Bear);
    return console.log(b.roar);
};
export const animal_bear = (b) => {
    console.log(b instanceof Animal);
    console.log(b instanceof Bear);
    console.log(b.name);
    return console.log(b.roar);
};
export const main = () => {
    let x = $extends(new Animal('foo'), new Bear(999));
    console.log(x);
    animal(x);
    bear(x);
    return animal_bear(x);
};
