

String.prototype.format = function () {
	var i = 0, args = arguments;
	return this.replace(/{}/g, function () {
		return typeof args[i] != 'undefined' ? args[i++] : '';
	});
};

function getName(result) {
	if (!result)
		return "";
	var split_data = result.split(",");
	return split_data[0];
}

function getVal(result) {
	if (!result)
		return "";
	var split_data = result.split(",");
	return parseFloat(split_data[1]);
}

function fillTable(results) {
	document.getElementsByClassName("name")[0].innerText = results["team_name0"];
	document.getElementsByClassName("name")[1].innerText = results["team_name1"];

	var player_len = (results["team0"].length >= results["team1"].length) ? results["team0"].length : results["team1"].length;

	var tot0 = 0, tot1 = 0;
	for (var p = 0; p < player_len; ++p) {
		var name0 = "", name1 = "", val0 = "", val1 = "";
		var display_val0 = "", display_val1 = "";
		var class0 = "player_td", class1 = "player_td";
		if (p < results["team0"].length) {
			var sp = results["team0"][p].split(",");
			name0 = sp[0];
			val0 =  sp[1];
			display_val0 = parseFloat(sp[1].split("_")[1]); //get half point

			if (players_picked) {
				tot0 += display_val0;
			} else if (sp[2] === "true") {
				tot0 += display_val0;
				class0 += " clicked";	
			}
		}
		if (p < results["team1"].length) {
			var sp = results["team1"][p].split(",");
			name1 = sp[0];
			val1 = sp[1];
			display_val1 = parseFloat(sp[1].split("_")[1]);

			if (players_picked) {
				tot1 += display_val1;
			} else if (sp[2] === "true") {
				tot1 += display_val1;
				class1 += " clicked";	
			}
		}
		var tr = document.createElement("tr"); tr.className = "player_row";
		var td = document.createElement("td");
		td.className = class0;
		td.id = "0_{}".format(val0);
		td.innerText = "{} - {}".format(display_val0, name0);

		var td2 = document.createElement("td");
		td2.className = class1;
		td2.id = "1_{}".format(val1);
		td2.innerText = "{} - {}".format(display_val1, name1);

		tr.appendChild(td); tr.appendChild(td2);
		document.getElementById("table").appendChild(tr);
	}
	// black bar
	var tr = document.createElement("tr");
	var td = document.createElement("td");
	td.colSpan = "2";
	td.style = "background-color: black; opacity: .4;";
	tr.appendChild(td);
	document.getElementById("table").appendChild(tr);

	// total display
	var tr = document.createElement("tr");
	var td = document.createElement("td");
	td.id = "total0";
	td.innerText = tot0;

	var td2 = document.createElement("td");
	td2.id = "total1";
	td2.innerText = tot1;
	tr.appendChild(td);
	tr.appendChild(td2);
	document.getElementById("table").appendChild(tr);

	findBest();
}

function findBest() {
	var tot0 = parseFloat(document.getElementById("total0").innerText);
	var tot1 = parseFloat(document.getElementById("total1").innerText);
	var class0 = (tot0 >= tot1) ? "best" : "";
	var class1 = (tot1 >= tot0) ? "best" : "";
	document.getElementById("total0").className = class0;
	document.getElementById("total1").className = class1;
}

function resetTotal() {
	document.getElementById("total0").innerText = 0;
	document.getElementById("total1").innerText = 0;
}

function resetBtns() {
	var btns = document.getElementsByTagName("button");
	for (var i = 0; i < btns.length; ++i) {
		btns[i].className = "";
	}
}

var changeScoring = function() {
	var scoring_idx = parseInt(this.id);
	document.getElementById("scoring_idx").value = scoring_idx;

	resetBtns();
	this.className = "active";

	var rows = document.getElementsByClassName("player_row");
	var tot0 = 0, tot1 = 0;
	for (var i = 0; i < rows.length; ++i) {
		var tds = rows[i].getElementsByTagName("td");
		var sp0 = tds[0].id.split("_");
		var sp1 = tds[1].id.split("_");
		var val0 = 0, val1 = 0;

		if (sp0.length > 2) {
			var val0 = parseFloat(sp0[scoring_idx]);
			tds[0].innerText = val0 + " - " + tds[0].innerText.split(" - ")[1];
			if (players_picked) {
				tot0 += val0;
			} else {
				if ((" " + tds[0].className + " ").indexOf(" clicked ") > -1 ) {
					tot0 += val0;
				}
			}
		}
		if (sp1.length > 2) {
			var val1 = parseFloat(sp1[scoring_idx]);
			tds[1].innerText = val1 + " - " + tds[1].innerText.split(" - ")[1];
			if (players_picked) {
				tot1 += val1;
			} else {
				if ((" " + tds[1].className + " ").indexOf(" clicked ") > -1 ) {
					tot1 += val1;
				}
			}
		}
	}
	document.getElementById("total0").innerText = tot0;
	document.getElementById("total1").innerText = tot1;
	findBest();
}

var increment = function() {
	var team = parseInt(this.id.split("_")[0]);
	var scoring_idx = parseFloat(document.getElementById("scoring_idx").value);
	var val = parseFloat(this.id.split("_")[scoring_idx]);
	var total = document.getElementById("total"+team);

	if (document.getElementsByClassName("clicked").length === 0) {
		resetTotal();
	}

	if ( (" " + this.className + " ").indexOf(" clicked ") > -1 )  {
		// not clicked
		this.className = this.className.split(" ")[0];
		total.innerText = parseFloat(total.innerText) - val;
	} else {		
		this.className += " clicked";
		total.innerText = parseFloat(total.innerText) + val;
	}
	findBest();
}

function last_updated(date_str) {
	const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var week = date_str.split(",")[0];
	var date = new Date(date_str.split(",")[1]);
	var link = "#";
	if (date_str.split(",").length > 2) {
		link = date_str.split(",")[2];
	}
	var a = document.getElementById("updated").getElementsByTagName("span")[0].getElementsByTagName("a")[0];
	a.innerText = "Last Updated: Week {} ({} {})".format(week, monthNames[date.getMonth()], date.getDate() + 1);
	a.href = link;
}

function onGot(storage) {
	players_picked = storage["players_picked"];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			var j = JSON.parse(this.responseText);
			last_updated(j["updated"]);
			fillTable({...j, ...storage});
			var tds = document.getElementsByClassName("player_td");
			for (var i = 0; i < tds.length; ++i) {
				if (tds[i].innerText != " - ") {
					tds[i].addEventListener("click", increment, false);
				}
			}
		}
	};
	xhttp.open("GET", "https://zhecht.pythonanywhere.com/extension"+storage["args"]);
	xhttp.send();
}

function onError(error) {
	console.log("ERROR: "+error);
}

function onExecScript() {
	browser.storage.local.get().then(onGot, onError);
}

function onExecScriptErr(error) {
	console.log("ERROR: "+ error);
}

var players_picked = false;
browser.tabs.executeScript({file: "/content_scripts/main.js"}).then(onExecScript).catch(onExecScriptErr);

var btns = document.getElementsByTagName("button");
for (var i = 0; i < btns.length; ++i) {
	btns[i].addEventListener("click", changeScoring, false);
}
