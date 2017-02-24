console.log('Loaded!');

var xbutton = document.getElementById("counter");
var xspan = document.getElementById("count");
var xcounter;
xbutton.onclick = function(){
	//create the request object
	var request = new XMLHttpRequest();
	//get the response
	request.onreadystateChange = function(){
		if(request.readyState === XMLHttpRequest.DONE){
			if(request.status === 200){
				xcounter = request.responseText;
				xspan.innerHTML = counter;
			}
		}
	};
	//make the request
	request.open("GET","http://localhost:8080/counter",true);
	request.send(null);
};