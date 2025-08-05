// The following piece of code creates a local server that can update the contents of any files. To update the contents of a file please open it on an Internet browser, modify the HTML and press the keys "ctrl" + "s". Please note that the file must have an event listener for "key" events. The event listener will communicate to the local server.

import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import * as foo from 'url';

import { getAccessibilityEvaluations } from './get-list-of-accessibility-evaluations.js';
import { getIssues } from './get-issues.js';

const port = 8001;

const mimeTypes = {
    default: 'application/octet-stream',
    html: 'text/html; charset=UTF-8',
    js: 'application/javascript',
    css: 'text/css',
    png: 'image/png',
    jpg: 'image/jpg',
    gif: 'image/gif',
    ico: 'image/x-icon',
    svg: 'image/svg+xml',
};

// Let `toBoolean` be a couple of functions, the first one returning always `true` and the second one always return `false`.
const toBoolean = [() => true, () => false];

// Let `rootPath` be the path of the current folder.
const rootPath = process.cwd();

/**
 *
 * @param url
 * @returns
 */
async function getFile(url: string) {
    // Let `filePath` be
    const filePath = path.join(rootPath, url);
    const found = await fs.promises.access(filePath).then(...toBoolean);

    let streamPath, ext, stream;

    if (found) {
        streamPath = filePath;
        ext = path.extname(streamPath).substring(1).toLowerCase();
        stream = fs.createReadStream(streamPath);
    }

    return { found, ext, stream };
};

http.createServer(async (request, response) => {
    const url = request.url;

    if (url?.endsWith('/get-issues')) {
        await getIssues(response);
    }

    else if (url?.endsWith('/index')) {
        await getAccessibilityEvaluations(response);
    }

    else if (url?.endsWith('/foo') && request.method === 'POST') {
        let pathName = foo.parse(request.headers.referer as string).pathname;
        let data = '';
        request.on('data', chunk => {
            data += chunk.toString();
        });

        request.on('end', async () => {
            response.end('Data received');

            await fs.promises.writeFile(rootPath + pathName, data, 'utf8').catch(error => console.log(error));
        });
    }

    // Otherwise get a file from within the root folder.
    else {
        console.log(url);

        const file = await getFile(url as string);
        const statusCode = file.found ? 200 : 404;
        const mimeType = mimeTypes[file.ext] || mimeTypes.default;

        response.writeHead(statusCode, {
            'access-control-allow-origin': '*',
            'content-type': mimeType,
        });

        if (statusCode === 404) {
            response.write('Not found!');
            response.end();
        }
        else {
            if (file.stream) {
                file.stream.pipe(response);
            }
        }
    }
}).listen(port);

console.log(`Server running at http://127.0.0.1:${port}/`);