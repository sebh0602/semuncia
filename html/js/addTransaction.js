function addTransaction(){
	hideAddTransactionPopup();
}

function loadTitleAutocomplete(){
	//{"Title":{categories:["cat"],count:3,positiveCount:0,amounts:[1,1,2]}}
	var unsorted = getUnsortedTransactionArray(localData.transactions);
	var autoCompleteObject = {};
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

function titleAutoCompleteSelect(event){
	var input = document.getElementById("addTransactionTitleInput").value;
	var transaction = localData.temp.titleAutocompleteObjCache[input];
	if (transaction == undefined){
		return;
	}
	localData.temp.newTransaction.type = transaction.type;
	addTransactionToggleHandler();
	for (category of transaction.categories){
		if (!localData.temp.newTransaction.categories.includes(category)){
			localData.temp.newTransaction.categories.push(category);
		}
	}
	addTransactionCategoryDisplayHandler();
	document.getElementById("addTransactionValueInput").value = transaction.amount/100;
	document.getElementById("addTransactionCategoryInput").focus();
}

function loadCategoryAutocomplete(){
	//{"Title":{categories:["cat"],count:3,positiveCount:0,amounts:[1,1,2]}}
	var unsorted = getUnsortedTransactionArray(localData.transactions);
	var autoCompleteObject = {};
	for (transaction of unsorted){
		for (category of transaction.categories){
			if (!(category in autoCompleteObject)){
				autoCompleteObject[category] = 1;
			} else {
				autoCompleteObject[category] += 1;
			}
		}
	}

	var autoCompleteArray = [];

	for (category in autoCompleteObject){
		autoCompleteArray.push({category:category, count:autoCompleteObject[category]});
	}

	autoCompleteArray.sort(function(a,b){
		return b.count - a.count;
	});

	localData.temp.categoryAutocompleteCache = autoCompleteArray;
	localData.temp.categoryAutocompleteObjCache = autoCompleteObject;
}

function categoryAutocompleteSuggestion(){
	var input = document.getElementById("addTransactionCategoryInput").value;
	localData.temp.newTransaction.categoryInput = input;

	var filteredArray = localData.temp.categoryAutocompleteCache;
	if (input.length == 0){
		document.getElementById("categoryAutocomplete").innerHTML = "";
		return;
	}
	var inputs = input.split(" ");
	for (i of inputs){
		filteredArray = filteredArray.filter(function(value){
			return value.category.toLowerCase().includes(i.toLowerCase());
		});
	}
	if (filteredArray.length > 4){
		filteredArray = filteredArray.slice(0,4);
	}

	var dataListInnerHTML = "";
	for (category of filteredArray){
		dataListInnerHTML += `<option value="${category.category}">${category.count}x</option>`
	}
	document.getElementById("categoryAutocomplete").innerHTML = dataListInnerHTML;
}

function categoryAutoCompleteSelect(){
	var input = document.getElementById("addTransactionCategoryInput").value;
	if (localData.temp.newTransaction.categories == undefined){
		localData.temp.newTransaction.categories = [];
	}
	if (localData.temp.newTransaction.categories.includes(input)){
		return;
	}
	localData.temp.newTransaction.categories.push(input);
	addTransactionCategoryDisplayHandler();
	document.getElementById("addTransactionCategoryInput").value = "";
	localData.temp.newTransaction.categoryInput = "";
	document.getElementById("categoryAutocomplete").innerHTML = "";
	document.getElementById("addTransactionValueInput").focus();
}

function addTransactionCategoryDisplayHandler(){
	displayInnerHTML = "";
	if (localData.temp.newTransaction.categories == undefined){
		localData.temp.newTransaction.categories = [];
	}
	for (category of localData.temp.newTransaction.categories){
		displayInnerHTML += `<div onclick="addTransactionRemoveCategory('${category}')">${category}</div>`;
	}
	document.getElementById("addTransactionFourthLine").innerHTML = displayInnerHTML;
}

function addTransactionRemoveCategory(category){
	localData.temp.newTransaction.categories.splice(localData.temp.newTransaction.categories.indexOf(category),1);
	addTransactionCategoryDisplayHandler();
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
