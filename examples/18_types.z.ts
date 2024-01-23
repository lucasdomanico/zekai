export let i:number = 1

export let s:string = 2

export let b:boolean = true

export type my_array = () => Array<number>
export const my_array:my_array = () => {
    let v = ([] as Array<number>)
    v.push(2)
    v.push('x')
    return v
}

export type my_map = () => Map<string, number>
export const my_map:my_map = () => {
    let m = new Map<string, number>()
    m.set('x', 1)
    m.set('y', 2)
    return m
}

export type my_object = () => void
export const my_object:my_object = () => {
    let m = my_map()
    let o = Object.fromEntries(m)
    return console.log(o)
}

export class None { constructor(
) {}
    static struct = (o:{  }) => {
        return new None()
    }
}

export class State { constructor(
    public value:number) {}
    static struct = (o:{ value:number }) => {
        return new State(o.value)
    }
}

export type my_union = (x:(None | State)) => void
export const my_union:my_union = (x) => {
    if(x instanceof None) {
        console.log('None')
    }
    if(x instanceof State) {
        console.log('State', x.value)
    }
}

export type my_tuple = (x:[number, string]) => void
export const my_tuple:my_tuple = (x) => {
    return console.log(x[0], x[1])
}

export type twice = (f:($0:number) => void) => void
export const twice:twice = (f) => {
    f(1)
    return f(2)
}

export class Class { constructor(
    public get_x:() => number,
    public set_x:($0:number) => void) {}
    static struct = (o:{ get_x:() => number, set_x:($0:number) => void }) => {
        return new Class(o.get_x, o.set_x)
    }
}

export type new_class = () => Class
export const new_class:new_class = () => {
    let x = 0
    return new Class(() => x, (n) => x = n)
}

export type Foo = Class

export let foo:Foo = new_class()

export type main = () => void
export const main:main = () => {
    console.log(my_array())
    console.log(my_map())
    my_object()
    my_union(new None())
    my_union(new State(7))
    my_tuple([1, 'z'])
    let n = 0
    twice((x) => n += x)
    console.log(n)
    let c = new_class()
    c.set_x(9)
    console.log(c.get_x())
    return console.log(foo)
}
