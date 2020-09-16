var localData = {};

function init(){
	if (localStorage.config != undefined){
		localData.config = JSON.parse(localStorage.config);
	} else{
		localData.config = {
			currentDisplay:"statsDisplay"
		};
		saveLocalData();
	}
	switchDisplay(localData.config.currentDisplay);
}

function saveLocalData(){
	localStorage.config = JSON.stringify(localData.config);
}

function importJSON(){
	alert("import");
}

function exportJSON(){
	alert("export");
}

init();
