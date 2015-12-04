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
var Genre = require('./models/genre'),
	Artist = require('./models/artist'),
	Playlist = require('./models/playlist');

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
		artistUrl = 'http://developer.echonest.com/api/v4/genre/artists?api_key=' + process.env.api_key + '&format=json&results=15&name=',
		artistBucket = '&bucket=hotttnesss&bucket=familiarity&bucket=id:spotify',
		playlistUrl = 'http://developer.echonest.com/api/v4/playlist/basic?api_key=' + process.env.api_key + '&genre=',
		playlistBucket = '&type=genre-radio&results=10&bucket=id:spotify&bucket=tracks&limit=true',

		spotifyImageUrl = 'https://api.spotify.com/v1/artists/?ids=';

	// Simplifying urls
	var wholeGenreUrl = genreUrl + genreTitle.toLowerCase() + genreBucket,
		wholeArtistUrl = artistUrl + genreTitle.toLowerCase() + artistBucket,
		wholePlaylistUrl = playlistUrl + genreTitle.toLowerCase() + playlistBucket;



	Genre.findOne({
		genreName: genreTitle.toLowerCase()
	}, function(err, foundGenre) {
		if (!foundGenre) {

			request(wholeGenreUrl, function(genreErr, genreRes, genreBody) {
				var genreData = JSON.parse(genreBody),
					genreMore = genreData.response.genres[0];

				// console.log('GENRE BODY', genreBody);

				request(wholePlaylistUrl, function(playlistErr, playlistRes, playlistBody) {
					var playlistData = JSON.parse(playlistBody);
					// console.log('PLAYLIST DATA : ', playlistData.response.songs);
					if (playlistData.response.status.code === 5) {
						res.status(400).json({
							error: 'no such genre playlist'
						});
						return;
					} else {
						var playlistMore = playlistData.response.songs;
						var playlistTracks = playlistMore.map(function(track) {
							var tracks = track.tracks[0].foreign_id.slice(14);
							return new Playlist({
								track: tracks
							});
						});
					}

					request(wholeArtistUrl, function(artistErr, artistRes, artistBody) {
						var artistData = JSON.parse(artistBody);
						// console.log('ARTIST DATA :', artistData.response);
						if (artistData.response.status.code === 5) {
							res.status(400).json({
								error: 'no such genre artist'
							});
						} else {
							var artistIds = [];
							var artistMore = artistData.response.artists;
							var artistsStuff = artistMore.map(function(artist) {
								var artistId = artist.foreign_ids[0].foreign_id.slice(15);
								artistIds.push(artistId);
							});


							request(spotifyImageUrl + artistIds.join(','), function(spotifyErr, spotifyRes, spotifyBody) {
								var spotifyArtistData = JSON.parse(spotifyBody);
								var spotifyArtistMore = spotifyArtistData.artists;
								var artists = spotifyArtistMore.map(function(spotArtists) {
									var url;
									if (spotArtists.images[0]) {
										url = spotArtists.images[0].url;
									} else {
										url = 'http://www.thewoodjoynt.com/Content/Images/Products/NoImageAvailable.jpg';
									}
									return new Artist({
										name: spotArtists.name,
										imageUrl: url
									});
								});


								var genreInfo = {};
								genreInfo.genreName = genreMore.name;
								genreInfo.description = genreMore.description;
								genreInfo.urls = genreMore.urls;
								genreInfo.artists = artists;
								genreInfo.playlist = playlistTracks;
								// console.log('Playlist', playlistItems[0]);
								// console.log('GenreInfo', genreInfo);

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