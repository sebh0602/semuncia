function loadGraph(){
	var graphMode = document.getElementById("graphSelect").value;
	drawGraph(calculateGraph(graphMode));
}

function calculateGraph(graphMode){
	if (graphMode == "balance"){
		return calculateBalanceGraph();
	} else{
		return [
			[
				[0,0],
				[1,1],
				[2,1.5]
			],
			[
				["y", 1],
				["x", 0.5]
			],
			[
				["semuncia", 1.05, 0.05],
				["semuncia", 0, 0.0],
			]
		];
	}
}

function calculateBalanceGraph(){
	var transactions = localData.transactions;
	var transactionDates = [];
	for (date in transactions){ //this is just for determining if the filter is active
		if (localData.config.filter.dateFrom == "" || (new Date(localData.config.filter.dateFrom) - new Date(date)) < 1){
			if (localData.config.filter.dateTo == "" || (new Date(date) - new Date(localData.config.filter.dateTo)) < 1){
				transactionDates.push(date);
			}
		}
	}
	var filteredTransactions = filter(localData.transactions);
	var filteredTransactionDates = Object.keys(filteredTransactions).sort();
	if (filteredTransactionDates.length != transactionDates.length){
		var filterActive = true;
	} else {
		var filterActive = false;
	}

	transactionDates = Object.keys(localData.transactions).sort();

	var startDate;
	if (filteredTransactionDates.length != 0){ //otherwise there are issues with the vertical lines
		startDate = filteredTransactionDates[0];
	} else if (localData.config.filter.dateFrom != ""){
		startDate = localData.config.filter.dateFrom;
	} else{
		startDate = transactionDates[0];
	}
	startDate = new Date(startDate);

	if (localData.config.filter.dateTo != ""){
		var endDate = new Date(localData.config.filter.dateTo);
	} else {
		var endDate = new Date();
	}
	var iterDate = new Date(transactionDates[0]);
	var iso = "";
	var iterBalance = localData.initialAmount;
	var dayCount = 1;
	var graphArray = [];

	var prevIso = iterDate.toISOString().split("T")[0];
	var grid = [];
	var labels = [];

	var years = (endDate - startDate)/365.2425/86400/1000;
	var yearSpace = document.getElementById("canvas").clientWidth*4/220;
	var months = (endDate - startDate)/30.44/86400/1000;
	var monthSpace = document.getElementById("canvas").clientWidth*4/330;
	var days = (endDate - startDate)/86400/1000;
	var daySpace = document.getElementById("canvas").clientWidth*4/480;

	if (days <= daySpace){
		var gridSpacing = "days";
	}else if (months <= monthSpace){
		var gridSpacing = "months";
	} else if (years <= yearSpace){
		var gridSpacing = "years";
	} else{
		var gridSpacing = "none";
	}

	while ((endDate - iterDate) >= -7200000){ //strange number because of DST stuff
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

		if (localData.config.filter.dateFrom == "" || (new Date(localData.config.filter.dateFrom) - iterDate) < 1){ //end date taken care of by endDate in loop
			if (filterActive && filteredTransactionDates.includes(iso)){
				graphArray.push([dayCount,iterBalance,"#578700"]);
			} else{
				graphArray.push([dayCount,iterBalance]);
			}
		}
		if (iso.split("-")[1] != prevIso.split("-")[1]){ //month change
			if (iso.split("-")[0] != prevIso.split("-")[0] && gridSpacing == "years"){ //year change
				grid.push(["y",dayCount - 0.5]);
				labels.push([iso.split("-")[0],dayCount - 0.5,"top"]);
			} else if (gridSpacing == "months"){
				grid.push(["y",dayCount - 0.5]);
				labels.push([iso.split("-").splice(0,2).join("-"),dayCount - 0.5,"top"]);
			}
		}

		if (gridSpacing == "days"){
			grid.push(["y",dayCount - 0.5]);
			labels.push([iso,dayCount - 0.5,"top"]);
		}

		dayCount += 1;
		iterDate.setDate(iterDate.getDate() + 1);
		prevIso = iso;
	}

	return [graphArray, grid, labels];
}

