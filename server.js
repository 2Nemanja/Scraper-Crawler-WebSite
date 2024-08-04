const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { puziPoStrani, vratiSadrzaj, dataReport } = require('./extract.js')

const app = express()
const port = 3000

// Middleware
app.use(bodyParser.json());
app.use(cors())

// Endpoint to handle POST request for scraping or crawling
app.post('/scrape', async (req, res) => {
    console.log('Received request body:', req.body)
    const { url, action } = req.body

    try {
        if (action === 'scrape') {
            const content = await vratiSadrzaj(url)
            res.json({ content })
        } else if (action === 'crawl') {
            const pages = await puziPoStrani(url, url, {}) 
            const report = await dataReport(await pages)
            res.json({ pages, report }) 
        } else {
            res.status(400).json({ error: 'Invalid action specified' }) 
        }
    } catch (err) {
        console.error('Error:', err)
        res.status(500).json({ error: 'Failed to process request' })
    }
})

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})