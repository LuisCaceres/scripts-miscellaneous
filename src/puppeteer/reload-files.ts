/* The following piece of code reloads a file that a web page downloads. This is useful, for example, when the developer is modifying a CSS or a JS file. In that case, the developer wants to see the web page update without having to manully refresh the web page.
*/

import * as puppeteer from 'puppeteer';
import { watchFile } from "./watch-file.js";

// The number of seconds to wait at a minimum to reload a file.
const duration = 3;

async function reloadFiles(browser: puppeteer.Browser, map: Map<string, string>): Promise<void> {
    // TO DO: Cannot change files to just files when using the smart rename feature.

    // Let `files` be a list of files to watch for modifications.
    // For each file `file` in `files`.
    for (const [url, file] of map) {
        // Let `file` be the current file.

        for await (const change of watchFile(file, duration)) {
            // Let `pages` be the all of the pages currently active.
            const pages = await browser.pages();

            // For each page `page` in `pages`.
            for (const page of pages) {
                const funct = file.includes('.css') ? reloadStyles : reloadScripts;
                // Execute the following code in `page`.
                await page.evaluate(funct, url);
            }
        }
    }
}

function reloadStyles(url: string) {
    // Note: This code runs on the browser and not on Node.

    //  Let `verticalScrolling` be the amount of current vertical scrolling.
    const verticalScrolling = window.scrollY;

    const link = document.querySelector(`link[href^="${url}"]`) as HTMLLinkElement;

    if (link) {
        link.href = '';
        link.href = url;

        // Stops `page` from "jumping" as CSS engine applies `file` on `page`.
        setTimeout(() => {
            window.scrollTo(0, verticalScrolling);
        }, 100);
    }
}

function reloadScripts(url: string) {
    // Note: This code runs on the browser and not on Node.
    const script = document.querySelector(`script[src^="${url}"]`) as HTMLScriptElement;

    if (script) {
        const replacementScript = document.createElement('script');
        replacementScript.src = url;

        script.replaceWith(replacementScript);
    }
}

export {
    reloadFiles
}