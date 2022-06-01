var menu_desplegado = false;
$(document).ready(function() {
	// Menu desplegable
	$('#hamburguesa1').click(function() {
		if (!menu_desplegado) {
			menu_desplegado = true;
			$('#menu_mobile').css('top', '0');
  		}
	});
	$('#hamburguesa2').click(function() {
		if (!menu_desplegado) {
			menu_desplegado = true;
			$('#menu_mobile').css('top', '0');
  		}
	});
	$('#cerrar').click(function() {
		if (menu_desplegado) {
  			colapsarMenu();
  		}
	});	
});

function colapsarMenu() {
	menu_desplegado = false;
	$('#menu_mobile').css('top', '-100vh');
}