var CrossFadeEstado = 1;

$(document).ready(function() {
	CrossFade();
	const rollInterval = setInterval(function() {
		CrossFade();
	}, 3000);
});

function CrossFade() {
	if (CrossFadeEstado == 1) {
		CrossFadeEstado = 0;
		$('#crossfade1').css('opacity', '100');
		$('#crossfade2').css('opacity', '0');
	}
	else {
		CrossFadeEstado = 1;
		$('#crossfade1').css('opacity', '0');
		$('#crossfade2').css('opacity', '100');
	}
}