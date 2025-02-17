{
    // Let `columnNumber` be number of the column whose cells will be used to sort the rows of this table.
    const columnNumber = 1;

    function toNumber(row: HTMLTableRowElement) {
        const cells = row.cells;
        const value1 = (cells[columnNumber - 1].textContent || '').toUpperCase().trim();
        let number;

        switch (value1) {
            // case 'STATUS: COMPLETED': /* WRITTEN IN CAPITAL LETTERS!!! */
                // number = 0;
                // break;
            // case 'STATUS: INCOMPLETE': /* WRITTEN IN CAPITAL LETTERS!!! */
                // number = 1;
                // break;
            default:
                break;
        }

        /* Add another switch statement if the order of the cells in this column depends on the cells in another column. */
        // const value2 = row.cells[1].textContent;

        // switch (value2) {
        //     // case 'PRIORITY LOW':
        //     //     number = number + 1;
        //     //     break;
        //     // case 'PRIORITY HIGH';
        //     //     number = number + 2;
        //     //     break;
        //     default:
        //         break;
        // }

        // TO DO: Implement algorithm so that numbers within switch statements aren't hard-coded. Refer to the below and notice that values used for sorting aren't repeated:
        // [1, 2, 3].map(n => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i, a, array) => (n * array.length) + i));

        return number;
    }

    const tbody = $0 as HTMLTableSectionElement;

    if (tbody.nodeName.toUpperCase() !== 'TBODY') {
        alert('Please select a `tbody` element before proceeding.');
        throw Error(`Elemented selected isn't a \`tbody\` element.`);
    }

    const rows = Array.from(tbody.rows);
    const map = new Map();

    rows.forEach(row => {
        const number = toNumber(row);
        map.set(row, number);
    });

    // Sort `rows` accordingly.
    rows.sort((rowA, rowB) => map.get(rowA) - map.get(rowB));
    rows.reverse();

    tbody.append(...rows);
}