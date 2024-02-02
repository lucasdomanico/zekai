/**
 * @license
 * Copyright 2024 lucas.domanico@gmail.com
 * SPDX-License-Identifier: MIT
 */

///////////////////////////////////////////////////////////////////////////////
// Parser Expression Grammar
///////////////////////////////////////////////////////////////////////////////

// let ast = (tag:string, text:string, data:ast[], pos:number, length:number, error:number):ast =>
let ast = (tag, text, data, pos, length, error) =>
            ({ tag, text, data, pos, length, error })

// let fail = (pos:number, error:number, tag:string):ast => {
let fail = (pos, error, tag) => {
    return ast(tag, "", [], pos, -1, error)
}
// let isfail = (ast:ast):boolean => {
let isfail = (ast) => {
    return ast.length == -1
}

// let all = (rules:rule[], tag = ""):rule => {
//     return (s:string, i:number) => {
let all = (rules, tag = "") => {
    return (s, i) => {
        let pos = i
        let error = i
        let data = []
        for(let n = 0; n < rules.length; n++) {
            let p = rules[n]
            let a = p(s, i)
            if(isfail(a)) {
                data.push(a) // fixed
                data.forEach((e) => {
                    if(e.error > error) error = e.error
                })
                // end fixed
                return fail(a.pos, error, a.tag)
            }
            i += a.length
            data.push(a)
        }
        return ast(tag, "", data, pos, i - pos, pos)
    }
}

// let many = (rule:rule, tag = ""):rule => { // uno o mas?, o cualquier cantidad?
//     return (s:string, i:number) => {
let many = (rule, tag = "") => { // uno o mas?, o cualquier cantidad?
    return (s, i) => {
        let size = s.length
        let pos = i
        let data = []
        for(;;) { // dead $.lock ***
            let a = rule(s, i)
            if(i + a.length > size || isfail(a)) {
            // if(isfail(a)) {
                return ast(tag, "", data, pos, i - pos, a.error) // fixed
            }
            i += a.length
            data.push(a)
        }
        // never
    }
}

// let cases = (rules:rule[], tag = ""):rule => {
//     return (s:string, i:number) => {
let cases = (rules, tag = "") => {
    return (s, i) => {
        let error = i
        for(let n = 0; n < rules.length; n++) {
            let r = rules[n]
            let a = r(s, i)
            if(!isfail(a)) {
                return ast(tag, "", [a], i, a.length, i) // WARNING: [a] maybe just 'a'
            }
            else {
                if(a.error > error) error = a.error
            }
        }
        return fail(i, error, tag)
    }
}


///////////////////////////////////////////////////////////////////////////////
// Parser
///////////////////////////////////////////////////////////////////////////////


let isAlphaNumeric = (str) => {
    let code = str.charCodeAt(0)
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false
    }
    return true
}
let is_alphaword = (str) => {
    for(let i = 0; i < str.length; i++) {
        let c = str[i]
        if(!isAlphaNumeric(c)) return false
    }
    return true
}


let token = (t, tag = "") => {
    return (s, i) => {
        if(s.slice(i, i + t.length) === t) {


            if(is_alphaword(t) && isAlphaNumeric(s[i + t.length])) {
                // console.error(t, s[i + t.length])
                return fail(i, i, tag)
            }


            return ast(tag, t, [], i, t.length, i)
        }
        return fail(i, i, tag)
    }
}

// let regex = (re:string, tag = ""):rule => { // too slow
//     return (s:string, i:number) => {
let regex = (re, tag = "") => { // too slow
    return (s, i) => {
        let e = s.substr(i).match(RegExp(re))
        if(e) {
            let r = e[0]
            return ast(tag, r, [], i, r.length, i)
        }
        return fail(i, i, tag)
    }
}

// let multi_regex = (re, tag = "") => { // too slow
//     return (s, i) => {
//         let e = s.substr(i).match(RegExp(re, 'm'))
//         if(e) {
//             let r = e[0]
//             return ast(tag, r, [], i, r.length, i)
//         }
//         return fail(i, i, tag)
//     }
// }


// let lazy = (rule:() => rule):rule => { // forward definitions
//     return (s:string, i:number) => {
let lazy = (rule) => { // forward definitions
    return (s, i) => {
        return rule()(s, i)
    }
}

let new_ast = ast



let atleast = (rule) => {
    return (s, i) => {
        let ast = rule(s, i)
        if(isfail(ast)) return ast
        if(ast.length === 0) return fail(ast.pos, ast.error, ast.tag)
        return ast
    }
}

let whitespace = (s, i) => {
    let pos = i
    for(;;) {
        if(i >= s.length) break
        let c = s.charAt(i)
        if(c === ' ' || c === '\t' || c === '\r' || c === '\n' || c === ',' || c === ';') {
            i++
            continue
        }
        if(s.charAt(i) === '#') {
            i += 1
            for(;;) {
                if(i >= s.length) break
                // if(s[i] === '{' && s[i + 1] === '{') break
                // if(s.charAt(i) === '\r' && s.charAt(i) === '\n') { i += 2; break }
                // if(s.charAt(i) === '\n' && s.charAt(i) === '\r') { i += 2; break }
                if(s.charAt(i) === '\n') { i += 1; break }
                i++
            }
            continue
        }
        break
    }
    return new_ast('ws', '', [], pos, i - pos, pos)
}
let blankspace = (s, i) => {
    let pos = i
    for(;;) {
        if(i >= s.length) break
        let c = s.charAt(i)
        if(c === ' ' || c === '\t' || c === ',' || c === ';') {
            i++
            continue
        }
        if(s.charAt(i) === '#') {
            i += 1
            for(;;) {
                if(i >= s.length) break
                // if(s[i] === '{' && s[i + 1] === '{') break
                if(s.charAt(i) === '\r' || s.charAt(i) === '\n') break
                i++
            }
            continue
        }
        break
    }
    return new_ast('b', '', [], pos, i - pos, pos)
}

let blankspace_nocomment = (s, i) => {
    let pos = i
    for(;;) {
        if(i >= s.length) break
        let c = s.charAt(i)
        if(c === ' ' || c === '\t' || c === ',' || c === ';') {
            i++
            continue
        }
        break
    }
    if(i === pos) return fail(pos, pos, '')
    return new_ast('b', s.substring(pos, pos + (i - pos)), [], pos, i - pos, pos)
}


let eof = (s, i) => {
    // console.error('eof', i >= s.length)
    if(i >= s.length) return new_ast('', '', [], i, 0, i)
    return fail(i, i, '')
}

