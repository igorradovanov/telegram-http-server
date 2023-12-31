const net = require("net");

class httpParser {

    constructor(dataBuffer) {
        this.data = dataBuffer.toString();
        this.startLine = this.data.split('\r\n')[0];
        this.userAgent = this.stringParser(this.data.split('\r\n')[2], 'User-Agent:');
        [this.httpMethod, this.httpPath, this.httpProtocol] = this.parseStartLine();
    }

    parseStartLine() {
        // Ensure startLine is defined and not empty
        if (this.startLine) {
            console.log(this.startLine.split(' '))
            return this.startLine.split(' ');
        }
        return [];
    }

    parsePath(httpPath, httpProtocol) {
        if (httpPath === '/') {
            return `${httpProtocol} 200 OK \r\n\r\n`;
        } else if (httpPath.includes('/echo/')) {
            const data = this.parseContent(httpPath);
            const responseBody = this.stringParser(data[0], '/echo/');
            const responseHeaders = `${httpProtocol} 200 OK\r\n` +
                'Content-Type: text/plain\r\n' +
                `Content-Length: ${responseBody.length}\r\n` +
                '\r\n';
            return responseHeaders + responseBody;
        } else if (httpPath.includes('/user-agent')) {
            const responseBody = this.userAgent;
            const responseHeaders = `${httpProtocol} 200 OK\r\n` +
            'Content-Type: text/plain\r\n' +
            `Content-Length: ${responseBody.length}\r\n` +
            '\r\n';
            return responseHeaders + responseBody;
        } else {
            return `${httpProtocol} 404 NOT FOUND \r\n\r\n`;
        }
    }

    parseContent(httpPath) {
        const data = httpPath.split(' ');
        return data;
    }

    stringParser(text, word) {
        const index = text.indexOf(word);
        const length = word.length;

        return text.slice(index + length).trim();
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
