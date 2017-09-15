const webshot = require('webshot')
const low = require('lowdb')
const db = low('data/db-2017-08-01.json')
const fs = require('fs');

const urlList = db.get('hyperlinks').map('url').value()

var options = {
	screenSize: {
		width: 1024,
		height: 768
	},
	shotSize: {
		width: 1024,
		height: 'all'
	},
	renderDelay: 200
};

function takeScreenshots(url, name) {
	return new Promise((resolve, reject) => {
		webshot(url, `images/${name}.png`, options, function (err) {
			if (err) reject([err, url])
			resolve(`Taked: ${url}`)
		});
	});
}

async function groupScreenshot(newList) {
	return new Promise((resolve, reject) => {
		var p = []
		for (var url of newList) {
			var name = url.replace('https://www.santander.com.br/br/', '')
			if (!fs.existsSync(`images/${name}.png`)) {
				p.push(
					takeScreenshots(url, name)
				)
			}
		}

		Promise.all(p).then((values) => {
			console.log("Screnshots:")
			console.log(values)
			resolve(`Last id: ${url}`)
		}).catch((error) => {
			console.log(error)
		})
	});
}

async function delay(timer) {
	return new Promise((resolve, reject) => {
		console.log(`Waiting ${timer}ms`)
		setTimeout(function () {
			resolve(true)
		}, timer);
	});
}

async function start() {
	let i = 125
	let groupOf = 5
	let lastIndex = 302

	while (true) {
		console.log("\n-------------New List --------------")
		let newList = urlList.slice(i, i + groupOf)
		await groupScreenshot(newList)
		await delay(5000)
		i = i + groupOf

		if (i > lastIndex) break
	}

}

start()