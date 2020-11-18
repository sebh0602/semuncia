function filter(unfilteredTransactions){
	var keywords = localData.config.filter.keywords.toLowerCase();
	if (keywords == ""){
		return unfilteredTransactions;
	}
	var filteredTransactions = {};
	for (date in unfilteredTransactions){
		date = unfilteredTransactions[date];
		for (transaction of date){
			if (transaction.title.toLowerCase().includes(keywords)){
				if (filteredTransactions[transaction.date] == undefined){
					filteredTransactions[transaction.date] = [];
				}
				filteredTransactions[transaction.date].push(transaction);
			}
			for (category of transaction.categories){
				if (category.toLowerCase().includes(keywords)){
					if (filteredTransactions[transaction.date] == undefined){
						filteredTransactions[transaction.date] = [];
					}
					filteredTransactions[transaction.date].push(transaction);
				}
			}
		}
	}
	return filteredTransactions;
}
