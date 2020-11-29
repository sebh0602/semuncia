//IDEA: Current balance Higher/lower/same as x% of days since FIRSTDATE
//Current balance higher/lower/same as n number of days since FIRSTDATE

//IDEA: first/last date where filter applies (number of day between)
//IDEA: amount per day between first and last / amount per transaction

//IDEA: check if current display is stats display. if not, only load sidebar number

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
		return;
	}

	//all transactions
	var transactionDates = Object.keys(localData.transactions);
	for (date of transactionDates){
		for (transaction of localData.transactions[date]){
			if (transaction["type"] == "+"){
				current += transaction["amount"];
			} else{
				current -= transaction["amount"];
			}
		}
	}

	//filtered transactions
	var filteredTransactions = filter(localData.transactions);
	var filteredTransactionDates = Object.keys(filteredTransactions);
	for (date of filteredTransactionDates){
		for (transaction of filteredTransactions[date]){
			if (transaction["type"] == "+"){
				earned += transaction["amount"];
			} else{
				spent += transaction["amount"];
			}
			numberOfTransactions += 1;
		}
		numberOfDays += 1;
	}

	document.getElementById("sideNavStatsDisplay").innerHTML = ((current >= 0) ? "+":"") + addDecimalSeparators(current);
	if (current >= 0){
		document.getElementById("sideNavStatsDisplay").style.backgroundColor = "#ccffcc";
	} else{
		document.getElementById("sideNavStatsDisplay").style.backgroundColor = "#ffcccc";
	}

	var sdHTML = "";
	var data = {
		"Current balance*":((current >= 0) ? "+":"") + addDecimalSeparators(current),
		"Amount earned":"+" + addDecimalSeparators(earned),
		"Amount spent":"-" + addDecimalSeparators(spent),
		"Total":((earned-spent >= 0) ? "+":"") + addDecimalSeparators(earned-spent),
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
