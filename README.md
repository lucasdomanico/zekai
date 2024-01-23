# zekai!

Why it's awesome
- Statically typed (using TypeScript)
- Comes with an Editor
- Transpiles to both TypeScript and JavaScript

```javascript
main
    console.log('hi zekai!')
```

### Syntax and Examples

Check the files in the `examples` folder with either your favorite editor or with zekai editor
for syntax highlighting.

If you are in a hurry, you can view them online with syntax highlighting:

- [`globals`](   https://lucasdomanico.github.io/zekai/example.html?example=11_globals.z)
- [`let`](       https://lucasdomanico.github.io/zekai/example.html?example=12_let.z)
- [`structs`](   https://lucasdomanico.github.io/zekai/example.html?example=13_structs.z)
- [`defun`](     https://lucasdomanico.github.io/zekai/example.html?example=14_defun.z)
- [`operators`]( https://lucasdomanico.github.io/zekai/example.html?example=15_operators.z)
- [`iif`](       https://lucasdomanico.github.io/zekai/example.html?example=16_iif.z)
- [`instanceof`](https://lucasdomanico.github.io/zekai/example.html?example=17_instanceof.z)
- [`types`](     https://lucasdomanico.github.io/zekai/example.html?example=18_types.z)
- [`extends`](   https://lucasdomanico.github.io/zekai/example.html?example=19_extends.z)
- [`if`](        https://lucasdomanico.github.io/zekai/example.html?example=20_if.z)
- [`for`](       https://lucasdomanico.github.io/zekai/example.html?example=21_for.z)
- [`lambda`](    https://lucasdomanico.github.io/zekai/example.html?example=22_lambda.z)
- [`import`](    https://lucasdomanico.github.io/zekai/example.html?example=23_import.z)
- [`std`](       https://lucasdomanico.github.io/zekai/example.html?example=24_std.z)
- [`generics`](  https://lucasdomanico.github.io/zekai/example.html?example=25_generics.z)

If you are looking for the language specification, view `zekai.js` source code.
In particular the `parser` function.

### JavaScript API

```javascript
    import zekai from './zekai.js'
    let result = zekai(code)
    if(result.error) { // boolean
        console.log(result.line, result.column, result.msg) // number number string
    }
    else {
        console.log(result.out) // transpiled typescript code (string)
    }
```
### Editor

Requires `Node.js`.
No additional install required.

You can delete the `<zekai>/editor/node_modules/` folder and install `express` and `typescript`

To verify what is happening, check `<zekai>/editor/server.mjs`

On __Linux__:
```
    ./<zekai>/editor.sh
``` 

On __Windows__:
```
    <zekai>/editor.bat
``` 

Or just execute `node server.mjs` at `<zekai>/editor/`

If you open your browser at: `http://localhost:777`, it will show you the list of examples.

To edit a specific file `http://localhost:777/<path>.z`

`Ctrl+S` saves the file and generates the `.z.ts` and `.z.js` files

### Game of Life

(To view it with the proper syntax highlighting, use zekai editor
or visit [`https://lucasdomanico.github.io/zekai`](https://lucasdomanico.github.io/zekai)

```javascript
'std'
    range

width 200
height 200

Grid array(array(bool))

Grid
init_grid
    range(height).map(\
        range(width).map(\
            Math.random() > 0.5
        )
    )

Grid int int bool
at grid y x
    if y < 0 || x < 0 ret false
    if y >= height || x >= width ret false
    grid[y][x]

Grid Grid
step grid
    grid.map(\row y
        row.map(\alive x
            atari 0
            if at(grid y - 1 x - 1) atari += 1
            if at(grid y - 1 x + 0) atari += 1
            if at(grid y - 1 x + 1) atari += 1
            if at(grid y + 0 x - 1) atari += 1
            if at(grid y + 0 x + 1) atari += 1
            if at(grid y + 1 x - 1) atari += 1
            if at(grid y + 1 x + 0) atari += 1
            if at(grid y + 1 x + 1) atari += 1
            if alive && atari < 2
                ret false
            if alive && (atari == 2 || atari == 3)
                ret true
            if alive && atari > 3
                ret false
            if !alive && atari == 3
                ret true
            alive
        )
    )

Canvas HTMLCanvasElement

Canvas
canvas
    canvas document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.style.position = 'absolute'
    canvas.style.top = '0'
    canvas.style.right = '1.5%'
    canvas.style.border = '2px solid black'
    canvas.style.width = '40%'
    canvas.style.imageRendering = 'pixelated'
    document.body.append(canvas)
    canvas

Canvas void
animate canvas
    tick(canvas)
    setTimeout(\\ animate(canvas) 1000 / 60)

Canvas int int bool void
pixel canvas x y alive
    c canvas.getContext('2d')
    if c instanceof CanvasRenderingContext2D
        c.fillStyle = iif alive 'yellow' 'black'
        c.fillRect(x y 1 1)

grid init_grid()

Canvas void
tick canvas
    grid = step(grid)
    grid.forEach(\row y
        row.forEach(\alive x
            pixel(canvas x y alive)
        )
    )

main
    animate(canvas())
``` 


### License: MIT

Copyright © 2024 lucas.domanico@gmail.com



