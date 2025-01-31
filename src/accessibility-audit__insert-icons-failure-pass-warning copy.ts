{
    const columnNumber = 1;
    const selector = `td:nth-of-type(${columnNumber})`;
    const cells = Array.from(document.querySelectorAll(selector)) as HTMLTableCellElement[];

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