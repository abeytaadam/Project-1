// Require node packages
var express = require('express'),
		bodyParser = require('body-parser'),
		mongoose = require('mongoose'),
		hbs = require('hbs');
		mongoose.connect('mongodb://localhost/delve-app');

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

// app.get('/api/genres', function (res, req) {
// 	Genre.find(function (err, allGenres))
// });

app.get('/api/genres/:name', function (req, res) {
	var name = req.params.name;
	console.log(name);
	Genre.find({genreName:name}, function (err, foundGenre) {
		console.log('foundGenre', foundGenre);

		res.json(foundGenre);
	});
});

// Render search results page
app.get('/results', function (req, res) {
	res.render('results');
});

// Server listening
var server = app.listen(process.env.PORT || 3000, function (){
	console.log('HEY! LISTEN!');
});