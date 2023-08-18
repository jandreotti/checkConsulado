import fs from 'fs-extra';
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
// export const getChromeTmpDataDir = (browser: Browser): string => {

// 	let chromeTmpDataDir = null;
// 	// find chrome user data dir (puppeteer_dev_profile-XXXXX) to delete it after it had been used
// 	let chromeSpawnArgs = browser.process().spawnargs;
// 	for (let i = 0; i < chromeSpawnArgs.length; i++) {
// 		if (chromeSpawnArgs[i].indexOf("--user-data-dir=") === 0) {
// 			chromeTmpDataDir = chromeSpawnArgs[i].replace("--user-data-dir=", "");
// 		}
// 	}
// 	return chromeTmpDataDir;
// };

export const closeBrowser = async (browser: Browser): Promise<string> => {

	let res;

	try {
		//! Obtengo la carpeta temporal que crea el navegador
		let chromeTmpDataDir = null;
		// find chrome user data dir (puppeteer_dev_profile-XXXXX) to delete it after it had been used
		let chromeSpawnArgs = browser.process().spawnargs;
		for (let i = 0; i < chromeSpawnArgs.length; i++) {
			if (chromeSpawnArgs[i].indexOf("--user-data-dir=") === 0) {
				chromeTmpDataDir = chromeSpawnArgs[i].replace("--user-data-dir=", "");
			}
		}

		//! Cierro el navegador
		await browser.close();

		//! Borro la carpeta temporal
		// console.error(`chromeTmpDataDir: ${chromeTmpDataDir}`);
		if (chromeTmpDataDir !== null) {
			// console.error("removiendo... ");
			fs.removeSync(chromeTmpDataDir);
		}

		res = `OK: removido: ${chromeTmpDataDir}`;

	}
	catch (e) {
		res = `ERROR: ${e.message}`;
	}
	return Promise.resolve(res);
};





