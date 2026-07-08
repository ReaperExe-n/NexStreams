const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('search.html', 'utf16le');
const $ = cheerio.load(html);
$('a').each((i, el) => {
    const text = $(el).text().trim();
    if (text.toLowerCase().includes('vincenzo')) {
        console.log('Found:', {
            text,
            href: $(el).attr('href'),
            class: $(el).attr('class'),
            parentClass: $(el).parent().attr('class'),
            parentParentClass: $(el).parent().parent().attr('class')
        });
    }
});
