var listOfDisplays = {
	"statsDisplay":document.getElementById("statsDisplay"),
	"graphDisplay":document.getElementById("graphDisplay"),
	"transactionsDisplay":document.getElementById("transactionsDisplay"),
	"settingsDisplay":document.getElementById("settingsDisplay")
};

function switchDisplay(newDisplay){
	if (newDisplay == "transactionsDisplay"){
		loadListOfTransactions();
	}

	for (display in listOfDisplays){
		listOfDisplays[display].style.display = "none";
	}
	listOfDisplays[newDisplay].style.display = "block";
	localData.config.currentDisplay = newDisplay;
	saveLocalData();
}

function toggleSideNav(){
	if (document.getElementById("sideNav").style.display == "none" || document.getElementById("sideNav").style.display == ""){
		document.getElementById("sideNav").style.display = "block";
		setTimeout(function(){
			document.getElementById("sideNav").style.backgroundColor = "rgba(0,0,0,0.5)";
			document.getElementById("nav").style.width = "300px";
		},20);
	} else{
		document.getElementById("nav").style.width = "0px";
		document.getElementById("sideNav").style.backgroundColor = "rgba(0,0,0,0.0)";
		setTimeout(function(){
			document.getElementById("sideNav").style.display = "none";
		}, 500);
	}
}

function toggleSideNavDropDown(){
	var dropDown;
	for (dropDown of document.getElementsByClassName("sideNavDropDownChild")){
		if (dropDown.style.height == "0px" || dropDown.style.height == ""){
			dropDown.style.borderTop = "1px solid #1e2749";
			dropDown.style.height = "40px";
		} else{
			dropDown.style.height = "0px";
			dropDown.style.borderTop = "none";
		}
	}
}

function showAddTransactionPopup(){
	var dateInput = document.getElementById("addTransactionDateInput");
	var titleInput = document.getElementById("addTransactionTitleInput");
	var categoryInput = document.getElementById("addTransactionCategoryInput");
	var amountInput = document.getElementById("addTransactionValueInput");

	if (localData.temp.popupMode == "add"){
		if (localData.temp.newTransaction == undefined){
			localData.temp.newTransaction = {};
		}
		var transaction = localData.temp.newTransaction;
		if (localData.temp.newTransaction.type == undefined){
			localData.temp.newTransaction.type = "-";
		}
	} else {
		var transaction = localData.temp.editTransaction;
	}

	if (transaction.date != undefined){
		dateInput.value = transaction.date;
	} else {
		dateInput.value = "";
	}

	if (transaction.title != undefined){
		titleInput.value = transaction.title;
	} else{
		titleInput.value = "";
	}

	if (transaction.categoryInput != undefined){
		categoryInput.value = transaction.categoryInput;
	} else{
		categoryInput.value = "";
	}

	if (transaction.amount != undefined){
		amountInput.value = transaction.amount/100;
	} else{
		amountInput.value = "0.00";
	}

	addTransactionCategoryDisplayHandler();
	addTransactionToggleHandler();

	if (dateInput.value == ""){
		dateInput.value = new Date().toISOString().split("T")[0];
		localData.temp.newTransaction.date = dateInput.value;
	}
	loadTitleAutocomplete();
	loadCategoryAutocomplete();

	if (localData.temp.popupMode == "add"){
		document.getElementById("addTransactionTitle").innerHTML = "Add transaction";
		document.getElementById("addTransactionButton").innerHTML = "Add transaction";
		document.getElementById("deleteTransactionButton").style.display = "none";
	} else{
		document.getElementById("addTransactionTitle").innerHTML = "Edit transaction";
		document.getElementById("addTransactionButton").innerHTML = "Edit transaction";
		document.getElementById("deleteTransactionButton").style.display = "block";
	}

	document.getElementById("popupBackground").style.display = "block";
	document.getElementById("addTransactionPopup").style.display = "block";
	document.getElementById("addTransactionHoverButton").style.display = "none";

	document.getElementById("addTransactionTitleInput").focus();
}

function hideAddTransactionPopup(){
	document.getElementById("popupBackground").style.display = "none";
	document.getElementById("addTransactionPopup").style.display = "none";
	document.getElementById("addTransactionHoverButton").style.display = "flex";
}
