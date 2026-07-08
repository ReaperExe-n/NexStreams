const express = require('express');
const cors = require('cors');
const { MOVIES } = require('@consumet/extensions');

const app = express();
app.use(cors());

// Initialize Dramacool provider
const dramacool = new MOVIES.DramaCool();
dramacool.baseUrl = 'https://dramacool9.com.ro';

const cheerio = require('cheerio');
const axios = require('axios');

// Search endpoint
app.get('/movies/dramacool/search/:query', async (req, res) => {
    try {
        const query = req.params.query;
        // The Consumet dramacool package search is broken due to WP migration, manually scrape the WP search:
        const response = await axios.get(`https://dramacool9.com.ro/?s=${encodeURIComponent(query)}`);
        const $ = cheerio.load(response.data);
        const results = [];
        $('a.mask').each((i, el) => {
            const fullText = $(el).text().trim();
            const title = fullText.split('\n')[0].trim();
            const href = $(el).attr('href');
            if (href && title) {
                // Dramacool IDs in consumet are just the path without the host and leading slash
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
app.get('/movies/dramacool/popular', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        // fetchPopular exists on the MovieParser base class or Dramacool
        // Wait, not all providers have it implemented, let's wrap in a try-catch
        const result = await dramacool.fetchPopular(page);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Info endpoint (gets episodes)
app.get('/movies/dramacool/info', async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) return res.status(400).json({ error: "id is required" });
        // The Consumet info endpoint is broken, manually scrape it
        const response = await axios.get(`https://dramacool9.com.ro/${id}`);
        const $ = cheerio.load(response.data);
        const episodes = [];
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            // Look for links that belong to this show and have 'episode' in them
            if (href && href.includes('episode') && href.includes(id.replace('-hd', ''))) {
                const epId = href.replace('https://dramacool9.com.ro/', '').replace(/\/$/, '');
                // Try to parse episode number from string like 'vincenzo-2021-episode-20.html'
                const match = epId.match(/episode-(\d+)/i);
                const num = match ? parseFloat(match[1]) : episodes.length + 1;
                // Only push if we haven't seen this episode yet to avoid duplicates
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
        // Reverse because usually the links on page are newest first
        episodes.reverse();
        res.json({ id, title: id, episodes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Watch endpoint (gets stream links)
app.get('/movies/dramacool/watch', async (req, res) => {
    try {
        const episodeId = req.query.episodeId;
        if (!episodeId) return res.status(400).json({ error: "episodeId is required" });
        // The episodeId is actually the full URL path like 'vincenzo-2021-episode-20.html'
        const url = `https://dramacool9.com.ro/${episodeId}`;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const iframeSrc = $('iframe').attr('src');
        if (iframeSrc) {
            // We just return the iframe URL since Dramacool streams are protected.
            // The frontend will render this iframe.
            res.json({ iframe: iframeSrc });
        } else {
            res.status(404).json({ error: "Could not find stream iframe" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Consumet API replacement running on http://localhost:${PORT}`);
});
