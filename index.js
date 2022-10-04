import { chromium } from 'playwright-extra'
import stealth from 'puppeteer-extra-plugin-stealth'
import bluebird from 'bluebird'
import { addToRemoveQueue, getProxies, removeLines } from './utils.js'

const init = async (i) => {
    // const proxy = getProxies(i)
    const options = {
        headless: false,
        args: [
            '--disable-setuid-sandbox',
            '--ignore-certificate-errors',
            '--disk-cache-size=1',
            '--disable-infobars',
            '--disable-features=IsolateOrigins,site-per-process,SitePerProcess',
            '--flag-switches-begin --disable-site-isolation-trials --flag-switches-end'],

        bypassCSP: true,
        ignoreHTTPSErrors: true,
        // proxy: {
        //     server: proxy.server,
        //     username: proxy.username,
        //     password: proxy.password
        // }
    }

    const browser = await chromium.launch(options)

    const page = await browser.newPage()

    await page.goto("your-site")

    await page.pause()

    await page.close()

    await browser.close()
}

bluebird.map(Array.from(Array(1), (_, i) => i), init, { concurrency: 1 })