export class Point { constructor(
    public x:number,
    public y:number) {}
    static struct = (o:{ x:number, y:number }) => {
        return new Point(o.x, o.y)
    }
}

export class None { constructor(
) {}
    static struct = (o:{  }) => {
        return new None()
    }
}

export type main = () => void
export const main:main = () => {
    console.log(new Point(1, 2))
    console.log(new Point(3, 4))
    console.log(new None())
    let p = new Point(0, 0)
    p.x = 20
    console.log(p)
    console.log(Point.struct({ x:7, y:9 }))
    console.log(Point.struct({ y:7, x:9 }))
    console.log(Point.struct({ x:11, y:22 }))
    return console.log(Point.struct({ x:11, y:22 }))
}
