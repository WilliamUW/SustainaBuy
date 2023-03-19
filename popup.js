function getMetas() {
	var message = document.querySelector('#metaTable');
	message.innerHTML = '';
	chrome.tabs.executeScript(null, {
		file: "getPageMetas.js"
	}, function() {
		// If you try it into an extensions page or the webstore/NTP you'll get an error
		if (chrome.runtime.lastError) {
			message.innerText = 'There was an error : \n' + chrome.runtime.lastError.message;
		}
	});
}

chrome.runtime.onMessage.addListener(function(request, sender) {
	var metaTable = document.getElementById('metaTable');
	if (request.method == "getMetas") {
		for (var i=0; i<request.metas.length; i++) { 
			metaTable.innerHTML += "<tr><td>"+request.metas[i][0]+"</td><td>"+request.metas[i][1]+"</td><td>"+request.metas[i][2]+"</td><td>"+request.metas[i][3]+"</td><td>"+request.metas[i][4]+"</td></tr>"; 
		} 
	}

	const regex = /\d+/g; // matches any sequence of digits
	const scores = request.score.match(regex); 

	const score = parseInt(scores[0]);
	document.getElementById("score").innerText = score;
	document.getElementById("explanation").innerText = request.explanation;
	document.getElementById("alternatives").innerText = request.alternatives;


	// Use the score to determine the background color
	console.log(score);
	console.log(score >= 80);
	let backgroundColor;
	if (score >= 70) {
		backgroundColor = "green";
	} else if (score < 30) {
		backgroundColor = "red";
	} else {
		backgroundColor = "yellow";
	}
	document.querySelector("#score-circle").classList.add(backgroundColor);
	// end eric
});

window.onload = getMetas;
