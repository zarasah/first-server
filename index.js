const http = require('http');
const path = require('path');
const fs = require('fs');
const port = 3000
const mimeType = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
}
//const filePath = path.join(path.resolve(), 'index.html'); // for first version


function fileMiddleware(req, res, next) {
    //console.log(req.url);
    let url = req.url;

    if (url === '/') {
        url = '/index.html';
    }
    
    const filePath = path.join(path.resolve(), url);
    const ext = path.extname(filePath);

    fs.promises.access(filePath)
        .then(() => {
            res.writeHead(200, {'Content-Type': mimeType[ext]});
            fs.createReadStream(filePath).pipe(res);
        })
        .catch(() => {
            next();
        });
}

const server = http.createServer((req, res) => {
    fileMiddleware(req, res, () => {
        if(req.url === '/name') {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('My name is First Server');
        } else if(req.url === '/hello') {
            res.writeHead(200, {'Content-Type': 'text/plain'})
            res.end('Hello!');
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain'})
            res.end('Data not found');
        }
    });

    // //first version
    // //console.log(req);
    // if(req.url === '/name') {
    //     res.writeHead(200, {'Content-Type': 'text/plain'});
    //     res.end('My name is First Server');
    // } else if(req.url === '/hello') {
    //     res.writeHead(200, {'Content-Type': 'text/plain'})
    //     res.end('Hello!');
    // } else if(req.url === '/style.css') {
    //     res.writeHead(200, {'Content-Type': 'text/css'});
    //     fs.createReadStream(path.resolve('style.css')).pipe(res);
    // } else if(req.url === '/') {
    //     res.writeHead(200, {'Content-Type': 'text/html'});
    //     fs.createReadStream(filePath).pipe(res);
    // } else if(req.url === '/main.js') {
    //     res.writeHead(200, {'Content-Type': 'text/javascript'});
    //     fs.createReadStream(path.resolve('main.js')).pipe(res);
    // } else {
    //     res.writeHead(404, {'Content-Type': 'text/plain'})
    //     res.end('Data not found');
    // }
});

server.listen(port);