const {JSDOM} = require('jsdom')

function normalizacija_URLa(url_String) {
    try {
        const urlobjekat = new URL(url_String)
        const hostPath = `${urlobjekat.hostname}${urlobjekat.pathname}`
        if(hostPath.length > 0 && hostPath.slice(-1) === '/') {
            return hostPath.slice(0,-1)
        }

        return hostPath
    } catch (error) {
        console.log(`ERR: --- ${error.message} ---`)
        return url_String
    }
}

function uzmi_URL_iz_HTMLa(html_Body, base_URL) { 
    const dom  = new JSDOM(html_Body)
    const nizLinkova = []
    const linkElementi = dom.window.document.querySelectorAll('a')
    for (const linkElement of linkElementi) {
        if (linkElement.href.slice(0,1) === '/') {
            try {
                const urlobjekat = new URL(`${base_URL}${linkElement.href}`)
                nizLinkova.push(urlobjekat.href)
            } catch (error) {
                console.log(`ERR: --- invalid url at ${error.message}---`)
            }
        } else{
            try {
                const urlobjekat = new URL(linkElement.href)
                nizLinkova.push(urlobjekat.href)
            } catch (error) {
                console.log(`ERR: --- invalid url at ${error.message}---`)
            }
        }
    }
    return nizLinkova
}

async function vratiSadrzaj(base_URL) {
    try {
        const resp = await fetch(base_URL)
        const tekst = await resp.text()
        const dom = new JSDOM(tekst)
        const doc = dom.window.document
        const textContent = doc.body.textContent || ""

        console.log(textContent.trim())
        return textContent.trim()
    } catch (error) {
        console.error(`Error fetching content from ${currentUrl}: ${error.message}`)
        throw error
    }
}

async function puziPoStrani(base_URL, currentUrl, pages) {
    const baseUrlObjekat = new URL(base_URL)
    const currentUrlObjekat = new URL(currentUrl) 
    if(baseUrlObjekat.hostname !== currentUrlObjekat.hostname) {
        return pages
    }
    
    const normalizedCurrent = normalizacija_URLa(currentUrl)
    if( pages[normalizedCurrent] > 0) {
        pages[normalizedCurrent]++
        return pages
    }

    pages[normalizedCurrent] = 1
    console.log(`actively crawling on ${currentUrl}`)
    try {
        const resp = await fetch(currentUrl)

        if(resp.status > 399) {
            console.log(`ERR: --- error in fetch ${resp.status} on page ${currentUrl} --- `)
            return pages
        }
        const contentType  = resp.headers.get("content-type")
        if( !contentType.includes("text/html") ) {
            console.log(`ERR: --- non html response, conType ${contentType}, on page: ${currentUrl}`)
            return pages
        }

        const HtmlBody = await resp.text()
        const nextURLs = uzmi_URL_iz_HTMLa(HtmlBody, base_URL)

        for (const nextUrl of nextURLs) {
            if (!pages[nextUrl]) {
                pages[nextUrl] = 1 // Initialize if not visited
                pages = await puziPoStrani(base_URL, nextUrl, pages)
            }
        }
        
    } catch (error) {
        console.log(`ERR: --- ${error.message} --- on page ${currentUrl} --- `)
    }
    return pages
}

function sortPages(pages) {
    pagesARR = Object.entries(pages)
    pagesARR.sort((a,b) => {
        aHits = a[1]
        bHits = b[1]
        return b[1] - a[1]
    })
    return pagesARR
 
 }

 function dataReport(pages) {
    let report = `<br><br>BEGIN REPORT<br><br>`

    const sortedPages = sortPages(pages)
    sortedPages.forEach(([url, hits]) => {
        report += `Found ${hits} on page ${url}<br>`
        console.log(`Found ${hits} on page ${url}<br>\n`)
    })

    report += `<br><br>END REPORT<br><br>`

    return report
}

module.exports = {
    normalizacija_URLa,
    uzmi_URL_iz_HTMLa,
    puziPoStrani, 
    vratiSadrzaj,
    dataReport
} 