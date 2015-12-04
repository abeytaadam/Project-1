var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

var PlaylistSchema = new Schema({
			track: String
		});

var Playlist = mongoose.model('Playlist', PlaylistSchema);

module.exports = Playlist;