let suite = (casesv, tag = '') => {
    return (s, i) => {
        let w = whitespace
        let braces = all([w, token('{'), w, many(all([cases(casesv), w])), w, token('}')])(s, i)
        if(!isfail(braces)) {
            let data = braces.data[3].data.map((ast) => ast.data[0].data[0])
            return new_ast(tag, '', data, braces.pos, braces.length, braces.error)
        }
        // suite
        let pos = i
        let ast = all([blankspace, token('\n'), blankspace_nocomment])(s, i)
        if(isfail(ast)) return ast
        let indent = ast.data[2].text
        i += ast.length - indent.length
        let data = []
        for(;;) {
            let line = all([blankspace_nocomment, maybe(cases(casesv)), blankspace, cases([token('\n'), eof])])(s, i)
            if(isfail(line) || line.data[0].text !== indent) {
                // if(s[i] === '\n') i += -1
                if(s[i - 1] === '\n') {
                    i += -1
                }
                return new_ast(tag, '', data, pos, i - pos, pos)
            }
            i += line.length
            if(line.data[1].data[0].tag !== 'none') {
                data.push(line.data[1].data[0].data[0])
            }
        }
    }
}

let none = (s, i) => ast('none', '', [], i, 0, 0)
let maybe = (rule) => cases([rule, none])

