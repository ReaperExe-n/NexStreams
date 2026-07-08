const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('search.html', 'utf16le');
const $ = cheerio.load(html);
console.log('Total articles:', $('article').length);
console.log('Total entry-titles:', $('.entry-title').length);
const titles = [];
$('a').each((i, el) => {
    const text = $(el).text().trim();
    if (text.toLowerCase().includes('vincenzo')) {
        titles.push({ text, href: $(el).attr('href') });
    }
});
console.log('Links with Vincenzo:', titles);
