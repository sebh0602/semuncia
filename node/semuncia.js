const WebSocket = require("ws");
const wss = new WebSocket.Server({ port:8080, maxPayload:5000000});

wss.on("connection", function connection(ws){
	ws.on("message", function incoming(message) {
    	console.log(message);
		ws.send("received: " + message);
	});
});
