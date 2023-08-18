import { Browser } from 'puppeteer';

export const getNewPageWhenLoaded = async (browser: Browser) => {
	return new Promise(x =>
		browser.on('targetcreated', async target => {
			if (target.type() === 'page') {
				const newPage = await target.page();
				const newPagePromise = new Promise(y => newPage.once('domcontentloaded', () => y(newPage)));
				const isPageLoaded = await newPage.evaluate(() => document.readyState);
				return isPageLoaded.match('complete|interactive') ? x(newPage) : x(newPagePromise);
			}
		})
	);
};

// Obtiene la carpeta temporal a borrar FUENTE: https://github.com/puppeteer/puppeteer/issues/1791
export const getChromeTmpDataDir = (browser: Browser): string => {

	let chromeTmpDataDir = null;

	// find chrome user data dir (puppeteer_dev_profile-XXXXX) to delete it after it had been used
	let chromeSpawnArgs = browser.process().spawnargs;
	for (let i = 0; i < chromeSpawnArgs.length; i++) {
		if (chromeSpawnArgs[i].indexOf("--user-data-dir=") === 0) {
			chromeTmpDataDir = chromeSpawnArgs[i].replace("--user-data-dir=", "");
		}
	}
	return chromeTmpDataDir;
};
