function loadListOfTransactions(){
	switchDisplay('transactionsDisplay');
	if (localData.transactions == undefined){
		return;
	}
	var transactionDates = Object.keys(localData.transactions).sort().reverse();
	var date;
	var transaction;
	for (date of transactionDates){
		//add a date block
		for (transaction of localData.transactions[date]){
			//add transaction block
		}
	}
}
