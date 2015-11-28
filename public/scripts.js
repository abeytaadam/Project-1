$(document).ready(function () {

	var $search = $('#search'),
			$genre = $('#genre-name'),
			$genreText = $('#genre-text');
			$genreDescription = $('#genre-description');
			$hide = $('#hide');

// Compile handlebars
	var source = $('#result-template').html(),
			template = Handlebars.compile(source);

	// Store all get request info
	var genreInfo = {};


	$search.on('keypress', function (event) {
		if (event.which == 13) {
			event.preventDefault();
			$hide.hide();
			var genreName = $genreText.val(),
					genreUrl = 'http://developer.echonest.com/api/v4/genre/profile?api_key=6SUIA2YM7GPJQQWZF&name=',
					genreBucket = '&bucket=description&bucket=urls;',
					artistUrl = 'http://developer.echonest.com/api/v4/genre/artists?api_key=6SUIA2YM7GPJQQWZF&format=json&results=10&bucket=hotttnesss&name=';

			$.get(genreUrl + genreName.toLowerCase() + genreBucket, function (data) {
				var genreData = data.response.genres[0];
				genreInfo.genreName = genreData.name;
				genreInfo.description = genreData.description;
				genreInfo.urls = genreData.urls;
				console.log('GENREINFO', genreInfo);
				var html = template({
							genres: genreData
						});
				$genreDescription.append(html);
			});
			console.log(genreName);
			
			$.get(artistUrl + genreName.toLowerCase(), function (data) {
				var artistData = data.response.artists;
				var artistNames = [];
				for (var i = 0; i < artistData.length; i++){
					artistNames[i] = artistData[i].name;
				}
				genreInfo.artistNames = artistNames;
				var html = template({
							artists: artistData
						});
				$genreDescription.append(html);
			});
		}
	});


});