/* The HTML file that contains an accessibility audit should reference this file with a `script` tag to include the functionality below. */


// Let `editionHistoryItems` be an initially empty list of modifications to the current document. This is relevant to undo and redo functionality.
const editionHistoryItems: string[] = [];

{

    // Save data on server when pressing the keys `ctrl` and `s`.
    window.addEventListener('keydown', async event => {
    
        if (event.ctrlKey && (event.key === 'S' || event.key === 's')) {
            event.preventDefault();
    
            const html = document.documentElement.outerHTML;
    
            // Send data to server.
            const response = await fetch('foo', {
                body: html,
                method: 'POST',
            });

            // Save data as an edit history item.
            editionHistoryItems.push(html);
        }
    });
    
    // Allow edition of data.
    document.designMode = 'on';
    
    // Prevent loss of data.
    window.addEventListener('beforeunload', event => event.preventDefault());
}