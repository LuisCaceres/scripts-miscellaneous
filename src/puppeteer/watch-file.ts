/*  Node's file-watching functionality is sensitive. Every character typed generates a file change event. However, sometimes it's more useful to generate that event after the developer has finished typing, for example, a line of code.
The following piece of code waits until the developer has finished typing to generate a file change event. This is useful, for example, when the developer is modifying a CSS or a JS file. In that case, the developer wants to see a web page reload that file only after the developer has finished a line of code (as opposed to reloading the web page for every character typed).
*/

import * as fs from 'fs/promises';

/** Watch a file and fire file change events only after this function believes the developer has finished typing.
 * @param path - A path to a file.
 * @param delay - The number of seconds to wait at a minimum to fire a file change event.
 */
async function* watchFile(path: string, delay: number) {
    const milliseconds = delay * 1000;
    const changes = fs.watch(path)[Symbol.asyncIterator]();

    // Wait until the developer inserts or deletes the first character in the file.
    await changes.next();

    while (true) {
        // Let `nextChange` be an insertion or deletion that hasn't yet occurred.
        const nextChange = changes.next();
        // Let `timer` be a mechanism which indicates whether the developer is continously typing (otherwise known as composing).
        const timer = new Promise(resolve =>
            setTimeout(resolve, milliseconds)
        );

        // Either `timer` will expire first or the developer will insert or delete a character from the file.
        const isTyping = await Promise.race([
            nextChange,
            timer
        ]);

        if (isTyping) {
            // The developer is still inserting or deleting characters from the file. Don't fire a file change event. Go back to the start of the `while` loop and start again.
            continue;
        }

        // Otherwise, `timer` expired first. The code now infers the developer is no longer modifying the file. Fire a file change event.
        yield;

        // Wait until the developer inserts or deletes the next character, go back to the beginning of the `while` loop and start again.
        await nextChange;
    }
}

export {
    watchFile
}