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


    [
        `https://www.visionaustralia.org/sites/default/files/css/css_swkj6i-0ADhIrhPK1MgvAlsmL7nUTBVXW9E0cwbtSpU.css?delta=1&language=en&theme=vision_australia&include=eJx9jzEOwzAMAz-U2lu_Y8it4gqQrcBUGqSvbwNkM9KFHO4GEjuca8wEnt4CsZZohXdSoThbc9oYVjndR1zUMukNvqu0Mm2cZ-s1nh0eVheDOA-ElSs3D092EkVwK0WvtZd1-RxTNPX1j1cZoHLNbfHfAQz8iC_u6Wfi`,
        'src/puppeteer/projects/drupal-forms/styles.css',
    ],
    [
        'https://www.visionaustralia.org/sites/default/files/css/css_swkj6i-0ADhIrhPK1MgvAlsmL7nUTBVXW9E0cwbtSpU.css?delta=1&language=en&theme=vision_australia&include=eJxlyUEOgCAMBMAPqdz8jllixSYFGhY0_t6bF68zjobU4CfD3obDFv9kGcVHNOUp-8SHXXKIoEyXUmvZMNgbTBGOWjpuYc2yrf9OViNsZn9MS3oBXMotuQ',
        'src/puppeteer/projects/drupal-forms/styles.css',
    ],
    [
        'https://www.visionaustralia.org/sites/default/files/css/css_swkj6i-0ADhIrhPK1MgvAlsmL7nUTBVXW9E0cwbtSpU.css?delta=1&language=en&theme=vision_australia&include=eJx9kdEOgzAIRX_ItW_7HUMr1ma0GMAZ9_XTZXty9QVCziXhXiIL-kGWGcgZBMIJYUDpdFPD4gMods-smWsPi5oAZfAjV4MVlQv29zNOxAHoprZRrqlbMYwsxX-7i1xm1mx4IkhYsJob0CCTOuOUqC2bWPLrOIV6WS50lB8o1sQFVSG113m23Z-2uU17YC0qYP9C-GGNcHH55yPXVPcpns0d5Q2_obn1',
        'src/puppeteer/projects/drupal-forms/styles.css',
    ],
    [
        'https://www.visionaustralia.org/sites/default/files/css/css_swkj6i-0ADhIrhPK1MgvAlsmL7nUTBVXW9E0cwbtSpU.css?delta=1&language=en&theme=vision_australia&include=eJxlykEOhCAMRuELqey8DinhF5sU2lDQeHsns5jNbN_3jDqVTnZ6yH0ayWa_ss1mMwn7ibz44wM1JHIsF2doRE3I8WBIDh1u2pwvrF_8LM7aIk0fnYQpHNoG3XCtiPs_F9FEsvp4hFt5AYcEO3w',
        'src/puppeteer/projects/drupal-forms/styles.css',
    ],
    [
        'https://www.visionaustralia.org/test.css',
        'src/puppeteer/projects/drupal-forms/test.css'
    ],
    [
        'https://www.visionaustralia.org/sites/default/files/css/css_dqI4WEksqiZ6K9KlanMTaO2t3kllfAyA-IwXh7JXBCs.css?delta=1&language=en&theme=vision_australia&include=eJx9j0sKhEAMRC_kZzfXkaixJ5B0pCuOOKcfBXeNs0kC71GkcCDY-pHAzUcgngfaEIVUqJ_Oy62dy7aStosXawngQK0unoN2hhsPrxon9fGMQBwqOTU7j1daf-9uclsdElwRVjbO0c0cJIouPCV91t5e5Hu9okPZ_njGAKVn7mucBVDxa_wA-4J46w',
        'src/puppeteer/projects/drupal-forms/styles.css',
    ],
    [
        `https://www.visionaustralia.org/test.js`,
        'dist/puppeteer/projects/drupal-forms/test.js',
    ],
    // [
    //     `https://www.visionaustralia.org/foo.js`,
    //     'dist/puppeteer/projects/drupal-forms/foo.js',
    // ],
    // [
    //     'https://www.visionaustralia.org/',
    //     'src/puppeteer/projects/drupal-forms/test.html',
    // ],
]);

// Let `urls` be the a list of urls which Pupeteer will open in a tab.
const urls = [
    'https://www.visionaustralia.org',
    'https://www.visionaustralia.org/form/march-2026-webform',
    'https://www.visionaustralia.org/form/school-holiday-therapy-groups',
    'https://www.visionaustralia.org/form/future-me-registration',
    'https://www.visionaustralia.org/healthcare-professionals/resources/articles/preparing-documents',
];

// Let `urlPatterns` be a list of patterns that Pupeteer can use to check if a web page should get custom stylysheet or script insertion. Custom insertion is useful when, for example, the developer wants to test CSS or JS code on a web page.
const urlPatterns = [
    // 'https://www.visionaustralia.org/*',
    'https://www.visionaustralia.org/',
];/* .map(urlPattern => new URLPattern(urlPattern)); */

export {
    interceptions,
    urlPatterns,
    urls,
}