export class Vec3 {
    x;
    y;
    z;
    add;
    sub;
    constructor(x, y, z, add, sub) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.add = add;
        this.sub = sub;
    }
    static struct = (o) => {
        return new Vec3(o.x, o.y, o.z, o.add, o.sub);
    };
}
export const vec3 = (x, y, z) => {
    let v = new Vec3(x, y, z, (b) => vec3(v.x + b.x, v.y + b.y, v.z + b.z), (b) => vec3(v.x - b.x, v.y - b.y, v.z - b.z));
    return v;
};
export const main = () => {
    console.log(vec3(1, 2, 3).add(vec3(1, 2, 3)).sub(vec3(2, 0, 0)));
    let a = vec3(1, 2, 3);
    a.x = 20;
    return console.log(a.add(vec3(0, 0, 0)));
};
