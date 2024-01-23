export class None {
    constructor() { }
    static struct = (o) => {
        return new None();
    };
}
export class State {
    stuff;
    constructor(stuff) {
        this.stuff = stuff;
    }
    static struct = (o) => {
        return new State(o.stuff);
    };
}
export let state = new None();
export const use_state = (f) => {
    if (state instanceof State) {
        f(state);
    }
};
export const main = () => {
    use_state((state) => {
        return console.log(state.stuff);
    });
    state = new State(777);
    return use_state((state) => {
        return console.log(state.stuff);
    });
};
