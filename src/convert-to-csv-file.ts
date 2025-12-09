/*

The following piece of code builds a comma-separated-value data structure that you can use to create work items on Jira. Please use this code to extract information from an accessibility evaluation summary. You'll have to run this code with a developer console built into an Internet browser.

For more information please read "Create work items using the CSV importer" at https://support.atlassian.com/jira-software-cloud/docs/create-issues-using-the-csv-importer/.

*/

const dataSets = [
    {
        summary: `Screen reader user unlikely to know there's an alert on the web page.`,
        details: `The "alert" component starts with a heading, however, the text of the heading is "Note:. This text isn't meaninful enough to let the user know there's an alert that should be read.`,
        impactedSites: 'https://shop.visionaustralia.org/',
        impactedDevices: 'all',
        actual: `When the user jumps from heading to heading, the screen reader says "Note:"`,
        expected: `When the user jumps from heading to heading, the screen reader should say "Important information:"`,
    },
    {
        summary: `Screen reader says "5 Thai" when the user specifies product quantity `,
        details: `The user can specify the number of products to buy. Instead of using the word "quantity", the code uses the abbreviation "qty". The screen reader pronounces that as "thai".`,
        impactedSites: 'https://shop.visionaustralia.org/',
        impactedDevices: 'all',
        actual: `Screen reader says "5 Thai" when the user specifies product quantity.`,
        expected: `Screen reader says "5 quantity" when the user specifies product quantity".`
    },
];

debugger;

{
    const fields = {
        // assignee: 'luis.cacerescastillo@visionaustralia.org',
        description: null,
        parent: 'MF26-70',
        priority: 'low',
        reporter: 'luis.cacerescastillo@visionaustralia.org',
        // sprint: 2854,
        summary: null,
        workType: 'bug',
    };

    const separator = 'ñ';
    const headers = Object.keys(fields).join(` ${separator} `);

    // const selector = `p:nth-of-type(2) label:has(.term)'`;
    // const issues = [...document.querySelectorAll(selector)];
    const issues = dataSets;

    const lines: string[] = [];

    const workItems = issues.map(issue => {
        // const text = issue.textContent.replace('Description:', '')
        //     // Escape double-quote marks (") so that Jira can create a work item as expected.
        //     .replaceAll('"', '""')
        //     .trim();

        // const [, summary, details] = text.match(/([\w\W]+?)\.([\w\W]+)?/) as RegExpMatchArray;

        const data = {
            summary: issue.summary.replaceAll('"', '""'),
            description: `"*Details:*
        ${issue.details.replaceAll('"', '""')}

        *Impacted sites*:
         ${issue.impactedSites.replaceAll('"', '""')}

        *Impacted devices*:
         ${issue.impactedDevices.replaceAll('"', '""')}

        *Current behaviour*:
        ${issue.actual.replaceAll('"', '""')}

        *Expected behaviour*:
        ${issue.expected.replaceAll('"', '""')}
        "`
        };

        const line = Object.keys(fields).map(field => {
            return fields[field] || data[field];
        })
            .join(` ${separator} `);

        lines.push(line);
    });

    console.log(`
        ${headers}
        ${lines.join('\n')}
    `);
}


// TO DO: Ensure that there's at least 1 period character (.) that divides the summary from the details of an issue. For example, the following string should have a period character immediately after "Donate $500". The string is: `User likely to be confused at the end of step 1 of 3 as button text is "Donate $500" Perhaps the text of this button should be "Go to next step: Your details" as donating an amount should be the final step.`. Not having this type of divider can cause Jira to create an additional work item.