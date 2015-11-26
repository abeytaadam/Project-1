$(document).ready(function () {

	var $search = $('#search'),
			$genre = $('#genre-name'),
			$genreText = $('#genre-text');


	$genreText.on('keypress', function (event) {
		if (event.which == 13) {
			$search.submit();
		
		var genreName = $genreText.val();
		// 		url = 'http://developer.echonest.com/api/v4/genre/profile?api_key=6SUIA2YM7GPJQQWZF&name=';
		console.log(genreName);
		}
	});


});