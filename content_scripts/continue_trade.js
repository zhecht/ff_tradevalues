// find the continue button and proceed

function onG(storage) {
	if (storage["is_yahoo"]) {
		var links = document.getElementById("buttonbar").getElementsByTagName("a");
		for (var i = 0; i < links.length; ++i) {
			if (links[i].innerText.trim() == "Continue") {
				links[i].click();
			}
		}
	}
}

function onE(e) {
	console.log("ERROR: "+e);
}

browser.storage.local.get().then(onG, onE);