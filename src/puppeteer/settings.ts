interface Settings {
    interceptions: Map<string, string>,
    urls?: string[],
}

// Let `urls` be a list of replacee urls each associated with a replacement url.
const settings: Settings = {
    interceptions: new Map([
        // [
        //     // This is a path to a file requested by `page`.
        //     'https://www.visionaustralia.org/form/school-holiday-therapy-groups',
        //     // This is a path to a file in this repository.
        //     'src/puppeteer/test.html'
        // ],
        [
            'https://www.visionaustralia.org/test.css',
            'src/puppeteer/test.css'
        ],
        [
            'https://www.visionaustralia.org/script.js',
            'dist/puppeteer/script.js'
        ],
        [
            `https://www.visionaustralia.org/test.js`,
            `dist/puppeteer/test.js`
        ],
    ]),
};

// Let `urls` be the a list of urls which Pupeteer will open in a tab.
const urls = [
    'https://www.visionaustralia.org/',
    // 'https://www.visionaustralia.org/business-consulting/digital-access',
    // 'https://www.visionaustralia.org/google/search?keys=Vision+Australia',
    // `https://www.visionaustralia.org/login`,
    // 'https://www.visionaustralia.org/services',
];

export {
    settings,
    urls,
}