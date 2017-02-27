var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var app = express();
app.use(morgan('combined'));
var counter = 0;

var config = {
    user: 'krish1212',
    database:'krish1212',
    host:'db.imad.hasura-app.io',
    port:5432,
    password:process.env.DB_PASSWORD
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

app.get('/counter', function(req, res) {
	counter += 1;
	res.send(counter.toString());
});

var articles = {
	'article-one' : {
		'title' : 'Article One | Modern App',
		'heading' : 'Article One',
		'date' : 'Yesterday',
		'content' : `
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia temporibus voluptas aperiam, quos voluptate quidem earum ex nihil deleniti labore sapiente vitae harum possimus impedit nulla suscipit cumque, accusantium reiciendis.</p>`
	},
	'article-two' : {
		'title' : 'Article Two | Modern App',
		'heading' : 'Article Two',
		'date' : 'Today',
		'content' : `
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia temporibus voluptas aperiam, quos voluptate quidem earum ex nihil deleniti labore sapiente vitae harum possimus impedit nulla suscipit cumque, accusantium reiciendis.</p>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia temporibus voluptas aperiam, quos voluptate quidem earum ex nihil deleniti labore sapiente vitae harum possimus impedit nulla suscipit cumque, accusantium reiciendis.</p>`
	},
	'article-three' : {
		'title' : 'Article Three | Modern App',
		'heading' : 'Article Three',
		'date' : 'Tomorrow',
		'content' : `
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia temporibus voluptas aperiam, quos voluptate quidem earum ex nihil deleniti labore sapiente vitae harum possimus impedit nulla suscipit cumque, accusantium reiciendis.</p>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia temporibus voluptas aperiam, quos voluptate quidem earum ex nihil deleniti labore sapiente vitae harum possimus impedit nulla suscipit cumque, accusantium reiciendis.</p>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia temporibus voluptas aperiam, quos voluptate quidem earum ex nihil deleniti labore sapiente vitae harum possimus impedit nulla suscipit cumque, accusantium reiciendis.</p>`		
	}
};
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
			<div>${date}</div>
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

app.get('/:articleName', function(req, res) {
	var articleName = req.params.articleName;
	res.send(createTemplate(articles[articleName]));
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
