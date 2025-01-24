/* The HTML file that contains an accessibility audit should reference this file with a `script` tag to include the functionality below. */

// Save data on server when pressing the keys `ctrl` and `s`.
window.addEventListener('keydown', async event => {

    if (event.ctrlKey && (event.key === 'S' || event.key === 's')) {
        event.preventDefault();

        const html = document.documentElement.outerHTML;

        const response = await fetch('foo', {
            body: html,
            method: 'POST',
        });
    }
});

// Allow edition of data.
document.designMode = 'on';

// Prevent loss of data.
window.addEventListener('beforeunload', event => event.preventDefault());