function drawGraph(input){
	switch(input.length){
		case 0:
			return;
			break;
		case 1:
			input = input[0];
			break;
		case 2:
			var grid = input[1];
			input = input[0];
			break;
		case 3:
			var grid = input[1];
			var labels = input[2];
			input = input[0];
			break;
	}
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if (input.length < 2){
		console.log("INPUT TOO SHORT")
		//TODO: Add "no graph" notice and size accordingly
	}

	if (localData.temp.graph == undefined){
		localData.temp.graph = {};
	}

	var minX = input[0][0], maxX = input[0][0], minY = 0, maxY = input[0][1];
	for (i of input){
		if (i[0] < minX){
			minX = i[0];
		}
		if (i[0] > maxX){
			maxX = i[0];
		}
		if (i[1] < minY){
			minY = i[1];
		}
		if (i[1] > maxY){
			maxY = i[1];
		}
	}
	canvas.width = 4*canvas.clientWidth;
	var inputWidth = maxX - minX;
	localData.temp.graph.xScale = canvas.width / inputWidth;
	localData.temp.graph.xOffset = minX * (-1); //xOffset needs to be added to all raw x-Values

	canvas.height = 4*canvas.clientHeight;
	localData.temp.graph.canvasHeight = canvas.height;
	var inputHeight = (maxY - minY) * 1.2;
	localData.temp.graph.yScale = canvas.height / inputHeight;
	localData.temp.graph.yOffset = minY * (-1) + ((minY < 0) ? (inputHeight / 12) : 0); //Make offset dependent on pos/neg values in graph

	ctx.lineJoin = "round";
	ctx.lineCap = "round";

	var coord;
	for (var i = 1; i < input.length; i++){
		coord = input[i];
		prevCoord = input[i - 1];

		ctx.beginPath();
		if (coord.length > 2){
			ctx.strokeStyle = coord[2];
			ctx.lineWidth = 15;
		} else{
			ctx.strokeStyle = "#000888";
			ctx.lineWidth = 5;
		}
		ctx.moveTo(grX(prevCoord[0]),grY(prevCoord[1]));
		ctx.lineTo(grX(coord[0]),grY(coord[1]));
		ctx.stroke();
	}

	if (typeof grid != "undefined"){
		for (line of grid){
			coord = line[1];
			ctx.beginPath();
			ctx.strokeStyle = "#1e2749";
			ctx.lineWidth = 3;

			if (line[0] == "x"){
				ctx.moveTo(grX(minX),grY(coord));
				ctx.lineTo(grX(maxX),grY(coord));
			} else{
				ctx.moveTo(grX(coord),grY(minY));
				ctx.lineTo(grX(coord),grY(maxY*1.2));
			}
			ctx.stroke();
		}
	}

	if (typeof labels != "undefined"){
		drawLabels(labels, ctx, minX, maxX, minY, inputHeight); //otherwise the font would not be loaded yet
	}
}

function drawLabels(labels, ctx, minX, maxX, minY, inputHeight){
	if (!document.fonts.check("80px Roboto")){
		setTimeout(
			function (){
				drawLabels(labels, ctx, minX, maxX, minY, inputHeight);
			},
			10
		);
		return;
	}

	var x, y;
	ctx.font = "80px Roboto";
	ctx.fillStyle = "#1e2749";
	for (label of labels){
		x = label[1];
		y = label[2];
		if (y == "top"){
			y = ((minY < 0) ? (inputHeight*11/12) : (inputHeight));
		}
		if (grX(x) + ctx.measureText(label[0]).width + 20 < grX(maxX) && x > minX){ //so it doesn't get cut off
			ctx.fillText(label[0], grX(x) + 20, grY(y) + 90);
		}
	}
}

function grX(x){
	return (x + localData.temp.graph.xOffset)*localData.temp.graph.xScale;
}

function grY(y){
	return localData.temp.graph.canvasHeight - (y + localData.temp.graph.yOffset)*localData.temp.graph.yScale;
}

window.addEventListener('resize', function(event){
	if (localData.config.currentDisplay == "graphDisplay"){
		setTimeout( //otherwise the width/height of the canvas are incorrect
			loadGraph,
			1
		);
	}
});
