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
			var genreInfo = {};
			var genreName = $genreText.val();
			
			$.get('/api/genres/' + genreName, function (data) {
				console.log('ROUTE RESPONSE', data);
				var html = template({
							genre: data
						});
				$genreDescription.append(html);
			});
		}
	});


});