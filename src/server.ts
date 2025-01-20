const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const url = require('node:url');

const port = 8001;

const MIME_TYPES = {
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

const STATIC_PATH = path.join(process.cwd(), '');
const toBool = [() => true, () => false];

const prepareFile = async (url) => {
    const paths = [STATIC_PATH, url];

    if (url.endsWith('/')) {
        paths.push('index.html');
    }

    const filePath = path.join(...paths);
    const pathTraversal = !filePath.startsWith(STATIC_PATH);
    const exists = await fs.promises.access(filePath).then(...toBool);
    const found = !pathTraversal && exists;
    const streamPath = found ? filePath : STATIC_PATH + '/index.html';
    const ext = path.extname(streamPath).substring(1).toLowerCase();
    const stream = fs.createReadStream(streamPath);
    return { found, ext, stream };
};

http.createServer(async (req, res) => {
    const file = await prepareFile(req.url);
    const statusCode = file.found ? 200 : 404;
    const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
    res.writeHead(statusCode, {'Content-Type': mimeType});
    file.stream.pipe(res);

    if (req.method === 'POST') {
        const filePath = url.parse(req.headers.referer);
        let data = '';
        req.on('data', chunk => {
            data += chunk.toString();
        });

        req.on('end', () => {
            res.end('Data received');

            fs.writeFile(STATIC_PATH + filePath.pathname, data, 'utf8', function(err) {
                if (err) return console.log(err);
            })
        });
    }
}).listen(port);

console.log(`Server running at http://127.0.0.1:${port}/`);
