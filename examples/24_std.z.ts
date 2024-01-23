
let range = (start:number, stop?:number, step?:number):number[] => {
    if(stop === undefined) {
        stop = start
        start = 0
    }
    if(step === undefined) {
        step = 1
    }
    if((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return []
    }
    var result = [] as number[]
    for(let i = start; step > 0? i < stop : i > stop; i += step) {
        result.push(i)
    }
    return result
}

let clone = <T,>(o:T):T => {
    let do_Array = (a:any, b:any) => {
        for(let i = 0; i < a.length; i++) {
            set_prototype(a[i], b[i])
        }
    }
    let do_Map = (a:any, b:any) => {
        let a_entries = [...a.entries()]
        let b_entries = [...b.entries()]
        a.clear()
        a_entries.forEach(([key, val], i) => {
            set_prototype(key, b_entries[i][0])
            set_prototype(val, b_entries[i][1])
            a.set(key, val)
        })
    }
    let do_Set = (a:any, b:any) => {
        throw new Error('Set clone not implemented')
    }
    let set_prototype = (a:any, b:any):void => {
        if(b === undefined) return
        if(b === null) return
        if(b instanceof   Array) return do_Array(a, b)
        if(b instanceof   ArrayBuffer) return
        if(typeof(b) === 'boolean') return
        if(b instanceof   DataView) return
        if(b instanceof   Date) return
        if(b instanceof   Error) return
        if(b instanceof   Map) return do_Map(a, b)
        if(typeof(b) ===  'number') return
        if(b instanceof   RegExp) return
        if(b instanceof   Set) return do_Set(a, b)
        if(typeof(b) ===  'string') return
        if(b instanceof   Int8Array) return
        if(b instanceof   Uint8Array) return
        if(b instanceof   Uint8ClampedArray) return
        if(b instanceof   Int16Array) return
        if(b instanceof   Uint16Array) return
        if(b instanceof   Int32Array) return
        if(b instanceof   Uint32Array) return
        if(b instanceof   Float32Array) return
        if(b instanceof   Float64Array) return
        if(b instanceof   BigInt64Array) return
        if(b instanceof   BigUint64Array) return
        Object.setPrototypeOf(a, Object.getPrototypeOf(b))
        Object.keys(b).forEach((key) => {
            set_prototype(a[key], b[key])
        })
    }
    let c = structuredClone(o)
    set_prototype(c, o)
    return c
}
export type show = () => void
export const show:show = () => {
    console.log(range(10))
    console.log(range(5, 10))
    return console.log(range(0, 10, 2))
}

export class Empty { constructor(
) {}
    static struct = (o:{  }) => {
        return new Empty()
    }
}

export type cloning = () => void
export const cloning:cloning = () => {
    let e = new Empty()
    let s = structuredClone(e)
    let c = clone(e)
    console.log(s instanceof Empty)
    return console.log(c instanceof Empty)
}

export type main = () => void
export const main:main = () => {
    show()
    return cloning()
}
