const axios = require('axios');
const cheerio = require('cheerio');
axios.get('https://dramacool9.com.ro/?s=Vincenzo').then(res => {
    const $ = cheerio.load(res.data);
    const results = [];
    $('article').each((i, el) => {
        const titleElement = $(el).find('.entry-title a');
        results.push(titleElement.text().trim());
    });
    console.log(results);
});
