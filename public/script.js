/* sources:
 * https://www.sitepoint.com/beginners-guide-to-javascript-date-and-time/
 * https://piazza.com/class/imb3pkt1msem5?cid=317
 * https://piazza.com/class/imb3pkt1msem5?cid=341
 */

document.addEventListener('DOMContentLoaded', bindButton);

//binding form's submit button to ajax insert request 
function bindButton(){
	document.getElementById('submit').addEventListener('click', function(event){

		//inserting data into database
		var payload = {};
	    payload.name = document.getElementById('name').value;
	    payload.reps = document.getElementById('reps').value;
	    payload.weight = document.getElementById('weight').value;
	    payload.lbs = document.getElementById('lbs').value;
	    payload.date = document.getElementById('date').value;

		var req = new XMLHttpRequest();
		req.open('GET', '/insert?name=' + payload.name + '&reps=' + payload.reps + '&weight=' + payload.weight + '&lbs=' + payload.lbs + '&date=' + payload.date, true);
		req.addEventListener('load', function(){
			if(req.status >= 200 && req.status < 400){
				getTable();
			} else {
				console.log("Error in network request: " + req.statusText);
			}
		});
		req.send(null);
		event.preventDefault();
	});
}

//getting data from database
function getTable(){
	var req2 = new XMLHttpRequest();
	req2.open('GET', '/select', true);
	req2.addEventListener('load', function(){
		if(req2.status >= 200 && req2.status < 400){
			var response = JSON.parse(req2.responseText);
							
			//clear table off old values
			var tbody = document.getElementById("tbody");
			while (tbody.firstChild){
				tbody.removeChild(tbody.firstChild);
			}
			tbody = document.getElementById("tbody");

			//assemble table
			for (var i = 0; i < response.length; i++){
				var tr = document.createElement("tr");

				//name
				var td = document.createElement("td");
				td.textContent = response[i].name;
				tr.appendChild(td);

				//reps
				var td = document.createElement("td");
				td.textContent = response[i].reps;
				tr.appendChild(td);

				//weight
				var td = document.createElement("td");
				td.textContent = response[i].weight;
				tr.appendChild(td);

				//lbs
				var td = document.createElement("td");
				if (response[i].lbs == 1){
					td.textContent = "lbs";
				} else {
					td.textContent = "kg";
				}
				tr.appendChild(td);

				//date
				var td = document.createElement("td");
				var dateValue = new Date(response[i].date);
				var format = "MMM DD, YYYY";
				var result = dateConvert(dateValue, format);
				td.textContent = result;
				tr.appendChild(td);

				//edit
				var editButton = document.createElement("input");
				editButton.setAttribute("type", "button");
				editButton.value = "Edit";
				editButton.id = response[i].id;
				editButton.addEventListener('click', function(event){
					window.location = "/edit?id=" + editButton.id;
				});
				tr.appendChild(editButton);

				//delete
				var deleteButton = document.createElement("input");
				deleteButton.setAttribute("type", "button");
				deleteButton.value = "Delete";
				deleteButton.id = response[i].id;
				deleteButton.setAttribute("onclick", "deleteRow(this)");
				tr.appendChild(deleteButton);

				tbody.appendChild(tr);
				//console.log('Finished adding row' + i);
			}
		} else {
			console.log("Error in network request: " + req2.statusText);
		}
	});
	req2.send(null);
	event.preventDefault();
}

//deleting workout
function deleteRow(deleteButton){
	var payload = {};
	payload.id = deleteButton.id;
	var req3 = new XMLHttpRequest();
	req3.open('GET', '/delete?id=' + payload.id, true);
	req3.addEventListener('load', function(){
		if(req3.status >= 200 && req3.status < 400){
			//console.log('deleting id #' + payload.id + 'success!');
			getTable();
		} else {
			console.log("Error in network request: " + req3.statusText);
		}
	});
	req3.send(null);
	event.preventDefault();
}
/*
//editing workout
function editRow(editButton){
	var payload = {};
	payload.id = editButton.id;
	var req4 = new XMLHttpRequest();
	req4.open('GET', '/edit?id=' + payload.id, true);
	req4.addEventListener('load', function(){
		if(req4.status >= 200 && req4.status < 400){
			//console.log('editing id #' + payload.id + 'success!');

		} else {
			console.log("Error in network request: " + req4.statusText);
		}
	});
	req4.send(null);
	event.preventDefault();
}
*/

//formatting date
function dateConvert(dateobj, format){
	var year = dateobj.getFullYear();
	var month= ("0" + (dateobj.getMonth()+1)).slice(-2);
	var date = ("0" + (dateobj.getDate()+1)).slice(-2);
	var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var converted_date = "";
	converted_date = months[parseInt(month)-1] + " " + date + ", " + year;
	return converted_date;
}

