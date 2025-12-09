// ==UserScript==
// @name         Foo
// @namespace    http://tampermonkey.net/
// @version      2024-11-21
// @description  try to take over the world!
// @author       You
// @match        https://www.visionaustralia.org/accessibility-checker
// @icon         https://www.google.com/s2/favicons?sz=64&domain=visionaustralia.org
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const stylesheet = `
    <style>
        table {
            border-collapse: collapse;
        }

        td {
            padding: 16px;
            border: solid;
        }
    </style>
    `;

    const stylesheets = document.querySelectorAll('link');

    // For each stylesheet 'stylesheet' in 'stylesheets'.
    for (const stylesheet of stylesheets) {
        stylesheet.remove();
    }

    const string = `
    <label>
        Your document as HTML:
        <textarea name="" required></textarea>
    </label>
    <button>
        Display your document as a HTML document
    </button>
`;

    const tree = new DOMParser().parseFromString(string, 'text/html');
    document.body.replaceChildren(...tree.body.children);

    const button = document.querySelector('button');
    button?.addEventListener('click', e => {
        const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
        const value = `${textarea.value} ${stylesheet}`;

        let tree = new DOMParser().parseFromString(value, 'text/html');
        tree = format(tree);
        
        document.body.replaceChildren(...tree.body.children);
    });
})();

function format(root: Document) {
    const tables = root.querySelectorAll('table');

    // For each table 'table' in 'tables'.
    for (const table of tables) {

        if (table.role === 'presentation') {
            // NOTE 1: Microsoft Word adds attribute `role` with value `presentation` to a `table` element. This attribute is removed from the element because it removes the table from the accesssibility tree.
            table.removeAttribute('role');
        }
    }

    return root;
}
