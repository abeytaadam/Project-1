$(document).ready(function () {

	var $search = $('#search'),
			$genre = $('#genre-name'),
			$genreText = $('#genre-text');
			$genreDescription = $('#genre-description');
			$hide = $('#hide');

// Compile handlebars
	var source = $('#result-template').html(),
			template = Handlebars.compile(source);





	$search.on('keypress', function (event) {
		if (event.which == 13) {
			event.preventDefault();
			$hide.hide();
			var genreName = $genreText.val(),
					genreUrl = 'http://developer.echonest.com/api/v4/genre/profile?api_key=6SUIA2YM7GPJQQWZF&name=',
					genreBucket = '&bucket=description&bucket=urls;',
					artistUrl = 'http://developer.echonest.com/api/v4/genre/artists?api_key=6SUIA2YM7GPJQQWZF&format=json&results=10&bucket=hotttnesss&name=';

			$.get(genreUrl + genreName.toLowerCase() + genreBucket, function (data) {
				var genreData = data.response.genres;
				var html = template({
							genres: genreData
						});
				$genreDescription.append(html);
			});
			console.log(genreName);
			
			$.get(artistUrl + genreName.toLowerCase(), function (data) {
				var artistData = data.response.artists;
				var html = template({
							artists: artistData
						});
				$genreDescription.append(html);
			});
		}
	});


});