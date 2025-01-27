{
    const currentPosition = 1;
    const newPosition = 2;

    const table = $0 as HTMLTableElement;

    if (table.nodeName.toUpperCase() !== 'TABLE') {
        alert('Please select a `table` element before proceeding.');
        throw Error(`Elemented selected isn't a \`table\` element.`);
    }
    
    const selector = `th:nth-of-type(${currentPosition}), td:nth-of-type(${currentPosition})`;
    const cells = Array.from(table.querySelectorAll(selector)) as HTMLTableCellElement[];

    // For each cell 'cell' in 'cells'.
    for (const cell of cells) {
        const row = cell.parentElement as HTMLTableRowElement;
        const referenceCell = row.cells[newPosition - 1];
        referenceCell.after(cell);
    }
}