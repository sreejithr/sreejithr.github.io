$(document).ready(function() {

var MobileTransformer = function() {
	var self = this;

	self.toggleDisplay = function(el) {
		if (el.css('display') !== 'none') {
	        el.hide();
	    } else {
	    	el.show();
	    }
	};

	self.toggleTheater = function(event) {
		var theaterId = "#" + event.currentTarget.getAttribute('id');
		var showtimes = $(theaterId).siblings('.showtimes');
		self.toggleDisplay(showtimes);
	};

	self.showFilters = function() {
		$('#filters-overlay').show();
		$('#left_nav').show();
	}

	self.hideFilters = function() {
		$('#filters-overlay').hide();
		$('#left_nav').hide();
	}

	self.initialize = function() {
		$('.showtimes').hide();
	};

	self.transform = function() {
		$('.desc').on('click', self.toggleTheater);
		$('#gb').removeAttr('style');
		$('#left_nav').hide();
		$('.gb_La').removeAttr('style');
		$('.gb_Ta').css('padding', '0px');

		// TODO
		$('#title_bar').append('<div id="filter-button"> <img id="filter-icon" src="filter.png"> Filter</div>');
//><object height='20px' width='20px' data='close.svg' type='image/svg+xml'>
		$('body').prepend("<div id='filters-overlay' style='display: none'><div id='filters-overlay-close-button'>X</div>");
		$('#filter-button').on('click', self.showFilters);
		$('#filters-overlay-close-button').on('click', self.hideFilters);
	};

	self.initialize();
};

var mq = window.matchMedia("screen and (max-width: 500px)");
if (mq.matches) {
	var mt = new MobileTransformer();
	mt.transform();
}

});