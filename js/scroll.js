$(document).ready(function() {
	/* Inicializo */
	chequearVisibles();
	var cabezal_desplegado = false;
	
    /* Every time the window is scrolled ... */
    $(window).scroll(function() {
        /* Check the location of each desired element */
        chequearVisibles();
		// Chequeo si debo mostrar el cabezal sólido
		var scrolltop = $(window).scrollTop();
		if ((scrolltop > 400) && (!cabezal_desplegado)) {
			cabezal_desplegado = true;
			$('#fixedmobile').css('opacity', 100);
			$('#fixeddesktop').css('opacity', 100);
		}
		else if ((scrolltop <= 400) && (cabezal_desplegado)) {
			cabezal_desplegado = false;
			$('#fixedmobile').css('opacity', 0);
			$('#fixeddesktop').css('opacity', 0);
		}
		// Cuando scrollea cierro el menú mobile si está abierto
		if (menu_desplegado) {
  			colapsarMenu();
  		}
    });
	
	/* Cuando la pantalla cambia de tamaño */
	/*window.onresize = function(event) {
	};*/
});

function chequearVisibles() {
	$('.oculto').each(function(i) {
        //var bottom_of_object = $(this).offset().top + $(this).outerHeight();
		var bottom_of_object = $(this).offset().top;
        var bottom_of_window = $(window).scrollTop() + $(window).height();
        /* If the object is completely visible in the window, fade it in */
        if (bottom_of_window > bottom_of_object) {
            $(this).animate({'opacity':'1'},1000);
			// Le saco la clase para que no vuelva a pasar por el obj en un siguiente each
			$(this).removeClass('oculto');
        }
    });
}