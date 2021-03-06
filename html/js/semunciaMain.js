var localData = {};

function init(){
	localDataDefaultFilter = {
		keywords:"",
		searchMode:"and",
		dateFrom:"",
		dateTo:"",
		amountFrom:"",
		amountTo:"",
		type:""
	};
	if (localStorage.config != undefined){
		localData.config = JSON.parse(localStorage.config);
		if (localData.config.filter == undefined){
			localData.config.filter = localDataDefaultFilter;
		}
	} else{
		localData.config = {
			currentDisplay:"statsDisplay",
			filter:localDataDefaultFilter
		};
	}
	if (localStorage.transactions != undefined){
		localData.transactions = JSON.parse(localStorage.transactions);
	} else{
		localData.transactions = {};
	}
	if (localStorage.initialAmount != undefined){
		localData.initialAmount = JSON.parse(localStorage.initialAmount);
	} else {
		localData.initialAmount = 0;
	}
	if (localStorage.recurringTransactions != undefined){
		localData.recurringTransactions = JSON.parse(localStorage.recurringTransactions);
	}
	if (localStorage.sync != undefined){
		localData.sync = JSON.parse(localStorage.sync);
	} else {
		localData.sync = {
			syncActivated: false
		};
	}
	localData.temp = {
		transactionScroll:0 //-1: maximum reached, 0: not initialized, n: scrolled n number of dates
	};

	if (localData.sync.syncActivated){
		establishConnection();
	}
	setInterval(checkSocket, 1000);
	window.addEventListener("keydown",function (e) {
		if (e.keyCode == 114 || (e.ctrlKey && e.keyCode == 70)) {
			if (["statsDisplay","graphDisplay","transactionsDisplay"].includes(localData.config.currentDisplay)){
				e.preventDefault();
				showFilterPopup();
			}
		}
	});
	window.onbeforeunload = function(){
		if (localData.temp.saving){
			return true;
		}
	}
	
	history.pushState(null,"");
	window.onpopstate = function(event){
		if (isEverythingMinimized()){
			history.back();
		} else {
			minimizeEverything();
			history.pushState(null,"");
		}
	}

	window.addEventListener("load", () => {
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.register("serviceWorker.js");
		}
	});

	loadStats();
	saveLocalData();
	switchDisplay(localData.config.currentDisplay);
}

function saveLocalData(){
	localData.temp.saving = true;

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
	if (localData.sync != undefined){
		localStorage.sync = JSON.stringify(localData.sync);
	}
	if (localData.sync.syncActivated && localData.temp.badConnection){
		localStorage.saveOnConnection = "true";
		localData.temp.saving = false;
	} else{
		if (localData.sync.syncActivated && (localData.temp.firstConnection === false)){
			var payload = {
				type: "push",
				id:localData.sync.id,
				data:JSON.stringify({
					config:localData.config,
					transactions:localData.transactions,
					initialAmount:localData.initialAmount,
					recurringTransactions:localData.recurringTransactions
				})
			};
			sendMessage(payload);
		} else {
			localData.temp.saving = false;
		}
	}
}

function importJSON(){
	var reader = new FileReader();
	reader.onload = function(event){
		var result = JSON.parse(event.target.result);
		if ("transactions" in result){
			localData.transactions = result.transactions;
			localData.temp.transactionScroll = 0;
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
		saveLocalData();
		switchDisplay(localData.config.currentDisplay);
	}
	reader.readAsText(event.target.files[0]);
	document.getElementById("transactionsFileInput").value = ""; //so the onchange event works
}

function exportJSON(){
	var exportableJSON = {
		initialAmount:localData.initialAmount,
		recurringTransactions:localData.recurringTransactions,
		transactions:localData.transactions
	};

	var fileName = "semuncia_export_" + getCurrentDate() + ".json";
	var stringified = JSON.stringify(exportableJSON,null,"\t");
	var blob = new Blob([stringified], {type:"application/json"});
	var a = document.createElement("a");
	var url = URL.createObjectURL(blob);
	a.href = url;
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
	setTimeout(function() { //not sure why this is done like this (copied from SO)
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}, 0);
}

function addDecimalSeparators(cents){
	if (cents == undefined || isNaN(cents)){
		return "?";
	}

	if (parseFloat(cents) < 0){
		var negative = true;
		cents = cents.toString();
		cents = cents.slice(1,cents.length);
	} else{
		var negative = false;
	}

	var arr = cents.toString().split("");
	while (arr.length < 3){
		arr.splice(0,0,"0");
	}
	arr.splice(arr.length-2,0,".");

	var withComma = arr.join("");
	var splitByComma = withComma.split(".");
	splitByComma[0] = addSpaces(splitByComma[0]);
	return (negative ? "-" : "") + splitByComma.join(".");
}

function addSpaces(number){
	var arr = number.toString().split("");
	for (var i = arr.length - 3; i >= 1; i -= 3){
		arr[i] = " " + arr[i];
	}
	return arr.join("");
}

function cleanNumber(number){
	if (number == undefined || number == ""){
		return 0;
	}
	var arr = number.toString().split("");
	var allowed = "01234567890.,";
	var result = [];
	for (i of arr){
		if (allowed.includes(i)){
			result.push(i);
		}
	}
	result = result.join("").replace(",",".");
	return parseFloat(result);
}

function getUnsortedTransactionArray(sortedTransactionArray){
	var unsorted = [];
	for (date in sortedTransactionArray){
		for (transaction of sortedTransactionArray[date]){
			unsorted.push(transaction);
		}
	}
	return unsorted;
}

function getCurrentDate(){
	return new Date(Date.now() - (new Date().getTimezoneOffset()*60000)).toISOString().split("T")[0];
}

init();
