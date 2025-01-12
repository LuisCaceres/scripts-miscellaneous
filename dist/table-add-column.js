"use strict";
{
    const table = document.querySelector('table');
    const rows = Array.from(table.rows);
    // Let `position` be the column number of the new column to be inserted.
    const position = 4;
    const textContent = 'Hello world!';
    // For each row 'row' in 'rows'.
    for (const row of rows) {
        const relevantCell = row.cells[position - 1];
        const newCell = document.createElement(relevantCell.nodeName);
        newCell.textContent = textContent;
        relevantCell.before(newCell);
    }
}
