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
	//TODO Calculate mode: https://stackoverflow.com/questions/1053843/get-the-element-with-the-highest-occurrence-in-an-array

	var autoCompleteArray = [];
	for (title in autoCompleteObject){
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
	console.log(autoCompleteArray)

	var dataListInnerHTML = "";
	for (transaction of autoCompleteArray){
		dataListInnerHTML += `<option value="${transaction.title}">${transaction.categories} | ${transaction.type}${addDecimalSeparators(transaction.amounts[0])} | ${transaction.count}x</option>`
	}
	document.getElementById("titleAutocomplete").innerHTML = dataListInnerHTML;
}
