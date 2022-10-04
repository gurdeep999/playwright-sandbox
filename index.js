import { chromium } from 'playwright-extra'
import stealth from 'puppeteer-extra-plugin-stealth'
import bluebird from 'bluebird'
import { addToRemoveQueue, getProxies, removeLines } from './utils.js'

const withBrowser = async (fn) => {
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

    try {
        return await fn(browser)
    } finally {
        await browser.close()
    }
}

const withPage = (browser) => async (fn) => {
    const page = await browser.newPage()

    try {
        return await fn(page)
    } finally {
        await page.close()
    }
}

const results = await withBrowser(async (browser) => {
    return bluebird.map(Array.from(Array(1), (_, i) => i), async (x) => {
        await withPage(browser)( async (page) => {
            await page.goto('https://google.com')
            //  do something
            return
        })
    }, { concurrency: 1 })
})