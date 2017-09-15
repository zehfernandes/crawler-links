const excludeDownloads = (href) => {
	return href.includes('/articles/') ||
		href.includes('/sections/') ||
		href.includes('/Download') ? false : href
}

const excludeJavascript = (href) => {
	return href.includes('javascript') ? false : href
}

const excludeDomains = (href) => {
	return href.includes('facebook.com') ||
		href.includes('google.com') ||
		href.includes('twitter.com') ||
		href.includes('linkedin.com') ||
		href.includes('ri.santander.com.br') ? false : href
}

const checkDomain = (href) => {
	return !href.includes('easynvest.com.br') ? false : href
}

const noHttpOrHttps = (href) => {
	return !href.substr(0, 8).includes('http://') &&
		!href.substr(0, 8).includes('https://') ? false : href
}

/*const filterByArea = (href) => {
	return !href.includes('/atendimento') &&
		!href.includes('/seguros-e-capitalizacao') &&
		!href.includes('/investimentos-e-previdencia') &&
		!href.includes('/creditos-e-financiamentos') &&
		!href.includes('/comercio-exterior-e-cambio') ? false : href
}*/

function pipeline(...funcs) {
	return function (val) {
		let lastResult = val
		for (func of funcs) {
			if (lastResult) {
				lastResult = func(lastResult)
			}
		}
		return lastResult
	}
}

function filterURL(href) {
	return pipeline(
		excludeDownloads,
		excludeJavascript,
		noHttpOrHttps,
		checkDomain,
		excludeDomains,
	)(href)
}

module.exports = {
	excludeDownloads,
	excludeJavascript,
	noHttpOrHttps,
	checkDomain,
	excludeDomains,
	filterURL
}