export type f = () => void
export const f:f = () => {
    let v = [1, 2, 3]
    return v.map((x) => x * 2)
}

export type suite = () => void
export const suite:suite = () => {
    let v = [1, 2, 3]
    return v.map((x) => {
        let n = 10
        n *= 20
        if(false) {
            return 0
        }
        for(;;) {
            break
        }
        return x * n
    })
}

export type wait = () => void
export const wait:wait = () => {
    let v = [1, 2, 3]
    return v.forEach(async (x) => {
        console.log('one')
        await timeout()
        return console.log('two')
    })
}

export type timeout = () => Promise<void>
export const timeout:timeout = () => {
    return new Promise((resolve) => {
        return setTimeout(resolve, 1000)
    })
}

export type main = () => void
export const main:main = () => {
    console.log(f())
    console.log(suite())
    return wait()
}
