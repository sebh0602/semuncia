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

	if (localData.temp.newTransaction == undefined){
		localData.temp.newTransaction = {};
	}
	if (localData.temp.newTransaction.date != undefined){
		dateInput.value = localData.temp.newTransaction.date;
	}
	if (localData.temp.newTransaction.title != undefined){
		titleInput.value = localData.temp.newTransaction.title;
	}

	if (localData.temp.newTransaction.type == undefined){
		localData.temp.newTransaction.type = "-";
	}
	addTransactionToggleHandler();

	if (localData.temp.newTransaction.categoryInput != undefined){
		categoryInput.value = localData.temp.newTransaction.categoryInput;
	}
	addTransactionCategoryDisplayHandler();

	if (localData.temp.newTransaction.amount != undefined){
		amountInput.value = localData.temp.newTransaction.amount/100;
	}

	if (dateInput.value == ""){
		dateInput.value = new Date().toISOString().split("T")[0];
		localData.temp.newTransaction.date = dateInput.value;
	}
	loadTitleAutocomplete();
	loadCategoryAutocomplete();

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
