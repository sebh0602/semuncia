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
		establishConnection();
	}

	localData.sync.syncActivated = !localData.sync.syncActivated;
}

function syncToggleHandler(){
	if (localData.sync.syncActivated){
		document.getElementById("syncToggleToggle").className = "toggleToggle firstOption";
		document.getElementById("syncToggleValueDisplay").innerHTML = "✔️";
		document.getElementById("syncNewIdButton").disabled = true;
		document.getElementById("syncEditIdButton").disabled = true;
		document.getElementById("syncPasswordInput").style.display = "none";
	} else {
		document.getElementById("syncToggleToggle").className = "toggleToggle secondOption";
		document.getElementById("syncToggleValueDisplay").innerHTML = "❌";
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
	var wSocket = new WebSocket(hostname);
	wSocket.onopen = function(event){
		wSocket.onmessage = function(msg){
			console.log(msg.data);
			console.log(msg);
		}
		wSocket.send(new Date().toISOString());
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
