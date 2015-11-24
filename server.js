// Require node packages
var express = require('express'),
		bodyParser = require('body-parser'),
		mongoose = require('mongoose'),
		hbs = require('hbs');
		mongoose.connect('mongodb://localhost/genres');

var app = express();

//  Set up body-parser
app.use(bodyParser.urlencoded({extended : true}));

// Set up public static files
app.use(express.static(__dirname + '/public'));

// Set up hbs
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.get('/', function (req, res) {
	res.render('index');
});

// Server listening
var server = app.listen(process.env.PORT || 3000, function (){
	console.log('HEY! LISTEN!');
});