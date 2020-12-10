function loadGraph(){
	drawGraph(calculateGraph());
}

function calculateGraph(){
	var transactionDates = Object.keys(localData.transactions).sort();
	var filteredTransactions = filter(localData.transactions);
	var filteredTransactionDates = Object.keys(filteredTransactions).sort();
	if (filteredTransactionDates.length != transactionDates.length){
		var filterActive = true;
	} else {
		var filterActive = false;
	}
	var currentDate = new Date();
	var iterDate = new Date(transactionDates[0]);
	var iso = "";
	var iterBalance = localData.initialAmount;
	var dayCount = 0;
	var graphArray = [];
	while (iterDate <= currentDate){
		iso = iterDate.toISOString().split("T")[0];
		dayCount += 1;
		if (transactionDates.includes(iso)){
			for (transaction of localData.transactions[iso]){
				if (transaction["type"] == "+"){
					iterBalance += transaction["amount"];
				} else{
					iterBalance -= transaction["amount"];
				}
			}
		}

		if (filterActive && filteredTransactionDates.includes(iso)){
			graphArray.push([dayCount,iterBalance,"#578700"]);
		} else{
			graphArray.push([dayCount,iterBalance]);
		}

		iterDate.setDate(iterDate.getDate() + 1);
	}
	return graphArray;
}

function drawGraph(input){
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if (input.length < 2){
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
	canvas.width = 2*canvas.clientWidth;
	var inputWidth = maxX - minX;
	localData.temp.graph.xScale = canvas.width / inputWidth;
	localData.temp.graph.xOffset = minX * (-1); //xOffset needs to be added to all raw x-Values

	canvas.height = 2*canvas.clientHeight;
	localData.temp.graph.canvasHeight = canvas.height;
	var inputHeight = (maxY - minY) * 1.2;
	localData.temp.graph.yScale = canvas.height / inputHeight;
	localData.temp.graph.yOffset = minY * (-1) + (maxY - minY + 1)*0.1;

	ctx.lineJoin = "round";

	var coord;
	for (var i = 1; i < input.length; i++){
		coord = input[i];
		prevCoord = input[i - 1];

		ctx.beginPath();
		if (coord.length > 2){
			ctx.strokeStyle = coord[2];
			ctx.lineWidth = 6;
		} else{
			ctx.strokeStyle = "#000888";
			ctx.lineWidth = 2;
		}
		ctx.moveTo(grX(prevCoord[0]),grY(prevCoord[1]));
		ctx.lineTo(grX(coord[0]),grY(coord[1]));
		ctx.stroke();
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
