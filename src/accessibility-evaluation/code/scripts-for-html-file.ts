import { generateShortVersion } from "./generate-short-version.js";

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
            await fetch('accessibility-evaluation__summary', {
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

// Remove issue
{
    window.addEventListener('click', event => {
        const target = event.target as HTMLElement;

        if (target.nodeName.toUpperCase() !== "BUTTON") {
            return;
        }

        if (target.textContent !== 'Remove issue') {
            return;
        }

        const issue = target.closest('li') as HTMLElement;
        const description = ((issue.querySelector('[data-issue-description]') as HTMLTextAreaElement).value).slice(0, 80);
        const confirmation = confirm(`Are you sure you\'d like to remove this issue?\n\n"${description}..."`);

        if (confirmation) {
            issue.remove();
        }
    });
}

/*
Functionality:
Why?
*/
// Add or remove the `selected` attribute from an `option` element accordingly.
{
    window.addEventListener('change', event => {
        const target = event.target as HTMLSelectElement;

        if (target.nodeName.toUpperCase() !== 'SELECT') {
            return;
        }

        const dropdown = target;
        const options = [...dropdown.options];

        // For each option 'option' in 'options'.
        for (const option of options) {
            // Add or remove the `selected` attributed from `option` according to the currently selected option.
            option.toggleAttribute('selected', option.selected);
        }
    });
}

/*
Functionality: Update the value of the `value` attribute from a text box or a text area.
Why? The HTML of the evaluation doesn't get updated as the user enters text into a text box or text area. The functionality that saves the evaluation only refers to the HTML. For that reason, any text entered into a text box isn't saved resulting in data loss. The easiest way to preserve the text seems to be programmatically updating the `value` property of a text box or text area.
*/
{
    window.addEventListener('blur', event => {
        const target = event.target as HTMLInputElement | HTMLTextAreaElement;
        const { nodeName, type } = target;

        // If `target` isn't either a text box or a text area.
        if ((nodeName !== 'INPUT' && type !== 'text') && nodeName !== 'TEXTAREA') {
            // Abort.
            return;
        }

        // Let `value` be the text currently entered into `target`.
        const { value } = target;

        // If `target` is a text box.
        if (nodeName === 'INPUT') {
            target.setAttribute('value', value);
        }
        // Otherwise if `target` is a text area.
        else {
            target.textContent = value;
        }
    }, true);
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