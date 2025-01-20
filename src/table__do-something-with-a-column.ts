{
    // Let `position` be the column number of the new column to be inserted.
    const position = 4;
    const selector = `td:nth-of-type(${position})`;
    const table = $0 as HTMLTableElement;
    const cells = Array.from(table.querySelectorAll(selector)) as HTMLTableCellElement[];

    // For each cell 'cell' in 'cells'.
    for (const cell of cells) {
        cell;
    }
}