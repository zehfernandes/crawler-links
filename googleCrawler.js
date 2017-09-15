var scraper = require('google-search-scraper');
const fs = require("fs")

var options = {
	query: 'site:easynvest.com.br -pdf -ajuda.',
	limit: 100
};

const outputFile = 'data/hyperlink.txt'

scraper.search(options, function (err, url) {
	// This is called for each result
	if (err) throw err;
	let handle = url.replace("https://www.easynvest.com.br", "")
	let text = `=HYPERLINK("${url}", "${handle}")`
	fs.appendFileSync(outputFile, text + '\n')
});