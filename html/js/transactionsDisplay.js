var transactionScroll = 0; //-1: maximum reached, 0: not initialized, n: scrolled n number of dates

function loadListOfTransactions(){
	if (localData.transactions == undefined){
		return;
	}
	if (transactionScroll == 0){
		document.getElementById("transactionsDisplay").innerHTML = "";
		loadMoreTransactions(0,50);
	}
}

function loadMoreTransactions(start,end){
	var transactionDates = Object.keys(localData.transactions).sort().reverse();
	if (end > transactionDates.length){
		end = transactionDates.length;
		transactionScroll = -1;
	} else{
		transactionScroll += 50;
	}
	transactionDates = transactionDates.slice(start,end);

	var date;
	var tdHTML = ""; //transactionsDisplay HTML
	var transaction;
	for (date of transactionDates){
		//add a date block
		tdHTML += `<div class="dateContainer"><div class="date">${date} (${weekday(date)})</div>`;
		for ([index, transaction] of localData.transactions[date].entries()){
			tdHTML += `<div class="transaction ${transaction["type"] == "+" ? "positiveTransaction" : "negativeTransaction"}">
				<div class="transactionLineOne">
					<div>${transaction["title"]}</div><div onclick="editTransaction('${date}',${index})">&#8942;</div>
				</div>
				<div class="transactionLineTwo">
					<div class="transactionCategories">`;
			for (cat of transaction["categories"]){
				tdHTML += `<div>${cat}</div>`;
			}
			tdHTML += `</div><div class="transactionAmount">${transaction["type"]}${addDecimalSeparators(transaction["amount"])}</div></div></div>`;
			//add transaction block
		}
		tdHTML += `</div>`;
	}
	document.getElementById("transactionsDisplay").innerHTML += tdHTML;
}

function scrollHandlerTD(event){
	var td = document.getElementById("transactionsDisplay");
	if (td.scrollHeight - td.clientHeight - td.scrollTop <= td.clientHeight && transactionScroll != -1){
		loadMoreTransactions(transactionScroll,transactionScroll + 50);
	}
}

//STILL ATTEMPTING TO LOAD NEW TRANSACTIONS AT END --> SET TO -!?

function weekday(date){
	var date = new Date(date);
	weekdays = {1:"Mon",2:"Tue",3:"Wed",4:"Thu",5:"Fri",6:"Sat",0:"Sun"};
	if (date != "Invalid Date"){
		return weekdays[date.getDay()];
	} else{
		return "";
	}
}
