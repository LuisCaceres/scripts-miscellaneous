{
    // Let `table` be a HTML table.
    // Let `startRow` be the row number of a row in `table` . 
    // Let `endRow` be the row number of anoter row in `table`.
    const startRow = 0;
    const endRow = undefined;
    
    const table = $0 as HTMLTableElement;
    
    if (table.nodeName.toUpperCase() !== 'TABLE') {
        alert('Please select a `table` element before proceeding.');
        throw Error(`Elemented selected isn't a \`table\` element.`);
    }
    
    const rows = [...table.rows].slice(startRow, endRow) as HTMLTableRowElement[];

    // For each row 'row' in 'rows'.
    for (const row of rows) {
        row;
    }
}