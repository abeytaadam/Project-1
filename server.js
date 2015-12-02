// Require node packages
var express = require('express'),
	bodyParser = require('body-parser'),
	request = require('request'),
	mongoose = require('mongoose'),
	hbs = require('hbs');

require('dotenv').load();

mongoose.connect(
	process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost/delve-app');


// Require genre model
var Genre = require('./models/genre');

var app = express();

//  Set up body-parser
app.use(bodyParser.urlencoded({
	extended: true
}));

// Set up public static files
app.use(express.static(__dirname + '/public'));

// Set up hbs
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

// Render index page
app.get('/', function(req, res) {
	res.render('index');
});

// Render error page
app.get('/error', function(req, res) {
	res.render('error');
});

// Get API items
app.get('/api/genres', function(req, res) {
	Genre.find(function(err, allGenres) {
		res.json({
			genres: allGenres
		});
	});
});

app.get('/api/genres/:name', function(req, res) {

	// Building urls
	var genreTitle = req.params.name,
		genreUrl = 'http://developer.echonest.com/api/v4/genre/profile?api_key=' + process.env.api_key + '&name=',
		genreBucket = '&bucket=description&bucket=urls;',
		artistUrl = 'http://developer.echonest.com/api/v4/genre/artists?api_key=' + process.env.api_key + '&format=json&results=15&bucket=hotttnesss&name=',
		playlistUrl = 'http://developer.echonest.com/api/v4/playlist/basic?api_key=' + process.env.api_key + '&genre=',
		playlistEnd = '&type=genre-radio&results=10&bucket=id:spotify&bucket=tracks&limit=true';

	// Simplifying urls
	var wholeGenreUrl = genreUrl + genreTitle.toLowerCase() + genreBucket,
		wholeArtistUrl = artistUrl + genreTitle.toLowerCase(),
		wholePlaylistUrl = playlistUrl + genreTitle.toLowerCase() + playlistEnd;

	var genreInfo = {};

	Genre.findOne({
		genreName: genreTitle.toLowerCase()
	}, function(err, foundGenre) {
		if (!foundGenre) {

			request(wholeGenreUrl, function(genreErr, genreRes, genreBody) {
				var genreData = JSON.parse(genreBody),
					genreMore = genreData.response.genres[0];

				request(wholePlaylistUrl, function(playlistErr, playlistRes, playlistBody) {
					var playlistData = JSON.parse(playlistBody);
					var playlistMore = playlistData.response.songs;
					var playlistItems = [];
					for (var j = 0; j < playlistMore.length; j++) {
						playlistItems[j] = playlistMore[j];
						var tracks = playlistMore[j].tracks[0].foreign_id;
						playlistItems[j] = tracks.slice(14);
					}

					request(wholeArtistUrl, function(artistErr, artistRes, artistBody) {
						var artistData = JSON.parse(artistBody);
						// console.log('artist body', artistBody);
						if (artistData.response.status.code === 5) {
							res.status(400).json({
								error: 'no such genre'
							});
						} else {
							var artistMore = artistData.response.artists;
							var artistNames = [];
							for (var i = 0; i < artistMore.length; i++) {
								artistNames[i] = artistMore[i].name;
							}

							// Building object to save to db
							genreInfo.genreName = genreMore.name;
							genreInfo.description = genreMore.description;
							genreInfo.urls = genreMore.urls;
							genreInfo.artistNames = artistNames;
							genreInfo.playlist = playlistItems;
							// console.log('Playlist', playlistItems[0]);
							console.log('GenreInfo', genreInfo);

							// Saving built object using genre model
							newGenre = new Genre(genreInfo);
							newGenre.save(function(err, savedGenre) {
								if (err) {
									console.error(err);
									return res.status(500).json({
										error: 'ERROR'
									});
								}
								res.json(savedGenre);
							});
						}
					});
				});
			});
		} else {
			res.json(foundGenre);
		}
	});
});


// Server listening
var server = app.listen(process.env.PORT || 3000, function() {
	console.log('HEY! LISTEN!');
});