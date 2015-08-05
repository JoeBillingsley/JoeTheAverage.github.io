/// <reference path="../typings/jquery/jquery.d.ts"/>
$(document).ready(function () {

	$('#people-quotes').owlCarousel({
		navigation: true,
		slideSpeed: 300,
		paginationSpeed: 400,
		items: 3
	});

	$('form').submit(function (event) {

		var base64_email = 'amNiQGpvc2VwaGJpbGxpbmdzbGV5LmNvLnVr';
		var base_url = '//forms.brace.io/';
		var action = base_url + atob(base64_email);

		alert(action);
		alert($('input[name=name]').val());
		
		$.ajax({
			url: action,
			method: "POST",
			data: {
				message: $('input[name=name]').val()
			},
			dataType: "json"
		});

		event.preventDefault();
	});
});