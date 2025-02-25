import { generateShortVersion } from "./accessibility-audit__generate-short-version.js";

/* The HTML file that contains an accessibility audit should reference this file with a `script` tag to include the functionality below. */

// Let `editionHistoryItems` be an initially empty list of modifications to the current document. This is relevant to undo and redo functionality.
const editionHistoryItems: string[] = [];

{
    // Verify that the server has been started so that modifications to this file can be saved.
    (async function () {
        try {
            await fetch('foo');
        } catch (error) {
            alert('Modifications to the file cannot be saved. To do so, please open the command line or terminal at the root folder of this accessibility evaluation. Then type "node server".');
        }
    })();

    // Save data on server when pressing the keys `ctrl` and `s`.
    window.addEventListener('keydown', async event => {
        const { documentElement: htmlElement } = document;

        if (event.ctrlKey && (event.key === 'S' || event.key === 's')) {
            event.preventDefault();

            const html = htmlElement.outerHTML;

            // Save long version of evalaution on server.
            await fetch('foo', {
                body: html,
                method: 'POST',
            });

            const shortVersion = generateShortVersion(htmlElement.cloneNode(true) as HTMLHtmlElement);

            // Save short version of evaluation.
            await fetch('bar', {
                body: shortVersion.outerHTML,
                method: 'POST',
            });

            // // Save data as an edit history item.
            // editionHistoryItems.push(html);
        }
    });

    // Allow edition of data.
    document.designMode = 'on';

    // Prevent loss of data.
    window.addEventListener('beforeunload', event => event.preventDefault());
}