var localData = {};

function init(){
	if (localStorage.config != undefined){
		localData.config = JSON.parse(localStorage.config);
	} else{
		localData.config = {
			currentDisplay:"statsDisplay"
		};
	}
	if (localStorage.transactions != undefined){
		localData.transactions = JSON.parse(localStorage.transactions);
	}
	if (localStorage.initialAmount != undefined){
		localData.initialAmount = JSON.parse(localStorage.initialAmount);
	}
	if (localStorage.recurringTransactions != undefined){
		localData.recurringTransactions = JSON.parse(localStorage.recurringTransactions);
	}
	saveLocalData();
	switchDisplay(localData.config.currentDisplay);
}

function saveLocalData(){
	if (localData.transactions != undefined){
		localStorage.transactions = JSON.stringify(localData.transactions);
	}
	if (localData.initialAmount != undefined){
		localStorage.initialAmount = JSON.stringify(localData.initialAmount);
	}
	if (localData.recurringTransactions != undefined){
		localStorage.recurringTransactions = JSON.stringify(localData.recurringTransactions);
	}
	if (localData.config != undefined){
		localStorage.config = JSON.stringify(localData.config);
	}
}

function importJSON(){
	var reader = new FileReader();
	reader.onload = function(event){
		var result = JSON.parse(event.target.result);
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
		saveLocalData();
	}
	reader.readAsText(event.target.files[0]);
	document.getElementById("transactionsFileInput").value = ""; //so the onchange event works
}

function exportJSON(){
	alert("export");
}

init();
