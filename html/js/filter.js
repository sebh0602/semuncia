function filter(unfilteredTransactions){
	var keywords = localData.config.filter.keywords.toLowerCase();
	var filteredTransactions = {};
	for (date in unfilteredTransactions){

		if (localData.config.filter.dateFrom == "" || (new Date(localData.config.filter.dateFrom) - new Date(date)) < 1){
			if (localData.config.filter.dateTo == "" || (new Date(date) - new Date(localData.config.filter.dateTo)) < 1){

				date = unfilteredTransactions[date];
				for (transaction of date){

					if (filterKeywordsCheck(transaction,keywords,localData.config.filter.searchMode)){

						if (localData.config.filter.amountFrom === "" || localData.config.filter.amountFrom <= transaction.amount){
							if (localData.config.filter.amountTo === "" || localData.config.filter.amountTo >= transaction.amount){

								if (filteredTransactions[transaction.date] == undefined){
									filteredTransactions[transaction.date] = [];
								}
								filteredTransactions[transaction.date].push(transaction);
							}
						}
					}
				}
			}
		}
	}
	return filteredTransactions;
}

function filterKeywordsCheck(transaction, keywords, mode){
	if (keywords == ""){
		return true; //because no kw filter was set
	}
	if (mode == "exact"){
		if (filterKeywordsSimpleCheck(transaction, keywords)){
			return true;
		}
	} else if (mode == "or"){
		for (kw of keywords.split(" ")){
			if (kw != "" && filterKeywordsSimpleCheck(transaction, kw)){
				return true;
			}
		}
	} else if (mode == "and"){
		for (kw of keywords.split(" ")){
			if (!filterKeywordsSimpleCheck(transaction, kw)){
				return false;
			}
		}
		return true;
	}
	return false;
}

function filterKeywordsSimpleCheck(transaction, keywords){
	if (keywords == ""){
		return true; //because no kw filter was set
	}
	if (transaction.title.toLowerCase().includes(keywords)){
		return true;
	}
	for (category of transaction.categories){
		if (category.toLowerCase().includes(keywords)){
			return true;
		}
	}
	return false;
}

function applyFilter(){
	//read/save data from inputs
	localData.config.filter.keywords = document.getElementById("filterSearch").value;
	localData.config.filter.searchMode = getFilterRadioValue();
	localData.config.filter.dateFrom = document.getElementById("filterDateFrom").value;
	localData.config.filter.dateTo = document.getElementById("filterDateTo").value;
	var aF = document.getElementById("filterAmountFrom").value;
	if (aF === ""){
		localData.config.filter.amountFrom = aF;
	} else{
		localData.config.filter.amountFrom = Math.round(cleanNumber(aF)*100);
	}
	var aT = document.getElementById("filterAmountTo").value;
	if (aT === ""){
		localData.config.filter.amountTo = aT;
	} else{
		localData.config.filter.amountTo = Math.round(cleanNumber(aT)*100);
	}
	saveLocalData();
	transactionScroll = 0;
	switchDisplay(localData.config.currentDisplay);
}

function clearFilter(){
	document.getElementById("filterSearch").value = "";
	localData.config.filter.keywords = "";
	localData.config.filter.searchMode = "and";
	localData.config.filter.dateFrom = "";
	localData.config.filter.dateTo = "";
	localData.config.filter.amountFrom = "";
	localData.config.filter.amountTo = "";
	saveLocalData();
	transactionScroll = 0;
	switchDisplay(localData.config.currentDisplay);
}

function getFilterRadioValue(){
	var radios = ["filterSearchModeAnd","filterSearchModeOr","filterSearchModeExact"];
	for (id of radios){
		if (document.getElementById(id).checked){
			return document.getElementById(id).value;
		}
	}
}

function setFilterRadioValue(val){
	var radios = ["filterSearchModeAnd","filterSearchModeOr","filterSearchModeExact"];
	for (id of radios){
		if (document.getElementById(id).value == val){
			document.getElementById(id).checked = true;
			break;
		}
	}
}
