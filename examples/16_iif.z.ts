export type fee = (is_member:boolean) => number
export const fee:fee = (is_member) => is_member? (2) : (10)

export type beverage = (age:number) => string
export const beverage:beverage = (age) => age >= 21? 'beer' : 'juice'

export type main = () => void
export const main:main = () => {
    console.log(fee(true))
    console.log(fee(false))
    console.log(beverage(18))
    return console.log(beverage(40))
}
