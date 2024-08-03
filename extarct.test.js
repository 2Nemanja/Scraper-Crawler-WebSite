const { normalizacija_URLa, uzmi_URL_iz_HTMLa} = require('./extract.js')
const { test, expect } = require('@jest/globals')

test('prazan check', () => {
    const input = ''
    const actual = normalizacija_URLa(input)  
    const expected = ''
    expect(actual).toEqual(expected)
})

test('Bez protokola', () => {
    const input = 'https://blog.boot.dev/path'
    const actual = normalizacija_URLa(input)  
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('Bez protokola HTTP', () => {
    const input = 'http://blog.boot.dev/path'
    const actual = normalizacija_URLa(input)  
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})


test('Viseci slash', () => {
    const input = 'https://blog.boot.dev/path/'
    const actual = normalizacija_URLa(input)  
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})


test('CAPSLOCK CHECK', () => {
    const input = 'https://BLOG.boot.dev/path/'
    const actual = normalizacija_URLa(input)  
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})
    
test('URL iz HTMLa', () => {
    const inputHtml = `
    <html>
        <body>
            <a href="https://blog.boot.dev/path/"
            Boot.dev
            </a>
            <a href="https://blog.boot.dev/path1/"
            Boot.dev
            </a>
            <a href="https://blog.boot.dev/path2/"
            Boot.dev
            </a>
            <a href="/path3/"
            Boot.dev path3
            </a>
        </body>
    </html>
    `
    const inputBaseUrl = "https://blog.boot.dev"
    const actual = uzmi_URL_iz_HTMLa(inputHtml, inputBaseUrl)
    const expected = [
        "https://blog.boot.dev/path/",
        "https://blog.boot.dev/path1/",
        "https://blog.boot.dev/path2/",
        "https://blog.boot.dev/path3/"
        
    ]
    expect(actual).toEqual(expected)
})

   
test('Relativ URL iz HTMLa', () => {
    const inputHtml = `
    <html>
        <body>
            <a href="invalid/"
            Boot.dev
            </a>
        </body>
    </html>
    `
    const inputBaseUrl = "https://blog.boot.dev"
    const actual = uzmi_URL_iz_HTMLa(inputHtml, inputBaseUrl)
    const expected = []
    expect(actual).toEqual(expected)
})