let parser = (macros) => {
    let $ = lazy
    let R = (rule, then) => { // returns rule
        return (s, i) => {
            let ast = rule(s, i)
            if(isfail(ast)) return ast
            // let r = then(ast)
            // if(isfail(r)) throw r
            // if(isfail(r)) return r
            // return r
            return then(ast)
        }
    }
    // let w       = regex("^([ \\t\\r\\n,])*", 'ws')
    // let b       = regex("^([ \\t\\r])*", 'b')
    let w       = whitespace
    let b       = blankspace
    // let idregex = '^[\\$A-Za-z_][\\$A-Za-z_\\d]*'
    

    let $id      = regex('^[\\$a-z_][\\$A-Za-z_\\d]*', 'id')
    let uid      = regex('^[\\A-Z][\\A-Za-z_\\d]+', 'uid')
    let $tid      = regex('^[\\$A-Za-z_][\\$A-Za-z_\\d]*', 'tid')
    let $ref     = regex('^[\\$A-Za-z_][\\$A-Za-z_\\d]*', 'ref')
    let $gid      = regex('^[\\A-Z]', 'gid') // generics id

    let tid = (s, i) => {
        let ast = $tid(s, i)
        if(isfail(ast)) return ast
        if(ast.text[0] === ast.text[0].toUpperCase()) {
            return ast
        }
        let types = [
            'void', 'bool', 'boolean', 'num', 'number', 'str', 'string',
            'int',
            'array', 'map',
            'tuple', 'extends', 'union',
            'fun', 'any'
        ]
        if(types.includes(ast.text)) return ast
        return fail(ast.pos, ast.error, '')
    }

    let gid = (s, i) => {
        let ast = $gid(s, i)
        if(isfail(ast)) return ast
        if(is_alphaword(s[i + 1])) {
            return fail(ast.pos, ast.error, '')
        }
        return ast
    }

    let is_keyword = (s) => {
        return s === 'new' || s === 'await' || s === 'iif' || s === 'async'
    }

    let id = (s, i) => {
        let ast = $id(s, i)
        if(isfail(ast)) return ast
        if(is_keyword(ast.text)) {
            return fail(ast.pos, ast.error, '')
        }
        return ast
    }
    let ref = (s, i) => {
        let ast = $ref(s, i)
        if(isfail(ast)) return ast
        if(is_keyword(ast.text)) {
            return fail(ast.pos, ast.error, '')
        }
        return ast
    }


    // let boolean = cases([token('true'), token('false')], 'boolean')
    // let True    = token('true', 'bool')
    // let False   = token('false', 'bool')
    let number  = R(regex("^(-?)((0[xX][0-9a-fA-F]+)|(\\d+(\\.\\d+)?))", 'number'), (ast) => ast)
    let string  = R(regex("^([\"'])((\\\\(\\1|\\\\))|.)*?\\1", 'string'), (ast) => ast)
    let multistr = regex("^'''((.|\n|\r)*?)'''", 'multistr')

    // let array   = R(all([token('['), w, many(all([$(() => expr), w])), w, token(']')], 'array'), (ast) => ast.data[2])

    let untyped_array = R(all([token('['), w, many(all([$(() => expr), w])), w, token(']')], 'untyped_array'), (ast) => {
        let asts = ast.data[2].data.map((a) => a.data[0])
        return new_ast(ast.tag, ast.text, asts, ast.pos, ast.length, ast.error)
        // return new_ast(ast.pos, ast.length, ast.error, ast.tag, [ast.data[2]], ast.text)
    })
    let typed_array = R(all([token('array('),  $(() => type), token(')')], 'typed_array'), (ast) => {
        return new_ast(ast.tag, '', [ast.data[1]], ast.pos, ast.length, ast.error)
        // return new_ast(ast.pos, ast.length, ast.error, ast.tag, [ast.data[2]], ast.text)
    })
    let array   = R(cases([typed_array, untyped_array]), (ast) => {
        return ast.data[0]
    })

    let member =  R(all([id, w, maybe(token(':')), w, $(() => expr)]), (ast) => {
        ast.data = [ast.data[0], ast.data[4]]
        return ast
    })
    let object = R(all([token('{'), w, many(all([member, w])), w, token('}')], 'object'), (ast) => {
        let members = ast.data[2].data.map((a) => a.data[0].data)
        let v = []
        members.forEach((member) => {
            v.push(member[0])
            v.push(member[1])
        })
        ast.data = v
        return ast
    })



    let typed_map   = R(all([token('map('),  $(() => type), b, $(() => type), token(')')], 'typed_map'), (ast) => {
        return new_ast(ast.tag, '', [ast.data[1], ast.data[3]], ast.pos, ast.length, ast.error)
        // return new_ast(ast.pos, ast.length, ast.error, ast.tag, [ast.data[2]], ast.text)
    })


    let Extends = R(all([token('extends('), $(() => expr), b, $(() => expr), token(')')], 'extends'), (ast) => {
        ast.data = [ast.data[1], ast.data[3]]
        return ast
        // return new_ast(ast.pos, ast.length, ast.error, ast.tag, [ast.data[2]], ast.text)
    })





    // let inline = all([id, token(','), w], 'inline')
    // let object  = R(all([token('{'), w, many(cases([inline, all([id, w, token(':'), w, $(() => expr), w]), id])), w, token('}')], 'object'), (ast) => {
    //     // let fields:ast[] = ast.data[2].data.map((a) => {
    //     //     return new_ast(a.pos, a.length, a.error, a.tag, [a.data[4]], a.data[0].text)
    //     // })
    //     // return new_ast(ast.pos, ast.length, ast.error, ast.tag, fields, ast.text)        
    //     let ids = ast.data[2].data.map((a) => {
    //         if(a.data[0].tag === 'id') {
    //             return a.data[0]
    //         }
    //         return a.data[0].data[0]
    //     })
    //     let exs = ast.data[2].data.map((a, i) => {
    //         if(a.data[0].tag === 'inline' || a.data[0].tag === 'id') {
    //             return new_ast('ref', ids[i].text, [], a.pos, a.length, a.error)
    //         }
    //         return a.data[0].data[4]
    //     })
    //     // woops
    //     let asts = []
    //     for(let i = 0; i < ids.length; i++) {
    //         asts.push(ids[i])
    //         asts.push(exs[i])
    //     }
    //     // return new_ast(ast.tag, ast.text, ids.concat(exs), ast.pos, ast.length, ast.error)
    //     return new_ast(ast.tag, ast.text, asts, ast.pos, ast.length, ast.error)
    // })




    let Let  = R(all([id, atleast(b), maybe(token(':=')), b, $(() => expr)], 'let'), (ast) => {
        return new_ast(ast.tag, ast.data[0].text, [ast.data[4]], ast.pos, ast.length, ast.error)
    })
    let typed_let  = R(all([token('@'), $(() => type), w, id, atleast(b), $(() => expr)], 'typed_let'), (ast) => {
        ast.text = ast.data[3].text
        ast.data = [ast.data[1], ast.data[5]]
        return ast
    })


    // let Return = R(all([token('return'), b, cases([$(() => expr), none])], 'return'), (ast) => {
    let Return = R(all([   cases([token('return'), token('ret')]), b, cases([$(() => expr), none])], 'return'), (ast) => {
        let exp = ast.data[2].data[0].tag === 'none'? [] : [ast.data[2].data[0]]
        return new_ast(ast.tag, ast.text, exp, ast.pos, ast.length, ast.error)
    })

    let Break = R(token('break'), (ast) => {
        return new_ast('break', '', [], ast.pos, ast.length, ast.error)
    })
    let Continue = R(token('continue'), (ast) => {
        return new_ast('continue', '', [], ast.pos, ast.length, ast.error)
    })

    let line = [Break, Continue, $(() => If), Return, $(() => For), typed_let, Let, $(() => assign_expr)]

    let Else = R(all([token('else'), b, cases([$(() => block)].concat(line))]), (ast) => {
        // throw ast
        return new_ast(ast.tag, ast.text, [ast.data[2].data[0]], ast.pos, ast.length, ast.error)
    })
    // let If = R(all([token('if'), w, token('('), w, $(() => expr), w, token(')'), w, cases([$(() => block)].concat(line)), w, cases([Else, none])], 'if'), (ast) => {
    //     let cond = ast.data[4]
    //     let body = ast.data[8].data[0]
    //     let els = ast.data[10].data[0].tag === 'none'? [] : [ast.data[10].data[0].data[0]]
    //     return new_ast(ast.tag, ast.text, [cond, body].concat(els), ast.pos, ast.length, ast.error)
    // })
    let If = R(all([token('if'), w, $(() => expr), b, cases([$(() => block)].concat(line)), cases([all([w, Else]), none])], 'if'), (ast) => {
        let cond = ast.data[2]
        let body = ast.data[4].data[0]
        let els = ast.data[5].data[0].tag === 'none'? [] : [ast.data[5].data[0].data[1].data[0]]
        // console.error(ast.data[5].data[0].data[1].data[0])
        // let els = []
        return new_ast(ast.tag, ast.text, [cond, body].concat(els), ast.pos, ast.length, ast.error)
    })


    // let For = R(all([token('for'), w, token('('), w, cases([Let, none]), w, token(';'), w, cases([$(() => expr), none]), w, token(';'), w, cases([increment, decrement, $(() => assign_expr), none]), w, token(')'), w, cases([$(() => block)].concat(line))], 'for'), (ast) => {
    // let For = R(all([token('for'), w, token('('), b, cases([Let, none]), b, token(';'), b, cases([$(() => expr), none]), b, token(';'), b, cases([$(() => assign_expr), none]), b, token(')'), w, cases([$(() => block)].concat(line))], 'for'), (ast) => {
    let For = R(all([token('for'), b, cases([Let, none]), b, cases([$(() => expr), none]), b, cases([$(() => assign_expr), none]), b, cases([$(() => block)].concat(line))], 'for'), (ast) => {
        let asts = [
            ast.data[2].data[0], ast.data[4].data[0], ast.data[6].data[0], ast.data[8].data[0]
        ]
        return new_ast(ast.tag, ast.text, asts, ast.pos, ast.length, ast.error)
    })


    // let block  = R(all([token('{{'), w, many(all([cases(line), w])), w, token('}}')], 'block'), (ast) => {
    //     let lines = ast.data[2].data.map((a) => a.data[0].data[0])
    //     return new_ast(ast.tag, ast.text, lines, ast.pos, ast.length, ast.error)
    // })

    let block  = R(suite(line, 'block'), (ast) => {
        // console.error(ast)
        let lines = ast.data
        return new_ast(ast.tag, ast.text, lines, ast.pos, ast.length, ast.error)
    })

    // let end_args = cases([token(':'), token('\\')])

    let func  = R(all([cases([all([token('async'), w]), none]), token('\\'), b, many(all([id, b])), b, maybe(token('\\')), b, cases([block, $(() => assign_expr)])], 'func'), (ast) => {
        let Async = ast.data[0].data[0].tag !== 'none'
        let args = ast.data[3].data.map((a) => a.data[0])
        args.push(ast.data[7].data[0])
        return new_ast(ast.tag, Async? 'async' : '', args, ast.pos, ast.length, ast.error)
    })

    // making par an instruction/ast makes easier the infix to prefix
    let par  = R(all([token('('), w, $(() => expr), w, token(')')], 'par'), (ast) => {
        return new_ast(ast.tag, ast.text, [ast.data[2]], ast.pos, ast.length, ast.error)
        // let a = {... ast.data[2], length:ast.length }
        return a
        // return new_ast(ast.tag, ast.text, [ast.data[2]], ast.pos, ast.length, ast.error)
    })

    // let literal = R(cases([func, par, array, typed_map, object, string, number, ref]), (ast) => {
    let literal = R(cases([func, par, array, typed_map, Extends, multistr, string, object, number, ref]), (ast) => {
        return ast.data[0]
    })

    ////////////////////////////////////////////////////////////////////////////////////////////
    //////// Expression Definition
    ////////////////////////////////////////////////////////////////////////////////////////////
    
    let assign_expr = R(cases([all([$(() => postfix), b, cases('= += -= *= /= %='.split(' ').map((op) => token(op))), w, $(() => expr)], 'assign'), $(() => expr)]), (ast) => {
        if(ast.data[0].tag === 'assign') {
            let data = [ast.data[0].data[0], ast.data[0].data[4]] 
            let text = ast.data[0].data[2].data[0].text
            return new_ast('assign', text, data, ast.pos, ast.length, ast.error)
        }
        return ast.data[0]
    })

    // atleast(w) to avoid iif true 1 -1
    let binary = (left, right, tokens) => R(all([left, maybe(all([w, cases(tokens.map((t) => token(t))), atleast(w), right]))]), (ast) => {
        if(ast.data[1].data[0].tag === 'none') {
            return ast.data[0]
        }
        let q = (L, R, text) => {
            // console.warn(text)
            if(R.tag === 'op' && tokens.includes(R.text)) {
                let right = R.data[1]
                let left = q(L, R.data[0], text)
                return new_ast('op', R.text, [left, right], ast.pos, ast.length, ast.error)
            }
            let data = [L, R]
            return new_ast('op', text, data, ast.pos, ast.length, ast.error)
        }
        return q(ast.data[0], ast.data[1].data[0].data[3], ast.data[1].data[0].data[1].data[0].text)
    })

    // let unary = (next) => R(all([maybe(token('!')), next]), (ast) => {
    //     if(ast.data[0].data[0].tag === 'none') {
    //         return ast.data[1]
    //     }
    //     return new_ast('not', '', [ast.data[1]], ast.pos, ast.length, ast.error)
    // })
    let toReversed = (v) => {
        let r = v.slice(0)
        r.reverse()
        return r
    }
    let unary = (next) => R(cases([all([token('await'), w, next], 'await'), all([many(cases([token('!'), token('~'), token('-')])), next])]), (ast) => {
        if(ast.data[0].tag === 'await') {
            return new_ast('await', '', [ast.data[0].data[2]], ast.pos, ast.length, ast.error)
        }
        let r = ast.data[0].data[1]
        toReversed(ast.data[0].data[0].data).forEach((a) => {
            if(a.data[0].text === '!') {
                r = new_ast('unary', '!', [r], a.data[0].pos, a.data[0].length, a.data[0].error)
                return
            }
            if(a.data[0].text === '~') {
                r = new_ast('unary', '~', [r], a.data[0].pos, a.data[0].length, a.data[0].error)
                return
            }
            if(a.data[0].text === '-') {
                r = new_ast('unary', '-', [r], a.data[0].pos, a.data[0].length, a.data[0].error)
                return
            }
            throw 'unknow'
        })
        r.pos = ast.pos
        r.length = ast.length
        return r
    })


    let field = R(all([token('.'), ref], 'field'), (ast) => {
        return new_ast(ast.tag, ast.data[1].text, [], ast.pos, ast.length, ast.error)
    })
    let index = R(all([token('['), w, $(() => expr), w, token(']')], 'index'), (ast) => {
        return new_ast(ast.tag, ast.text, [ast.data[2]], ast.pos, ast.length, ast.error)
    })
    let call_inline = R(all([token('('), w, many(all([$(() => expr), w])), w, token(')')], 'call'), (ast) => {
        let data = ast.data[2].data.map((a) => a.data[0])
        return new_ast(ast.tag, ast.text, data, ast.pos, ast.length, ast.error)
    })


    let call = R(cases([call_inline]), (ast) => {
        return ast.data[0]
    })

    let New = R(all([token('new'), atleast(w), $(() => access(false)), token('('), w, many(all([$(() => expr), w])), w, token(')')], 'new'), (ast) => {
        // console.error(ast)
        let args = ast.data[5].data.map((a) => a.data[0])
        return new_ast(ast.tag, ast.text, [ast.data[2]].concat(args), ast.pos, ast.length, ast.error)
    })
    // let access = (calls) => R(all([literal, many(cases([field, index].concat(calls? [call] : [])))]), (ast) => {
    let access = (calls) => R(all([cases([New, literal]), many(cases([field, index].concat(calls? [call] : [])))]), (ast) => {
        let r = ast.data[0].data[0]
        ast.data[1].data.forEach((a) => {
            if(a.data[0].tag === 'field') {
                r = {... a.data[0], data:[r] }
                return
            }
            if(a.data[0].tag === 'index') {
                r = {... a.data[0], data:[r, a.data[0].data[0]] }
                return
            }
            if(a.data[0].tag === 'call') {
                let args = a.data[0].data
                r = {... a.data[0], data:[r].concat(args) }
                return
            }
            throw 'unknow postfix'
        })
        r.pos = ast.pos
        r.length = ast.length
        return r
    })
    let postfix = R(cases([access(true)]), (ast) => {
        return ast.data[0]
    })

    let op_17 = postfix
    let op_16 = op_17 // new
    let op_15 = op_16 // increment ++ --
    let op_14 = unary(op_15)
    let op_13 = op_14 // exponentiation (**)
    let op_12 = binary(op_13, $(() => op_12), ['*', '/', '%'])
    let op_11 = binary(op_12, $(() => op_11), ['+', '-'])
    let op_10 = binary(op_11, $(() => op_10), ['<<', '>>>', '>>'])
    let op_9  = binary(op_10, $(() => op_9),  ['<=', '<', '>=', '>', 'instanceof']) // instanceof
    let op_8  = binary(op_9,  $(() => op_8),  ['==', '!='])
    let op_7  = binary(op_8,  $(() => op_7),  ['&'])
    let op_6  = binary(op_7,  $(() => op_6),  ['^'])
    let op_5  = binary(op_6,  $(() => op_5),  ['|'])
    let op_4  = binary(op_5,  $(() => op_4),  ['&&'])
    let op_3  = binary(op_4,  $(() => op_3),  ['||'])

    // let iif = R(all([op_3, maybe(all([w, token('?'), w, $(() => expr), w, token(':'), w, $(() => expr)]))]), (ast) => {
    //     if(ast.data[1].data[0].tag === 'none') {
    //         return ast.data[0]
    //     }
    //     let d = ast.data[1].data[0].data
    //     let data = [ast.data[0], d[3], d[7]]
    //     return new_ast('iif', '', data, ast.pos, ast.length, ast.error)
    // })

    let iif = R(cases([all([token('iif'), w, $(() => expr), w, $(() => expr), w, $(() => expr)], 'iif'), op_3]), (ast) => {
        if(ast.data[0].tag !== 'iif') return ast.data[0]
        // throw ast
        let d = ast.data[0].data
        let data = [d[2], d[4], d[6]]
        return new_ast('iif', '', data, ast.pos, ast.length, ast.error)
    })


    // let replace_calls = (data, ref) => {
    //     for(let i = 0; i < data.length; i++) {
    //         let ast = data[i]
    //         if(ast.tag === 'call') {
    //             let f = ast.data[0]
    //             if(f.tag === 'ref' && f.text[0] === f.text[0].toUpperCase()) {
    //                 // constructor
    //             }
    //             else {
    //                 let v = new_ast('do_array', '', ast.data.slice(1), f.pos, f.length, f.error)
    //                 let call = new_ast('ref', ref, [], f.pos, f.length, f.error)
    //                 ast.data = [call, f].concat(v)
    //             }
    //         }
    //         replace_calls(ast.data, ref)
    //     }
    // }
    // let Do = R(cases([all([token('do'), w, ref, b, block], 'do'), iif]), (ast) => {
    //     if(ast.data[0].tag !== 'do') return ast.data[0]
    //     ast = ast.data[0]
    //     let ref = ast.data[2].text
    //     replace_calls(ast.data[4].data, ref)
    //     ast.data = ast.data[4].data
    //     // console.error(ast)
    //     ast.tag = 'block'
    //     return ast
    // })

    let macro_context = {
        expr: $(() => expr),
        combo: R,
        all, cases, many,
        ast: new_ast,
        isfail, fail,
        w, b,
        token, regex,
        maybe, none,
        atleast
    }
    let macro = R(cases([macros(macro_context), iif]), (ast) => {
        return ast.data[0]
    })

    let expr = macro


    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    let generics = R(all([token('('), b, many(all([$(() => type), b])), b, token(')')], 'type'), (ast) => {
        return ast
    })
    let type  = R(all([tid, maybe(generics)], 'type'), (ast) => {
        let generics = []
        if(ast.data[1].data[0].tag !== 'none') {
            generics = ast.data[1].data[0].data[2].data.map((a) => a.data[0])
        }
        ast.text = ast.data[0].text
        ast.data = generics
        return ast
    })    

    let struct_field  = R(all([id, b, type]), (ast) => {
        ast.text = ast.data[0].text
        ast.data = [ast.data[2]]
        return ast
    })    
    let struct = R(all([uid, b, many(all([gid, b])), b, suite([struct_field])], 'struct'), (ast) => {
        let generics = ast.data[2].data.map((a) => a.data[0].text).join(' ')
        if(generics.length > 0) generics = ' ' + generics
        ast.text = ast.data[0].text + generics
        ast.data = ast.data[4].data
        return ast
    })
    let alias = R(all([uid, b, many(all([gid, b])), b, type], 'alias'), (ast) => {
        let generics = ast.data[2].data.map((a) => a.data[0].text).join(' ')
        if(generics.length > 0) generics = ' ' + generics
        ast.text = ast.data[0].text + generics
        ast.data = [ast.data[4]]
        // console.error(ast)
        return ast
    })
    let struct_empty = R(all([uid], 'struct'), (ast) => {
        ast.text = ast.data[0].text
        ast.data = []
        return ast
    })

    ///////////////// same as Let //////////////////////

    // let uninit  = R(all([id, atleast(b), token('('), type, token(')')], 'uninit'), (ast) => {
    //     return new_ast(ast.tag, ast.data[0].text, [ast.data[3]], ast.pos, ast.length, ast.error)
    // })

    let global  = R(all([id, atleast(b), maybe(token(':=')), b, expr], 'global'), (ast) => {
        return new_ast(ast.tag, ast.data[0].text, [ast.data[4]], ast.pos, ast.length, ast.error)
    })
    let typed_global  = R(all([token('@'), type, w, id, atleast(b), expr], 'typed_global'), (ast) => {
        ast.text = ast.data[3].text
        ast.data = [ast.data[1], ast.data[5]]
        return ast
    })




    ///////////////////////////////////////////////
    ////////// DEFUN //////////////////////////////
    ///////////////////////////////////////////////

    let defun_types = maybe(all([many(all([type, b])), token('\n')]))

    // let do_type = all([token('do('), tid, token(')'), b, token('\n')])


    let defun_inline_args = R(all([many(all([id, b])), b, token('=')]), (ast) => {
        let args = ast.data[0].data.map((a) => a.data[0])
        return new_ast('args', '', [args], ast.pos, ast.length, ast.error)
    })
    let defun_inline = R(all([defun_types, id, b, maybe(token('async')), b, defun_inline_args, b, $(() => assign_expr)], 'defun'), (ast) => {        
        let types = []
        if(ast.data[0].data[0].tag === 'none') {
            types = [new_ast('type', 'void', [], 0, 0, 0)]
        }
        else {
            types = ast.data[0].data[0].data[0].data.map((a) => a.data[0])
        }
        let id = ast.data[1].text
        let Async = ast.data[3].data[0].tag !== 'none'? ' async' : ''
        let args = ast.data[5].data[0]
        let lines = ast.data[7]
        ast.text = id + Async
        ast.data = types.concat(args).concat(lines)
        return ast
    })

    let defun_args  = R(all([many(all([id, b])), b, maybe(token('='))]), (ast) => {
        let args = ast.data[0].data.map((a) => a.data[0])
        return new_ast('args', '', [args], ast.pos, ast.length, ast.error)
    })

    let defun  = R(all([defun_types, id, b, maybe(token('async')), b, defun_args, b, block], 'defun'), (ast) => {
        // console.error('boom')
        let types = []
        if(ast.data[0].data[0].tag === 'none') {
            types = [new_ast('type', 'void', [], 0, 0, 0)]
        }
        else {
            types = ast.data[0].data[0].data[0].data.map((a) => a.data[0])
        }
        let id = ast.data[1].text
        let Async = ast.data[3].data[0].tag !== 'none'? ' async' : ''
        let args = ast.data[5].data[0]
        let lines = ast.data[7]
        ast.text = id + Async
        ast.data = types.concat(args).concat(lines)
        return ast
    })

    ////////// import ////////////////
    let using = R(all([ref, b, maybe(ref)], 'using'), (ast) => {
        if(ast.data[2].data[0].tag === 'none') {
            ast.data = [ast.data[0]]
            return ast
        }
        ast.data = [ast.data[0], ast.data[2].data[0]]
        return ast
    })    
    let include = R(all([string, b, suite([using])], 'include'), (ast) => {
        ast.data = [ast.data[0]].concat(ast.data[2].data)
        // console.error(ast)
        return ast
    })


    ///////////////////////////////////////////////////////////
    // cambiar w for blank (.text is comment)
    ///////////////////////////////////////////////////////////
    let script = R(all([w, many(all([cases([include, defun_inline, defun, struct, alias, struct_empty, typed_global, global]), w])), w], 'script'), (ast) => {
        let lines = ast.data[1].data.map((a) => a.data[0].data[0])
        return new_ast(ast.tag, ast.text, lines, ast.pos, ast.length, ast.error)
    })



    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////



    return (code) => {
        let ast = script(code, 0)
        if(isfail(ast)) return ast
        if(ast.pos + ast.length !== code.length) {
            return fail(code.length, ast.pos + ast.length, ast.tag)
        }        
        return ast
    }
}


