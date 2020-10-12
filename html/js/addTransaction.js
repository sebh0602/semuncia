function addTransaction(){
	hideAddTransactionPopup();
}

function loadTitleAutocomplete(){
	//{"Title":{categories:["cat"],count:3,positiveCount:0,amounts:[1,1,2]}}
	var unsorted = getUnsortedTransactionArray(localData.transactions);
	var autoCompleteObject = [];
	for (transaction of unsorted){
		if (!(transaction.title in autoCompleteObject)){
			autoCompleteObject[transaction.title] = {
				title:transaction.title,
				categories:transaction.categories,
				count:1,
				positiveCount:(transaction.type == "+" ? 1 : 0),
				amounts:[transaction.amount]
			};
		} else{
			for (cat of transaction.categories){
				if (!autoCompleteObject[transaction.title].categories.includes(cat)){
					autoCompleteObject[transaction.title].categories.push(cat);
				}
			}
			autoCompleteObject[transaction.title].count += 1;
			if (transaction.type == "+"){
				autoCompleteObject[transaction.title].positiveCount += 1;
			}
			autoCompleteObject[transaction.title].amounts.push(transaction.amount);
		}
	}

	var autoCompleteArray = [];
	var amounts, maxOccurrence, mode, modeObj;

	for (title in autoCompleteObject){
		amounts = autoCompleteObject[title].amounts;
		maxOccurrence = 1;
		mode = amounts[0];
		modeObj = {};
		for (a of amounts){
			if (!(a in modeObj)){
				modeObj[a] = 1;
			} else {
				modeObj[a] += 1;
				if (modeObj[a] > maxOccurrence){
					maxOccurrence = modeObj[a];
					mode = a;
				}
			}
		}
		autoCompleteObject[title].amount = mode;

		if (autoCompleteObject[title].positiveCount / autoCompleteObject[title].count > 0.5){
			autoCompleteObject[title].type = "+";
		} else{
			autoCompleteObject[title].type = "-";
		}
		autoCompleteArray.push(autoCompleteObject[title]);
	}

	autoCompleteArray.sort(function(a,b){
		return b.count - a.count;
	});

	localData.temp.titleAutocompleteCache = autoCompleteArray;
	localData.temp.titleAutocompleteObjCache = autoCompleteObject;
	/*var dataListInnerHTML = "";
	for (transaction of autoCompleteArray){
		dataListInnerHTML += `<option value="${transaction.title}">${transaction.categories} | ${transaction.type}${addDecimalSeparators(transaction.amount)} | ${transaction.count}x</option>`
	}
	document.getElementById("titleAutocomplete").innerHTML = dataListInnerHTML;*/
}

function titleAutocompleteSuggestion(){
	var input = document.getElementById("addTransactionTitleInput").value;
	localData.temp.newTransaction.title = input;

	var filteredArray = localData.temp.titleAutocompleteCache;
	if (input.length <= 1){
		document.getElementById("titleAutocomplete").innerHTML = "";
		return;
	}
	var inputs = input.split(" ");
	for (i of inputs){
		filteredArray = filteredArray.filter(function(value){
			return value.title.toLowerCase().includes(i.toLowerCase());
		});
	}
	if (filteredArray.length > 4){
		filteredArray = filteredArray.slice(0,4);
	}

	var dataListInnerHTML = "";
	for (transaction of filteredArray){
		dataListInnerHTML += `<option value="${transaction.title}">${transaction.categories} | ${transaction.type}${addDecimalSeparators(transaction.amount)} | ${transaction.count}x</option>`
	}
	document.getElementById("titleAutocomplete").innerHTML = dataListInnerHTML;
}

function titleAutoCompleteSelect(){
	var input = document.getElementById("addTransactionTitleInput").value;
	var transaction = localData.temp.titleAutocompleteObjCache[input];
	localData.temp.newTransaction.type = transaction.type;
	addTransactionToggleHandler();
	document.getElementById("addTransactionValueInput").value = transaction.amount/100;
}

function addTransactionToggleHandler(){
	if (localData.temp.newTransaction.type == "+"){
		document.getElementById("addTransactionToggleToggle").className = "toggleToggle firstOption";
		document.getElementById("addTransactionToggleValueDisplay").innerHTML = "+";
		document.getElementById("addTransactionPopup").style.backgroundColor = "#ccffcc";
	} else {
		document.getElementById("addTransactionToggleToggle").className = "toggleToggle secondOption";
		document.getElementById("addTransactionToggleValueDisplay").innerHTML = "-";
		document.getElementById("addTransactionPopup").style.backgroundColor = "#ffcccc";
	}
}
