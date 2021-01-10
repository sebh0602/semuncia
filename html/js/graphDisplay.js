function loadGraph(){
	var graphMode = document.getElementById("graphSelect").value;
	drawGraph(calculateGraph(graphMode));
}

function calculateGraph(graphMode){
	if (graphMode == "balance"){
		document.getElementById("graphResolutionContainer").style.display = "none";
		return calculateBalanceGraph();
	} else if (graphMode == "change"){
		document.getElementById("graphResolutionContainer").style.display = "none";
		return calculateChangeGraph();
	} else if (graphMode == "frequency"){
		document.getElementById("graphResolutionContainer").style.display = "block";
		return calculateFrequencyGraph();
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

	var min = 0;
	var max = 0;
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
			if (iterBalance < min){
				min = iterBalance;
			} else if (iterBalance > max){
				max = iterBalance;
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

	var range = (max - min);
	var maxHorizontalLines = Math.round(document.getElementById("canvas").clientHeight*4 / 200);
	var n = Math.ceil(Math.log10(range/maxHorizontalLines));
	var spacing = Math.pow(10,n);
	if (range/spacing*2 <= maxHorizontalLines && spacing > 100){ //so it can do spacings like 50/500/5000...
		spacing = spacing/2;
	}


	for (var i = 0; i<=max; i+=spacing){ //positive values
		grid.push(["x",i]);
		labels.push([Math.round(i/100),"left",i]);
	}
	for (var i = -1; i>=min; i-=spacing){ //negative values
		grid.push(["x",i]);
		labels.push([Math.round(i/100),"left",i]);
	}

	return [graphArray, grid, labels];
}

function calculateChangeGraph(){
	var filteredTransactions = filter(localData.transactions);
	var filteredTransactionDates = Object.keys(filteredTransactions).sort();
	if (filteredTransactionDates.length < 2){
		return [];
	}
	var startDate = filteredTransactionDates[0];
	startDate = new Date(startDate);

	var endDate = filteredTransactionDates[filteredTransactionDates.length - 1];
	endDate = new Date(endDate);

	var iterDate = startDate;
	var iso = "";
	var iterBalance = 0;
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

	var min = 0;
	var max = 0;
	while ((endDate - iterDate) >= -7200000){ //strange number because of DST stuff
		iso = iterDate.toISOString().split("T")[0];

		if (filteredTransactionDates.includes(iso)){
			for (transaction of filteredTransactions[iso]){
				if (transaction["type"] == "+"){
					iterBalance += transaction["amount"];
				} else{
					iterBalance -= transaction["amount"];
				}
			}
		}

		graphArray.push([dayCount,iterBalance]);
		if (iterBalance < min){
			min = iterBalance;
		} else if (iterBalance > max){
			max = iterBalance;
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

	var range = (max - min);
	var maxHorizontalLines = Math.round(document.getElementById("canvas").clientHeight*4 / 200);
	var n = Math.ceil(Math.log10(range/maxHorizontalLines));
	var spacing = Math.pow(10,n);
	if (range/spacing*2 <= maxHorizontalLines && spacing > 100){ //so it can do spacings like 50/500/5000...
		spacing = spacing/2;
	}

	for (var i = 0; i<=max; i+=spacing){ //positive values
		grid.push(["x",i]);
		labels.push([Math.round(i/100),"left",i]);
	}
	for (var i = -1; i>=min; i-=spacing){ //negative values
		grid.push(["x",i]);
		labels.push([Math.round(i/100),"left",i]);
	}

	return [graphArray, grid, labels];
}

function calculateFrequencyGraph(){
	//first make a list with the daynumbers of all filtered transactions
	//use this with the calc function for every x-pixel

	//graph always starts on a whole number/day
	//Whole day number in center of day. Day n goes from ]n-0.5;n+0.5[.
	var filteredTransactions = filter(localData.transactions);
	var filteredTransactionDates = Object.keys(filteredTransactions).sort();
	if (filteredTransactionDates.length < 2){
		return [];
	}
	var startDate = filteredTransactionDates[0];
	startDate = new Date(startDate);

	var endDate = filteredTransactionDates[filteredTransactionDates.length - 1];
	endDate = new Date(endDate);

	var iterDate = startDate;
	var iso = "";
	var dayCount = 0;

	var prevIso = iterDate.toISOString().split("T")[0];
	var grid = [];
	var labels = [];
	var frequencyDayList = [];
	var graphArray = [];

	var canvasWidth = document.getElementById("canvas").clientWidth*4;
	var years = (endDate - startDate)/365.2425/86400/1000;
	var yearSpace = canvasWidth/220;
	var months = (endDate - startDate)/30.44/86400/1000;
	var monthSpace = canvasWidth/330;
	var days = (endDate - startDate)/86400/1000;
	var daySpace = canvasWidth/480;

	if (days <= daySpace){
		var gridSpacing = "days";
	}else if (months <= monthSpace){
		var gridSpacing = "months";
	} else if (years <= yearSpace){
		var gridSpacing = "years";
	} else{
		var gridSpacing = "none";
	}

	var min = 0;
	var max = 0;
	while ((endDate - iterDate) >= -7200000){ //strange number because of DST stuff
		iso = iterDate.toISOString().split("T")[0];

		if (filteredTransactionDates.includes(iso)){
			for (transaction of filteredTransactions[iso]){
				frequencyDayList.push(dayCount);
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

	var x, y, a;
	a = 1 + 500*Math.pow(0.85,parseInt(document.getElementById("graphResolution").value));
	console.log(a)
	var conversionFactor = dayCount / canvasWidth;
	for (var i = 0; i <= canvasWidth; i++){
		x = i*conversionFactor;
		y = frequencyFunction(x, frequencyDayList, a);

		graphArray.push([i,y]);

		if (y < min){
			min = y;
		} else if (y > max){
			max = y;
		}
	}

	var val;
	for (var i = 0; i<grid.length; i++){
		val = grid[i];
		val[1] = val[1]/conversionFactor;
		grid[i] = val;
	}

	for (var i = 0; i<labels.length; i++){
		val = labels[i];
		val[1] = val[1]/conversionFactor;
		labels[i] = val;
	}

	var range = (max - min);
	var maxHorizontalLines = Math.round(document.getElementById("canvas").clientHeight*4 / 200);
	var n = Math.ceil(Math.log10(range/maxHorizontalLines));
	var spacing = Math.pow(10,n);
	if (spacing < 1){
		spacing = 1;
	}
	if (range/spacing*2 <= maxHorizontalLines && spacing > 1){ //so it can do spacings like 50/500/5000...
		spacing = spacing/2;
	}

	for (var i = 0; i<=max; i+=spacing){ //positive values
		grid.push(["x",i]);
		labels.push([Math.round(i),"left",i]);
	}
	for (var i = -1; i>=min; i-=spacing){ //negative values
		grid.push(["x",i]);
		labels.push([Math.round(i),"left",i]);
	}

	return [graphArray, grid, labels];
}

function frequencyFunction(x, frequencyDayList, a){
	//f(x) = Sum(i=1-->n, a^-(x-p_i)²)
	var y = 0;
	var exponent;
	var val;
	for (point of frequencyDayList){
		exponent = (-1) * Math.pow(x-point, 2);
		val = Math.pow(a,exponent);
		y += val;
	}
	return y;
}

function drawGraph(input){
	switch(input.length){
		case 0:
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
		return;
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
				var buffer = (maxY - minY)*0.1;
				if (minY >= 0){
					ctx.moveTo(grX(coord),grY(minY));
					ctx.lineTo(grX(coord),grY(maxY + 2*buffer));
				} else{
					ctx.moveTo(grX(coord),grY(minY - buffer));
					ctx.lineTo(grX(coord),grY(maxY + buffer));
				}
			}
			ctx.stroke();
		}
	}

	if (typeof labels != "undefined"){
		drawLabels(labels, ctx, minX, maxX, minY, maxY, inputHeight); //otherwise the font would not be loaded yet
	}
}

function drawLabels(labels, ctx, minX, maxX, minY, maxY, inputHeight){
	if (!document.fonts.check("80px Roboto")){
		setTimeout(
			function (){
				drawLabels(labels, ctx, minX, maxX, minY, maxY, inputHeight);
			},
			10
		);
		return;
	}

	var x, y;
	ctx.font = "80px Roboto";
	ctx.fillStyle = "#1e2749";
	var buffer = (maxY - minY)*0.1;
	for (label of labels){
		x = label[1];
		y = label[2];
		if (y == "top"){
			y = ((minY < 0) ? (maxY + buffer) : (maxY + 2*buffer));
		}
		if (x == "left"){
			x = minX;
		}
		if (grX(x) + ctx.measureText(label[0]).width + 20 < grX(maxX) && x >= minX){ //so it doesn't get cut off
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