///////////////////////////////////////////////////////////////////////////////
// Decompiler
///////////////////////////////////////////////////////////////////////////////

let detype = (type, scope_generics = []) => {
    if(type.tag !== 'type') throw new Error(type.tag)
    let args = []
    if(type.data.length !== 0) {
        args = type.data.map((t) => detype(t, scope_generics))
    }
    let args_str = ''
    if(args.length) {
        args_str = '<' + args.join(', ') + '>'
    }
    let id = type.text === 'array'? 'Array' : type.text
    if(type.text === 'map') id = 'Map'
    if(id === 'num')  id = 'number'
    if(id === 'int')  id = 'number'
    if(id === 'bool') id = 'boolean'
    if(id === 'str')  id = 'string'
    if(id === 'fun') {
        if(args.length === 0) return '() => void'

        // let generics = extract_generics(type.data)
        // generics = generics.filter((gen) => {
        //     for(let i = 0; i < scope_generics.length; i++) {
        //         if(scope_generics[i] === gen) return false
        //     }
        //     return true
        // })
        let generics_str = ''
        // if(generics.length) {
        //     generics_str = '<' + generics.join(', ') + ',>'
        // }

        let ret = args.pop()
        return  generics_str + '(' + args.map((gen, i) => {
            return '$' + i + ':' + gen
        }).join(', ') + ') => ' + ret
    }
    if(id === 'union') {
        return '(' + args.join(' | ') + ')'
    }
    if(id === 'extends') {
        return '(' + args.join(' & ') + ')'
    }
    if(id === 'tuple') {
        return '[' + args.join(', ') + ']'
    }
    return id + args_str
}

