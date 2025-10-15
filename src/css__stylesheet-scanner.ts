// TO DO: `document.stylesheets` doesn't always include a stylesheet from a different origin. For example https://forms.visionaustralia.org/f/child-enquiry has a stylesheet from https://www.visionaustralia.org/form-assembly/style.css. However, that stylesheet isn't in `document.stylesheets`. Code run from the console doesn't have access to stylesheets from other origins. Perhaps a browser extension is worth exploring as an option.

// TO DO: Use mutation observer to detect elements with problematic css declarations applied to them.
{
    // Setting a root node helps filter out unrelated or irrelevant CSS rules. This is to give the developer the ability to concentrate on a component or user interface element rather than an entire page. For example, the developer may not need to know that there are problematic declarations that apply to the header of the page when the developer is building a tabbed interface component.
    const root = document;

    const relevantProperties = new Map([
        [
            'height', function (value: CSSStyleValue) {
                let result = null;
                const message = 'Error message!';

                switch (true) {
                    case value instanceof CSSUnitValue && value.unit === 'px':
                    case value instanceof CSSUnitValue && value.unit === 'rem':
                    case value instanceof CSSUnitValue && value.unit === 'vh':
                        result = message;
                        break;
                    default:
                        break;
                }

                return result;
            }
        ],
        [
            'position', function (value: CSSStyleValue) {
                let result = null;
                const message = 'Error message!';

                switch (true) {
                    case value instanceof CSSKeywordValue && value.value === 'absolute':
                        result = message;
                        break;
                    default:
                        break;
                }

                return result;
            }
        ],
        [
            'border', function (value: CSSStyleValue) {
                let result = null;
                const message = 'Error message!';

                switch (true) {
                    case value instanceof CSSKeywordValue && value.value === 'transparent':
                        result = message;
                        break;
                    default:
                        break;
                }

                return result;
            }
        ],
    ]);

    const stylesheets = [...document.styleSheets];
    // const stylesheet = new CSSStyleSheet();
    // stylesheet.replace(document.body.textContent);
    // const stylesheets = [stylesheet];

    // For each stylesheet 'stylesheet' in 'stylesheets'.
    for (const stylesheet of stylesheets) {

        try {
            // The following error is thrown: Uncaught SecurityError: Failed to read the 'cssRules' property from 'CSSStyleSheet': Cannot access rules. This error occurs because you are trying to access the cssRules property of a stylesheet that is not from the same origin as your document. Browsers implement a security measure called the Same-Origin Policy, which restricts scripts from accessing resources from different origins. This prevents malicious scripts from reading sensitive data from other websites.
            stylesheet.cssRules;
        }
        catch (error) {
            console.log(`Cannot access stylesheet from ${stylesheet.href}`);
            continue;
        }

        const rules = [...stylesheet.cssRules] as CSSStyleRule[];

        // For each rule 'rule' in 'rules'.
        for (const rule of rules) {

            // TO DO: `document.stylesheets` doesn't always include a stylesheet from a different origin. For example https://forms.visionaustralia.org/f/child-enquiry has a stylesheet from https://www.visionaustralia.org/form-assembly/style.css. This stylesheet is referenced  with an `import at-rule`. However, that stylesheet isn't in `document.stylesheets`. Code run from the console doesn't have access to stylesheets from other origins. Perhaps a browser extension is worth exploring as an option.

            // Detect if `stylesheet` references another stylesheet with an import at-rule.
            if (rule instanceof CSSImportRule && rule.styleSheet) {
                stylesheets.push(rule.styleSheet);
                continue;
            }

            const element = root.querySelector(rule.selectorText);

            if (!element) {
                continue;
            }

            const declarations = [...(rule.styleMap?.entries() || [])];

            // For each declaration 'declaration' in 'declarations'.
            for (const declaration of declarations) {
                const property = declaration[0];
                const hasRelevantProperty = relevantProperties.has(property);

                if (hasRelevantProperty) {
                    const verifier = relevantProperties.get(property) as Function;

                    const values = [...declaration[1]];

                    // For each value 'value' in 'values'.
                    for (const value of values) {
                        /*       property === 'position' && console.log('position: value:\n', value); */
                        const errorMessage = verifier(value);

                        if (errorMessage) {
                            console.warn(
                                `Accessibility
${errorMessage}
Declaration: '${property}: ${value}'.
Selector: '${rule.selectorText}'.
Stylesheet: ${stylesheet.href}.
Example:`,
                                element);
                        }
                    }
                }
            }
        }
    }
}