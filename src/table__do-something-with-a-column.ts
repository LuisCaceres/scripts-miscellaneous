{
    // Let `position` be the column number of the new column to be inserted.
    const position = 4;
    
    const table = $0 as HTMLTableElement;
    
    if (table.nodeName.toUpperCase() !== 'TABLE') {
        alert('Please select a `table` element before proceeding.');
        throw Error(`Elemented selected isn't a \`table\` element.`);
    }
    
    const selector = `td:nth-of-type(${position})`;
    const cells = Array.from(table.querySelectorAll(selector)) as HTMLTableCellElement[];

    // For each cell 'cell' in 'cells'.
    for (const cell of cells) {
        cell;
    }
}