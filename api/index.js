const express = require('express');
const cors = require('cors');
const { MOVIES } = require('@consumet/extensions');
const cheerio = require('cheerio');
const axios = require('axios');

const app = express();
app.use(cors());

// Initialize Dramacool provider
const dramacool = new MOVIES.DramaCool();
dramacool.baseUrl = 'https://dramacool9.com.ro';

// Search endpoint
app.get('/api/movies/dramacool/search/:query', async (req, res) => {
    try {
        const query = req.params.query;
        const response = await axios.get(`https://dramacool9.com.ro/?s=${encodeURIComponent(query)}`);
        const $ = cheerio.load(response.data);
        const results = [];
        $('a.mask').each((i, el) => {
            const fullText = $(el).text().trim();
            const title = fullText.split('\n')[0].trim();
            const href = $(el).attr('href');
            if (href && title) {
                const id = href.replace('https://dramacool9.com.ro/', '').replace(/\/$/, '');
                results.push({ id, title, url: href });
            }
        });
        res.json({ results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Popular endpoint
app.get('/api/movies/dramacool/popular', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const result = await dramacool.fetchPopular(page);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Info endpoint (gets episodes)
app.get('/api/movies/dramacool/info', async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) return res.status(400).json({ error: "id is required" });
        const response = await axios.get(`https://dramacool9.com.ro/${id}`);
        const $ = cheerio.load(response.data);
        const episodes = [];
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && href.includes('episode') && href.includes(id.replace('-hd', ''))) {
                const epId = href.replace('https://dramacool9.com.ro/', '').replace(/\/$/, '');
                const match = epId.match(/episode-(\d+)/i);
                const num = match ? parseFloat(match[1]) : episodes.length + 1;
                if (!episodes.find(e => e.id === epId)) {
                    episodes.push({
                        id: epId,
                        number: num,
                        title: $(el).attr('title') || `Episode ${num}`,
                        url: href
                    });
                }
            }
        });
        episodes.reverse();
        res.json({ id, title: id, episodes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Watch endpoint (gets stream links)
app.get('/api/movies/dramacool/watch', async (req, res) => {
    try {
        const episodeId = req.query.episodeId;
        if (!episodeId) return res.status(400).json({ error: "episodeId is required" });
        const url = `https://dramacool9.com.ro/${episodeId}`;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const iframeSrc = $('iframe').attr('src');
        if (iframeSrc) {
            res.json({ iframe: iframeSrc });
        } else {
            res.status(404).json({ error: "Could not find stream iframe" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Export the Express app as a Vercel serverless function
module.exports = app;

// Add local server listener for local development
if (require.main === module) {
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
        console.log(`Backend server listening on port ${port}`);
    });
}
