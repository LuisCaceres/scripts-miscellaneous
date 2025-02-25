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

    return evaluation;
}

export {
    generateShortVersion
}   