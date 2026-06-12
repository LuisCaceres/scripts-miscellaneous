// import { URLPattern } from "url";

// Let `urls` be a list of replacee urls each associated with a replacement url.
const interceptions = new Map([
    // [
    //     'https://www.visionaustralia.org/utils.js',
    //     'dist/puppeteer/projects/dark-mode/utils.js',
    // ],
    [
        'https://minikai.com/accessibility-tree.js',
        'dist/accessibility-evaluation/code/utils/accessibility-tree.js',
    ],
    [
        'https://minikai.com/accessibility-tree.js',
        'src/accessibility-evaluation/code/utils/axe.min.js',
    ],
    [
        'https://minikai.com/run-axe.js',
        'dist/accessibility-evaluation/code/utils/run-axe.js',
    ],
    // [
    //     'https://www.visionaustralia.org/test.css',
    //     'src/puppeteer/projects/dark-mode/test.css',
    // ],
]);

// Let `urls` be the a list of urls which Pupeteer will open in a tab.
const urls = [
    `https://minikai.com/`,
];

//  Let `files` be a list of CSS and JS files to be loaded in a tab. The files will load in the specified order. These files will load via a `script` or `link` element. The element will be appended to the `head` element's list of children. Make sure to modify `interceptions` in this file accordingly.
const files = [
    // 'test.css',
    'axe.min.js',
    'run-axe.js',
    `accessibility-tree.js`,
];

// Let `urlPatterns` be a list of patterns that Pupeteer can use to check if a web page should get custom stylysheet or script insertion. Custom insertion is useful when, for example, the developer wants to test CSS or JS code on a web page.
const urlPatterns = [
    'https://minikai.com/',
];/* .map(urlPattern => new URLPattern(urlPattern)); */

export {
    files,
    interceptions,
    urlPatterns,
    urls,
}