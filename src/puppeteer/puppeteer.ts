// To execute the following code, open the command line, type `node dist/puppeteer/puppeteer.js` and press the "enter" key.

import * as fs from "fs/promises";
import { URL } from "url";
import puppeteer, { Page } from 'puppeteer';
import { reloadFiles } from "./reload-files.js";
import * as settings from "./projects/drupal-forms/settings.js";

// Let `interceptedUrls` be a list of intercepted urls.
const interceptedUrls = settings.interceptions;

// Launch the browser.
const browser = await puppeteer.launch({
    defaultViewport: null,
    // A value of `true` runs Chrome in the background. A value of `false` opens Chrome.
    headless: false,
});

// Run code every time a page is created.
browser.on('targetcreated', async target => {
    const page = await target.page();

    if (!page) {
        return;
    }

    // Intercept requests from `page`.
    await page.setRequestInterception(true);

    // Show error message from JavaScript console.
    page.on('pageerror', message => console.log(message));

    // For each request `request` from `page`:
    page.on('request', async request => {
        //  Let `url` be the url of `request`.
        const url = request.url();
        // Abort if the developer hasn't asked to override `url`.
        if (!interceptedUrls.has(url)) {
            request.continue();
        }
        // Otherwise:
        else {
            // Let `replacement` be what `request` is replaced with.
            const replacement = interceptedUrls.get(url) as string;

            // If `replacement` is a another url then replace `request` with whatever loads from the other url.
            if (replacement.startsWith('http')) {
                request.continue({ url: replacement });
            }
            // Otherwise:
            else {
                // `replacement` is a file in this repository.
                // Let `file` be the file `replacement` points to.
                const file = await fs.readFile(replacement, 'utf-8');

                // Replace `request` with `file`.
                request.respond({
                    body: file,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': getContentType(url),
                    }
                });
            }
        }
    });

    // For each `page` fully loaded by the browser. Please note that a page is different from a browser tab. A browser tab loads pages.
    page.on('load', async () => {
        // Let `url` be the url of the page currently loading.
        const url = page.url();
        console.log('url:\n', url);

        // Stops Puppeteer to close unexpectedly because of a JS error thrown.
        if (url === 'chrome://new-tab-page/') {
            return;
        }

        // // Abort if `page` shouldn't get insertion of custom CSS and JS files.
        // if (!settings.urlPatterns.some(pattern => pattern.test(url))) {
        if (!settings.urlPatterns.some(pattern => url.startsWith(pattern))) {
            return;
        }

        // If `url` is on the list of urls that Puppeteer has to load.
        // Execute the following code directly on the page.
        await page.evaluate(() => {
            // const script = document.createElement('script');
            // script.defer = true;
            // script.src = `https://www.visionaustralia.org/script.js`;
            // document.head.append(script);

            const link = document.createElement('link')
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = `https://www.visionaustralia.org/test.css`;
            document.head.append(link);

            {
                const script = document.createElement('script');
                script.type = 'module';
                script.src = `https://www.visionaustralia.org/test.js`;
                document.head.append(script);
            }

            {
                const script = document.createElement('script');
                script.type = 'module';
                script.src = `https://www.visionaustralia.org/foo.js`;
                document.head.append(script);
            }
        });

        await new Promise(resolve => setTimeout(resolve, 5000));

        // {
        //     const url = new URL(page.url());
        //     const name = `${url.hostname}_${url.pathname}`
        //         .replace(/[./]/g, '_');
        //     console.log('name:\n', name);
        //     const path = `src/puppeteer/projects/drupal-forms/screenshots/`;

        //     page.screenshot({
        //         fullPage: true,
        //         path: `${path}${name}.jpeg`,
        //         type: 'jpeg',
        //     });
        // }
    });
});

// const pages: Promise<Page>[] = [];

// Open a browser tab for each url in `urls`.
for (const url of settings.urls) {
    const page = await browser.newPage();
    await page.goto(url);
    // Set screen size.
    await page.setViewport({ width: 1080, height: 1024 });
}

// await Promise.all(pages);

//  Let `files` be a list of CSS and JS files in this repository that intercept some urls from `interceptedUrls`.
const files = new Map([...interceptedUrls]
    .filter(([interceptedUrl]) =>
        interceptedUrl.includes('.css') ||
        interceptedUrl.includes('.js')
    )
    // Remove `file` if it's stored on a server. This type of file cannot be handle by the `reloadFiles` function.
    .filter(([, replacementUrl]) => replacementUrl.startsWith('http') === false)
);

reloadFiles(browser, files);

/**
 *
 * @param filePath
 * @returns
 */
function getContentType(filePath: string): string {
    let contentType: string;
    const extension = new URL(filePath).pathname.split('.').pop();

    switch (extension) {
        case 'html':
            contentType = 'text/html; charset=UTF-8';
            break;
        case 'js':
            contentType = 'application/javascript';
            break;
        case 'css':
            contentType = 'text/css';
            break;
        case 'png':
            contentType = 'image/png';
            break;
        case 'jpg':
            contentType = 'image/jpg';
            break;
        case 'gif':
            contentType = 'image/gif';
            break;
        case 'ico':
            contentType = 'image/x-icon';
            break;
        case 'svg':
            contentType = 'image/svg+xml';
            break;
        default:
            // contentType = 'application/octet-stream';
            contentType = 'text/html; charset=UTF-8';
            break;
    }

    return contentType;
}