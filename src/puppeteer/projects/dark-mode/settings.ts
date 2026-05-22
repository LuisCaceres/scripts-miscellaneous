// import { URLPattern } from "url";

// Let `urls` be a list of replacee urls each associated with a replacement url.
const interceptions = new Map([
    [
        'https://www.visionaustralia.org/utils.js',
        'dist/puppeteer/projects/dark-mode/utils.js',
    ],
    [
        'https://www.visionaustralia.org/test.js',
        'dist/puppeteer/projects/dark-mode/test.js',
    ],
    [
        'https://www.visionaustralia.org/test.css',
        'src/puppeteer/projects/dark-mode/test.css',
    ],
]);

// Let `urls` be the a list of urls which Pupeteer will open in a tab.
const urls = [
    `https://www.visionaustralia.org/`,
];

// Let `urlPatterns` be a list of patterns that Pupeteer can use to check if a web page should get custom stylysheet or script insertion. Custom insertion is useful when, for example, the developer wants to test CSS or JS code on a web page.
const urlPatterns = [
    'https://www.visionaustralia.org/',
];/* .map(urlPattern => new URLPattern(urlPattern)); */

export {
    interceptions,
    urlPatterns,
    urls,
}