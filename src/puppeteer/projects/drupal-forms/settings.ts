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
        'https://www.visionaustralia.org/sites/default/files/css/css_dqI4WEksqiZ6K9KlanMTaO2t3kllfAyA-IwXh7JXBCs.css?delta=1&language=en&theme=vision_australia&include=eJx9j0sKhEAMRC_kZzfXkaixJ5B0pCuOOKcfBXeNs0kC71GkcCDY-pHAzUcgngfaEIVUqJ_Oy62dy7aStosXawngQK0unoN2hhsPrxon9fGMQBwqOTU7j1daf-9uclsdElwRVjbO0c0cJIouPCV91t5e5Hu9okPZ_njGAKVn7mucBVDxa_wA-4J46w',
        'https://www.visionaustralia.org/sites/default/files/css/css_swkj6i-0ADhIrhPK1MgvAlsmL7nUTBVXW9E0cwbtSpU.css?delta=1&language=en&theme=vision_australia&include=eJx9kdEOgzAIRX_ItW_7HUMr1ma0GMAZ9_XTZXty9QVCziXhXiIL-kGWGcgZBMIJYUDpdFPD4gMods-smWsPi5oAZfAjV4MVlQv29zNOxAHoprZRrqlbMYwsxX-7i1xm1mx4IkhYsJob0CCTOuOUqC2bWPLrOIV6WS50lB8o1sQFVSG113m23Z-2uU17YC0qYP9C-GGNcHH55yPXVPcpns0d5Q2_obn1',
    ],
    [
        'https://www.visionaustralia.org/test.css',
        'src/puppeteer/projects/drupal-forms/test.css'
    ],
    // We take the JS from https://www.visionaustralia.org/form/school-holiday-therapy-groups which already works
    [
        'https://www.visionaustralia.org/sites/default/files/js/js_hvacBYIA45oZEGMvWxNdSUf7VJLlEm9Vv-lL7uXnLVY.js?scope=footer&delta=0&language=en&theme=vision_australia&include=eJyFUVtuxDAIvFAefz1E1b8ewCKY9bLBxg0k296-jnZbVYqi_pgxM4wBoxAUB5lHqBN6X9dJGDsUpuLGkcIGwhGctYTbx0rL14jb8EDDk6MuqSah4JCCL4AzlzT-gG51FvZWpzlreX3_k9CZ6fd6hRKF3jRx6Ta2_UVYrdkIw4gNae7jslaQ_qJL7sGM3I7Si7aJ7mSaKbwc6SQ6NQvDhWsrv9O0u43POJBQbrMPeCWcJ_2kc0kkBxYbDDb6V-Sa2opOZZnMIJ3zWvcvOO_FGkA_0PvxDW-Vvco',
        'https://www.visionaustralia.org/sites/default/files/js/js_eirIbfQEZUKXeiyi7-XE7LIDB1mPPp5khGpiCgRQQP0.js?scope=footer&delta=0&language=en&theme=vision_australia&include=eJyFkVFSxCAMhi_E0jcP4fjmATqBZmlsSpCkXb29dKzOjsr4AoHvDyT5IyNkA14GKCHapWyBKbrIhNmUJhx3YJrASPL48rphfR_i7j8jfzJ0USoOU90KsDcIjBW1SFba_2CKjNFcEkmMo0EarUJcKKfhK3CbEZO1v2RdJT8-313IQvh9nCFPjE-SKLud9KgSNm3PMMFwldbaDVVWHB9-48QSgC8aKxVTd8NwlboO5-5blWsbgo8zxiXIG_YlExoQq1do_f4nMkmt766MacFqXbyiKqR-upTDqn6pYjPWLq3N6Db9Hj6d6-F7d39qjuUD57by4Q',
    ],
    [
        `https://www.visionaustralia.org/test.js`,
        'dist/puppeteer/projects/drupal-forms/test.js',
    ],
    [
        `https://www.visionaustralia.org/foo.js`,
        'dist/puppeteer/projects/drupal-forms/foo.js',
    ],
    [
        'https://www.visionaustralia.org/',
        'src/puppeteer/projects/drupal-forms/test.html',
    ],
]);

// Let `urls` be the a list of urls which Pupeteer will open in a tab.
const urls = [
    'https://www.visionaustralia.org/',
    // 'https://www.visionaustralia.org/form/march-2026-webform',
    // 'https://www.visionaustralia.org/form/school-holiday-therapy-groups',
    // `https://www.visionaustralia.org/content-general-template`,
    // `https://www.visionaustralia.org/content-general-pattern`,
    // `https://www.visionaustralia.org/landing-template`,
    // `https://www.visionaustralia.org/landing-pattern`,
    // `https://www.visionaustralia.org/services/staying-connected/events/2019-01-01/content-events-template`,
    // `https://www.visionaustralia.org/community/news/2024-09-18/content-news-template`,
    // `https://www.visionaustralia.org/healthcare-professionals/resources/articles/content-template`,
    // `https://www.visionaustralia.org/business-consulting/digital-access/DA-blog-template`,
    // `https://www.visionaustralia.org/services/helpful-resources/individuals/life-hacks/life-hack-video-series/life-hacks-template`,
    // `https://www.visionaustralia.org/node/31011`,
    // `https://www.visionaustralia.org/node/31016`,
    // `    `,
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