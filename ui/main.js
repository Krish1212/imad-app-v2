console.log('Loaded!');
//store the userid value here for future use
var sessionvar = {};
//HTML for login form - loads when document loads
var loginForm = `
<div id="loginHere">
	<h3>Login for more fun!!</h3>
	<input type="text" id="username" placeholder="username" required>
    <input type="password" id="password" required><br/>
    <input type="submit" value="Login" id="login">
    <input type="submit" value="Register" id="register">
</div>`;
var ncontent = document.getElementById("contents");
ncontent.innerHTML = loginForm;
//HTML for articles loads after user logs in
var articles = `
<div id="article-list">
</div>
<div id="article-content">
</div>`;
var nartlist = document.getElementById("article-list");
var nartcontent = document.getElementById("article-content");
var nregister = document.getElementById("register");
var nlogin = document.getElementById("login");
console.log(nregister);
//get the values of the input fields
var nuser,npass;
nlogin.onclick = function(){
	//create the request object
	var request = new XMLHttpRequest();
	//get the response
	request.onreadystatechange = function(){
		if(request.readyState === XMLHttpRequest.DONE){
			if(request.status === 200){
				console.log('User successfully logged');
				alert('User login successfull');
				console.log(request.responseURL);
				nlogin.value = "Login";
				sessionvar = JSON.parse(this.response);
				console.log(sessionvar.userid);
				ncontent.innerHTML = articles;
				getArticles();
			} else if (request.status === 403){
				alert('Login credentials invalid');
				nlogin.value = "Login";
			} else if (request.status === 500){
				nlogin.value = "Login";
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
	nlogin.value = "Loggin In...";
	nlogin.disabled = true;
};
nregister.onclick = function(){
	//create the request object
	var request = new XMLHttpRequest();
	//get the response
	request.onreadystatechange = function(){
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

function getArticles(){
	var request = new XMLHttpRequest();
	request.onreadystatechange = function(){
		if(request.readyState === XMLHttpRequest.DONE){
			if(request.status === 200){
				console.log("Articles loaded");
				var articleList = this.responseText;
				if(articleList && articleList != '') {
					alert(articleList);
					nartlist.innerHTML = articleList;
				}
			}else{
				console.log("No articles loaded");
			}
		}else {
			console.log("Unknown error handling");
		}
	}
	//make the request
	request.open("POST","/getArticles",true);
	request.setRequestHeader('Content-Type','application/json');
	request.send(JSON.stringify(sessionvar));
}