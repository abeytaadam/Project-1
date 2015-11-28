// Require node packages
var express = require('express'),
		bodyParser = require('body-parser'),
		mongoose = require('mongoose'),
		hbs = require('hbs');
		mongoose.connect('mongodb://localhost/genres');

// Require genre model
var Genre = require('./models/genre');

var app = express();

//  Set up body-parser
app.use(bodyParser.urlencoded({extended : true}));

// Set up public static files
app.use(express.static(__dirname + '/public'));

// Set up hbs
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

// Render index page
app.get('/', function (req, res) {
	res.render('index');
});

// // GET full genre info
// app.get('/', function (req, res) {
// 		var newGenre = new Genre(req.body);
// });

// Render search results page
app.get('/results', function (req, res) {
	res.render('results');
});

// Server listening
var server = app.listen(process.env.PORT || 3000, function (){
	console.log('HEY! LISTEN!');
});