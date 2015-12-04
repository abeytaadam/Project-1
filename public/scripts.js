$(document).ready(function() {

	var $search = $('#search'),
		$genre = $('#genre-name'),
		$genreText = $('#genre-text'),
	$genreDescription = $('#genre-description'),
	$hide = $('#hide'),
	$hiddenError = $('#hiddenError'),
	$artpic = $('.artpic');

	// Compile handlebars
	var source = $('#result-template').html(),
		template = Handlebars.compile(source);

	Handlebars.registerHelper('grouped_each', function(every, context, options) {
		var out = "",
			subcontext = [],
			i;
		if (context && context.length > 0) {
			for (i = 0; i < context.length; i++) {
				if (i > 0 && i % every === 0) {
					out += options.fn(subcontext);
					subcontext = [];
				}
				subcontext.push(context[i]);
			}
			out += options.fn(subcontext);
		}
		return out;
	});

	function invalid(genreName) {
		return (genreName === null || genreName === "");
	}

	$('body').on('mouseenter', '.artpic', function () {
		console.log('hovering');
		$(this).css('max-height', '200px');
		$(this).css('position', 'absolute');
		$(this).css('z-index', '50');
	});

	$('body').on('mouseleave', '.artpic', function () {
		$(this).css('max-height', '40px');
		$(this).css('position', 'relative');
		$(this).css('z-index', '0');
	});

	$search.on('keypress', function(event) {
		if (event.which == 13) {
			event.preventDefault();
			var genreName = $genreText.val();
			if (invalid(genreName)) {
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