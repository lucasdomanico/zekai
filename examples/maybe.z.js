export class Nothing {
    constructor() { }
    static struct = (o) => {
        return new Nothing();
    };
}
export class Just {
    value;
    constructor(value) {
        this.value = value;
    }
    static struct = (o) => {
        return new Just(o.value);
    };
}
export const show = (m) => {
    if (m instanceof Nothing) {
        console.log('Nothing');
    }
    else {
        console.log('Just', m.value);
    }
};
export const main = () => {
    show(new Nothing());
    show(new Just(777));
    return show(new Just('z'));
};
