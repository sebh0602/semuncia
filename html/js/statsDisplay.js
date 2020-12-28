//IDEA: check if current display is stats display. if not, only load sidebar number (actually args)

function loadStats(doFullCalculation = false){
	var current = 0;
	var earned = 0;
	var spent = 0;
	var numberOfPlusTransactions = 0;
	var numberOfMinusTransactions = 0;
	var numberOfDaysWithTransactions = 0;
	if (localData.initialAmount != undefined){
		current = localData.initialAmount;
	}
	if (localData.transactions == undefined){
		return;
	}

	//all transactions
	var transactionDates = Object.keys(localData.transactions).sort();
	for (date of transactionDates){
		for (transaction of localData.transactions[date]){
			if (transaction["type"] == "+"){
				current += transaction["amount"];
			} else{
				current -= transaction["amount"];
			}
		}
	}

	document.getElementById("sideNavStatsDisplay").innerHTML = ((current >= 0) ? "+":"") + addDecimalSeparators(current);
	if (current >= 0){
		document.getElementById("sideNavStatsDisplay").style.backgroundColor = "#ccffcc";
	} else{
		document.getElementById("sideNavStatsDisplay").style.backgroundColor = "#ffcccc";
	}

	if (!doFullCalculation){
		return;
	}

	/*
	Start of full calculations
	*/

	//filtered transactions
	var filteredTransactions = filter(localData.transactions);
	var filteredTransactionDates = Object.keys(filteredTransactions).sort();
	for (date of filteredTransactionDates){
		for (transaction of filteredTransactions[date]){
			if (transaction["type"] == "+"){
				earned += transaction["amount"];
				numberOfPlusTransactions += 1;
			} else{
				spent += transaction["amount"];
				numberOfMinusTransactions += 1;
			}
		}
		numberOfDaysWithTransactions += 1;
	}

	var numberOfDays = new Date(filteredTransactionDates[filteredTransactionDates.length - 1]) -  new Date(filteredTransactionDates[0]);
	numberOfDays = numberOfDays / 86400000;
	numberOfDays += 1; //so it counts the days on both ends

	var currentBalanceComparison = getDayBasedStats(current);
	var totalDays = currentBalanceComparison[0] + currentBalanceComparison[1] + currentBalanceComparison[2];

	var sdHTML = "<button onclick='showFilterPopup()'>⌕</button>"; //add html for filter button here

	if (Object.keys(filteredTransactions).length == 0){
		sdHTML += "<div class='emptyNotice'>No statistics to display.</div>";
		document.getElementById("statsDisplayInner").innerHTML = sdHTML;
		return;
	}

	var data1 = {
		"Current balance*":((current >= 0) ? "+":"") + addDecimalSeparators(current),
		"Current balance lower/same/higher than on ... days*":`${currentBalanceComparison[0]}/${currentBalanceComparison[1]}/${currentBalanceComparison[2]}`,
		"Current balance lower/same/higher than on ...% of days*":`${Math.round(currentBalanceComparison[0]/totalDays*1000)/10}/${Math.round(currentBalanceComparison[1]/totalDays*1000)/10}/${Math.round(currentBalanceComparison[2]/totalDays*1000)/10}`
	};

	var data2 = {
		"Amount earned":"+" + addDecimalSeparators(earned),
		"Amount earned per day":"+" + addDecimalSeparators(Math.round(earned/numberOfDays)),
		"Amount earned per [+] transaction":"+" + addDecimalSeparators(Math.round(earned/numberOfPlusTransactions))
	};

	var data3 = {
		"Amount spent":"-" + addDecimalSeparators(spent),
		"Amount spent per day":"-" + addDecimalSeparators(Math.round(spent/numberOfDays)),
		"Amount spent per [-] transaction":"-" + addDecimalSeparators(Math.round(spent/numberOfMinusTransactions))
	};

	var data4 = {
		"Total":((earned-spent >= 0) ? "+":"") + addDecimalSeparators(earned-spent),
		"Total per day":((earned-spent >= 0) ? "+":"") + addDecimalSeparators(Math.round((earned - spent)/numberOfDays)),
		"Total per transaction":((earned-spent >= 0) ? "+":"") + addDecimalSeparators(Math.round((earned - spent)/(numberOfPlusTransactions + numberOfMinusTransactions)))
	};

	var data5 = {
		"First transaction":filteredTransactionDates[0],
		"Last transaction":filteredTransactionDates[filteredTransactionDates.length - 1],
		"Days in between":numberOfDays,
		"Days with transactions":numberOfDaysWithTransactions
	};

	var data6 = {
		"No. of transactions":numberOfPlusTransactions + numberOfMinusTransactions,
		"No. of [+] transactions":numberOfPlusTransactions,
		"No. of [-] transactions":numberOfMinusTransactions,
	};

	var sections = [data1, data2, data3, data4, data5, data6];

	for (section of sections){
		sdHTML += "<div class = 'statsDataCollection'>";
		for (datum in section){
			sdHTML += `<div class="singleStat">
				<div class="statDescriptor">${datum}</div>
				<div class="statValue">${section[datum]}</div>
			</div>`;
		}
		sdHTML += "</div><hr>";
	}

	document.getElementById("statsDisplayInner").innerHTML = sdHTML;
}

function getDayBasedStats(current){
	var transactionDates = Object.keys(localData.transactions).sort();
	var currentDate = new Date();
	var iterDate = new Date(transactionDates[0]);
	var iso = "";
	var iterBalance = localData.initialAmount;
	var smaller = 0;
	var equal = 0;
	var larger = 0;
	while (iterDate <= currentDate){
		iso = iterDate.toISOString().split("T")[0];
		if (transactionDates.includes(iso)){
			for (transaction of localData.transactions[iso]){
				if (transaction["type"] == "+"){
					iterBalance += transaction["amount"];
				} else{
					iterBalance -= transaction["amount"];
				}
			}
		}

		if (current < iterBalance){
			smaller += 1;
		} else if (current == iterBalance){
			equal += 1;
		} else if (current > iterBalance){
			larger += 1;
		}

		iterDate.setDate(iterDate.getDate() + 1);
	}
	return [smaller, equal, larger];
}
