const WebSocket = require("ws");
const wss = new WebSocket.Server({port:8080, maxPayload:5000000});
const fs = require("fs");

var clientInstances = {};

function run(){
	wss.on("connection", function connection(ws){
		ws.on("message", function incoming(message) {
			try{
				message = JSON.parse(message);
				if (!checkIdValidity(message.id)){
					return;
				}
				console.log("Received:")
				print(message);
				if (clientInstances[message.id] == undefined){
					clientInstances[message.id] = [ws];
				} else if (!clientInstances[message.id].includes(ws)){
					clientInstances[message.id].push(ws);
				}
				console.log(clientInstances[message.id].length);
				if (message.type == "get"){
					getHandler(ws, message);
				}else if (message.type == "push"){
					pushHandler(ws, message);
				}
			}catch(err){
				console.log(err);
			}
		});
	});
}

function getHandler(ws, message){
	if (!fs.existsSync("data/" + message.id)){
		var payload = {
			type:"get",
			id:message.id,
			data:undefined
		};
		console.log("Sent:");
		print(payload);
		console.log(clientInstances[message.id].length);
		ws.send(JSON.stringify(payload));
	} else{
		var file = fs.readFileSync("data/" + message.id).toString();
		var payload = {
			type:"push",
			id:message.id,
			iv:file.split("\n")[0],
			data:file.split("\n")[1]
		};
		console.log("Sent:");
		print(payload);
		console.log(clientInstances[message.id].length);
		ws.send(JSON.stringify(payload));
	}
}

function pushHandler(ws, message){
	if (message.data != undefined){
		if (!fs.existsSync("data")){
    		fs.mkdirSync("data");
		}
		fs.writeFileSync("data/" + message.id, message.iv + "\n" + message.data);
		for (webSock of clientInstances[message.id]){
			if (webSock != ws){
				var payload = {
					type:"push",
					id:message.id,
					iv:message.iv,
					data:message.data
				};
				console.log("Sent:");
				print(payload);
				console.log(clientInstances[message.id].length);
				webSock.send(JSON.stringify(payload));
			}
		}
	} else{
		if (fs.existsSync("data/" + message.id)){
			fs.unlinkSync("data/" + message.id);
		}
		for (webSock of clientInstances[message.id]){
			if (webSock != ws){
				var payload = {
					type:"disconnect",
					id:message.id,
				};
				console.log("Sent:");
				print(payload);
				console.log(clientInstances[message.id].length);
				webSock.send(JSON.stringify(payload));
				webSock.close();
			}
		}
		delete clientInstances[message.id];
	}
}

function checkIdValidity(id){
	var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
	if (id == undefined){
		return false;
	}
	if (id.length != 16){
		return false;
	}
	for (c of id){
		if (!chars.includes(c)){
			return false;
		}
	}
	return true;
}

function print(obj){
	console.log(JSON.stringify(obj).slice(0,100));
}

function cleanse(){
	for (id in clientInstances){
		var workingConnections = [];
		for (var i=0; i<clientInstances[id].length;i++){
			if (clientInstances[id][i].readyState == WebSocket.OPEN){
				workingConnections.push(clientInstances[id][i]);
			}
		}
		clientInstances[id] = workingConnections;

		if (clientInstances[id].length == 0){
			delete clientInstances[id];
		}
	}
}

var iv = setInterval(cleanse,30000);
run();
