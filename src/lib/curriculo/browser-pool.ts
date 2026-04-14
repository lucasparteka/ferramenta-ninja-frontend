import puppeteer, { type Browser, type Page } from "puppeteer";

const MAX_CONCURRENT = 3;

let browser: Browser | null = null;
let activeCount = 0;
const waitQueue: Array<() => void> = [];

async function getOrLaunchBrowser(): Promise<Browser> {
	if (browser?.connected) return browser;

	browser = await puppeteer.launch({
		headless: true,
		args: [
			"--no-sandbox",
			"--disable-setuid-sandbox",
			"--disable-dev-shm-usage",
			"--disable-gpu",
		],
	});

	browser.on("disconnected", () => {
		browser = null;
	});

	return browser;
}

function acquireSlot(): Promise<void> {
	return new Promise<void>((resolve) => {
		if (activeCount < MAX_CONCURRENT) {
			activeCount++;
			resolve();
		} else {
			waitQueue.push(() => {
				activeCount++;
				resolve();
			});
		}
	});
}

function releaseSlot(): void {
	activeCount--;
	const next = waitQueue.shift();
	if (next) next();
}

export async function withPage<T>(fn: (page: Page) => Promise<T>): Promise<T> {
	await acquireSlot();

	const b = await getOrLaunchBrowser();
	const page = await b.newPage();

	try {
		return await fn(page);
	} finally {
		await page.close().catch(() => {});
		releaseSlot();
	}
}
