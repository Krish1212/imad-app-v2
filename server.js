var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');
//todo: use passport.js for better
//performance and security

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
	secret:'verySecretCookieValue',
	cookie:{maxAge: 1000 /*1 sec*/ * 60 /*1 min*/ * 60 /*1 hr*/ * 24 /*1 day*/ * 30 /*1 month*/ },
	resave:true,
	saveUninitialized:true
}));

var config = {
    user: 'krish1212',
    database:'krish1212',
    host:'db.imad.hasura-app.io',
    port:5432,
    password:'db-krish1212-81383'
};
var pool = new Pool(config);
app.get('/test-db',function(req,res){
    pool.query('SELECT * FROM test',function(err,result){
        if(err){
            res.status(500).send(err.toString());
        } else {
            res.send(JSON.stringify(result.rows));
        }
    });
});

function hash(input,salt){
    var hashed = crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return ["pbkdf2","10000", salt, hashed.toString('hex')].join('$');
}

app.post('/create-user',function(req,res){
    //assume we've already got the username and password from the UI
    var username = req.body.username;
    var password = req.body.password;
    if(username === ''  || password === '') {
    	res.status(500).send("Enter the valid credentials to proceed further");
    	return;
    }
    //sending the salt content along with the entered password
    var salt = crypto.randomBytes(128).toString('hex');
    //create the hashed password
    var dbString = hash(password,salt);
    //insert into the database
    pool.query("INSERT INTO users (username,password) VALUES ($1,$2)",[username,dbString],function(err,result){
	    if(err){
	        res.status(500).send(err.toString());
	    }else{
	        res.send("User created successfully: " + username);
	    }
    });
});

app.get('/hash/:input', function(req,res){
   var hashedString = hash(req.params.input,'my-own-string');
   res.send(hashedString);
});

// passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }), 

app.post('/login', function(req,res){
    //assume we've already got the username and password from the UI
    var username = req.body.username;
    var password = req.body.password;
    if(username === ''  || password === '') {
    	res.status(500).send("Enter the valid credentials to proceed further");
    	return;
    }
    pool.query("SELECT * FROM users WHERE username = $1",[username],function(err,result){
	    if(err){
	    	//if database connection is not found
	        res.status(500).send(err.toString());
	    }else if(result.rows.length === 0){
	        res.status(403);
	    } else {
	    	//match the password
	    	var dbString = result.rows[0].password;
	    	var salt = dbString.split('$')[2];
	    	var hashedPassword = hash(password,salt); //creating the hash based on the password submitted and salt
	    	if (hashedPassword === dbString){
	    		//get the user id from the result
	    		var uid = result.rows[0].id;
	    		//set a session
	    		req.session.auth = {userid: uid};
	    		//sets a cookie with a session id
	    		//internally in the server side, it maps the session id to an object
	    		//{auth:{userid:}}
	    		res.status(200).send({userid:uid});
	    	} else {
	    		res.status(403).send("Invalid credentials");
	    	}
	    }
    });
});

app.get('/check-login',function(req,res){
	if(req.session && req.session.auth && req.session.auth.userid){
		pool.query("SELECT * FROM users WHERE id=$1",[req.session.auth.userid],function(err,result){
			if(err){
				res.status(500).send(err.toString());
			}else{
				res.send(result.rows[0].username);
			}
		});
	}else{
		res.status(400).send("You are not logged in");
	}
});

app.get('/logout',function(req,res){
	delete req.session.auth;
	res.send("You are logged out!!");
});

app.post('/getArticles',function(req,res){
	var userid = req.body.userid;
	if(userid !== '' && userid === req.session.auth.userid){
		res.status(200).send("Articles being loaded");
	}else{
		res.status(500).send("User not logged in");
	}
});


function createTemplate (data) {
	var title = data['title'];
	var heading = data['heading'];
	var date = data['date'];
	var content = data['content'];
	var htmlTemplate = `
		<div>
			<a href="/">Home</a>
		</div>
		<hr>
		<h3>${heading}</h3>
		<div>${date.toDateString()}</div>
		<div>
			${content}
		</div>`;
	return htmlTemplate;
}
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

//Article database connected using pool connection
//Instead of using user parameter directly inside the query
//we should use the sql injection method ($1) for sequirity
app.get('/articles/:articleName', function(req, res) {
	if(req.session && req.session.auth && req.session.auth.userid){
		pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName], function(err,result){
		    if(err){
		        res.status(500).send(err.toString());
		    }else{
		        if(result.rows.length === 0){
		            res.status(404).send('Article not found');
		        }else{
		            var articleData = result.rows[0];
		            res.send(createTemplate(articleData));
		        }
		    }
		});
	}else{
		res.status(404).send("User not logged in");
	}
});
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
