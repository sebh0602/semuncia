//IDEA: check if current display is stats display. if not, only load sidebar number (actually args)

function loadStats(doFullCalculation = false){
	console.log("partial stats")
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

	var sdHTML = "<button onclick='showFilterPopup()'>⌕</button>"; //add html for filter button here

	var data1 = {
		"Current balance*":((current >= 0) ? "+":"") + addDecimalSeparators(current)
	};

	var data2 = {
		"Amount earned":"+" + addDecimalSeparators(earned)
	};

	var data3 = {
		"Amount spent":"-" + addDecimalSeparators(spent)
	};

	var data4 = {
		"Total":((earned-spent >= 0) ? "+":"") + addDecimalSeparators(earned-spent)
	};

	var data5 = {
		"Days with transactions":numberOfDays
	};

	var data6 = {
		"No. of transactions":numberOfTransactions
	};

	var sections = [data1, data2, data3, data4, data5, data6];

	for (section of sections){
		for (datum in section){
			sdHTML += `<div class="singleStat">
				<div class="statDescriptor">${datum}</div>
				<div class="statValue">${section[datum]}</div>
			</div>`;
		}
		sdHTML += "<hr>";
	}

	document.getElementById("statsDisplayInner").innerHTML = sdHTML;
	console.log("full stats")
}
