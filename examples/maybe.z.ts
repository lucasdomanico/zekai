export class Nothing { constructor(
) {}
    static struct = (o:{  }) => {
        return new Nothing()
    }
}

export class Just<T> { constructor(
    public value:T) {}
    static struct = <T>(o:{ value:T }) => {
        return new Just<T>(o.value)
    }
}

export type Maybe<T,> = (Nothing | Just<T>)

export type show = <T,>(m:Maybe<T>) => void
export const show:show = <T,>(m:Maybe<T>) => {
    if(m instanceof Nothing) {
        console.log('Nothing')
    }
    else {
        console.log('Just', m.value)
    }
}

export type main = () => void
export const main:main = () => {
    show(new Nothing())
    show(new Just(777))
    return show(new Just('z'))
}
