{
    const columnNumber = 0;
    const selector = `td:nth-of-type(${columnNumber + 1})`;
    const cells = Array.from(document.querySelectorAll(selector)) as HTMLTableCellElement[];

    // For each cell 'cell' in 'cells'.
    for (const cell of cells) {
        const textContent = cell.textContent?.toUpperCase().slice(0, 1);
        
        const icon = document.createElement('span');
        icon.ariaHidden = 'true';
        icon.classList.add('fa');

        switch(textContent) {
            case 'F':
                icon.classList.add('fa-exclamation-circle');
                break;
            case 'P':
                icon.classList.add('fa-check');
                break;
            case 'U':
                icon.classList.add('fa-question-circle');
                break;
            case 'W':
                icon.classList.add('fa-exclamation-triangle');
                break;
            default:
                break;
        }

        cell.prepend('icon');
    }
}