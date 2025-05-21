{
    const rowNumber = -1;
    let numberOfNewRows = 70;
    
    const table = $0 as HTMLTableElement;

    if (table.nodeName.toUpperCase() !== 'TABLE') {
        alert('Please select a `table` element before proceeding.');
        throw Error(`Elemented selected isn't a \`table\` element.`);
    }

    const row = [...table.rows].at(rowNumber) as HTMLTableRowElement;
    const clones: HTMLTableRowElement[] = [];

    while (numberOfNewRows--) {
        const clone = row?.cloneNode(true) as HTMLTableRowElement;
        clones.push(clone);
    }

    table.append(...clones);
}