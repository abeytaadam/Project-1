var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		GenreSchema = new Schema({
			description: String,
			genreName: String,
			artistNames: [String],
			urls: Object
		});

var Genre = mongoose.model('Genre', GenreSchema);

module.exports = Genre;