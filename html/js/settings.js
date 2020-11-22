function loadSettingsPage(){
	document.getElementById("settingsInitialAmountInput").value = localData.initialAmount/100;
}

function setInitialAmount(){
	if (!confirm("Are you sure you want to change this value?")){
		document.getElementById("settingsInitialAmountInput").value = localData.initialAmount/100;
		return;
	}
	var newAmount = document.getElementById("settingsInitialAmountInput").value;
	newAmount = Math.round(newAmount*100);
	localData.initialAmount = newAmount;
	saveLocalData();
	loadStats();
}

function deleteAllLocalData(){
	if (prompt("Type DELETE to delete all local data.") != "DELETE"){
		return;
	}
	if (localData.sync.syncActivated){
		localData.sync.syncActivated = false;
		removeKey();
		wSocket.close()
	}
	localStorage.clear();
	localData = {
		config:{
			currentDisplay:"settingsDisplay",
			filter:{
				keywords:"",
				searchMode:"and",
				dateFrom:"",
				dateTo:""
			}
		},
		temp:{},
		initialAmount:0,
		sync:{
			syncActivated:false
		}
	};

	document.getElementById("sideNavStatsDisplay").innerHTML = "0.00";
	document.getElementById("sideNavStatsDisplay").style.backgroundColor = "#ffffff";
	document.getElementById("statsDisplayInner").innerHTML = "<div class='emptyNotice'>No statistics to display.</div>";
	document.getElementById("graphDisplay").innerHTML = "<div class='emptyNotice'>No graph to display.</div>";
	document.getElementById("transactionsDisplay").innerHTML = "<div class='emptyNotice'>No transactions to display.</div>";

	saveLocalData();
	switchDisplay(localData.config.currentDisplay);
}

function deleteRemoteData(){
	if (!localData.sync.syncActivated){
		alert("Synchronisation is not activated.");
		return;
	}
	if (prompt("Type DELETE to delete all remote data.") != "DELETE"){
		return;
	}
	var payload = {
		type: "push",
		id:localData.sync.id,
		data:undefined
	};
	console.log("Sent:");
	console.log(payload);
	wSocket.send(JSON.stringify(payload));
	localData.sync.syncActivated = false;
	removeKey();
	wSocket.close();
	saveLocalData();
}
