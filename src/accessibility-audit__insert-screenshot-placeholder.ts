{
    // Let `position` be the column number of the new column to be inserted.
    const position1 = 5;
    const position2 = 6;
    const placeholder = '{{screenshot n}}';

    const table = $0 as HTMLTableElement;

    if (table.nodeName.toUpperCase() !== 'TABLE') {
        alert('Please select a `table` element before proceeding.');
        throw Error(`Elemented selected isn't a \`table\` element.`);
    }

    const selector = `td:nth-of-type(${position1})`;
    const cells = Array.from(table.querySelectorAll(selector)) as HTMLTableCellElement[];

    const relevantCells: HTMLTableCellElement[] = [];

    // For each cell 'cell' in 'cells'.
    for (const cell of cells) {
        const textContent = cell.textContent?.toUpperCase().trim();

        switch (textContent) {
            case 'FAILURE':
            case 'WARNING':
                relevantCells.push(cell);
                break;
            default:
                break;
        }
    }

    // For each relevantCell 'relevantCell' in 'relevantCells'.
    for (const relevantCell of relevantCells) {
        const parentRow = relevantCell.parentElement as HTMLTableRowElement;
        parentRow.cells[position2 - 1].append(placeholder);
    }
}