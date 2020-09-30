function loadStats(){
	var current = 0;
	var earned = 0;
	var spent = 0;
	var numberOfTransactions = 0;
	var numberOfDays = 0;
	if (localData.initialAmount != undefined){
		current = localData.initialAmount;
	}
	if (localData.transactions == undefined){
		return
	}

	var transactionDates = Object.keys(localData.transactions);
	for (date of transactionDates){
		for (transaction of localData.transactions[date]){
			if (transaction["type"] == "+"){
				current += transaction["amount"];
				earned += transaction["amount"];
			} else{
				current -= transaction["amount"];
				spent += transaction["amount"];
			}
			numberOfTransactions += 1;
		}
		numberOfDays += 1;
	}

	document.getElementById("sideNavStatsDisplay").innerHTML = ((current >= 0) ? "+":"-") + addDecimalSeparators(current);
	if (current >= 0){
		document.getElementById("sideNavStatsDisplay").style.backgroundColor = "#ccffcc";
	} else{
		document.getElementById("sideNavStatsDisplay").style.backgroundColor = "#ffcccc";
	}

	var sdHTML = "";
	var data = {
		"Current balance":((current >= 0) ? "+":"-") + addDecimalSeparators(current),
		"Amount earned":"+" + addDecimalSeparators(earned),
		"Amount spent":"-" + addDecimalSeparators(spent),
		"Total":((current >= 0) ? "+":"-") + addDecimalSeparators(earned-spent),
		"No. of transactions":numberOfTransactions,
		"Days with transactions":numberOfDays
	};

	for (datum in data){
		sdHTML += `<div class="singleStat">
			<div class="statDescriptor">${datum}</div>
			<div class="statValue">${data[datum]}</div>
		</div>`;
	}

	document.getElementById("statsDisplayInner").innerHTML = sdHTML;
}
