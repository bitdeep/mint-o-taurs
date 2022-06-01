$(document).ready(function() {
	$(window).scroll(function() {
        $('#soonsign').css('display', 'none');
    });
});

function commingSoon(e) {
	e.preventDefault();
	
	var x, y, sx, sy;
	
	if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
		var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
		var touch = evt.touches[0] || evt.changedTouches[0];
		x = touch.pageX;
		y = touch.pageY;
	} else if (e.type == 'click' || e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
		x = e.clientX;
		y = e.clientY;
	}
	
	sx = window.innerWidth - x + 'px';
	sy = y + 40 + 'px';
	
	$('#soonsign').css('right', sx);
	$('#soonsign').css('top', sy);
	$('#soonsign').css('display', 'block');
	
	const rollInterval = setInterval(function() {
		quitarComming();
	}, 3000);
}

function quitarComming() {
	$('#soonsign').css('display', 'none');
}