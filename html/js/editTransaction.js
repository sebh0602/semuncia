function editTransaction(date, index){
	localData.temp.popupMode = "edit";
	localData.temp.editTransaction = JSON.parse(JSON.stringify(localData.transactions[date][index]));
	localData.temp.editTransaction.indexDate = date;
	localData.temp.editTransaction.index = index;
	showAddTransactionPopup();
}

function deleteTransaction(){
	var date = localData.temp.editTransaction.indexDate;
	var index = localData.temp.editTransaction.index;
	if (!confirm("Delete this transaction?")){
		return;
	}
	localData.transactions[date].splice(index,1);
	if (localData.transactions[date].length == 0){
		delete localData.transactions[date];
	}
	localData.editTransaction = undefined;
	saveLocalData();
	localData.temp.transactionScroll = 0;
	switchDisplay(localData.config.currentDisplay);
	loadStats();
	hideAllPopups();
}
