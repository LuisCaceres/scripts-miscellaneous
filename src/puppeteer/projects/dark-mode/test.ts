import { getClosestColor, getColour, getColourDistance, regexes } from "./utils.js";

{
    // The following code removes the default styles applied to the section that has a web form in Drupal. An example of this is https://www.visionaustralia.org/form/school-holiday-therapy-groups.
    // Why do we do this? Because overriding default styles is very complicated and the developer has to deal with specificity of selectors. For that reason, style rules get removed so that we can get to a clean slate as much as possible. Then another stylesheet should be loaded that contains the desired styles. The intention is that the stylesheet has selectors with low specificity.

    // Let `domain` be the domain that this web page belongs to. Please note that CSS rules can only be removed if the URL of the CSS file belongs to the same domain (otherwise a JS error is thrown). For example, CSS rules from a CSS file loaded from Google cannot be removed unless the entire CSS file is removed. This may not be ideal.
    const domain = 'https://www.visionaustralia.org/';

    // Let `stylesheets` be a list of stylesheets that load from `domain`.
    const stylesheets = [...document.styleSheets].filter(
        stylesheet => stylesheet.href?.startsWith(domain)
    )
        .filter(stylesheet =>
            stylesheet.href !== 'https://www.visionaustralia.org/test.css'
        );


    // stylesheets.length = 0;

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
                const ruleList = rule as CSSGroupingRule;
                rules.push(...getRules(ruleList));
            }
        }

        return rules;
    }).flat() as CSSStyleRule[];

    // Let `colourProperties` be a list of properties that accept colour values (CSS <color> value).
    const colourProperties = new Set([
        // Core color / UI color
        "color",
        "accent-color",
        "caret-color",

        // Backgrounds (longhands + shorthand that includes <color>)
        "background",
        "background-color",

        // Borders (shorthands + longhands that include <color>)
        "border",
        "border-color",
        "border-top",
        "border-right",
        "border-bottom",
        "border-left",
        "border-top-color",
        "border-right-color",
        "border-bottom-color",
        "border-left-color",

        // Outlines (shorthand + longhand that includes <color>)
        "outline",
        "outline-color",

        // Columns
        "column-rule",
        "column-rule-color",

        // Text decoration / emphasis (shorthands + longhands that include <color>)
        "text-decoration",
        "text-decoration-color",
        "text-emphasis",
        "text-emphasis-color",

        // Shadows (include optional <color>)
        "box-shadow",
        "text-shadow",

        // SVG / CSS presentation properties commonly used in web UI
        "fill",
        "stroke",
        "stop-color",
        "flood-color",
        "lighting-color"
    ]);

    // Let `tokens` be a list of CSS keywords and characters that don't have anything to do with colour manipulation of a web page.
    const tokens = new RegExp(`(${[
        '/', // Can be part of the value of the background property.
        '!important',
        'auto',
        'center',
        'dashed',
        'dotted',
        'inherit',
        'initial',
        'inset',
        'no-repeat',
        'none',
        'solid',
        'transparent',
        'underline',
    ].join('|')})`, 'g');

    // Let `valueComponents` be a list of regular expressions.
    let valueComponents = new Map([
        // For example, it matches `url("https://www.website.com/image.png")` in ``. Make sure this is the first regex in this map.
        ['url', /url\("[\w\W]+?"\)/g],
        // For example, it matches `!important`, `center` or `dashed` in ``.
        ['tokens', tokens],
        // For example, it matches `0px`, `10.5rem` or `-75%` in ``. It matches absolute or relative values.
        ['value', /-?\d+(\.\d+)?(em|px|rem|%)/g],
    ]);

    const config = {
        // Let `colours` be a list of colours that shouldn't be modified if they are part of the value of some properties.
        colours: new Map([
            [`background`, [`rgb(0, 32, 91)`, `rgb(250, 225, 16)`]],
            [`border`, [`rgb(255, 255, 255)`]],
            [`color`, [`rgb(255, 255, 255)`]],
            [`fill`, [`rgb(255, 255, 255)`]],
        ]),
        combinations: new Map([
            ['rgb(0, 32, 91)', 'rgb(255, 255, 255)'],
            [`rgb(250, 225, 16)`, `rgb(0, 32, 91)`],
        ]),
        // Let `selectors` be a list of selectors that filter out rules that shouldn't be modified.
        selectors: new Map([
            // `:active`,
            // `:focus`,
            // `:hover`,
            // '.card.active',
            [
                '.header-right a, .header-left a.header-hover, .curtain-menu-text',
                '.header-right a, .header-left a.header-hover'],
            [
                '.header-right h3 + a:hover path',
                ''
            ],
            [
                'footer.page-footer .footer-menu .menu-column a:hover, footer.page-footer .footer-menu .menu-column a:focus, footer.page-footer .footer-menu .menu-column a:active',
                ''
            ],
            [
                '.header-hover.search-bar:hover svg, .header-hover.search-bar:focus svg',
                ''
            ],
            [
                'button.btn.btn-default.des-search-button:hover, button.btn.btn-default.des-search-button:focus, button.btn.btn-default.g-search-button:hover, button.btn.btn-default.g-search-button:focus',
                '',
            ],
        ]),
    };

    // Let `strings` be a list of CSS rules as they would appear in a CSS file.
    const strings: string[] = [];

    // Let `colors` be a list of all color values that occur in `rules`.
    const colors: Set<string> = new Set();

    // For each rule `rule` in `rules`.
    for (const rule of rules) {
        // Let `rule` be the current rule. A rule is a selector and a declaration block with a list of declarations.

        // Let `selector` be the CSS selector associated with `rule`. For example, `h1 > p + div`.
        let selector = rule.selectorText;

        // if (rule.selectorText.startsWith('button.btn.btn-default.des-search-button:hover')) {
        //     debugger;
        // }

        // Modify `selector`, if necessary, for better compatibility with dark mode. For example, `h1 > p + div` can be changed to `h1`.
        if (config.selectors.has(selector)) {
            const newSelector = config.selectors.get(selector)!;
            selector = newSelector;

            // Remove `rule` and declarations within from the dark mode stylesheet, if necessary.
            if (!selector) {
                continue;
            }
        }

        // Let `declarationBlock` be the part of `rule` that has the list of declarations.
        const declarationBlock = rule.cssText
            // Remove the selector from `rule`.
            .replace(rule.selectorText, '')
            .trim()
            // Remove the first { character and last } characters from `rule`.
            .replace(/^{|}$/g, '');

        // Let `declarations` be each property-value pair in `declarationBlock`.
        let declarations = [...declarationBlock.matchAll(regexes.declaration)]
            // For each declaration `declaration` in `declarations`.
            .map(([, property, value]) => [property, value])
            // Remove `declaration` if its property is unrelated to colour manipulation. For example, `text-align: center`.
            .filter(([property]) => colourProperties.has(property))
            // Remove `declaration` if every component in its value are unrelated to colour manipulation. For example, it removes declaration `border: solid 100px`. If the value contains at least 1 component related to colour manipulation, `declaration` isn't removed. For example, declaration `border: red solid 100px`. IMPORTANT: Please note that the browser exposes colours only as `rgb` or `rgba` values even though `hex` values appear in the source stylesheet.
            .filter(([, value]) => {

                for (const [, regex] of valueComponents) {
                    value = value.replace(regex, '').trim();
                };

                // Let `color` be the component in `value` that defines a colour.
                const color = value;
                // Add `color` to `colors`.
                colors.add(color);

                return value.length;
            })

        // Let `backgroundColor` be the background color, if any, that `rule` defines.
        let backgroundColor = getColour('background', declarations);
        // Let `isDarkBackgroundColor` be a flag that indicates whether `backgroundColor` is dark or light.
        let isDarkBackgroundColor = false;

        if (backgroundColor) {
            const backgroundColors = config.colours.get('background')!;
            const closestColor = getClosestColor(backgroundColor, backgroundColors);
            const distance = getColourDistance(backgroundColor, closestColor);

            if (distance >= 0.9) {
                backgroundColor = closestColor;
                isDarkBackgroundColor = true;
            }
        }

        // Let `textColor` be the text color, if any, that `rule` defines.
        let textColor = getColour('color', declarations);
        let isLightTextColor = false;

        if (textColor) {
            const textColors = config.colours.get('color')!;
            const closestColor = getClosestColor(textColor, textColors);
            const distance = getColourDistance(textColor, closestColor);

            if (distance >= 0.9) {
                textColor = closestColor;
                isLightTextColor = true;
            }
        }

        // If `rule` defines a dark background color but not a text color.
        if (isDarkBackgroundColor && !textColor) {
            // Add `color` property with no value to `declarations`. The value will be defined further down the code. This ensures that text color has sufficient contrast against the background color.
            const declaration = [`color`, `undefined`];
            declarations.push(declaration);
        }

        declarations = declarations
            // Remove `declaration` if `rule` defines a dark background colour or a light text colour. It's assumed `rule` defines colours that are already compatible with dark mode. For example, a rule that defines a black background and white text colour.
            .filter(([, value]) => {

                if ((isDarkBackgroundColor || isLightTextColor) &&
                    value !== 'undefined') {
                    return false;
                }
                else {
                    return true;
                }
            })
            // Remove `declaration` if its value has a colour that's not necessary to modify. For example, it's not necessary to modify dark backgrounds because dark mode requires those dark backgrounds.
            .map(([property, value]) => {

                if (value !== `undefined`) {
                    return [property, value];
                }

                const color = config.combinations.get(backgroundColor!)!;
                // value = color;
                value = 'var(--colour-2)';
                return [property, value];
            })

        // Remove `rule` if running the steps above left `rule` with no declarations.
        if (declarations.length === 0) {
            continue;
        }

        // Format `declarations` so that they can appear in a CSS file.
        const string = `
            ${selector} {
                ${declarations
                .map(([property, value]) => `${property}: ${value};`)
                .join('\n')
            }
        }`;

        strings.push(string);
    }

    let colours1 = [...colors].map(value => {
        const colours = value.match(regexes.rgb);
        // debugger;
        const rest = value.replace(regexes.rgb, '').trim();
        return [colours, rest];
    }).flat(2);

    console.log([...colours1].join('`, \n`'));

    const colours = [
        `rgba(0, 0, 0, 0.063)`,
        `rgb(204, 204, 204)`,
        `rgb(255, 244, 244)`,
        // `var(--fa - border - color, #eee)`,
        // `var(--fa - inverse, #fff)`,
        `rgb(0, 32, 91)`,
        `rgb(255, 255, 255)`,
        `rgba(35, 23, 5, 0.26)`,
        `rgb(230, 233, 235)`,
        `rgb(250, 225, 16)`,
        `rgb(52, 152, 219)`,
        `rgb(242, 244, 245)`,
        `rgb(38, 65, 116)`,
        `rgb(204, 212, 216)`,
        `rgb(53, 65, 75)`,
        `rgb(0, 0, 0)`,
        `rgb(31, 40, 51)`,
        `rgba(0, 0, 0, 0.4)`,
        `rgb(153, 167, 176)`,
        `rgb(108, 133, 168)`,
        `rgb(14, 99, 98)`,
        `rgb(76, 99, 140)`,
        `rgb(149, 167, 191)`,
        `rgb(113, 178, 178)`,
        `rgb(172, 32, 30)`,
        `rgb(151, 60, 0)`,
        `rgb(2, 96, 122)`,
        // `red`, TO DO: Only look for colours to replace in the value of a property and not anywhere else. For example, frederick { background: red } should only get modified `red` in the value and not `red` in frederick.
        `rgba(0, 0, 0, 0.2)`,
        `rgba(0, 0, 0, 0.5)`,
        `rgb(229, 233, 239)`,
        `rgb(84, 101, 112)`,
        `rgba(0, 0, 0, 0.04)`,
        `rgb(108, 67, 135)`,
        `rgba(218, 217, 217, 0.5)`,
        `rgb(148, 0, 18)`,
        `rgba(255, 255, 255, 0.7)`,
        `rgb(243, 221, 221)`,
        `rgb(217, 231, 235)`,
        `rgb(253, 244, 242)`,
        `rgb(184, 184, 184)`,
        `rgb(252, 244, 242)`,
        `rgb(239, 226, 217)`,
        `rgb(219, 232, 231)`,
        `rgba(0, 0, 0, 0.075)`,
        `rgba(0, 0, 0, 0.125)`,
        `rgb(132, 53, 52)`,
        `rgb(77, 144, 254)`,
    ];

    // Let `customProperties` be a list of colours each of them assigned to a custom CSS property.
    const customProperties = [...colours].map((colour, index) =>
        `--colour - ${index}: ${colour}; `
    );

    // Let `cssFile` be a new CSS file that only has declarations to manipulate the colours of a web page.
    const cssFile = `
            :root {
                ${customProperties.join('\n')}
}

            ${strings.map(string =>
        [...colours].reduce((string, colour, index) => string.replaceAll(colour, `var(--colour-${index})`), string))
            .join('')
        }
    `;

    const style = document.createElement('style');
    style.textContent = `
    body {
        white-space: break-spaces;
    }
    `;

    // Open `cssFile` in a new tab.
    const tab = window.open() as Window;
    tab.document.body.append(cssFile, style);
}



// TO DO: There's a bug where the border is white (you can't see the border) in non-dark mode and the code thinks it's white because there's a dark background around it. The code thinks it must preserve it.