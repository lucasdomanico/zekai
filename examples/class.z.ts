export class Vec3 { constructor(
    public x:number,
    public y:number,
    public z:number,
    public add:($0:Vec3) => Vec3,
    public sub:($0:Vec3) => Vec3) {}
    static struct = (o:{ x:number, y:number, z:number, add:($0:Vec3) => Vec3, sub:($0:Vec3) => Vec3 }) => {
        return new Vec3(o.x, o.y, o.z, o.add, o.sub)
    }
}

export type vec3 = (x:number, y:number, z:number) => Vec3
export const vec3:vec3 = (x, y, z) => {
    let v:Vec3 = new Vec3(x, y, z, (b) => vec3(v.x + b.x, v.y + b.y, v.z + b.z), (b) => vec3(v.x - b.x, v.y - b.y, v.z - b.z))
    return v
}

export type main = () => void
export const main:main = () => {
    console.log(vec3(1, 2, 3).add(vec3(1, 2, 3)).sub(vec3(2, 0, 0)))
    let a = vec3(1, 2, 3)
    a.x = 20
    return console.log(a.add(vec3(0, 0, 0)))
}
