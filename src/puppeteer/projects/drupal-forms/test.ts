
// The following code removes the default styles applied to the section that has a web form in Drupal. An example of this is https://www.visionaustralia.org/form/school-holiday-therapy-groups.
// Why do we do this? Because overriding default styles is very complicated and the developer has to deal with specificity of selectors. For that reason, style rules get removed so that we can get to a clean slate as much as possible. Then another stylesheet should be loaded that contains the desired styles. The intention is that the stylesheet has selectors with low specificity.

// Let `domain` be the domain that this web page belongs to. Please note that CSS rules can only be removed from a stylesheet if the URL of the stylesheet (CSS file) belongs to the same domain (otherwise a JS error is thrown). For example, CSS rules from a stylesheet loaded from www.google.com cannot be removed unless the entire stylesheet is removed. This may not be ideal in all cases.
{
    const domain = new URL(document.location.href).origin; // For example, `https://www.visionaustralia.org/`.

    // Let `stylesheets` be a list of stylesheets that load from `domain`.
    const stylesheets = [...document.styleSheets].filter(
        stylesheet => stylesheet.href?.startsWith(domain)
    );

    // Let `rules` be a list of all the CSS rules in `stylesheets`.
    const rules = stylesheets.map(function getRules(ruleList: CSSGroupingRule | CSSStyleSheet): CSSRule[] {
        const rules: CSSRule[] = [];

        if (!ruleList.cssRules) {
            return rules;
        }

        for (const rule of ruleList.cssRules) {
            const type = rule.constructor.name;

            if (type === 'CSSStyleRule') {
                rules.push(rule);
            }
            else {
                const ruleList = rule;
                rules.push(...getRules(ruleList));
            }
        }

        return rules;
    }).flat() as CSSStyleRule[];

    // Let `selectors` be a list of CSS selectors.
    const selectors = [
        `hr`,
        `b, strong`,
        `fieldset`,
        `legend`,
        `[type="checkbox"], [type="radio"]`,
        `label`,
        `.button`,
        `.button`,
        `.right-cont-component h2`,
        `.right-cont-component h2`,
        `.right-cont-component h3`,
        `.right-cont-component h3`,
        `.right-cont-component h4`,
        `.right-cont-component h4`,
        `.news-detail-page .row .col-md-8 div p`,
        `div#edit-actions`,
        `.required.error`,
        `.news-detail-page .row .col-md-8`,
        `.news-detail-page .row .col-md-8 p`,
        `fieldset#edit-field-event-state-value--wrapper span.fieldset-legend, .fieldgroup legend span.fieldset-legend`,
        `span.fieldset-legend`,
        `.news-detail-page .row .col-md-8 hr`,
        `.form-item.js-form-item.form-type-checkbox.js-form-type-checkbox`,
        `.js-form-type-checkbox, .js-form-type-radio`,
        `.js-form-type-checkbox .control-label.option, .js-form-type-radio .control-label.option`,
        `.js-form-type-checkbox .control-label.option, .js-form-type-radio .control-label.option`,
        `h4`,
        `.button`,
        `input#edit-submit`,
        `input, select`,
        `input, select`,
        `select`,
        `.form-type-radio`,
        `.form-type-radio input`,
        `.form-type-radio label`,
        `.form-item.js-form-item.form-type-checkbox`,
        `.form-item.js-form-item.form-type-checkbox input`,
        `.form-item.js-form-item.form-type-checkbox label`,
        `input[type="radio"], input[type="checkbox"]`,
        `.help-block`,
        `.select-wrapper select, .select-wrapper textarea`,
        `.news-detail-page .right-cont-component [id*="webform-submission-"]`,
        `div#edit-actions`,
        `div#edit-actions span`,
        `.form-actions input`,
        `fieldset.webform-composite-hidden-title`,
        `fieldset.webform-composite-hidden-title .fieldset-wrapper > .form-item:first-child, fieldset.webform-composite-hidden-title .fieldset-wrapper > .form-wrapper > .form-item:first-child, fieldset.webform-composite-hidden-title .fieldset-wrapper > .webform-flexbox:first-child`,
        `legend`,
        `.form-control`,
        `.form-item.js-form-item.form-type-checkbox.js-form-type-checkbox.form-item-yes.js-form-item-yes`,
        `.form-item.js-form-item.form-type-checkbox.js-form-type-checkbox.form-item-yes.js-form-item-yes input`,
        `.form-textarea-wrapper .form-textarea`,
        `.news-detail-page .region.region-content`,
        `.path-node input.error`,
        `.path-node .webform .form-item`,
        `.webform-flex--container`,
        `.webform-options-display-three-columns`,
        `.webform-submission-add-form .js-form-type-checkbox .control-label.option, .webform-submission-add-form .js-form-type-radio .control-label.option`,
        `.webform-submission-add-form .form-item.js-form-item.form-type-checkbox`,
        `.webform-submission-add-form .form-item.js-form-item.form-type-checkbox input`,
        `.webform-submission-add-form .form-item.js-form-item.form-type-checkbox label`,
        `button, input, optgroup, select, textarea`,
        `textarea`,
        `textarea.form-control`,
    ];

    // Let `relevantRules` be a list of rules from `rules` that are associated with a selector from `selectors`.
    const relevantRules = rules.filter(rule =>
        selectors.includes(rule.selectorText)
    );

    // For each relevantRule `relevantRule` of `relevantRules`.
    for (const relevantRule of relevantRules) {
        // Delete `relevantRule`.
        const list = [...(relevantRule.parentRule || relevantRule.parentStyleSheet).cssRules];
        const index = list.findIndex(rule => rule === relevantRule);
        (relevantRule.parentRule || relevantRule.parentStyleSheet).deleteRule(index);
    }
}