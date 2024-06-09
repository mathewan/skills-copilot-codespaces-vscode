// Create web server
// 1. Create a web server
// 2. Handle requests
// 3. Return responses
// 4. Listen for incoming requests

// 1. Create a web server
const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

// 2. Handle requests
function renderHTML(filename, res) {
    fs.readFile(filename, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.write('File not found');
        } else {
            res.write(data);
        }
        res.end();
    });
}

function renderComments(res) {
    fs.readFile('comments.json', (err, data) => {
        if (err) {
            res.writeHead(404);
            res.write('File not found');
        } else {
            res.write(data);
        }
        res.end();
    });
}

function addComment(req, res) {
    let body = '';
    req.on('data', (data) => {
        body += data;
    });
    req.on('end', () => {
        let params = querystring.parse(body);
        fs.readFile('comments.json', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.write('File not found');
            } else {
                let comments = JSON.parse(data);
                comments.push(params);
                fs.writeFile('comments.json', JSON.stringify(comments), (err) => {
                    if (err) {
                        res.writeHead(404);
                        res.write('File not found');
                    } else {
                        res.writeHead(302, {
                            'Location': 'http://localhost:3000'
                        });
                    }
                });
            }
            res.end();
        });
    });
}

function handleRequest(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    let path = url.parse(req.url).pathname;
    switch (path) {
        case '/':
            renderHTML('index.html', res);
            break;
        case '/comments':
            renderComments(res);
            break;
        case '/new-comment':
            addComment(req, res);
            break;
        default:
            res.writeHead(404);
            res.write('Route not defined');
            res.end();
    }
}

// 3. Return responses
const server = http.createServer(handleRequest);

//