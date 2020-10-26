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
	localStorage.clear();
	localData = {
		config:{
			currentDisplay:"settingsDisplay"
		},
		temp:{},
		initialAmount:0
	};

	document.getElementById("sideNavStatsDisplay").innerHTML = "0.00";
	document.getElementById("sideNavStatsDisplay").style.backgroundColor = "#ffffff";
	document.getElementById("statsDisplayInner").innerHTML = "<div class='emptyNotice'>No statistics to display.</div>";
	document.getElementById("graphDisplay").innerHTML = "<div class='emptyNotice'>No graph to display.</div>";
	document.getElementById("transactionsDisplay").innerHTML = "<div class='emptyNotice'>No transactions to display.</div>";

	saveLocalData();
	switchDisplay(localData.config.currentDisplay);
}
