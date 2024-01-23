export const loop = () => {
    for (let i = 0; i < 10; i += 1) {
        console.log(i);
    }
    for (let i = 0; i < 10; i += 1) {
        console.log(i);
    }
};
export const loopy = () => {
    for (let i = 0; i < 10;) {
        console.log(i);
        i += 1;
    }
};
export const loopz = () => {
    for (let i = 0;;) {
        if (i >= 10)
            break;
        console.log(i);
        i += 1;
    }
};
export const loopx = () => {
    let i = 0;
    for (;;) {
        if (i >= 10)
            break;
        console.log(i);
        i += 1;
    }
};
export const main = () => {
    console.log('loop');
    loop();
    console.log('loopy');
    loopy();
    console.log('loopz');
    loopz();
    console.log('loopx');
    return loopx();
};
