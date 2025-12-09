// TO DO: Walk up the parent chain of event.target to find an element that's relevant. For example, event.target is the `u` element which is a child of an `a` element. The relevant element is `a` and not `u`.
// TO DO: Truncate long pieces of text.

const selectors = {
    textBoxes: 'input:is(:not([type]), [type=email], [type=number], [type=password], [type=search], [type=text]), [contenteditable=true], [contenteditable]',
};

const settings = {
    // This is the maximum number of characters of an accessible name. If the accessible name is longer than this number then it's truncated.
    characterLimit: 80,
}

function getAccessibleName(element: HTMLElement & HTMLInputElement) {
    let name = 'undefined';

    const ariaLabelledBy = element.getAttribute('aria-labelledby');
    const ariaLabel = element.getAttribute('aria-label');
    const label = element?.labels?.[0]?.textContent;
    const placeholder = element?.placeholder;
    const textContent = element?.textContent;

    if (ariaLabelledBy) {
        const ids = ariaLabelledBy.split('\s+');

        // For each id 'id' in 'ids'.
        for (const id of ids) {
            name += (document.querySelector(`#${id}`)?.textContent || '');
        }
    }

    else if (ariaLabel) {
        name = ariaLabel;
    }

    else if (label) {
        name = label;
    }

    else if (placeholder) {
        name = placeholder;
    }

    else if (textContent && element instanceof HTMLSelectElement === false) {
        name = textContent;
    }

    else if (name === 'undefined') {
        name = prompt(`What's the accessible name of this user interface element?`) || '';
    }

    // Remove any consecutive white space characters from `name`.
    name = name.replaceAll(/\s{2,}/g, ' ').trim();
    // Remove any line break characters from `name`.
    name = name.replaceAll(/\/n/g, '');

    if (name.length > settings.characterLimit) {
        // Truncate `name` up to the maximum number of characters allowed.
        name = `that starts with "${name.slice(0, settings.characterLimit)}"`;
    }
    else {
        // Otherwise surround `name` with double quotation marks.
        name = `"${name}"`;
    }

    return name;
}

// This
const steps = [
    `Wait until the web page "${document.title}" loads.`
];

// Click event
{
    const pairs: Map<string, string[]> = new Map([

        ['a, [role=link]', ['link with text', 'press it']],
        ['button, input[type=button], [role=button]', ['button with text', 'press it']],
        ['h1, h2, h3, h4, h5, h6', ['heading with text', '']],
        ['div, label, p', ['text']],
    ]);

    window._onMouseDown = function onMouseDown(e) {
        const target = e.target;

        if (target instanceof HTMLElement === false) {
            return;
        }

        // For each pair 'pair' in 'pairs'.
        for (const [selector, [component, action]] of pairs) {
            if (target.matches(selector)) {
                const name = getAccessibleName(target);
                const step = `STEP: Find the ${component} ${name}${action ? ` and ${action}` : ``}.`;
                steps.push(step);
                console.log(step);
                break;
            }
        }
    }

    document.addEventListener('mousedown', window._onMouseDown, true);
}

function printSteps() {

    // For each step `step` in `steps`.
    steps.map((step, index) => {
        // Let `step` be the current step.
        // Let `index` be the numeric position of `step`.
        return step.replace('STEP: ', '');
    });

    // TO DO: Eliminate any duplicates that are adjacent to each other.
    console.log(`\`${steps.join('`,\n`')}\`,`);
}


function getValue(formField: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string {
    let value = '';

    if (formField instanceof HTMLInputElement && formField.matches(selectors.textBoxes)) {
        value = formField.value;
    }
    else if (formField instanceof HTMLSelectElement) {
        value = formField.selectedOptions[0].textContent || '';
    }
    else if (formField instanceof HTMLTextAreaElement) {
        value = formField.value;
    }

    return value;
}

{
    const pairs: Map<string, string[]> = new Map([
        ['a, [role=link]', ['link with text', 'press it']],
        [selectors.textBoxes, ['textbox with label', 'type']],
        ['input[type=checkbox]', ['checkbox with label', 'check it']],
        ['input[type=radio]', ['radio button with label', 'select it']],
        ['select', ['dropdown with label', 'select']],
        ['textarea', ['textbox with label', 'type']],
    ]);

    // Get the text content of a textbox after it becomes blurred.
    document.addEventListener('blur', event => {
        const target = event.target as HTMLElement;

        // For each pair 'pair' in 'pairs'.
        for (const [selector, [component, action]] of pairs) {
            // debugger;
            if (target.matches(selector)) {
                const name = getAccessibleName(target);
                const value = getValue(target);
                const step = `STEP: Find the ${component} ${name} and ${action}${value ? ` "${value}"` : ``}.`;
                steps.push(step);
                console.log(step);
                break;
            }
        }
    }, true);
}

// console.log(`${steps.map(a =>
//     `<li>${a}</li>`
// ).join('')}`);

const scenario1 = [
    // Log in
    `Wait until the web page "Physitrack® - Login" loads.`,
    `STEP: Find the textbox with label "Email:" and type "john.doe@visionaustralia.org".`,
    `STEP: Find the textbox with label "Password: Reset password" and type 'john'.`,
    `STEP: Find the button with text "Login" and press it.`,
    `STEP: Find the error message with text "Login failed. Invalid email or password.".`,
    `STEP: Find the textbox with label "Email:" and type "luis.cacerescastillo@visionaustralia.org".`,
    `STEP: Find the textbox with label "Password: Reset password" and type ''.`,
    `STEP: Find the button with text "Login" and press it.`,

    // Reset password
    `Wait until the web page "Physitrack® - Login" loads.`,
    `STEP: Find the link with text "Reset password" and press it.`,
    `STEP: Find the textbox with label "Email:" and type "luis.cacerescastillo@visionaustralia.org".`,
    `STEP: Find the button with text "Get password reset link" and press it.`,
    `STEP: Find the notification that starts with "If your email address exists in our database, you will receive a password recove".,`,
    `STEP: Read the email title "Reset password instructions"`,
    `STEP: Find the link with text "Change my password" and press it.`,
    `Wait until the web page "Physitrack® - Choose a new password" loads.`,
    `STEP: Find the textbox with label "Re-type your password:" and type "HelloWorld1!".`,
    `STEP: Find the textbox with label that starts with "12 characters, at least 1 number, one upper case letter and one lower case lette" and type "HelloWorld1!".`,
    `STEP: Find the button with text "Save password" and press it.`,

    
];