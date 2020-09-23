function loadListOfTransactions(){
	switchDisplay('transactionsDisplay');
	if (localData.transactions == undefined){
		return;
	}
	var transactionDates = Object.keys(localData.transactions).sort().reverse();
	var date;
	var tdHTML = ""; //transactionsDisplay HTML
	var transaction;
	for (date of transactionDates){
		//add a date block
		tdHTML += `<div class="dateContainer"><div class="date">${date} (${weekday(date)})</div>`;
		for (transaction of localData.transactions[date]){
			//add transaction block
		}
		tdHTML += `</div>`;
	}
	document.getElementById("transactionsDisplay").innerHTML = tdHTML;
	console.log(tdHTML)
	/*<div class="dateContainer">
		<div class="date">2020-09-18 (Friday)</div>

		<div class="transaction positiveTransaction">
			<div class="transactionLineOne">
				<div>McDonalds Cheeseburger</div><div>&#9998;</div>
			</div>
			<div class="transactionLineTwo">
				<div class="transactionCategories">
					<div>Food</div>
					<div>Lunch</div>
				</div>
				<div class="transactionAmount">
					+1,20
				</div>
			</div>
		</div>
		<div class="transaction negativeTransaction">
			<div class="transactionLineOne">
				<div>McDonalds Cheeseburger</div><div>&#9998;</div>
			</div>
			<div class="transactionLineTwo">
				<div class="transactionCategories">
					<div>Food</div>
					<div>Lunch</div>
				</div>
				<div class="transactionAmount">
					-1,20
				</div>
			</div>
		</div>
	</div>*/
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
