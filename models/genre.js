var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		Artist = require('./artist'),
		Playlist = require('./playlist');

var	GenreSchema = new Schema({
			description: String,
			genreName: String,
			artists: [Artist.schema],
			playlist: [Playlist.schema],
			urls: Object
		});

var Genre = mongoose.model('Genre', GenreSchema);

module.exports = Genre;