function loadListOfTransactions(){
	if (localData.transactions == undefined || Object.keys(localData.transactions).length == 0){
		document.getElementById("transactionsDisplay").innerHTML = `<div class="emptyNotice">No transactions to display.</div>`;
		return;
	}
	if (localData.temp.transactionScroll == 0){
		document.getElementById("transactionsDisplay").innerHTML = "";
		loadMoreTransactions(0,50);
	}
}

function loadMoreTransactions(start,end){
	var filteredTransactions = filter(localData.transactions);
	var transactionDates = Object.keys(filteredTransactions).sort().reverse();
	if (end > transactionDates.length){
		end = transactionDates.length;
		localData.temp.transactionScroll = -1;
	} else{
		localData.temp.transactionScroll += 50;
	}
	transactionDates = transactionDates.slice(start,end);

	var date;
	var tdHTML; //transactionsDisplay HTML
	var transaction;
	if (start == 0){
		tdHTML = `<div id="transactionsDisplayFilter">
			<input type="text" id="transactionsDisplayFilterSearch" placeholder="Search..." oninput="searchInputHandlerTD()" value="${localData.config.filter.keywords}">
			<button onclick="showFilterPopup()">⌕</button>
		</div>`;
	}else{
		tdHTML = "";
	}
	for (date of transactionDates){
		tdHTML += `<div class="dateContainer"><div class="date">${date} (${weekday(date)})</div>`;
		for ([index, transaction] of filteredTransactions[date].entries()){
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
		}
		tdHTML += `</div>`;
	}
	document.getElementById("transactionsDisplay").innerHTML += tdHTML;
	var pos = localData.config.filter.cursorPos;
	if (start == 0 && pos != -1){
		document.getElementById("transactionsDisplayFilterSearch").focus();
		document.getElementById("transactionsDisplayFilterSearch").setSelectionRange(pos, pos);
	}
}

function scrollHandlerTD(event){
	var td = document.getElementById("transactionsDisplay");
	if (td.scrollHeight - td.clientHeight - td.scrollTop <= td.clientHeight && localData.temp.transactionScroll != -1){
		loadMoreTransactions(localData.temp.transactionScroll,localData.temp.transactionScroll + 50);
	}
}

function searchInputHandlerTD(event){
	var value = document.getElementById("transactionsDisplayFilterSearch").value;
	var pos = document.getElementById("transactionsDisplayFilterSearch").selectionStart;
	localData.config.filter.keywords = value;
	localData.config.filter.cursorPos = pos;
	saveLocalData();
	localData.temp.transactionScroll = 0;
	switchDisplay(localData.config.currentDisplay);
}

function weekday(date){
	var date = new Date(date);
	weekdays = {1:"Mon",2:"Tue",3:"Wed",4:"Thu",5:"Fri",6:"Sat",0:"Sun"};
	if (date != "Invalid Date"){
		return weekdays[date.getDay()];
	} else{
		return "";
	}
}
