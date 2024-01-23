export type add = (a:number, b:number) => number
export const add:add = (a, b) => {
    return a + b
}

export type mul = (a:number, b:number) => number
export const mul:mul = (a, b) => a * b

export type hi = () => void
export const hi:hi = () => {
    return console.log('hi')
}

export type bye = () => void
export const bye:bye = () => {
    return console.log('bye')
}

export type test = (n:number) => number
export const test:test = (n) => {
    let q = n + 1
    q += 10
    return q
}

export type wait = () => void
export const wait:wait = async () => {
    let now = Date.now()
    await timeout()
    return console.log(Date.now() - now)
}

export type timeout = () => Promise<void>
export const timeout:timeout = () => {
    return new Promise((resolve) => {
        return setTimeout(resolve, 1000)
    })
}

export type main = () => void
export const main:main = () => {
    console.log(add(1, 2))
    console.log(mul(3, 4))
    hi()
    bye()
    console.log(test(8))
    return wait()
}
