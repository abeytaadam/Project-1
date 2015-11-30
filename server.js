// Require node packages
var express = require('express'),
		bodyParser = require('body-parser'),
		request = require('request'),
		mongoose = require('mongoose'),
		hbs = require('hbs'),
		dotenv = require('dotenv').load();
		mongoose.connect(
			process.env.MONGOLAB_URI || 
			process.env.MONGOHQ_URL || 
			'mongodb://localhost/delve-app');


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
	var genreName = req.params.name,
			genreUrl = 'http://developer.echonest.com/api/v4/genre/profile?api_key=' + process.env.api_key + '&name=',
			genreBucket = '&bucket=description&bucket=urls;',
			artistUrl = 'http://developer.echonest.com/api/v4/genre/artists?api_key=' + process.env.api_key + '&format=json&results=10&bucket=hotttnesss&name=';
	var genreInfo = {};

	// Genre.find({genreName:genreName}, function (err, foundGenre) {
	// 	console.log('foundGenre', foundGenre);
	// 		if (foundGenre === []) {
				request(genreUrl + genreName.toLowerCase() + genreBucket, function (error, res, genreBody) {
					var genreData = JSON.parse(genreBody),
							genreMore = genreData.response.genres[0];
					
					request(artistUrl + genreName.toLowerCase(), function (error, res, artistBody){
						var artistData = JSON.parse(artistBody),
							artistMore = artistData.response.artists;
						artistNames = [];
						for (var i = 0; i < artistMore.length; i++){
							artistNames[i] = artistMore[i].name;
						}
						
					genreInfo.name = genreMore.name;
					genreInfo.description = genreMore.description;
					genreInfo.artistNames = artistNames;
					console.log(genreInfo);
					});
					
				});
				// console.log(genreInfo);
				// request(artistUrl + genreName.toLowerCase()).pipe(res);
				// console.log('RESPONSE',res);
			// }
	// 	console.log(foundGenre);
	// 	res.json(foundGenre);
	// });
});

// Render search results page
app.get('/results', function (req, res) {
	res.render('results');
});

// Server listening
var server = app.listen(process.env.PORT || 3000, function (){
	console.log('HEY! LISTEN!');
});