var activeAnswer = 0;
var objeto = '';

function toggleAnswer(number) {
	if (activeAnswer > 0) {
		// Comienzo cerrando la respuesta que se encuentra abierta
		objeto = '#FAQ_answer' + activeAnswer;
		$(objeto).css('height', '0');
		objeto = '#FAQ_arrow' + activeAnswer;
		$(objeto).css('transform', 'rotate(0deg)');
		if (activeAnswer != number) {
			// Si se hizo click en una que no estaba activa, la abro
			openAnswer(number);
		}
		else {
			// Quedan todas cerradas
			activeAnswer = 0;
		}
	}
	else {
		// Abro la respuesta elegida
		openAnswer(number);
	}
}

function openAnswer(number) {
	objeto = '#FAQ_answer' + number;
	$(objeto).css('height', 'auto');
	activeAnswer = number;
	objeto = '#FAQ_arrow' + number;
	$(objeto).css('transform', 'rotate(90deg)');
}