// let $new_class = `
// var classy = function classy() {
//     return function (Class:any) {
//         var _Class = function _Class() {
//             for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
//                 rest[_key] = arguments[_key];
//             }

//             return new(Function.prototype.bind.apply(Class, ([null] as any).concat(rest)))();
//         };
//         _Class.prototype = Class.prototype;
//         return _Class;
//     };
// };

// const $new_class = classy() as
//   <T, A extends any[], R>(ctor: T & (new (...args: A) => R)) => T & { (...args: A): R };
// `

let std = new Map()
// std.set('print', (name) => `
// let ${name} = (...args:any):void => console.log(...args)`)
std.set('range', (name) => `
let ${name} = (start:number, stop?:number, step?:number):number[] => {
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
}`)
// structuredClone algorithm
// Array
// ArrayBuffer
// Boolean
// DataView
// Date
// Error types (but see Error types below).
// Map
// Number
// Object objects: but only plain objects (e.g. from object literals).
// Primitive types, except symbol.
// RegExp: but note that lastIndex is not preserved.
// Set
// String
// TypedArray
std.set('clone', (name) => `
let ${name} = <T,>(o:T):T => {
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
}`)
// std.set('isnull', (name) => `
// let ${name} = (a:any):a is null => {
//     return a === null
// }`)
// std.set('assign', (name) => `
// let ${name} = <T,>(a:T, b:T):void => {
//     Object.keys(a as any).forEach((key) => {
//         (a as any)[key] = (b as any)[key]
//     })
// }`)
// std.set('copy', (name) => `
// function ${name}<T>(o:T):T {
//     return Object.assign(Object.create(Object.getPrototypeOf(o)), o)
// }`)

