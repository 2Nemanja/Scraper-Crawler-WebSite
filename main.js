document.getElementById('scrapeButton').addEventListener('click', async function () {
    const url = document.getElementById('url').value
    try {
        const response = await fetch('http://localhost:3000/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url, action: 'scrape' })
        })

        if (response.ok) {
            const data = await response.json()
            displayScrapedData(data)
        } else {
            alert('Failed to scrape data')
        }
    } catch (error) {
        console.error('Error fetching data:', error.message)
    }
})

document.getElementById('crawlButton').addEventListener('click', async function () {
    const url = document.getElementById('url').value
    try {
        const response = await fetch('http://localhost:3000/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url, action: 'crawl' })
        })

        if (response.ok) {
            const data = await response.json()
            displayCrawledData(data)
            displayDataReport(pages)
        } else {
            alert('Failed to crawl data')
        }
    } catch (error) {
        console.error('Error fetching data:', error)
    }
})

function displayScrapedData(data) {
    const cardBody = document.getElementById('cardBody')
    cardBody.innerHTML = '' // Clear previous content

    if (data.content) {
        const formattedContent = data.content.replace(/\n/g, '<br>')
        cardBody.innerHTML = `
            <h2>Extracted Data:</h2>
            <p>${formattedContent}</p>
        `
    } else {
        cardBody.innerHTML = '<p>No content available.</p>'
    }
}

function displayCrawledData(data) {
    const cardBody = document.getElementById('cardBody')
    cardBody.innerHTML = '' // Clear previous content
    const content = typeof data === 'object' ? JSON.stringify(data, null, 2) : data // Check if data is JSON
    cardBody.innerHTML = `
        <h2>Extracted Data:</h2>
        <pre>${content}</pre>
    `
}

function displayDataReport(pages) {
    const reportOutput = dataReport(pages) 
    const reportSection = document.createElement('div')
    reportSection.innerHTML = `
    <h2>Page Report:<\h2>
    <pre>${reportOutput}</pre>`
    document.getElementById('cardBody').appendChild(reportSection)
}