const request = require("request")
const cheerio = require('cheerio')
const fs = require("fs")
const urlUtils = require('url')

const { filterURL } = require('./libs/filters.js')
const {
	addUrl,
	urlExists,
	eachURLisVisited,
	updatedVist,
	getNextURL,
	getLastIndex,
	clearDB
} = require('./libs/db.js')


function getLinks(url) {
	return new Promise((resolve, reject) => {
		request(url, function (error, response, body) {

			if (error) {
				reject(error)
				return
			}

			if (response.statusCode == 200) {

				const URI = response.request.uri.href
				var $ = cheerio.load(body);

				$("a").each(function (a, b) {

					var href = $(b).attr("href");
					console.log(href)

					if (href) {
						href = urlUtils.resolve(URI, href)
						href = href.replace('http:', 'https:')
						href = href.replace(/#\w*/, '')
						// Filter
						if (filterURL(href) !== false) {
							if (!urlExists(href)) addUrl(href, url) // Try to perfomarce better
						}
					}
				});

				resolve()

			} else {
				console.log("Couldn't open the URL.")
				reject("Couldn't open the URL.")
			}

		});
	});
}

async function crawler() {
	//clearDB()

	addUrl('https://www.easynvest.com.br/')
	var id = getLastIndex()
	//var id = 2

	while (true) {
		obj = getNextURL(id)

		if (!obj.visited) {
			try {
				await getLinks(obj.url)
			} catch (error) {
				console.error(error);
			}

			updatedVist(obj.url)
			console.log(`Visted: ${obj.url}`)
			id++
		}

		if (eachURLisVisited()) {
			break
		}
	}
}

crawler()