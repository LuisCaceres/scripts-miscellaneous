// The following piece of code gets the a list of all accessibility evaluations that currently exist in the root folder. It responds to the client with a HTML representation of this list. The list consists of links each of which linking to an accessibility evaluation.
// Why? Because the evaluator has to manually type the URL of the accessibility evaluation to access it on an Internet browser. This is cumbersome, fiddly and error prone.

import * as fs from "fs";
import * as http from 'http';

const url = 'http://127.0.0.1:8001/';

async function getAccessibilityEvaluations(response: http.ServerResponse) {
    const globPattern = '**/accessibility-evaluation.html';

    //  Let `evaluations` be an initially empty list of accessibility evaluations.
    const evaluations: string[] = [];

    // For each evaluation `evaluation` found anywhere within the root folder.
    for await (const evaluation of fs.promises.glob(globPattern)) {
        // Add `evaluation` to `evaluations`.
        evaluations.push(evaluation);
    }

    // Let template be `evaluations` converted to HTML code.
    const template = `
        <h1>List of accessibility evaluations</h1>
        <ul>
            ${evaluations.map(evaluation => `
            <li>
                <a href="${url}${evaluation}">${evaluation}</a>
            </li>
            `).join('')}
        </ul>
    `;

    response.writeHead(200, {
        'content-type': 'text/html; charset=UTF-8'
    });
    // Send `template` as the response back to the client.
    response.write(template);
    response.end();
}

export {
    getAccessibilityEvaluations,
}