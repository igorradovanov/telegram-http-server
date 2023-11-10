const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

class httpParser {

    constructor(dataBuffer) {
        this.data = dataBuffer.toString();
        this.startLine = this.data.split('\r\n')[0];
        [this.httpMethod, this.httpPath, this.httpProtocol] = this.parseStartLine();
    }

    parseStartLine() {
        // Ensure startLine is defined and not empty
        if (this.startLine) {
            return this.startLine.split(' ');
        }
        return [];
    }

    parsePath(httpPath) {
        if (httpPath === '/') {
            return `HTTP/1.1 200 OK \r\n\r\n`
        } else {
            return `HTTP/1.1 404 NOT FOUND \r\n\r\n`
        }
    }
}


// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        const parser = new httpParser(data);
        const [httpMethod, httpPath, httpProtocol,] = parser.parseStartLine();
        const headers = parser.parsePath(httpPath, httpProtocol);
        socket.write(headers);
        socket.end();
    });
    socket.on("close", () => {
        socket.end();
        server.close();
    });
});

server.listen(4221, "localhost");
