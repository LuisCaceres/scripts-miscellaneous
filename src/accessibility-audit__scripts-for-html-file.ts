import { generateShortVersion } from "./accessibility-audit__generate-short-version.js";

/* The HTML file that contains an accessibility audit should reference this file with a `script` tag to include the functionality below. */

// Let `editionHistoryItems` be an initially empty list of modifications to the current document. This is relevant to undo and redo functionality.
const editionHistoryItems: string[] = [];

const errorMessage = 'Modifications to the file cannot currently be saved. This is because this Internet browser cannot communicate to the server. To save this file, please open the command line or terminal at the root folder of this accessibility evaluation. Then type "node server".'

{
    // Verify that the server has been started so that modifications to this file can be saved.
    (async function () {
        try {
            await fetch('foo');
        } catch (error) {
            alert(errorMessage);
        }
    })();

    // Save data on server when pressing the keys `ctrl` and `s`.
    window.addEventListener('keydown', async event => {
        const { documentElement: htmlElement } = document;

        if (event.ctrlKey && (event.key === 'S' || event.key === 's')) {
            event.preventDefault();

            const html = htmlElement.outerHTML;

            // Save long version of evaluation on the server.
            try {
                await fetch('foo', {
                    body: html,
                    method: 'POST',
                });
            } catch (error) {
                // Alert the user if the evaluation can't be saved on the server.
                alert(errorMessage);
            }

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

    // Prevent loss of data.
    window.addEventListener('beforeunload', event => event.preventDefault());
}

// Add blank issue
{
    window.addEventListener('click', event => {
        const target = event.target as HTMLElement;

        if (target.nodeName.toUpperCase() !== "BUTTON") {
            return;
        }

        if (target.textContent !== 'Insert issue') {
            return;
        }

        const cell = target.closest('td') as HTMLElement;
        const list = cell.querySelector('ol') as HTMLElement;
        const issue = document.querySelector('template#issue') as HTMLTemplateElement;

        if (cell && list && issue) {
            list.append(issue.content.cloneNode(true));
        }
    });
}

// Add or remove the `selected` attributed from `option` according to the currently selected option.
{
    window.addEventListener('change', event => {
        const target = event.target as HTMLSelectElement;

        if (target.nodeName.toUpperCase() !== 'SELECT') {
            return;
        }

        const dropdown = target;
        const options = Array.from(dropdown.options);

        // For each option 'option' in 'options'.
        for (const option of options) {
            // Add or remove the `selected` attributed from `option` according to the currently selected option.
            option.toggleAttribute('selected', option.selected);
        }
    });
}

{
    window.addEventListener('change', event => {
        const target = event.target as HTMLSelectElement;

        if (target.nodeName.toUpperCase() !== 'SELECT') {
            return;
        }

        const dropdown = target;
        const selectedOption = (dropdown.selectedOptions[0].textContent || '').trim().toUpperCase();

        const icon = dropdown.closest('td')?.querySelector('.icon');

        if (icon) {
            icon.removeAttribute('class');
            icon.classList.add('icon');
            icon.classList.add('fa');

            switch (true) {
                case selectedOption === 'FAILURE':
                    icon.classList.add('fa-exclamation-circle');
                    break;
                case selectedOption === 'PASS':
                    icon.classList.add('fa-check');
                    break;
                case selectedOption === 'UNVERIFIED':
                    icon.classList.add('fa-question-circle');
                    break;
                case selectedOption === 'WARNING':
                    icon.classList.add('fa-exclamation-triangle');
                    break;
                default:
                    break;
            }
        }
    });
}