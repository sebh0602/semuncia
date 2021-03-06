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

								if (localData.config.filter.type === "" || localData.config.filter.type === transaction.type){

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
	}
	return filteredTransactions;
}

function filterKeywordsCheck(transaction, keywords, mode){
	if (keywords == ""){
		return true; //because no kw filter was set
	}
	if (mode == "exact"){
		if (filterKeywordsSimpleCheck(transaction, keywords, mode)){
			return true;
		}
	}

	var keywords2 = [];
	for (kw of keywords.split(" ")){
		if (!filterKeywordsNegativeCheck(transaction,kw)){
			return false;
		}
		if (kw[0] != "-" && kw != ""){
			keywords2.push(kw)
		}
	}
	if (keywords2.length == 0){ //because of searches containing only "-"-keywords
		return true;
	}

	if (mode == "or"){
		for (kw of keywords.split(" ")){
			if (kw != "" && filterKeywordsSimpleCheck(transaction, kw, mode)){
				return true;
			}
		}
	} else if (mode == "and"){
		for (kw of keywords.split(" ")){
			if (!filterKeywordsSimpleCheck(transaction, kw, mode)){
				return false;
			}
		}
		return true;
	}
	return false;
}

function filterKeywordsSimpleCheck(transaction, keyword, mode){
	if (keyword == ""){
		return true; //because no kw filter was set
	}
	if (keyword[0] == "-"){ //because this is handled by another function
		if (mode == "or"){
			return false;
		} else if (mode == "and"){
			return true;
		}
	}
	if (transaction.title.toLowerCase().includes(keyword)){
		return true;
	}
	for (category of transaction.categories){
		if (category.toLowerCase().includes(keyword)){
			return true;
		}
	}
	return false;
}

function filterKeywordsNegativeCheck(transaction, keyword){
	if (keyword == "" || keyword == "-"){
		return true;
	}
	if (keyword[0] == "-"){
		keyword = keyword.slice(1,keyword.length);
		if (transaction.title.toLowerCase().includes(keyword)){
			return false;
		}
		for (category of transaction.categories){
			if (category.toLowerCase().includes(keyword)){
				return false;
			}
		}
	}
	return true;
}

function applyFilter(){
	//read/save data from inputs
	localData.config.filter.keywords = document.getElementById("filterSearch").value;
	localData.config.filter.searchMode = getFilterRadioValue();
	localData.config.filter.dateFrom = document.getElementById("filterDateFrom").value;
	localData.config.filter.dateTo = document.getElementById("filterDateTo").value;
	localData.config.filter.cursorPos = -1; //so it doesn't focus on search bar

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

	if (document.getElementById("filterTypeCheckbox").checked){
		localData.config.filter.type = localData.temp.filterToggle;
	} else {
		localData.config.filter.type = "";
	}

	saveLocalData();
	localData.temp.transactionScroll = 0;
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
	localData.config.filter.type = "";
	localData.config.filter.cursorPos = -1; //so it doesn't focus on search bar
	saveLocalData();
	localData.temp.transactionScroll = 0;
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

function filterInvertToggle(){
	if (localData.temp.filterToggle == "+"){
		localData.temp.filterToggle = "-";
	} else{
		localData.temp.filterToggle = "+";
	}
}

function filterToggleHandler(){
	if (localData.temp.filterToggle == "+"){
		document.getElementById("filterToggleToggle").className = "toggleToggle firstOption";
		document.getElementById("filterToggleValueDisplay").innerHTML = "+";
	} else {
		document.getElementById("filterToggleToggle").className = "toggleToggle secondOption";
		document.getElementById("filterToggleValueDisplay").innerHTML = "-";
	}
}
