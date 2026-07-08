const axios = require('axios');
const cheerio = require('cheerio');
axios.get('https://dramacool9.com.ro/vincenzo-2021-episode-20.html').then(res => {
    const $ = cheerio.load(res.data);
    require('fs').writeFileSync('iframes.txt', $('iframe').map((i, el) => $(el).attr('src')).get().join('\n'));
});
