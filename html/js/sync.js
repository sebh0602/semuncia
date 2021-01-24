function syncInvertToggle(){
	if (!localData.sync.syncActivated){
		if (document.getElementById("syncPasswordInput").value.length == 0){
			alert("Please enter a password first!")
			return;
		}
		if (document.getElementById("syncEditIdButton").innerHTML == "Edit ID"){
			if (!checkIdValidity(localData.sync.id)){
				return;
			}
		} else{
			if (!checkIdValidity(document.getElementById("syncIdInput").value)){
				editId();
				return;
			} else{
				editId();
			}
		}
		localData.sync.initialSetup = true;
		storeKey().then(function(){
			establishConnection()
		});
	}

	localData.sync.syncActivated = !localData.sync.syncActivated;

	if (!localData.sync.syncActivated){
		wSocket.close();
		removeKey();
	}

	localStorage.sync = JSON.stringify(localData.sync); //not the full save, so it doesn't get in the way of connection establishment
}

function syncToggleHandler(){
	if (localData.sync.syncActivated){
		document.getElementById("syncToggleToggle").className = "toggleToggle firstOption";
		document.getElementById("syncToggleValueDisplay").innerHTML = "✔";
		document.getElementById("syncNewIdButton").disabled = true;
		document.getElementById("syncEditIdButton").disabled = true;
		document.getElementById("syncPasswordInput").style.display = "none";
	} else {
		document.getElementById("syncToggleToggle").className = "toggleToggle secondOption";
		document.getElementById("syncToggleValueDisplay").innerHTML = "✖";
		document.getElementById("syncNewIdButton").disabled = false;
		document.getElementById("syncEditIdButton").disabled = false;
		document.getElementById("syncPasswordInput").style.display = "block";
	}
}

function editId(){
	if (document.getElementById("syncEditIdButton").innerHTML == "Edit ID"){
		document.getElementById("syncIdInput").style.display = "block";
		document.getElementById("syncIdDisplay").style.display = "none";
		document.getElementById("syncEditIdButton").innerHTML = "Done";
		document.getElementById("syncIdInput").focus();
	} else{
		var newId = document.getElementById("syncIdInput").value;
		if (checkIdValidity(newId)){
			document.getElementById("syncIdInput").style.display = "none";
			document.getElementById("syncIdDisplay").style.display = "block";
			document.getElementById("syncEditIdButton").innerHTML = "Edit ID";
			localData.sync.id = newId;
			saveLocalData();
			document.getElementById("syncIdDisplay").innerHTML = newId;
		} else{
			alert("Invalid ID! Your ID needs to contain exactly 16 characters and be made up of only lowercase letters and numbers.");
		}
	}
}

function generateNewId(){
	var newId = generateId();
	localData.sync.id = newId;
	document.getElementById("syncIdDisplay").innerHTML = newId;
	document.getElementById("syncIdInput").value = newId;
	saveLocalData();
}

