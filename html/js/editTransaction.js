function editTransaction(date, index){
	localData.temp.popupMode = "edit";
	localData.temp.editTransaction = JSON.parse(JSON.stringify(localData.transactions[date][index]));
	showAddTransactionPopup();
}
