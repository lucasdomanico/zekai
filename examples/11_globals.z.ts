export let n = 7

export let luck = 777

export let on = true

export let off = false

export let hex = 0xFFF

export let name = 'bob'

export let v = [1, 2, 3]

export let w = [1, 2, 3]

export let q = [1, 2, 3]

export type main = () => void
export const main:main = () => {
    console.log(n)
    console.log(luck)
    console.log(on)
    console.log(off)
    console.log(hex)
    console.log(name)
    console.log(v)
    console.log(w)
    return console.log(q)
}
