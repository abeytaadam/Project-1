$(document).ready(function () {

	var $search = $('#search'),
			$genre = $('#genre-name'),
			$genreText = $('#genre-text');
			$append = $('#append');

// Compile handlebars
	var source = $('#result-template').html(),
			template = Handlebars.compile(source);





	$search.on('keypress', function (event) {
		if (event.which == 13) {
			event.preventDefault();
			var genreName = $genreText.val(),
					url = 'http://developer.echonest.com/api/v4/genre/profile?api_key=6SUIA2YM7GPJQQWZF&name=',
					bucket = '&bucket=description&bucket=urls;';

			$.get(url + genreName + bucket, function (data) {
				console.log('DATA', data);
				var genreData = data.response.genres[0];
				console.log(genreData);
				var html = template({
							genres: genreData
						});
				$append.append(html);
			});
			console.log(genreName);
			

		}
	});


});