let extract_generics_x = (type, generics) => {
    if(type.text.length === 1 && type.text[0] === type.text[0].toUpperCase()) {
        generics.value.push(type.text)
        return
    }
    type.data.forEach((t) => {
        extract_generics_x(t, generics)
    })
}
let extract_generics = (types) => {
    let generics = { value:[] }
    types.forEach((type) => {
        extract_generics_x(type, generics)
    })
    return [...new Set(generics.value)]
}


// function copy<T>(a:T):T {
//     return Object.assign(Object.create(Object.getPrototypeOf(a)), a)
// }

// let clone = Object.assign(Object.create(Object.getPrototypeOf(orig)), orig)

let $extends = `
const $extends = <T, S,>(a:T, b:S):(T & S) => {
    let o = { ...a, ...b }
    Object.setPrototypeOf(o, Object.getPrototypeOf(b))
    Object.setPrototypeOf(Object.getPrototypeOf(o), Object.getPrototypeOf(a))
    return o
}
`

let use_extends = (ast) => {
    if(ast.tag === 'extends') return true
    for(let i = 0; i < ast.data.length; i++) {
        let a = ast.data[i]
        let r = use_extends(a)
        if(r === true) return true
    }
    return false
}

let decompile_main = (ast, types) => {
    let lib = ''
    if(use_extends(ast)) {
        lib = $extends + '\n'
    }
    let options = { raise:false, as_any:false }
    let code = decompile(ast, types, 0, false, options)
    if(options.raise === true) {
        lib = 'let $raise = (msg) => { throw new Error(msg) }\n' + lib
    }
    if(options.as_any) {
        lib = 'let $any = (t:any) => t as any\n' + lib
    }
    return lib + code
}


