const http = require('http');
const url = require('url');

const AUTH_USERNAME = "lamp";
const AUTH_PASSWORD = "orange";

const server = http.createServer( (req, res) => {
    if (req.method === 'POST') {
        req.on('data', chunk => {
            body += chunk.toString();  
        });
        req.on('end', () => {
            const parsedBody = new URLSearchParams(body);
            const username = parsedBody.get('username');
            const password = parsedBody.get('password');

            if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end('Login successful!');
            } else {
                res.writeHead(401, {'Content-Type': 'text/plain'});
                res.end('Invalid credentials');
            };
        });
    }
});

server.listen(8199);