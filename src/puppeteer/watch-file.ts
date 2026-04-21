/*  Node's file-watching functionality is sensitive. Every character typed generates a file change event. However, sometimes it's more useful to generate that event after the developer has finished typing, for example, a line of code.
The following piece of code waits until the developer has finished typing to generate a file change event. This is useful, for example, when the developer is modifying a CSS or a JS file. In that case, the developer wants to see a web page reload that file only after the developer has finished a line of code (as opposed to reloading the web page for every character typed).
*/

import * as fs from 'fs/promises';
import * as process from "process";

/** Watch a file and fire file change events only after this function believes the developer has finished typing.
 * @param path - A path to a file.
 * @param delay - The number of seconds to wait at a minimum to fire a file change event.
 */
async function* watchFile(path: string, delay: number) {
    let timestamp1 = process.uptime();

    for await (const change of fs.watch(path)) {
        timestamp1 = process.uptime();

        // Verify if the developer is still typing. This prevents a file change event from being fired constantly for every single character that's typed. Otherwise, this could cause Puppeteer or the web page to run out of resources and crash.
        const isTyping = await new Promise(resolve =>
            setTimeout(() => {
                const timestamp2 = process.uptime();
                const isTyping = (timestamp2 - timestamp1) < delay;
                resolve(isTyping);
            }, delay * 1000)
        );

        // If the developer is still typing, wait longer to file change event.
        if (isTyping) {
            continue;
        }

        yield change;
    }
}

export {
    watchFile
}