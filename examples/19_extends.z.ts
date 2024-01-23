
const $extends = <T, S,>(a:T, b:S):(T & S) => {
    let o = { ...a, ...b }
    Object.setPrototypeOf(o, Object.getPrototypeOf(b))
    Object.setPrototypeOf(Object.getPrototypeOf(o), Object.getPrototypeOf(a))
    return o
}

export class Animal { constructor(
    public name:string) {}
    static struct = (o:{ name:string }) => {
        return new Animal(o.name)
    }
}

export class Bear { constructor(
    public roar:number) {}
    static struct = (o:{ roar:number }) => {
        return new Bear(o.roar)
    }
}

export type AnimalBear = (Animal & Bear)

export type animal = (a:Animal) => void
export const animal:animal = (a) => {
    console.log(a instanceof Animal)
    return console.log(a.name)
}

export type bear = (b:Bear) => void
export const bear:bear = (b) => {
    console.log(b instanceof Bear)
    return console.log(b.roar)
}

export type animal_bear = (b:AnimalBear) => void
export const animal_bear:animal_bear = (b) => {
    console.log(b instanceof Animal)
    console.log(b instanceof Bear)
    console.log(b.name)
    return console.log(b.roar)
}

export type main = () => void
export const main:main = () => {
    let x = $extends(new Animal('foo'), new Bear(999))
    console.log(x)
    animal(x)
    bear(x)
    return animal_bear(x)
}
