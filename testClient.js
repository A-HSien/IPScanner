var client = require("socket.io-client")('http://localhost:8000');

client.on("connect", function () {
    console.log("test client connected");


    client.emit("echo", "Hello World", function (message) {
        console.log('Echo received at callback function: ', message);
        client.disconnect();
    });

});