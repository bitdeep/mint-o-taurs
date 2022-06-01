var timer = 0;
var imagenActual = 1;
var sliderXmin, sliderXmax;
var goupVisible = false;

// Debug, insertion of dummy taurs
var DummyTaurs = 0;

if (window.innerWidth > 640) {
	sliderXmin = '-100vw';
	sliderXmax = '100vw';
}
else {
	sliderXmin = '-300vw';
	sliderXmax = '300vw';
}

$(document).ready(function() {
	const interval = setInterval(function() {
		cambiarImagen();
	}, 3000);
	
	window.onresize = function(event) {
		if (window.innerWidth > 640) {
			sliderXmin = '-100vw';
			sliderXmax = '100vw';
		}
		else {
			sliderXmin = '-300vw';
			sliderXmax = '300vw';
		}
		CheckGoUp();
	};
	
	window.onscroll = function(event) {
		CheckGoUp();
	};
	
	// Insertion of dummy taurs, one by one
	/*const interval2 = setInterval(function() {
		TaurDummy();
	}, 500);*/
});

function cambiarImagen() {
	if (imagenActual == 1) {
		$('#slide1').css('left', sliderXmin);
		$('#slide2').css('left', '0');
		$('#slide4').css('z-index', '1');
		$('#slide4').css('left', sliderXmax);
		$('#slide3').css('z-index', '2');
		imagenActual = 2;
	}
	else if (imagenActual == 2) {
		$('#slide2').css('left', sliderXmin);
		$('#slide3').css('left', '0');
		$('#slide1').css('z-index', '1');
		$('#slide1').css('left', sliderXmax);
		$('#slide4').css('z-index', '2');
		imagenActual = 3;
	}
	else if (imagenActual == 3) {
		$('#slide3').css('left', sliderXmin);
		$('#slide4').css('left', '0');
		$('#slide2').css('z-index', '1');
		$('#slide2').css('left', sliderXmax);
		$('#slide1').css('z-index', '2');
		imagenActual = 4;
	}
	else if (imagenActual == 4) {
		$('#slide4').css('left', sliderXmin);
		$('#slide1').css('left', '0');
		$('#slide3').css('z-index', '1');
		$('#slide3').css('left', sliderXmax);
		$('#slide2').css('z-index', '2');
		imagenActual = 1;
	}
}

function CheckGoUp() {
	if ((window.scrollY > window.innerHeight) && (!goupVisible)) {
		$('#goup').css('display', 'block');
		goupVisible = true;
	}
	if ((window.scrollY <= window.innerHeight) && (goupVisible)) {
		$('#goup').css('display', 'none');
		goupVisible = false;
	}
}

function GoToTop() {
	document.body.scrollTop = document.documentElement.scrollTop = 0;
}


function PopUpClose() {
	$('#result_popup').remove();
}


// Debug only: insert taurs programmatically
function TaurDummy() {
	if (DummyTaurs < 20) {		
		InsertTaur('taurs/0.jpg', '2521');
		DummyTaurs++;
	}
}