function generateShortVersion(evaluation: HTMLHtmlElement): HTMLHtmlElement {
    // Let `table` be the table in `evaluation`.
    const table = evaluation.querySelector('table') as HTMLTableElement;

    const selectors = `select, textarea`;
    const formFields = [...evaluation.querySelectorAll(selectors)] as (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)[];

    // For each formField `formField` in `formFields`.
    for (const formField of formFields) {
        // Let `value` be `formField`'s value.
        const value = formField.querySelector('option[selected]')?.textContent || formField.value;

        // Replace `formField` with `value`.
        formField.replaceWith(value);
    }

    // Let `rows` be the rows in `table`.
    const rows = [...table.rows].slice(1) as HTMLTableRowElement[];

    // For each row 'row' in 'rows'.
    for (const row of rows) {
        const relevantCell = row.cells[4];
        const text = (relevantCell.textContent || '').trim().toUpperCase();

        // If the text content of `row` doesn't contain the words `FAILURE` or `WARNING`.
        if (text.match(/(FAILURE|WARNING)/) === null) {
            // Remove `row` from `table`.
            row.remove();
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

    // Let `irrelevantElements` be a list of elements that should be excluded from `evaluation`.
    const irrelevantElements = [...evaluation.querySelectorAll('[data-ae-evaluation-only], :is(td, th]:is(:nth-of-type(3)), :is(td, th):is(:nth-of-type(4))')];

    // For each irrelevantElement `irrelevantElement` in `irrelevantElements`.
    for (const irrelevantElement of irrelevantElements) {
        // Remove `irrelevantElement` from `evaluation`.
        irrelevantElement.remove();
    }

    return evaluation;
}

export {
    generateShortVersion
}   