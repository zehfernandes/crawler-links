const low = require('lowdb')
const db = low('data/urls.json')

const _DBNAME_ = 'hyperlinks'
db.defaults({ hyperlinks: [] }).write()


function getLastIndex() {
	let index = db.get(_DBNAME_).map('id').value().length

	return index
}

function addUrl(url, source) {
	let index = getLastIndex()

	db.get(_DBNAME_).push({
		id: index + 1,
		ref: source,
		url: url,
		visited: false
	}).write()
}

function urlExists(url) {
	let find = db.get(_DBNAME_).find({ url: url }).value()
	return find !== undefined
}

function eachURLisVisited() {
	let find = db.get(_DBNAME_).every({ visited: true }).value()
	return find
}

function getNextURL(id) {
	let find = db.get(_DBNAME_).find({ id: id }).value()
	return find
}

function updatedVist(url) {
	let find = db.get(_DBNAME_)
		.find({ url: url })
		.assign({ visited: true })
		.write()

	return find
}

function clearDB() {
	db.set(_DBNAME_, []).write()
}

module.exports = {
	addUrl,
	urlExists,
	eachURLisVisited,
	updatedVist,
	getNextURL,
	clearDB,
	getLastIndex
}