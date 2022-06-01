var posBody, aux, pixelDensity, pixelsWidth, sliderMin, sliderMax, isMobile;

$(document).ready(function() {
	isMobile = 2; // 0 = desktop, 1 = mobile, 2 = no definido
	calcPixelDensity();
	resizeCheck();
	checkArrows();
	
	window.onresize = function(event) {
		calcPixelDensity();
		resizeCheck();
	};


	// TestAdd()
});

function resizeCheck() {
	if (window.innerWidth > 640) {
		// Desktop
		if (isMobile != 0) {
			isMobile = 0;
			sliderMin = '20vw';
			sliderMax = '36vw';
			resizeAll();
		}
	}
	else {
		// Mobile
		if (isMobile != 1) {
			isMobile = 1;
			sliderMin = '50vw';
			sliderMax = '90vw';
			resizeAll();
		}
	}
}

function resizeAll() {
	for (i = 0; i < myTaursTotal; i++) {
		if (i+1 == myTaursCurrent) {
			$('#slideritem' + myTaursCurrent).css('width', sliderMax);
			$('#slideritem' + myTaursCurrent).css('height', sliderMax);
		}
		else {
			aux = i + 1;
			$('#slideritem' + aux).css('width', sliderMin);
			$('#slideritem' + aux).css('height', sliderMin);
		}
	}
	reposBody();
}

function myPrevTaur() {
	if (myTaursCurrent > 1) {
		$('#slideritem' + myTaursCurrent).css('width', sliderMin);
		$('#slideritem' + myTaursCurrent).css('height', sliderMin);
		myTaursCurrent--;
		$('#infonumber').html(myTaursCurrent + ' out of ' + myTaursTotal + ' ');
		checkArrows();
		$('#slideritem' + myTaursCurrent).css('width', sliderMax);
		$('#slideritem' + myTaursCurrent).css('height', sliderMax);
		if (myTaursCurrent > 1) {
			// Si no es el primero, llevo a escala media al que tiene a su izquierda
			aux = myTaursCurrent-1;
			$('#slideritem' + aux).css('width', sliderMin);
			$('#slideritem' + aux).css('height', sliderMin);
		}
		reposBody();
		updateInfo();
	}
}

function myNextTaur() {
	if (myTaursCurrent < myTaursTotal) {
		$('#slideritem' + myTaursCurrent).css('width', sliderMin);
		$('#slideritem' + myTaursCurrent).css('height', sliderMin);
		myTaursCurrent++;
		$('#infonumber').html(myTaursCurrent + ' out of ' + myTaursTotal);
		checkArrows();
		$('#slideritem' + myTaursCurrent).css('width', sliderMax);
		$('#slideritem' + myTaursCurrent).css('height', sliderMax);
		if (myTaursCurrent < myTaursTotal) {
			// Si no es el último, llevo a escala media al que tiene a su derecha
			aux = myTaursCurrent+1;
			$('#slideritem' + aux).css('width', sliderMin);
			$('#slideritem' + aux).css('height', sliderMin);
		}
		reposBody();
		updateInfo();
	}
}

function checkArrows() {
	// Calculo si las flechas deben o no ser visibles
	if (myTaursCurrent < 2) {
		$('#sliderleft').css('opacity', '0');
		$('#sliderleftm').css('opacity', '0');
	} else {
		$('#sliderleft').css('opacity', '100');
		$('#sliderleftm').css('opacity', '100');
	}
	if (myTaursCurrent == myTaursTotal) {
		$('#sliderright').css('opacity', '0');
		$('#sliderrightm').css('opacity', '0');
	} else {
		$('#sliderright').css('opacity', '100');
		$('#sliderrightm').css('opacity', '100');
	}
}

function reposBody() {
	// if there's only one taur, position is different
	if (myTaursTotal != 1) {
		if (isMobile != 1) {
			posBody = (myTaursCurrent * -22) + 44 - (pixelDensity * (myTaursCurrent-1) * 4) + (pixelDensity * 4);
		}
		else {
			posBody = (myTaursCurrent * -52) + 52 - (pixelDensity * (myTaursCurrent-1) * 4) + (pixelDensity * 4);
		}
	}
	else {
		if (isMobile != 1) {
			posBody = 22 - (pixelDensity * (myTaursCurrent-1) * 4) + (pixelDensity * 4);
		}
		else {
			posBody = (pixelDensity * (myTaursCurrent-1) * 4) + (pixelDensity * 4);
		}
	}
	$('#sliderbody').css('left', posBody + 'vw');
}

