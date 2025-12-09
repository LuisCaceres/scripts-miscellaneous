{
    // Let `position` be the column number of the new column to be inserted.
    const position = 4;
    const textContent = 'Hello world!';

    const table = $0 as HTMLTableElement;

    if (table.nodeName.toUpperCase() !== 'TABLE') {
        alert('Please select a `table` element before proceeding.');
        throw Error(`Elemented selected isn't a \`table\` element.`);
    }

    const rows = [...table.rows];

    // For each row 'row' in 'rows'.
    for (const row of rows) {
        const relevantCell = row.cells[position - 1];
        const newCell = document.createElement(relevantCell.nodeName);
        newCell.textContent = textContent;
        relevantCell.before(newCell);
    }
}

{
    const values: string[] = [];
    const selector = `td:nth-child(n+2):nth-child(-n+4)`;
    const cells = document.querySelectorAll(selector);

    // For each cell 'cell' in 'cells'.
    for (const cell of cells) {
        values.push(cell.textContent.trim());
    }


    // function printSteps() {
        // TO DO: Eliminate any duplicates that are adjacent to each other.
        console.log(`\`${values.join('`,\n`')}\`,`);
    // }
}