let decompile = (ast, types, indent, ret, options) => {

    let decom = ($ast, $indent, $ret) => decompile($ast, types, $indent, $ret, options)

    if(ast.tag === 'script') {
        return ast.data.map((a) => {
            return '    '.repeat(indent) + decom(a, indent)
        }).join('\n')
    }


    // if(ast.tag === 'struct') {
    //     return 'const ' + ast.text + ' = (' + ast.data.map((a) => a.text).join(', ') + ') => ({ ' +
    //         ast.data.map((a) => a.text).join(', ') + ' })'
    // }
    if(ast.tag === 'struct') {

        if(types) {
            // throw ast
            let ids = ast.text.split(' ')
            let generics = ''
            if(ids.length > 1) {
                generics = '<' + ids.slice(1).join(', ') + '>'
            }
            let scope_generics = ids.slice(1)
            return 'export class ' + ids[0] + generics + ' { constructor(\n' +
                ast.data.map((a) => '    public ' + a.text + ':' + detype(a.data[0], scope_generics)).join(',\n') +
                ') {}\n    static struct = ' + generics + '(o:{ ' +
                    ast.data.map((a) => a.text + ':' + detype(a.data[0], scope_generics)).join(', ') +
                ' }) => {\n' +
                    '        return new ' + ids[0] + generics + '(' +
                        ast.data.map((a) => 'o.' + a.text).join(', ') +
                    ')' +
                '\n    }\n}\n'
        }
        // never happens
        throw new Error('types are mandatory')

        // let raise = (id) => '(() => { throw new Error("struct ' + ast.text + ' field ' + id + ' is undefined") })()'
        // return 'const ' + ast.text + ' = (' + ast.data.map((a) => a.text).join(', ') + ') => ({\n' +
        //     // ast.data.map((a) => a.text).join(', ') + ' })'
        //     ast.data.map((a) => '\t' + a.text + ': ' + a.text + ' === undefined? ' + raise(a.text) + ' : ' + a.text).join(',\n') + '\n})'
    }
    if(ast.tag === 'alias') {
        if(types) {
            let ids = ast.text.split(' ')
            let generics = ''
            if(ids.length > 1) {
                generics = '<' + ids.slice(1).join(', ') + ',>'
            }
            let scope_generics = ids.slice(1)
            return 'export type ' + ids[0] + generics + ' = ' + detype(ast.data[0], scope_generics) + '\n'
        }
        return ''
    }
    if(ast.tag === 'global') {
        return 'export let ' + ast.text + ' = ' + decom(ast.data[0], indent) + '\n'
    }

    if(ast.tag === 'typed_global') { // add generics for fun
        return 'export let ' + ast.text + ':' + detype(ast.data[0]) + ' = ' + decom(ast.data[1], indent) + '\n'
    }

    // if(ast.tag === 'uninit') {
    //     if(types) {
    //         // console.error(ast)
    //         return 'export let ' + ast.text + ':' + detype(ast.data[0]) + '\n'
    //     }
    //     return 'let ' + ast.text + ' = null'
    // }
    // if(ast.tag === 'typed_global') {
    //     return 'let ' + ast.text + ' = ' + decom(ast.data[1], indent)
    // }
    if(ast.tag === 'defun') {
        // if(ast.data[0].tag === 'type' && ast.data[0].text === 'do') {
        //     let generic = ast.data[0].data[0].text
        //     let id = ast.text
        //     let f = ast.data[1].text
        //     let args = ast.data[2].text
        //     return 'export const ' + id + ' = <F extends (...args:Array<any>) => any>(' + f + ':F, ' + args + ':Parameters<F>):' + generic + '<ReturnType<F>> => ' +
        //         decom(ast.data.at(-1), indent, true)
        // }

        let typesc = ast.data.filter((a) => a.tag === 'type').length
        if(ast.data.length !== typesc * 2) {
            options.raise = true
            return `$raise("types dont match arguments on function \'${ast.text}\'" )\n`
        }
        let argc = ast.data.length / 2
        let type = ''
        let split = ast.text.split(' ')
        let Async = split[1] === 'async'? 'async ' : ''
        let ast_text = split[0]
        let generics = extract_generics(ast.data.slice(0, argc))
        let generics_text = ''
        if(types) {
            if(generics.length !== 0) {
                generics_text = '<' + generics.join(', ') + ',>'
            }
            type = 'export type ' + ast_text + ' = ' + generics_text + '('
            let v = []
            let id = argc
            let tid = 0
            for(let i = 0; i < argc - 1; i++) {
                let id_str = ast.data[id].text
                let tid_str = detype(ast.data[tid])
                v.push(id_str + ':' + tid_str)
                id++
                tid++
            }
            let str = v.join(', ')
            type += str + ') => ' + detype(ast.data[argc - 1]) + '\n'
            // console.error(type)
        }
        let desc = ''
        if(types) {
            desc = ':' + ast_text
        }
        return type + 'export const ' + ast_text + desc + ' = ' + Async + generics_text + '(' +
            ast.data.slice(argc, argc * 2 - 1).map((a, i) => {
                return a.text + (generics_text? ':' + detype(ast.data[i]) : '')
            }).join(', ') + ') => ' +
            decom(ast.data.at(-1), indent, true) + '\n'
    }
    // if(ast.tag === 'include') {
    //     let rand = '$$$' + includes.value++
    //     return 'import * as ' + rand + ' from ' + ast.data[0].text + '\n' +
    //         ast.data.slice(1).map((using) => {
    //             if(using.data.length === 2) {
    //                 return 'let ' + using.data[0].text + ' = ' + rand + '.' + using.data[1].text
    //             }
    //             return 'let ' + using.data[0].text + ' = ' + rand + '.' + using.data[0].text
    //         }).join('\n')
    // }
    if(ast.tag === 'include') {

        if(ast.data[0].text.substring(1, ast.data[0].text.length - 1) === 'std') {
            return ast.data.slice(1).map((using) => {
                let name = using.data[0].text
                let func = using.data.length === 2? using.data[1].text : using.data[0].text
                if(!std.has(func)) return ''
                return std.get(func)(name)
            }).join('\n')
        }

        return 'import {\n' +
            ast.data.slice(1).map((using) => {
                if(using.data.length === 2) {
                    return '    ' + using.data[1].text + ' as ' + using.data[0].text
                }
                return '    ' + using.data[0].text
            }).join(',\n') + '\n} from ' + ast.data[0].text + '\n'
    }




    // if(ast.tag === 'block') {
    //     let $ret = ret? 'return ' : ''
    //     if(ast.data.length > 0 && ast.data.at(-1).tag === 'return') $ret = ''
    //     return '{\n' + ast.data.map((a, i) => {
    //         return '    '.repeat(indent + 1) + (i === ast.data.length - 1? $ret : '') + decom(a, indent + 1)
    //     }).join('\n') + '\n' + '    '.repeat(indent) + '}'
    // }


    if(ast.tag === 'block') {
        let $ret = ret? 'return ' : ''
        if(ast.data.length > 0) {
            if(ast.data.at(-1).tag === 'return') $ret = ''
            if(ast.data.at(-1).tag === 'if')     $ret = ''
            if(ast.data.at(-1).tag === 'for')    $ret = ''
        } 
        return '{\n' + ast.data.map((a, i) => {
            return '    '.repeat(indent + 1) + (i === ast.data.length - 1? $ret : '') + decom(a, indent + 1)
        }).join('\n') + '\n' + '    '.repeat(indent) + '}'
    }



    if(ast.tag === 'number') {
        return ast.text
    }

    if(ast.tag === 'string') {
        return ast.text
    }

    if(ast.tag === 'multistr') {
        let lines = ast.text.slice(3, -3).split('\n')
        return "`" + lines.join('\n') + "`"
    }


    // if(ast.tag === 'do_array') {
    //     return '[' + ast.data.map((a) => decom(a, indent) + ' as any').join(', ')  + ']' 
    // }

    if(ast.tag === 'untyped_array') {
        return '[' + ast.data.map((a) => decom(a, indent)).join(', ')  + ']' 
    }
    if(ast.tag === 'typed_array') {
        return '([] as Array<' + detype(ast.data[0]) + '>)' 
    }

    if(ast.tag === 'typed_map') {
        return 'new Map<' + detype(ast.data[0]) + ', ' + detype(ast.data[1]) + '>()' 
    }

    if(ast.tag === 'extends') {
        return '$extends(' + decom(ast.data[0], indent) + ', ' + decom(ast.data[1], indent) + ')' 
    }



    if(ast.tag === 'object') {
        options.raise = true
        return '$raise("objects cannot be used outside of class constructors")'
        // let members = ast.data.slice(1)
        // let v = []
        // for(let i = 0; i < members.length / 2; i++) {
        //     v.push(members[i * 2].text + ':' + decom(members[i * 2 + 1], indent))
        // }
        // return decom(ast.data[0], indent) + '.struct({ ' + v.join(', ') + ' })'
    }

    if(ast.tag === 'let') {
        return 'let ' + ast.text + ' = ' + decom(ast.data[0], indent)
    }
    if(ast.tag === 'typed_let') {
        return 'let ' + ast.text + ':' + detype(ast.data[0]) + ' = ' + decom(ast.data[1], indent)
    }

    if(ast.tag === 'func') {
        let Async = ast.text === 'async'? 'async ' : ''
        return Async + '(' + ast.data.filter((a) => {
            return a.tag === 'id'
        // }).map((a) => a.text + ':any').join(', ') + ') => ' + decom(ast.data.at(-1), indent, true)
        }).map((a) => a.text).join(', ') + ') => ' + decom(ast.data.at(-1), indent, true)
    }

    if(ast.tag === 'par') {
        return '(' + decom(ast.data[0], indent) + ')'
    }

    if(ast.tag === 'op') {
        let op = ast.text
        if(ast.text === '==')   op = '==='
        if(ast.text === '!=')   op = '!=='
        return decom(ast.data[0], indent) + ' ' + op + ' ' + decom(ast.data[1], indent)
    }

    if(ast.tag === 'unary') {
        let op = ast.text
        return op + decom(ast.data[0], indent)
    }

    if(ast.tag === 'iif') {
        return decom(ast.data[0], indent) + '? ' +
            decom(ast.data[1], indent) + ' : ' +
            decom(ast.data[2], indent)
    }

    if(ast.tag === 'field') {
        return decom(ast.data[0], indent) + '.' + ast.text
    }

    if(ast.tag === 'ref') {
        return ast.text
    }

    if(ast.tag === 'index') {
        return decom(ast.data[0], indent) + '[' + decom(ast.data[1], indent) + ']'
    }

    if(ast.tag === 'call' || ast.tag === 'new') {
        let $new = ast.tag === 'new'? 'new ' : ''
        // console.log(ast)
        // let $new = ''
        if(ast.data[0].tag === 'ref') {
            let char = ast.data[0].text[0]
            if(char === char.toUpperCase()) {
                $new = 'new '
            }
        }
        if(ast.data[0].tag === 'ref' && ast.data[0].text === 'import') {
            if(ast.data.slice(1).length !== 1) {
                // return '(() => { throw new Error("bad import") })()'
                return 'import()'
            }
            return 'import(' + ast.data.slice(1).map((a) => decom(a, indent)).join(', ') + ' as any)'
        }
        if(ast.data[0].tag === 'ref' && ast.data[0].text === 'any') {
            options.as_any = true
            return '$any(' + decom(ast.data[1], indent) + ')'
        }
        if(ast.data.length > 1 && ast.data[1].tag === 'object') {
            let members = ast.data[1].data
            let v = []
            for(let i = 0; i < members.length / 2; i++) {
                v.push(members[i * 2].text + ':' + decom(members[i * 2 + 1], indent))
            }
            return decom(ast.data[0], indent) + '.struct({ ' + v.join(', ') + ' })'
        }
        return $new + decom(ast.data[0], indent) +
            '(' + ast.data.slice(1).map((a) => decom(a, indent)).join(', ') + ')'
    }

    if(ast.tag === 'assign') {
        let L = decom(ast.data[0], indent)
        let R = decom(ast.data[1], indent)
        let op = ast.text
        return L + ' ' + op + ' ' + R
    }

    if(ast.tag === 'for') {
        let start = ast.data[0].tag === 'none'? '' : decom(ast.data[0], indent)
        let cond =  ast.data[1].tag === 'none'? '' : ' ' + decom(ast.data[1], indent)
        let acc =   ast.data[2].tag === 'none'? '' : ' ' + decom(ast.data[2], indent)
        let body =  decom(ast.data[3], indent)
        return 'for(' + start + ';' + cond + ';' + acc + ') ' + body
    }

    if(ast.tag === 'return') {
        if(ast.data.length === 0) return 'return'
        return 'return ' + decom(ast.data[0], indent)
    }

    if(ast.tag === 'break') {
        return 'break'
    }

    if(ast.tag === 'continue') {
        return 'continue'
    }

    if(ast.tag === 'await') {
        return 'await ' + decom(ast.data[0], indent)
    }

    if(ast.tag === 'if') {
        return 'if(' + decom(ast.data[0], indent) + ') ' + decom(ast.data[1], indent) +
           (ast.data.length === 3? '\n' +
           '    '.repeat(indent) + 'else ' + decom(ast.data[2], indent) : '')
    }

    throw new Error('unknown ast tag \'' + ast.tag + '\'')
}

///////////////////////////////////////////////////////////////////////////////
// API
///////////////////////////////////////////////////////////////////////////////

let error_at_line = (code, error) => {
    let line = 1
    for(let i = 0; i < code.length; i++) {
        if(i >= error) break
        if(code[i] === '\n') {
            line++
        }
    }
    return line
}

let zekai_result = (ast, out, error, line, column, msg) => ({
                    ast, out, error, line, column, msg
})

// let code_parser_error = 0
// let code_okay = 1

let api = {
    ast: parser,
    decompile: decompile_main
}

export default (code, macros) => {
    macros ??= (_) => (s, i) => fail(i, i, '')
    let ast = api.ast(macros)(code)
    if(ast.length === -1) {
        let line = error_at_line(code, ast.error)
        return zekai_result(ast, '', true, line, 0, 'parser error at line ' + line)
    }
    let out = api.decompile(ast, true)
    return zekai_result(ast, out, false, -1, -1, '')
}













