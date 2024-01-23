
import express from 'express'
import fs from 'fs'
import path from 'path'
import ts from './node_modules/typescript/lib/typescript.js'
import zekai from '../zekai.js'

let port = 777
let cwd = process.cwd()

let resolve = (s) => {
    return path.resolve(s)    
}

let compile = (code) => {
    let result = zekai(code)
    if(result.error) {
        return `
            let main = () => {
                throw new Error(${JSON.stringify(result.msg)})
            }
        `
    }
    return result.out
}

let ts_to_js = (source) => {
    let result = ts.transpileModule(source, {
        compilerOptions: {
            module: ts.ModuleKind.ES2022,
            lib: 'dom',
            target: ts.ScriptTarget.ES2022
        }
    })
    return result.outputText
}

express().all('/*', (req, res) => {
    console.log('req', req.path)

    let path = req.path.substring(1)

    // list examples
    if(path === '') {
        let exs = fs.readdirSync(resolve(cwd + '/../examples/')).filter((path) => {
            return path.substring(path.length - 2) === '.z'
        })
        let links = exs.map((ex) => {
            return 'http://localhost:' + port + '/' + resolve(cwd + '/../examples/' + ex).replaceAll('\\', '/')
        })
        let html = links.map((link) => {
            let split = link.split('/')
            let name = split.pop()
            let url = split.join('/')
            return `
                <div style="width:80%; margin:0 auto; padding:2px 0 2px 0">
                    <a href="${link}" style="color:white; font:inherit; text-decoration:none">
                        ${url}/<span style="color:#ffd500">${name}</span>
                    </a>
                </div>
            `
        }).join('\n')
        res.send(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>zekai!</title>
                </head>
                <body style="padding:20px 0 0 0; margin:0; background:#111; font-family:consolas">
                    <div style="color:#ffd500; width:80%; margin:0 auto">
                        zekai!
                    </div>
                    ${html}
                </body>
            </html>
        `)
        return
    }

    if(req.path === '/favicon.ico') {
        res.sendFile(resolve(cwd + '/pulsar.png'))
        return
    }

    // CODE MIRROR
    if(path.split('codemirror5').length === 2) {
        let url = resolve(cwd + '/codemirror5' + path.split('codemirror5')[1])
        res.sendFile(url)
        return
    }
    if(path.endsWith('/index.css')) {
        let url = resolve(cwd + '/index.css')
        res.sendFile(url)
        return
    }

    let exists = fs.existsSync(path)
    if(!exists) {
        res.sendStatus(404)
        return
    }

    let jsfile = path.substring(path.length - 3) === '.js'
    if(jsfile) {
        res.sendFile(path)
        return
    }

    let zfile = path.substring(path.length - 2) === '.z'
    if(!zfile) {
        res.send('file is not .z')
        return
    }

    if(req.method === 'POST') {
        let datav = []
        req.on('data', (data) => datav.push(data))
        req.on('end', async () => {
            let body = Buffer.concat(datav) + ''
            let tscode = compile(body)
            let jscode = ts_to_js(tscode)
            fs.writeFileSync(path, body)
            fs.writeFileSync(path + '.ts', tscode)
            fs.writeFileSync(path + '.js', jscode)
            res.send(true)
        })
        return
    }

    let code = fs.readFileSync(path, 'utf8') + ''
    code = code.replace(/\r\n/g, "\n") // CRLF to LF

    let html = fs.readFileSync(cwd + '/index.html') + ''
    html = html.replace('//%SERVER_CODE%//', `
        codemirror_value = ${JSON.stringify(code)}
        codemirror_fetch = 'http://localhost:${port}/' + ${JSON.stringify(path)}
    `).replace('//%SERVER_MAIN%//', ts_to_js(compile(code)) + '\nmain()')

    res.send(html)

}).listen(port, () => {
    console.log(`http://localhost:${port}`)
})
