// The following piece of code gets issues from accessibility evaluations. These issues are presented to the evaluator as a list. The evaluator can copy a an issue from the list and modify it so that it can be included in the accessibility evaluation they're working on.
// Why? Because sometimes the evaluator has to document an issue that's already been documented in the past. The evaluator may not know which accessibility evaluation the issue was documented.

import * as fs from "fs";
import * as http from 'http';

async function getIssues(response: http.ServerResponse) {
    const globPattern = '**/accessibility-evaluation.html';

    // For example, it matches `Hello` in `<textarea>Hello</textarea>`.
    // For example, it matches `Hola` in `<textarea id="1">Hola</textarea>`.
    const regex = /(?<=>)([^><]+?)(?=<\/textarea)/g;

    //  Let `issues` be an initially empty list of issues.
    const issues: Set<string> = new Set();
    const evaluations = await fs.promises.glob(globPattern);

    // For each path 'path' in 'paths'.
    for await (const evaluation of evaluations) {
        const html = await fs.promises.readFile(evaluation, { encoding: "utf-8" });
        //
        ([...html.match(regex) || '']).forEach(issues.add, issues);
    }

    const html = `
        <link href="code/table.css" rel="stylesheet"/>
        <script src="code/search-issues.js" type="module"/></script>
        <p>
            <label>Keywords:</label>
            </br>
            <input type="search" class="js-search-box">
        </p>
        <p>
            <button class="js-search-issues" type="search">Search for issues</button>
        </p>
        <ul class="js-list-issues">
            ${[...issues].map(issue => `<li class="js-issues">${issue}</li>`).join('')}
        </ul>
    `;

    response.writeHead(200, {
        'content-type': 'text/html; charset=UTF-8'
    });
    response.write(html);
    response.end();
}

export {
    getIssues,
}