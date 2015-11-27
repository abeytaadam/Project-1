var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		GenreSchema = new Schema({
			description: String,
			name: String,
			urls: Object
		});