function checkIdValidity(id){
	var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
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

function establishConnection(){
	var hostname = (window.location.protocol == "https:") ? ("wss://" + window.location.hostname + "/ws/") : ("ws://" + window.location.hostname) + ":8080";
	localData.temp.firstConnection = true;
	wSocket = new WebSocket(hostname);
	wSocket.onopen = onSocketOpen;
}

function onSocketOpen(event){
	wSocket.onmessage = messageParser;
	if (localData.temp.firstConnection){
		var payload = {
			type: "get",
			id:localData.sync.id
		};
		sendMessage(payload);
	}
}

function messageParser(event){
	var message = JSON.parse(event.data);
	if (message.type == "push"){
		decrypt(message.data, new Uint8Array(atob(message.iv).split(","))).then(function(result){
			var dec = new TextDecoder();
			var result = JSON.parse(dec.decode(result));
			if ("transactions" in result){
				localData.transactions = result.transactions;
			}
			if ("initialAmount" in result){
				localData.initialAmount = result.initialAmount;
			}
			if ("recurringTransactions" in result){
				localData.recurringTransactions = result.recurringTransactions;
			}
			if ("config" in result){
				localData.config = result.config;
			}
			loadStats();
			localData.temp.firstConnection = true; //so saveLocalData doesn't immediately push the data again
			saveLocalData();
			localData.temp.transactionScroll = 0;
			switchDisplay(localData.config.currentDisplay);
			localData.temp.firstConnection = false;
			localData.sync.initialSetup = false;
		},function(error){
			localData.sync.syncActivated = false;
			wSocket.close();
			removeKey();
			syncToggleHandler();
			alert("Incorrect password!");
		});
	} else if (message.type == "get"){
		if (localData.sync.initialSetup){
			localData.temp.firstConnection = false;
			saveLocalData();
		} else{
			localData.sync.syncActivated = false;
			localData.sync.initialSetup = false;
			removeKey();
			wSocket.close();
			saveLocalData();
		}
		saveLocalData();
	} else if (message.type == "disconnect"){
		localData.sync.syncActivated = false;
		wSocket.close();
		removeKey();
		syncToggleHandler();
	}
}

function checkSocket(){
	if (localData.sync.syncActivated){
		if (wSocket.readyState == WebSocket.CLOSED || wSocket.readyState == WebSocket.CLOSING){
			console.log("Reconnecting...")
			establishConnection();
		}
	}
}

async function sendMessage(payload){
	if (payload.data == undefined){
		try{
			wSocket.send(JSON.stringify(payload));
		}catch(err){
			console.log(err);
			console.log("Attempting recovery...");
			setTimeout(function(){
				sendMessage(payload);
			},500);
		}
	} else {
		var iv = window.crypto.getRandomValues(new Uint8Array(12));
		var encryptedData = await encrypt(payload.data, iv);
		payload.iv = btoa(iv);
		var base64Data = btoa(new Uint8Array(encryptedData));
		payload.data = base64Data;
		try{
			wSocket.send(JSON.stringify(payload));
			localData.temp.saving = false;
		}catch(err){
			console.log(err);
			console.log("Attempting recovery...");
			setTimeout(function(){
				sendMessage(payload);
			},500);
		}
	}
}

async function encrypt(data, iv){
	var enc = new TextEncoder();
	data = enc.encode(data);
	return window.crypto.subtle.encrypt(
		{
			name: "AES-GCM",
    		iv: iv,
			additionalData:enc.encode(JSON.stringify({iv:iv,id:localData.sync.id}))
      	},
		await readKey(),
		data
	);
}

async function decrypt(data, iv){
	var binData = new Uint8Array(atob(data).split(","));
	var enc = new TextEncoder();
	var p = window.crypto.subtle.decrypt(
		{
			name: "AES-GCM",
    		iv: iv,
			additionalData:enc.encode(JSON.stringify({iv:iv,id:localData.sync.id}))
      	},
		await readKey(),
		binData
	);
	return p;
}

async function storeKey(){
	var password = document.getElementById("syncPasswordInput").value;
    var enc = new TextEncoder();
    var impKey = await window.crypto.subtle.importKey(
		"raw",
		enc.encode(password),
    	"PBKDF2",
    	false,
    	["deriveKey"]
    );
	var key = await window.crypto.subtle.deriveKey(
	    {
	    	"name": "PBKDF2",
	    	salt: enc.encode(localData.sync.id),
	    	"iterations": 20000,
	    	"hash": "SHA-256"
	    },
	    impKey,
	    { "name": "AES-GCM", "length": 256},
	    false,
	    [ "encrypt", "decrypt" ]
	);

	var request = indexedDB.open("keyDB", 1);
	request.onupgradeneeded = function(event){
		var db = event.target.result;
		var objectStore = db.createObjectStore("keyStore");
	}
	request.onsuccess = function(event){
		var db = event.target.result;
		var keyStore = db.transaction("keyStore", "readwrite").objectStore("keyStore");
		keyStore.put(key,"key");
		document.getElementById("syncPasswordInput").value = "";
	}
}

function readKey(){
	var p = new Promise(function(resolve,reject){
		var request = indexedDB.open("keyDB", 1);
		request.onsuccess = async function(event){
			var db = event.target.result;
			db.transaction("keyStore").objectStore("keyStore").get("key").onsuccess = function(event){
				resolve(event.target.result);
			};
		}
	});
	return p;
}

async function removeKey(){
	var request = indexedDB.open("keyDB", 1);
	request.onsuccess = function(event){
		var db = event.target.result;
		var keyStore = db.transaction("keyStore", "readwrite").objectStore("keyStore");
		keyStore.delete("key");
	}
}

function generateId(){
	var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
	var newId = "";
	for (var i=0; i<16; i++){
		newId = newId + chars[Math.floor(Math.random()*36)];
	}
	return newId;
}
