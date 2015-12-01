$(document).ready(function () {

	var $search = $('#search'),
			$genre = $('#genre-name'),
			$genreText = $('#genre-text');
			$genreDescription = $('#genre-description');
			$hide = $('#hide');
			$hiddenError = $('#hiddenError');

// Compile handlebars
	var source = $('#result-template').html(),
			template = Handlebars.compile(source);


	$search.on('keypress', function (event) {
		if (event.which == 13) {
			event.preventDefault();
			$hide.hide();
			var genreName = $genreText.val();
			
			$.ajax({
				method: 'GET',
				url:'/api/genres/' + genreName, 
				
				beforeSend: function() {
    			$genreDescription.html("<img id='loadGif' src='images/loading.gif'>");
  			},
				
				success: function (data) {
					$genreDescription.empty();
						var html = template({
									genre: data
								});
						$genreDescription.append(html);
				},

				error: function (data) {
					console.log("ERROR");
					$genreDescription.empty();
					$genreDescription.append('<div class="error"><br><br>You must be on another level...<br>No such genre found</div>');
					// $hiddenError.css('display','block');
				}
			});
		}
	});


});