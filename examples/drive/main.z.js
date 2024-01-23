import { tick } from './tick.z.js';
export const canvas = () => {
    let canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.right = '1.5%';
    canvas.style.border = '2px solid black';
    canvas.style.width = '40%';
    canvas.style.height = '40%';
    document.body.append(canvas);
    return canvas;
};
export const main = () => {
    return tick(canvas(), 400, 400);
};
