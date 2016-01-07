// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require jquery-readyselector
//= require turbolinks
//= require jquery.svg.js

//= require bootstrap-sprockets

function getUrlParameter(sParam)
{
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for (var i = 0; i < sURLVariables.length; i++) 
	{
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam) 
		{
			return sParameterName[1];
		}
	}
}

jQuery.ajaxSetup({
	'beforeSend': function(xhr) {
		//xhr.setRequestHeader('Content-Type', 'application/javascript');
		//xhr.setRequestHeader('Accept', 'application/javascript');
	}
})

$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);

formActionGetterCallback = function() {
	var form = $(this).parent('form');
	return form.attr('action');
}

jQuery.fn.submitWithAjax = function(actionGetterCallback, type, method) {

	this.click(function(event) {
		event.preventDefault();

		alert(typeof actionGetterCallback);

		var action = actionGetterCallback();

		$.ajax({
			url: action,
			type: type,
			data: { _method: method },
			dataType: 'script'
		});
		return false;
	})
}

jQuery.fn.removeWithFadeOut = function()
{
	$(this).fadeOut(500, function() {
		$(this).remove();
	});
}