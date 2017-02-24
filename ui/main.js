console.log('Loaded!');

var button = document.getElementById("counter");
var span = document.getElementById("count");

button.onclick = function(){
	//create the request object
	var request = new XMLHttpRequest();
	//get the response
	request.onreadystateChange = function(){
		if(request.readyState === XMLHttpRequest.DONE){
			if(request.status === 200){
				var counter = request.responseText;
				span.innerHTML = counter;
			}
		}
	};
	//make the request
	request.open("GET","http://localhost:8080/counter",true);
	request.send(null);
};