export let name = 'bob'

export type main = () => void
export const main:main = () => {
    let n = 1
    let luck = 7
    n = 9
    name = 'alice'
    console.log(n)
    return console.log(name)
}
