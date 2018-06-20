/**
var server = require('http').createServer(function (request, response) {
    console.log('Connection');
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write('Hello, World.');
    response.end();
});

server.listen(8000);
*/

var io = require('socket.io').listen(8000);

io.sockets.on("connection", function (socket) {
    console.log('Server: Incoming connection.');
    socket.on("echo", function (message, callback) {

        console.log('Echo received at server: ', message);
        callback(message);
    });
});

scan();

function scan() {
    var net = require('net');
    var ipList = [];
    var ip3Min = 0;
    var ip3Max = 1;
    var ip4Min = 0;
    var ip4Max = 100;
    for (var ip3 = ip3Min; ip3 <= ip3Max; ip3++) {
        for (var ip4 = ip4Min; ip4 <= ip4Max; ip4++) {
            var ip = `192.168.${ip3}.${ip4}`;
            ipList.push(ip);
        }
    }
    console.log(`try list:${ipList}`);


    var ip = ipList.shift();
    checkConnect(80, ip, 2000, handler);


    function handler(error, status, ip, port) {
        console.log(`${status}: ${ip}:${port}`);
        if (status == 'close') {
            ipList.push(ipList.shift());
            checkConnect(80, ipList[0], 500, handler);
        }
    };

    function checkConnect(port, ip, timeout, callback) {
        var socket = new net.Socket();
        socket.setTimeout(timeout);


        socket.on('connect', function () {
            socket.end();
            callback(null, 'connect', ip, port);
        });


        socket.on('timeout', function () {
            callback(null, 'timeout', ip, port);
            socket.destroy();
        });
        socket.on('error', function (exception) {
            callback(exception, 'error', ip, port);
        });
        socket.on('close', function (exception) {
            callback(exception, 'close', ip, port);
        });

        socket.connect(port, ip);
    }

};
