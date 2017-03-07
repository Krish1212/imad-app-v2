console.log('Loaded!');

var nregister = document.getElementById("register");
var nlogin = document.getElementById("login");
console.log(nregister);
//get the values of the input fields
var nuser,npass;
nlogin.onclick = function(){
	//create the request object
	var request = new XMLHttpRequest();
	//get the response
	request.onreadystateChange = function(){
		if(request.readyState === XMLHttpRequest.DONE){
			if(request.status === 200){
				console.log('User successfully logged');
				alert('User login successfull');
			} else if (request.status === 403){
				alert('Login credentials invalid');
			} else if (request.status === 500){
				alert('Unknown Error handling');
			}
		}
	};
	//get the users inputs
	nuser = document.getElementById("username").value;
	npass = document.getElementById("password").value;
	//make the request
	request.open("POST","http://krish1212.imad.hasura-app.io/login",true);
	request.setRequestHeader('Content-Type','application/json');
	request.send(JSON.stringify({username:nuser,password:npass}));
};
nregister.onclick = function(){
	//create the request object
	var request = new XMLHttpRequest();
	//get the response
	request.onreadystateChange = function(){
		if(request.readyState === XMLHttpRequest.DONE){
			if(request.status === 200){
				console.log('New user created');
				alert('New user created successfully');
			} else if (request.status === 403){
				alert('User creation forbidden');
			} else if (request.status === 500){
				alert('Unknown Error handling');
			}
		}
	};
	//get the users inputs
	nuser = document.getElementById("username").value;
	npass = document.getElementById("password").value;
	//make the request
	request.open("POST","http://krish1212.imad.hasura-app.io/create-user",true);
	request.setRequestHeader('Content-Type','application/json');
	request.send(JSON.stringify({username:nuser,password:npass}));
};

