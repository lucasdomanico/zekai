export type loop = () => void
export const loop:loop = () => {
    for(let i = 0; i < 10; i += 1) {
        console.log(i)
    }
    for(let i = 0; i < 10; i += 1) {
        console.log(i)
    }
}

export type loopy = () => void
export const loopy:loopy = () => {
    for(let i = 0; i < 10;) {
        console.log(i)
        i += 1
    }
}

export type loopz = () => void
export const loopz:loopz = () => {
    for(let i = 0;;) {
        if(i >= 10) break
        console.log(i)
        i += 1
    }
}

export type loopx = () => void
export const loopx:loopx = () => {
    let i = 0
    for(;;) {
        if(i >= 10) break
        console.log(i)
        i += 1
    }
}

export type main = () => void
export const main:main = () => {
    console.log('loop')
    loop()
    console.log('loopy')
    loopy()
    console.log('loopz')
    loopz()
    console.log('loopx')
    return loopx()
}
