// import { URLPattern } from "url";

// Let `urls` be a list of replacee urls each associated with a replacement url.
const interceptions = new Map([

]);

// Let `urls` be the a list of urls which Pupeteer will open in a tab.
const urls = [
    `https://carols.visionaustralia.org/our-partners/become-a-partner`,
    `https://carols.visionaustralia.org/form/what-is-your-fondest-memory-of-v`,
    `https://carols.visionaustralia.org/contact-us`,
    `https://sed.visionaustralia.org/about-us/news-and-stories/Name-NAIDOC-Seeing-Eye-Dogs-pup-for-NAIDOC-week/submission-form`,
    `https://sed.visionaustralia.org/form/contact-us`,
    `https://sed.visionaustralia.org/form/register-your-interest-for-puppy`,
    `https://sed.visionaustralia.org/form/request-dog-adoption`,
    `https://sed.visionaustralia.org/form/sed-youth-program`,
    `https://www.visionaustralia.org/admin/structure/webform?search=&category=&state=open&sort=desc&order=Results`,
    `https://www.visionaustralia.org/form/complaints-and-suggestions-for-i`, // REMOVE FIXED WIDTH
    `https://www.visionaustralia.org/fyi`,
    `https://www.visionaustralia.org/community/news/2026-03-30/get-know-new-metro-tunnel-stations/register-now`,
    `https://www.visionaustralia.org/form/future-me-registration`,
    `https://www.visionaustralia.org/form/carers-our-partners-in-support-c`,
    `https://www.visionaustralia.org/business-consulting/digital-access/digital-access-technology-newsletter`,
    `https://www.visionaustralia.org/services/staying-connected/events/2026-05-26/aged-care-professionals-open-day/register-now`,

    `https://www.visionaustralia.org/form/complaints-and-suggestions-for-i`, // REMOVE FIXED WIDTHS
    `https://www.visionaustralia.org/form/future-me-registration`,
    `https://www.visionaustralia.org/fyi`,
    `https://www.visionaustralia.org/community/news/2026-03-30/get-know-new-metro-tunnel-stations/register-now`,
    // `https://www.visionaustralia.org/form/carers-our-partners-in-support-c`,
    // `https://www.visionaustralia.org/business-consulting/digital-access/digital-access-technology-newsletter`,
    // `https://www.visionaustralia.org/form/dat-download-registration`, // BUTTON LOOKING FUNNY // FIXED WIDTH
    // `https://www.visionaustralia.org/services/staying-connected/events/2026-05-26/aged-care-professionals-open-day/register-now`,
    // `https://www.visionaustralia.org/form/registration-for-amazon-smart-sp`,
    // `https://www.visionaustralia.org/form/nsw-spectacles-program-enquiry`, // BUTTON // FIXED WIDTH
    // `https://www.visionaustralia.org/community/news/2026-02-24/fast-tracked-home-modifications-your-clients/book-a-time-to-talk`,
    // `https://www.visionaustralia.org/business-consulting/speakers-network/way_i_see_information_and_registration`,
    // `https://www.visionaustralia.org/form/print-access-contact-us`, // BUTTON // // FIXED WIDTH
    // `https://www.visionaustralia.org/healthcare-professionals/newsletter-signup`,
    // `https://www.visionaustralia.org/form/lego-braille-bricks-expression-o`,
    // `https://www.visionaustralia.org/form/leap-registration-form`,
    // `https://www.visionaustralia.org/form/school-holiday-therapy-groups`,
    // `https://www.visionaustralia.org/form/dat-download-registration-multi`, // BUTTON // FIXED WIDTH
    // `https://www.visionaustralia.org/form/include-a-gift-in-your-will-form`,
    // `https://www.visionaustralia.org/form/in-the-drivers-seat-july-5`,
    // `https://www.visionaustralia.org/services/find-services/children/high-school-years/tertiary-ready/register`,
    // `https://www.visionaustralia.org/form/register-your-interest-certifica`,
    // `https://www.visionaustralia.org/form/register-your-interest-in-qualit`,
    // `https://www.visionaustralia.org/form/employment-assistance-callback`,
    // `https://www.visionaustralia.org/form/contact-philanthropy-team`,
    // `https://www.visionaustralia.org/form/seed-library-registration-form`,
    // `https://www.visionaustralia.org/form/order-form-lets-talk-about-visio`,
    // `https://www.visionaustralia.org/form/feelix-membership-webform`,
    // `https://www.visionaustralia.org/form/leap-interest-questionnaire-`,
    // `https://www.visionaustralia.org/form/fundraising-mailing-list`,
    // `https://www.visionaustralia.org/form/have-your-say`, // BUTTON // FIXED WIDTH
    // `https://www.visionaustralia.org/form/braille-order-form`, // BUTTON // FIXED WIDTH
    // `https://www.visionaustralia.org/form/library-membership-form`, // BUTTTON // FIXED WIDTH
    // `https://www.visionaustralia.org/form/book-suggestions`, // BUTTON // // FIXED WIDTH
    // `https://www.visionaustralia.org/form/inter-library-loan`, // BUTTON // FIXED WIDTH
    // `https://www.visionaustralia.org/form/contact-the-library`, // BUTTON // FIXED WIDTH
    // `https://www.visionaustralia.org/form/ask-a-librarian`, // BUTTON // FIXED WIDTH
    // `https://www.visionaustralia.org/form/expression-of-interest`, // BUTTON // FIXED WIDTH
    // `https://www.visionaustralia.org/form/healthcare-professional-referral`, // BUTTON // FIXED WIDTH
    // `https://www.visionaustralia.org/form/complaints-and-suggestions`, // BUTTON // FIXED WIDTH
    // `https://www.visionaustralia.org/form/adaptive-technology-training-fee`, // BUTTON // // FIXED WIDTH
    // `https://www.visionaustralia.org/form/download-tools-from-digital-acce`, // BUTTON // // FIXED WIDTH
    // `https://www.visionaustralia.org/form/request-a-presenter`, // BUTTON // POST CODE FIELD WIDTH // // FIXED WIDTH
    // `https://www.visionaustralia.org/form/dat-feedback`, // BUTTON // FIXED WIDTH
    // `https://www.visionaustralia.org/form/digital-access-contact-us`, // BUTTON // WIDTH OF BUTTONS
    // `https://www.visionaustralia.org/form/request-a-vision-australia-speak`, // BUTTON // WIDTH OF BUTTONS
    // `https://www.visionaustralia.org/form/library-call-back-form`, // BUTTON // WIDTH OF BUTTONS
    // `https://www.visionaustralia.org/form/self-referral`, // BUTTON // WIDTH OF BUTTONS
    // `https://www.visionaustralia.org/form/l-230-family-referral`, // BUTTON // WIDTH OF BUTTONS
    // `https://www.visionaustralia.org/form/f-56-expression-of-interest`, // BUTTON // WIDTH OF BUTTONS
    // // `https://www.visionaustralia.org/form/contact`,
];

// Let `urlPatterns` be a list of patterns that Pupeteer can use to check if a web page should get custom stylysheet or script insertion. Custom insertion is useful when, for example, the developer wants to test CSS or JS code on a web page.
const urlPatterns = [
    // 'https://www.visionaustralia.org/*',
    // 'https://www.visionaustralia.org/',
    // 'https://carols.visionaustralia.org/',
    // 'https://seda-uat.visionaustralia.org/',
    // `https://sed.visionaustralia.org/`,
];/* .map(urlPattern => new URLPattern(urlPattern)); */

export {
    interceptions,
    urlPatterns,
    urls,
}