const http = require("http");
const fs = require("fs");
const path = require("path"); 

const server = http.createServer((req, res) => {
    // Check if request is for static files
    if (req.url.startsWith("/static/")) {
        const staticFilePath = path.join(__dirname, req.url);

        fs.readFile(staticFilePath, (err, data) => {
            if (err) { // If there's a error reading the file, send a 404 Not Found response
                res.writeHead(404);
                res.end("File not found")
            }
            
            else { // Otherwse, send the content of the static file
                res.writeHead(200);
                res.end(data);
            }
        });
    }

    else { // Serve different HTML files based on the URL
        let filePath;

        if (req.url == "/") {
            filePath = path.join(__dirname, 'templates', 'index.html');
        }
        else {
            // For any other URL, send a 404 Not Found response
            res.writeHead(404);
            res.end("Page not found");
            return;
        }
        
        // Read the content of the requested HTML file
        fs.readFile(filePath, (err, data) => {
            if (err) { // If there's an error reading the file, send a 500 Internal Server Error response
                res.writeHead(500);
                res.end("Error loading page")
            }

            else {
                // Otherwise, send the content of the HTML file as the response
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data);
            }
        })
    }
})

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Listen on all network interfaces
server.listen(PORT, HOST, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Also available on http://192.168.0.44:${PORT}`)
  });