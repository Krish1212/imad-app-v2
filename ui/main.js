console.log('Loaded!');

var button = document.getElementById("counter");

button.onclick = function(){
	//create the request object
	var request = new XMLHttpRequest();
	//get the response
	request.onreadystateChange = function(){
		if(request.readyState === XMLHttpRequest.DONE){
			if(request.status === 200){
				var counter = request.responseText;
				var span = document.getElementById("count");
				alert(counter);
				span.innerHTML = counter.toString();				
			}
		}
	};
	//make the request
	request.open("GET","http://krish1212.imad.hasura-app.io/counter",true);
	request.send(null);
};