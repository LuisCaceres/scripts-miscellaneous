{
    const columnNumber = 1;
    const selector = `td:nth-of-type(${columnNumber})`;

    const table = $0 as HTMLTableElement;

    if (table.nodeName.toUpperCase() !== 'TABLE') {
        alert('Please select a `table` element before proceeding.');
        throw Error(`Elemented selected isn't a \`table\` element.`);
    }

    const cells = Array.from(table.querySelectorAll(selector)) as HTMLTableCellElement[];

    // For each cell 'cell' in 'cells'.
    for (const cell of cells) {
        const textContent = cell.textContent?.toUpperCase().trim();
        
        const icon = cell.querySelector('.fa') || document.createElement('span');
        icon.removeAttribute('class');
        icon.ariaHidden = 'true';
        icon.classList.add('fa');

        switch(textContent) {
            case 'FAILURE':
                icon.classList.add('fa-exclamation-circle');
                break;
            case 'PASS':
                icon.classList.add('fa-check');
                break;
            case 'UNVERIFIED':
                icon.classList.add('fa-question-circle');
                break;
            case 'WARNING':
                icon.classList.add('fa-exclamation-triangle');
                break;
            default:
                break;
        }

        cell.prepend(icon);
    }
}