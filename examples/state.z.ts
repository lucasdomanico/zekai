export class None { constructor(
) {}
    static struct = (o:{  }) => {
        return new None()
    }
}

export class State { constructor(
    public stuff:number) {}
    static struct = (o:{ stuff:number }) => {
        return new State(o.stuff)
    }
}

export let state:(None | State) = new None()

export type use_state = (f:($0:State) => void) => void
export const use_state:use_state = (f) => {
    if(state instanceof State) {
        f(state)
    }
}

export type main = () => void
export const main:main = () => {
    use_state((state) => {
        return console.log(state.stuff)
    })
    state = new State(777)
    return use_state((state) => {
        return console.log(state.stuff)
    })
}
