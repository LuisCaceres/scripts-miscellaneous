// To execute the following code, open the command line, type `node dist/puppeteer/puppeteer.js` and press the "enter" key.

import * as fs from "fs/promises";
import { URL } from "url";
import puppeteer from 'puppeteer';
import { watchFile } from "./watch-file.js";
import { reloadFiles } from "./reload-files.js";

const path = '/projects/drupal-forms/settings.js';
// Line of code below is commented out because TypeScript complaints. It'd be good to store the path to `settings.ts` as a constant.
// let settings = await import(`.${path}`);
let settings = await import(`./projects/drupal-forms/settings.js`);

// Let `interceptedUrls` be a list of intercepted urls.
settings.interceptions;

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

    // Force the browser to clear the cache.
    page.setCacheEnabled(false);

    // Intercept requests from `page`.
    await page.setRequestInterception(true);

    // Show error message from JavaScript console.
    page.on('pageerror', message => console.log(message));

    // For each request `request` from `page`:
    page.on('request', async request => {
        //  Let `url` be the url of `request`.
        const url = request.url();
        // Abort if the developer hasn't asked to override `url`.
        if (!settings.interceptions.has(url)) {
            request.continue();
        }
        // Otherwise:
        else {
            // Let `replacement` be what `request` is replaced with.
            const replacement = settings.interceptions.get(url) as string;

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

        //  Let `files` be a list of CSS and JS files currently in this project's folder. Remove any files that `settings.interceptions` includes.
        // TO DO: Use `fs` to get a list of those files.
        const files = [
            'test.css',
            'test.js',
        ];

        // If `url` is on the list of urls that Puppeteer has to load.
        // Execute the following code directly on the page.
        await page.evaluate((origin: string, files: string[]) => {
            // Let `files` be  a list of CSS and JS files.
            const groups = Object.groupBy(files, file =>
                file.endsWith('.css') ? 'cssFiles' : 'jsFiles'
            );

            // Let `cssFiles` be a list of CSS files.
            // Let `jsFiles` be a list of JS files.
            const { cssFiles, jsFiles } = groups;

            // For each CSS file `cssFile` in `cssFiles`.
            for (const cssFile of (cssFiles || [])) {
                // Add a new `link` element to `page` that loads `cssFile`.
                const link = document.createElement('link')
                link.type = 'text/css';
                link.rel = 'stylesheet';
                link.href = `${origin}/${cssFile}`;
                document.head.append(link);
            }

            // For each JS file `jsFile` in `jsFiles`.
            for (const jsFile of (jsFiles || [])) {
                // Add a new `script` element to `page` that loads `jsFile`.
                const script = document.createElement('script');
                script.type = 'module';
                script.src = `${origin}/${jsFile}`;
                document.head.append(script);
            }
        }, new URL(url).origin, files);

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
const files = new Map([...settings.interceptions]
    .filter(([interceptedUrl]) =>
        interceptedUrl.includes('.css') ||
        interceptedUrl.includes('.js')
    )
    // Remove `file` if it's stored on a server. This type of file cannot be handle by the `reloadFiles` function.
    .filter(([, replacementUrl]) => replacementUrl.startsWith('http') === false)
);

reloadFiles(browser, files);

{
    // Update settings if the developer's updated `settings.ts` file. This is useful because the developer doesn't need to restart Puppeteer every time the settings are updated.
    const delay = 10; // seconds

    for await (const change of watchFile(`dist/puppeteer${path}`, delay)) {
        let error: unknown;

        // Stop Puppeteer from crashing if there are syntax errors in `settings.ts` file.
        try {
            // The `?imported=${Date.now()}` part invalidates the cache which forces Node to retrieve the updated version of the `settings.ts`. file.
            settings = await import(`./projects/drupal-forms/settings.js?imported=${Date.now()}`);
        } catch (err) {
            console.log(`Error: Settings couldn't be updated.`);
            error = err;
        }

        if (!error) {
            const date = new Date();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();
            const time = `${hours}:${minutes}:${seconds}`;

            console.log(`Settings have been updated at ${time}`);
        }
    }
}




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