$(document).ready(function() {

	var $search = $('#search'),
		$genre = $('#genre-name'),
		$genreText = $('#genre-text');
	$genreDescription = $('#genre-description');
	$hide = $('#hide');
	$hiddenError = $('#hiddenError');

	// Compile handlebars
	var source = $('#result-template').html(),
		template = Handlebars.compile(source);

	function invalid (genreName) {
		return (genreName === null || genreName === "");
	}

	$search.on('keypress', function(event) {
		if (event.which == 13) {
			event.preventDefault();
			var genreName = $genreText.val();
			if(invalid(genreName)){
				console.error("Invalid");
				return;
			}
			$hide.hide();
			$.ajax({
				method: 'GET',
				url: '/api/genres/' + genreName,

				beforeSend: function() {
					$genreDescription.html("<img id='loadGif' src='images/loading.gif'>");
				},

				success: function(data) {
					$genreDescription.empty();
					console.log('Data', data);
					var html = template({
						genre: data
					});
					console.log(data);
					$genreDescription.append(html);
				},

				error: function(data) {
					console.log("ERROR");
					$genreDescription.empty();
					$genreDescription.append('<div class="error"><br><br>You must be on another level...<br>No such genre found<br><div class="col-md-2 glyphicon glyphicon-arrow-right"></div><a href="/" class="col-md-4 tryAgain">DELVE ON</a></div>');
					// $hiddenError.css('display','block');
				}
			});
		}
	});


});