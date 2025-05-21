{
    // Let `table` be a HTML table.
    // Let `column` be the column number in `table` whose cells will be visited to do something. 
    const column = 4;
    
    const table = $0 as HTMLTableElement;
    
    if (table.nodeName.toUpperCase() !== 'TABLE') {
        alert('Please select a `table` element before proceeding.');
        throw Error(`Elemented selected isn't a \`table\` element.`);
    }
    
    const selector = `td:nth-of-type(${column})`;
    const cells = [...table.querySelectorAll(selector)] as HTMLTableCellElement[];

    // For each cell 'cell' in 'cells'.
    for (const cell of cells) {
        cell;
    }
}