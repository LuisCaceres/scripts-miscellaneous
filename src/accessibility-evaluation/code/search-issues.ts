// The following piece of code filters issues according to the text typed in a text box.
// Why? Because there's a great number of issues. Finding an issue manually without any type of filtering is time-consuming and error prone.

const regexes = {
    // Matches a comma or a period or any number of white space characters.
    keywords: /,|\.|`|\s+/,
};

// Let `searchBox` be the text box the user can type keywords to search issues
const searchBox = document.querySelector('.js-search-box') as HTMLInputElement;
// Let `searchButton` be the button the user can press to start the search.
const searchButton = document.querySelector('.js-search-issues') as HTMLButtonElement;

// Let `issues` be a list of issues existing in all accessibility evaluations.
const issues: Map<HTMLLIElement, number> = new Map();
// For each issue `issue` in `issues`.
for (const issue of [...document.querySelectorAll('.js-issues')] as HTMLLIElement[]) {
    // Associate `issue` with a counter initially set to zero. This counter indicates the number of times `issue` contains a keyword from `searchBox`.
    issues.set(issue, 0);
}

// Evertime `searchButton` is pressed.
searchButton.addEventListener('click', event => {
    // Reset all counters to zero because a new search is about to start.
    for (const [issue] of issues) {
        issues.set(issue, 0);
    }

    // Let `keywords` be the list of keywords typed in `searchBox`.
    const keywords = searchBox.value.toUpperCase().split(regexes.keywords);

    // For each issue `issue` in issues`.
    for (const [issue] of issues) {
        const words = issue.textContent.toUpperCase().split(regexes.keywords);
        let counter = 0;

        for (const keyword of keywords) {
            // If the text of `issue` contains a keyword typed in `searchBox`.
            if (words.includes(keyword)) {
                // Increment the counter by one.
                issues.set(issue, ++counter);
                // Ignore any subsequent occurrences of `keyword` in the text of `issue`.
                continue;
            }
        }
    };

    // Let `relevantIssues` be the issues from `issues` whose text contains at least one keyword from `keywords`.
    const relevantIssues = [...issues].filter(([issue, n]) => {
        if (n > 0) {
            return true;
        }
        // Hide `issue` from the web page if there are no keywords.
        issue.remove();
    });

    // Sort `relevantIssues` by the number of times the text of an issue contains a keyword.
    relevantIssues.sort((relevantIssueA, relevantIssueB) => relevantIssueA[1] - relevantIssueB[1]);
    relevantIssues.reverse();

    const list = document.querySelector('.js-list-issues');

    // Present `relevantIssues` on the web page according to the sorting order.
    for (const relevantIssue of relevantIssues) {
        list?.append(relevantIssue[0]);
    }

    // Highlight visually keywords within the text of issues from `relevantIssues`.
    {
        const ranges: Range[] = [];

        for (const relevantIssue of relevantIssues) {
            const textNode = relevantIssue[0].firstChild as Text;
            // For each keyword 'keyword' in 'keywords'.
            for (const keyword of keywords) {
                const regex = new RegExp(keyword, 'gid');
                const matches = textNode.textContent.matchAll(regex);

                // For each match 'match' in 'matches'.
                for (const match of matches) {
                    const index = match.index;
                    const range = new Range();
                    range.setStart(textNode, index);
                    range.setEnd(textNode, index + keyword.length);
                    ranges.push(range);
                }
            }
        }

        const highlighter = new Highlight(...ranges);
        CSS.highlights.set('keywords', highlighter);
    }
});

export { }