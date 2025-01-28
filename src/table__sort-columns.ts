{
    function toNumber(row: HTMLTableRowElement) {
        const cells = row.cells;
        const value1 = cells[0].textContent;
        let number;

        switch (value1) {
            // case 'Status: Completed':
                // number = 0;
                // break;
            // case 'Status: Incomplete':
                // number = 3;
                // break;
            default:
                break;
        }

        /* Add another switch statement if the order of the cells in this column depends on the cells in another column. */
        // const value2 = row.cells[1].textContent;

        // switch (value2) {
        //     // case 'Priority: Low':
        //     //     number = number + 1;
        //     //     break;
        //     // case 'Priority: High';
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
