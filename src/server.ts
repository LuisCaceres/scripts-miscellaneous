import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import * as url from 'url';

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
    const paths = [rootPath, url];

    if (url.endsWith('/')) {
        paths.push('index.html');
    }
    // Let `filePath` be 
    const filePath = path.join(...paths);
    const pathTraversal = !filePath.startsWith(rootPath);
    const exists = await fs.promises.access(filePath).then(...toBoolean);
    const found = !pathTraversal && exists;
    const streamPath = found ? filePath : rootPath + '/index.html';
    const ext = path.extname(streamPath).substring(1).toLowerCase();
    const stream = fs.createReadStream(streamPath);
    return { found, ext, stream };
};

http.createServer(async (request, response) => {
    console.log(request.url);
    const file = await getFile(request.url as string);
    const statusCode = file.found ? 200 : 404;
    const mimeType = mimeTypes[file.ext] || mimeTypes.default;
    response.writeHead(statusCode, {'Content-Type': mimeType});
    file.stream.pipe(response);

    if (request.method === 'POST') {
        const filePath = url.parse(request.headers.referer as string);

        let data = '';
        request.on('data', chunk => {
            data += chunk.toString();
        });

        request.on('end', async() => {
            response.end('Data received');

            await fs.promises.writeFile(rootPath + filePath.pathname, data, 'utf8').catch(error => console.log(error));
        });
    }
}).listen(port);

console.log(`Server running at http://127.0.0.1:${port}/`);