let range = (start, stop, step) => {
    if (stop === undefined) {
        stop = start;
        start = 0;
    }
    if (step === undefined) {
        step = 1;
    }
    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }
    var result = [];
    for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }
    return result;
};
export let width = 200;
export let height = 200;
export const init_grid = () => {
    return range(height).map(() => {
        return range(width).map(() => {
            return Math.random() > 0.5;
        });
    });
};
export const at = (grid, y, x) => {
    if (y < 0 || x < 0)
        return false;
    if (y >= height || x >= width)
        return false;
    return grid[y][x];
};
export const step = (grid) => {
    return grid.map((row, y) => {
        return row.map((alive, x) => {
            let atari = 0;
            if (at(grid, y - 1, x - 1))
                atari += 1;
            if (at(grid, y - 1, x + 0))
                atari += 1;
            if (at(grid, y - 1, x + 1))
                atari += 1;
            if (at(grid, y + 0, x - 1))
                atari += 1;
            if (at(grid, y + 0, x + 1))
                atari += 1;
            if (at(grid, y + 1, x - 1))
                atari += 1;
            if (at(grid, y + 1, x + 0))
                atari += 1;
            if (at(grid, y + 1, x + 1))
                atari += 1;
            if (alive && atari < 2) {
                return false;
            }
            if (alive && (atari === 2 || atari === 3)) {
                return true;
            }
            if (alive && atari > 3) {
                return false;
            }
            if (!alive && atari === 3) {
                return true;
            }
            return alive;
        });
    });
};
export const canvas = () => {
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.right = '1.5%';
    canvas.style.border = '2px solid black';
    canvas.style.width = '40%';
    canvas.style.imageRendering = 'pixelated';
    document.body.append(canvas);
    return canvas;
};
export const animate = (canvas) => {
    tick(canvas);
    return setTimeout(() => animate(canvas), 1000 / 60);
};
export const pixel = (canvas, x, y, alive) => {
    let c = canvas.getContext('2d');
    if (c instanceof CanvasRenderingContext2D) {
        c.fillStyle = alive ? 'yellow' : 'black';
        c.fillRect(x, y, 1, 1);
    }
};
export let grid = init_grid();
export const tick = (canvas) => {
    grid = step(grid);
    return grid.forEach((row, y) => {
        return row.forEach((alive, x) => {
            return pixel(canvas, x, y, alive);
        });
    });
};
export const main = () => {
    return animate(canvas());
};
