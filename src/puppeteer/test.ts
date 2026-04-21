{
    // The following code removes the default styles applied to the section that has a web form in Drupal. An example of this is https://www.visionaustralia.org/form/school-holiday-therapy-groups.
    // Why do we do this? Because overriding default styles is very complicated and the developer has to deal with specificity of selectors. For that reason, style rules get removed so that we can get to a clean slate as much as possible. Then another stylesheet should be loaded that contains the desired styles. The intention is that the stylesheet has selectors with low specificity.

    // Let `domain` be the domain that this web page belong to. Please note that CSS rules can only be removed if the URL of the CSS file belongs to the same domain (otherwise a JS error is thrown). For example, CSS rules from a CSS file loaded from Google cannot be removed unless the entire CSS file is removed. This may not be ideal.
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

    // Let `relevantRules` be a list of rules that contain at least 1 property from `colourProperties`.
    const relevantRules = rules.filter(rule => {
        const props = new Set(rule.styleMap.keys());
        return props.intersection(colourProperties).size > 0;
    });

    // Let `keywords` be a list of CSS keywords that don't have anything to do with colour manipulation of a web page.
    const keywords = new RegExp(`(${[
        '!important',
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

    // Let `regexes` be a list of regular expressions.
    let regexes = new Map([
        ['keywords', keywords],
        // Matches absolute or relative values, for example, `0px`, `10.5rem` or `75%`.
        ['value', /\d+(\.\d+)?(px|rem|%)/g],
        // Matches, for example, url("https://www.website.com/image.png")
        ['url', /url\("[\w\W]+?"\)/g],
    ]);

    const exclusions = {
        // Let `colours` be a list of colours that shouldn't be modified if they are part of the value of some properties.
        colours: new Map([
            [`background`, [`rgb(0, 32, 91)`, `rgb(250, 225, 16)`]],
            [`border`, [`rgb(255, 255, 255)`]],
            [`color`, [`rgb(255, 255, 255)`]],
        ]),
        combinations: new Map([
            ['rgb(0, 32, 91)', 'rgb(255, 255, 255)'],
            [`rgb(250, 225, 16)`, `rgb(0, 32, 91)`],
        ]),
        // Let `selectors` be a list of selectors that filter out rules that shouldn't be modified.
        selectors: [`:active`, `:focus`, `:hover`, '.card.active'],
    };

    // Let `strings` be a list of CSS rules as they would appear in a CSS file.
    const strings: string[] = [];

    // Let `values` be a list of CSS property values.
    const values: string[] = [];

    // For each rule `rule` of `relevantRules`.
    for (const rule of relevantRules) {

        // if (rule.selectorText === '.badge.date') {
        //     debugger;
        // }

        // Matches a CSS declaration. For example, it matches `width: 100%;` in `.system { width: 100%; }`.
        const regex = /\b([^\s]+?):([\w\W]+?);/g;

        // Remove the selector from `rule`.
        const cssText = rule.cssText.replace(rule.selectorText, '');

        // Let `declarations` be a list of `rule`'s CSS declarations (property-value pairs).
        const declarations = [...cssText.matchAll(regex)]
            // For each declaration `declaration` from `declarations`.
            // Remove `declaration` if its property is unrelated to colour manipulation. For example, `text-align: center`.
            .filter(([, property]) => colourProperties.has(property))
            // Remove `declaration` if its value has only tokens unrelated to colour manipulation. For example, `border: solid 100px`.
            .filter(([, , value]) => {

                for (const [, regex] of regexes) {
                    value = value.replace(regex, '').trim();
                };

                // Save declaration with its value modified so that it doesn't contain tokens unrelated to colour manipulation.
                values.push(value);

                return !!value.length;
            })
            // Remove `declaration` if its value has a colour that's not necessary to modify. For example, it's not necessary to modify dark backgrounds because dark mode requires those dark backgrounds.
            .filter(([, prop, value], index, declarations) => {

                // Detect hover: focus: active state and do not remove those.
                const selector1 = rule.selectorText;
                const boolean = exclusions.selectors.some(selector2 =>
                    selector1.includes(selector2)
                );

                if (boolean) {
                    return true;
                }

                // Detect background and color combinations. For example, detect when yellow background and then ignore color declaration.
                prop = prop.match(/[\W\w]+?(?=-)/)?.[0] || prop;

                const colours = exclusions.colours.get(prop);

                if (colours) {
                    const boolean = colours.some(colour => value.includes(colour));

                    // Please modify, this is horrible code.
                    if (boolean && prop !== 'color') {
                        const index = declarations.findLastIndex(
                            ([, prop]) => prop === 'color');
                        const value = declarations[index];

                        if (value) {
                            // Flag declaration with colour property so that it can be ignored.
                            declarations[index][2] = `Remove: ${value}`;
                        }
                    }

                    return !boolean;
                }
                else {
                    return true;
                }
            })
            // Remove declarations flagged as unnecessary.
            .filter(([, , value]) => value.startsWith('Remove:') ? false : true)
            // Format `declaration` so that it can appear in a CSS file.
            .map(([, property, value]) => `${property}: ${value};`);

        // Remove `rule` if it doesn't have any declarations that can be used to manipulate colour.
        if (declarations.length === 0) {
            continue;
        }

        const string = `
            ${rule.selectorText} {
                ${declarations.join('\n')}
            }
        `;

        strings.push(string);
    }

    regexes = new Map([
        ['rgba', /rgba?\(\d+(\.\d+)?,\s*\d+(\.\d+)?,\s*\d+(\.\d+)?(,\s*\d+(\.\d+)?)?\)/g],
    ]);

    // let colours = new Set(values.map(value => {
    //     const colours = value.match(regexes.get('rgba') as RegExp);
    //     // debugger;
    //     const rest = value.replace(regexes.get('rgba') as RegExp, '').trim();
    //     return [colours, rest];
    // }).flat(2));

    // console.log([...colours].join('`,\n`'));

    const colours = [
        `rgba(0, 0, 0, 0.063)`,
        `rgba(0, 0, 0, 0.075)`,
        `rgba(0, 0, 0, 0.125)`,
        `rgba(0, 0, 0, 0.4)`,
        `rgba(0, 0, 0, 0.5)`,
        `rgb(0, 0, 0)`,
        `rgba(35, 23, 5, 0.26)`,
        `rgb(31, 40, 51)`,
        `rgb(53, 65, 75)`,
        `rgb(84, 101, 112)`,
        `rgb(149, 167, 191)`,
        `rgb(153, 167, 176)`,
        `rgb(184, 184, 184)`,
        `rgb(204, 204, 204)`,
        `rgba(218, 217, 217, 0.5)`,
        `rgb(204, 212, 216)`,
        `rgb(230, 233, 235)`,
        `rgb(242, 244, 245)`,
        `rgb(229, 233, 239)`,
        `rgb(217, 231, 235)`,
        `#eee`,
        `#fff`,
        `rgb(255, 255, 255)`,
        `rgb(243, 221, 221)`,
        `rgb(255, 244, 244)`,
        `rgb(253, 244, 242)`,
        `rgb(239, 226, 217)`,
        `rgb(252, 244, 242)`,
        `rgb(219, 232, 231)`,
        `rgb(148, 0, 18)`,
        `rgb(172, 32, 30)`,
        `rgb(151, 60, 0)`,
        `rgb(250, 225, 16)`,
        `rgb(14, 99, 98)`,
        `rgb(2, 96, 122)`,
        `rgb(52, 152, 219)`,
        `rgb(108, 133, 168)`,
        `rgb(76, 99, 140)`,
        `rgb(108, 67, 135)`,


        // `rgb(242, 244, 245)`,      // off-white
        // `rgb(184, 184, 184)`,      // light grey
        // `rgb(84, 101, 112)`,       // mid slate
        // `rgb(38, 65, 116)`,
        // `rgb(0, 32, 91)`,
        // `rgb(0, 0, 0)`,            // black

        // // Accents (warm → cool)
        // `rgb(172, 32, 30)`,        // red
        // `rgb(151, 60, 0)`,         // orange/brown
        // `rgb(250, 225, 16)`,       // yellow
        // `rgb(14, 99, 98)`,         // teal
        // `rgb(52, 152, 219)`,       // bright blue
        // `rgb(108, 67, 135)`,       // purple
    ];

    // Let `customProperties` be a list of colours each of them assigned to a custom CSS property.
    const customProperties = [...colours].map((colour, index) =>
        `--colour-${index}: ${colour};`
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