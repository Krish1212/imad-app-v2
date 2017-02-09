console.log('Loaded!');
var img = document.getElementById("madi");
var marginLeft = 0;
var button = document.getElementById("counter");
function moveRight(){
	marginLeft += 5;
	img.style.marginLeft = marginLeft + 'px';
}

img.onclick = function(){
	var interval = setInterval(moveRight,50);
	console.log('iam here');
}
button.onclick = function(){
	//create the request object
	var request = new XMLHttpRequest();
	//get the response
	request.onreadystateChange = function(){
		if(request.readyState === XMLHttpRequest.DONE){
			if(request.status === 200){
				var counter = request.responseText;
				var span = document.getElementById("count");
				span.innerHTML = counter.toString();				
			}
		}
	};
	//make the request
	request.open("GET","http://krish1212.imad.hasura-app.io/counter",true);
	request.send(null);
};