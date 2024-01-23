export let lib_js = await import('./23_import_lib_js.js' as any)

import {
    sub,
    mul as my_mul
} from './23_import_lib_ts.js'

import {
    div
} from './23_import_lib_zekai.z.js'

export type main = () => void
export const main:main = () => {
    console.log(lib_js.add(1, 2))
    console.log(sub(1, 2))
    console.log(my_mul(2, 3))
    return console.log(div(1, 2))
}
