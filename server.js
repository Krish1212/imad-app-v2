var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');

var app = express();
app.use(morgan('combined'));
var counter = 0;

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
    var hashed = cyrpto.pbkdf2(input,salt,10000,512,'sha512');
    return hashed.toString('hex');
}

app.get('/hash/:input',function(req,res){
   var hashedString = hash(req.params.input,'my-own-string');
   res.send(hashedString);
});

app.get('/counter', function(req, res) {
	counter += 1;
	res.send(counter.toString());
});

function createTemplate (data) {
	var title = data['title'];
	var heading = data['heading'];
	var date = data['date'];
	var content = data['content'];
	var htmlTemplate = `
	<!DOCTYPE html>
	<html lang="en">
	<head>
	    <meta name="viewport" content="width=device-width initial-scale=1">
	    <link href="/ui/style.css" rel="stylesheet" />
		<title>${title}</title>
	</head>
	<body>
		<div class="container">
			<div>
				<a href="/">Home</a>
			</div>
			<hr>
			<h3>${heading}</h3>
			<div>${date.toDateString()}</div>
			<div>
				${content}
			</div>
		</div>
	</body>
	</html>`;
	return htmlTemplate;
}
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

//Article database connected using pool connection
//Instead of using user parameter directly inside the query
//we should use the sql injection method ($1) for sequirity
app.get('/articles/:articleName', function(req, res) {
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
	})

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
