onmessage = function(event){
	var from = event.data[0];
	var to = event.data[1];
	var frequencyDayList = event.data[2];
	var a = event.data[3];
	var conversionFactor = event.data[4];
	var returnArray = [];
	var max = 0;

	for (var i = from; i <= to; i++){
		x = i*conversionFactor;
		y = frequencyFunction(x, frequencyDayList, a);

		returnArray.push([i,y]);

		if (y > max){
			max = y;
		}
	}
	postMessage([returnArray,max]);
}

function frequencyFunction(x, frequencyDayList, a){
	var y = 0;
	var exponent;
	var val;
	for (point of frequencyDayList){
		y += Math.pow(a,-Math.pow(x-point, 2));
	}
	return y;
}
