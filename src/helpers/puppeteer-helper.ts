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
