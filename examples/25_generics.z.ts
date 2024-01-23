export class None { constructor(
) {}
    static struct = (o:{  }) => {
        return new None()
    }
}

export class Node<T> { constructor(
    public value:T,
    public links:Array<Node<T>>) {}
    static struct = <T>(o:{ value:T, links:Array<Node<T>> }) => {
        return new Node<T>(o.value, o.links)
    }
}

export type Tree<T,> = Node<T>

export type my_map = <T, S,>(v:Array<T>, f:($0:T) => S) => Array<S>
export const my_map:my_map = <T, S,>(v:Array<T>, f:($0:T) => S) => {
    let r = ([] as Array<S>)
    for(let i = 0; i < v.length; i += 1) {
        r.push(f(v[i]))
    }
    return r
}

export type show = <T,>(t:Tree<T>) => void
export const show:show = <T,>(t:Tree<T>) => {
    return console.log(t)
}

export type main = () => void
export const main:main = () => {
    let root = new Node(1, [])
    root.links.push(new Node(2, []))
    show(root)
    return console.log(my_map([1, 2, 3], (x) => x * 2))
}
