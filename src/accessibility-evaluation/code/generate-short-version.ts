// TO DO: WORK WITH EVALUATIONS THAT CONTAIN MORE THAN 1 TABLE

function generateShortVersion(evaluation: HTMLHtmlElement): HTMLHtmlElement {
    const selectors = `select, textarea`;
    const formFields = [...evaluation.querySelectorAll(selectors)] as (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)[];

    // For each formField `formField` in `formFields`.
    for (const formField of formFields) {
        // Let `value` be `formField`'s value.
        const value = formField.querySelector('option[selected]')?.textContent || formField.value;

        // Replace `formField` with `value`.
        formField.replaceWith(value);
    }

    // Let `table` be the table in `evaluation`.
    const table = evaluation.querySelector('table') as HTMLTableElement;

    /*
    Functionality: Remove "unverified" and "pass" test cases from `evaluation`.
    Why? Because typically `evaluation` is a lenghty document. The accessibility evaluation report should be concise to make it reader-friendly.
    */
    {
        // Let `headers` be a list of table headers from `table`.
        const headers = [...table.querySelectorAll('th')];
        //  Let `relevantColumn` be the number of the column that contains test cases.
        const relevantColumn = headers.findIndex(row => row?.matches('[data-test-status]'));
        // Let `rows` be the rows in `table`.
        const rows = [...table.rows].slice(1) as HTMLTableRowElement[];

        // For each row 'row' in 'rows'.
        for (const row of rows) {
            // Let `relevantCell` be the cell that contains test cases.
            const relevantCell = row.cells[relevantColumn];
            const text = relevantCell.textContent.trim().toUpperCase();

            // If the text content of `relevantCell` doesn't contain the words `FAILURE` or `WARNING`.
            if (text.match(/(UNVERIFIED|PASS)/)) {
                // Remove `row` from `evaluation`.
                row.remove();
            }
        }
    }

    // Generate links to screenshots.
    {
        const folder = 'screenshots/';
        const prefix = 'screenshot-';
        const extension = '.png';

        const screenshots = [...evaluation.querySelectorAll('[data-issue-screenshot]')] as HTMLInputElement[];

        // For each screenshot 'screenshot' in 'screenshots'.
        for (const screenshot of screenshots) {
            const screenshotNumber = screenshot.value.trim();
            const link = document.createElement('a');
            link.href = `${folder}${prefix}${screenshotNumber}${extension}`;
            link.target = '_blank';
            link.textContent = `${prefix}${screenshotNumber}`;
            screenshot.replaceWith(link);
        }
    }

    /*
    Functionality: Remove other irrelevant elements from `evaluation`.
    Why? Because typically `evaluation` is a lenghty document. The accessibility evaluation report should be concise to make it reader-friendly.
    */
    {
        // Let `irrelevantColumns` be an initially empty list of the columns in `table` to be removed.
        const irrelevantColumns: number[] = [];

        // Find which columns from `table` to be removed and add them to `irrelevantColumns`.
        [...table.rows[0].cells].forEach((tableHeader, index) => {

            if (tableHeader.matches(`[data-ae-evaluation-only]`)) {
                irrelevantColumns.push(index + 1);
            }
        });

        // Let `selector` be a CSS selector that matches `irrelevantColumns`.
        let selector = '';

        for (const irrelevantColumn of irrelevantColumns) {
            selector += `:nth-of-type(${irrelevantColumn}),`;
        }

        // Let `irrelevantElements` be a list of elements that should be excluded from `evaluation` including `irrelevantColumns`.
        const irrelevantElements = evaluation.querySelectorAll(`[data-ae-evaluation-only], :is(td, th):is(${selector})`);

        // For each irrelevantElement `irrelevantElement` in `irrelevantElements`.
        for (const irrelevantElement of irrelevantElements) {
            // Remove `irrelevantElement` from `evaluation`.
            irrelevantElement.remove();
        }
    }

    return evaluation;
}

export {
    generateShortVersion
}