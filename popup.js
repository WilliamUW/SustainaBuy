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
	document.getElementById("score").innerText = request.score;
	document.getElementById("explanation").innerText = request.explanation;
	document.getElementById("alternatives").innerText = request.alternatives;

// following by eric, change background color of circle in popup.html
// Set the score in another JS file
let score = 75;
document.querySelector("#score").textContent = score;

// Use the score to determine the background color
let backgroundColor;
if (score >= 70) {
  backgroundColor = "green";
} else if (score < 40) {
  backgroundColor = "red";
} else {
  backgroundColor = "yellow";
}
document.querySelector("#score-circle").classList.add(backgroundColor);
// end eric
});

window.onload = getMetas;
