// import { URLPattern } from "url";

// Let `urls` be a list of replacee urls each associated with a replacement url.
const interceptions = new Map([
    // [
    //     // This is a path to a file requested by `page`.
    //     'https://www.visionaustralia.org/form/school-holiday-therapy-groups',
    //     // This is a path to a file in this repository.
    //     'src/puppeteer/test.html'
    // ],
    // We take the CSS from https://www.visionaustralia.org/form/school-holiday-therapy-groups which already works
    // [
    //     `https://www.visionaustralia.org/themes/custom/vision_australia/images/logo/logo-desktop.svg`,
    //     `https://www.visionaustralia.org/themes/custom/vision_australia/images/logo/hoverfooter-logo.svg`,
    //     // `https://www.visionaustralia.org/themes/custom/vision_australia/images/logo/footer-logo.svg`,
    // ],
    // [
    //     `https://www.visionaustralia.org/sites/default/files/css/css_dqI4WEksqiZ6K9KlanMTaO2t3kllfAyA-IwXh7JXBCs.css?delta=1&language=en&theme=vision_australia&include=eJx9j0sKhEAMRC_kZzfXkaixJ5B0pCuOOKcfBXeNs0kC71GkcCDY-pHAzUcgngfaEIVUqJ_Oy62dy7aStosXawngQK0unoN2hhsPrxon9fGMQBwqOTU7j1daf-9uclsdElwRVjbO0c0cJIouPCV91t5e5Hu9okPZ_njGAKVn7mucBVDxa_wA-4J46w`,
    // ],
    [
        `https://www.visionaustralia.org/test.css`,
        'src/puppeteer/projects/drupal-forms/test.css',
    ],
    [
        `https://carols-uat.visionaustralia.org/test.css`,
        'src/puppeteer/projects/drupal-forms/test.css',
    ],
    [
        `https://seda-uat.visionaustralia.org/test.css`,
        'src/puppeteer/projects/drupal-forms/test.css',
    ],
    // [
    //     'https://www.visionaustralia.org/',
    //     'src/puppeteer/projects/drupal-forms/test.html',
    // ],
]);

// Let `urls` be the a list of urls which Pupeteer will open in a tab.
const urls = [
    // 'https://www.visionaustralia.org',
    // 'https://www.visionaustralia.org/form/march-2026-webform',
    'https://www.visionaustralia.org/form/school-holiday-therapy-groups',
    // 'https://carols-uat.visionaustralia.org/form/carols-competition-opt-out',
    // 'https://www.visionaustralia.org/form/future-me-registration',
    // 'https://www.visionaustralia.org/healthcare-professionals/resources/articles/preparing-documents',
];

// Let `urlPatterns` be a list of patterns that Pupeteer can use to check if a web page should get custom stylysheet or script insertion. Custom insertion is useful when, for example, the developer wants to test CSS or JS code on a web page.
const urlPatterns = [
    // 'https://www.visionaustralia.org/*',
    'https://www.visionaustralia.org/',
    'https://carols-uat.visionaustralia.org/',
    'https://seda-uat.visionaustralia.org/',
];/* .map(urlPattern => new URLPattern(urlPattern)); */

export {
    interceptions,
    urlPatterns,
    urls,
}