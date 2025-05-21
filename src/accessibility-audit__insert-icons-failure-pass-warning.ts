{
    const columnNumber = 1;
    const selector = `td:nth-of-type(${columnNumber})`;

    const table = $0 as HTMLTableElement;

    if (table.nodeName.toUpperCase() !== 'TABLE') {
        alert('Please select a `table` element before proceeding.');
        throw Error(`Elemented selected isn't a \`table\` element.`);
    }

    const cells = [...table.querySelectorAll(selector)] as HTMLTableCellElement[];

    // For each cell 'cell' in 'cells'.
    for (const cell of cells) {
        const textContent = cell.textContent as string;
        const firstLetter = textContent.toUpperCase().trim().slice(0, 1);

        const icon = document.createElement('span');
        icon.ariaHidden = 'true';
        icon.classList.add('fa');
        cell.textContent = '';

        switch (true) {
            case firstLetter === 'F': // FAILURE
                icon.classList.add('fa-exclamation-circle');
                cell.append('Failure');
                break;
            case firstLetter === 'P': // PASS
                icon.classList.add('fa-check');
                cell.append('Pass');
                break;
            case firstLetter === 'U': // UNVERIFIED
                icon.classList.add('fa-question-circle');
                cell.append('Unverified');
                break;
            case firstLetter === 'W': // WARNING
                icon.classList.add('fa-exclamation-triangle');
                cell.append('Warning');
                break;
            default:
                cell.append(textContent);
                break;
        }

        cell.prepend(icon);
    }
}