function calcPixelDensity() {
	// Obtengo el tamaño de pantalla y lo uso para calcular la relación pixel-viewportwidth
	pixelDensity = 100 / window.innerWidth;
}

function updateInfo() {
	$('#skin').text(skins[myTaursCurrent-1]);
	$('#horns').text(horns[myTaursCurrent-1]);
	$('#collar').text(collars[myTaursCurrent-1]);
	$('#shirt').text(shirts[myTaursCurrent-1]);
	$('#background').text(backs[myTaursCurrent-1]);
	$('#hair').text(hairs[myTaursCurrent-1]);
	$('#eyes').text(eyes[myTaursCurrent-1]);
	$('#snout').text(snouts[myTaursCurrent-1]);
	$('#earring').text(earrings[myTaursCurrent-1]);
	$('#tatoo').text(tatoos[myTaursCurrent-1]);
	$('#id').text(id[myTaursCurrent-1]);
}

function myTaursAddTaur(taurRarity, taurImg, taurSkin, taurHorns, taurCollar, taurShirt, taurBack, taurHair, taurEyes, taurSnout, taurEarrings, taurTatoos, taurID) {
	myTaursTotal++;
	// If this is the first one to be added, update some values and erase "no taurs yet" message
	if (myTaursTotal == 1) {
		myTaursCurrent = 1;
		$('#notaursyet').remove();
	}
	// Push new values into arrays
	skins.push(taurSkin);
	horns.push(taurHorns);
	collars.push(taurCollar);
	shirts.push(taurShirt);
	backs.push(taurBack);
	hairs.push(taurHair);
	eyes.push(taurEyes);
	snouts.push(taurSnout);
	earrings.push(taurEarrings);
	tatoos.push(taurTatoos);
	id.push(taurID);
	// Update total counts
	if (taurRarity == "common") {
		count_common++;
		$('#count_common').html(count_common);
	}
	else if (taurRarity == "bronze") {
		count_bronze++;
		$('#count_bronze').html(count_bronze);
	}
	else if (taurRarity == "silver") {
		count_silver++;
		$('#count_silver').html(count_silver);
	}
	else if (taurRarity == "gold") {
		count_gold++;
		$('#count_gold').html(count_gold);
	}
	else if (taurRarity == "diamond") {
		count_diamond++;
		$('#count_diamond').html(count_diamond);
	}
	$('#count_total').html('Total: ' + myTaursTotal);
	// Add a slider module with the image
	var moduletxt = '<div class="slidermodule" id="slidermodule' + myTaursTotal + '">"';
	moduletxt += '<div class="slideritem" id="slideritem' + myTaursTotal + '" ';
	moduletxt += 'style="background-image: url(\'taurs/' + taurImg + '\'); ';
	// if this is the first item, then size must be 36vw, otherwise must be 20vw
	if (myTaursTotal == 1) {
		moduletxt += 'width: 36vw; height: 36vw"></div></div>';
	} else {
		moduletxt += 'width: 20vw; height: 20vw"></div></div>';
	}
	$('#sliderbody').append(moduletxt);
	// Update information section (only if it's the first item to be added)
	if (myTaursTotal == 1) {
		$('#skin').html(taurSkin);
		$('#horns').html(taurHorns);
		$('#collar').html(taurCollar);
		$('#shirt').html(taurShirt);
		$('#background').html(taurBack);
		$('#hair').html(taurHair);
		$('#eyes').html(taurEyes);
		$('#snout').html(taurSnout);
		$('#earring').html(taurEarrings);
		$('#tatoo').html(taurTatoos);
		$('#id').html(taurID);
		reposBody();
	}
	checkArrows();
}

function TestAdd() {

	console.log('')
	myTaursAddTaur('diamond', '1.jpg', 'Gold', 'Bull', 'Skull', 'Beach', 'Neon', 'Bare', 'Green', 'Light', 'Silver', 'Minotaur', '257');
}