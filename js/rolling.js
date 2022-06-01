var imgActual = 0;
let imagenes = [];
var newurl = '';
const urlbase = 'img/rolling/';

imagenes[0] = 'Bronze_2.jpg';
imagenes[1] = 'Common 1.jpg';
imagenes[2] = 'Bronze 1.jpg';
imagenes[3] = 'Common 2.jpg';
imagenes[4] = 'Bronze 2.jpg';
imagenes[5] = 'Common 6.jpg';
imagenes[6] = 'Bronze 3.jpg';
imagenes[7] = 'Gold.jpg';
imagenes[8] = 'Bronze 4.jpg';

$(document).ready(function() {
	const rollInterval = setInterval(function() {
		rollingImgs();
	}, 1500);
});

function rollingImgs() {
	imgActual++;
	if (imgActual >= 9) imgActual = 0;
	newurl = urlbase + imagenes[imgActual];
	$('#rolling_imgs').css('background-image', 'url(\''+newurl+'\')');
}