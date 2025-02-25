function generateShortVersion(evaluation: HTMLHtmlElement): HTMLHtmlElement {
    // Let `table` be the sole table in `evaluation`.
    const table = evaluation.querySelector('table') as HTMLTableElement;
    // Let `rows` be the rows in `table`.
    const rows = Array.from(table.rows).slice(1) as HTMLTableRowElement[];

    // For each row 'row' in 'rows'.
    for (const row of rows) {
        const relevantCell = row.cells[4];
        const text = (relevantCell.textContent || '').trim().toUpperCase();

        if (text !== 'FAILURE' && text !== 'WARNING') {
            row.remove();
        }
    }

    // Let `irrelevantElements` be a list of elements that should be excluded from `evaluation`.
    const irrelevantElements = Array.from(evaluation.querySelectorAll('[data-ae-evaluation-only], :is(td, th):is(:nth-of-type(3)), :is(td, th):is(:nth-of-type(4))'));

    // For each irrelevantElement 'irrelevantElement' in 'irrelevantElements'.
    for (const irrelevantElement of irrelevantElements) {
        irrelevantElement.remove();
    }

    return evaluation;
}

export {
    generateShortVersion
}   