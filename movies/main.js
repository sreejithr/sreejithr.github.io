$(document).ready(function() {

var custom_styles = "@media screen and (max-width: 500px) {body { margin: 0px; } .gb_Ta { padding: 0px; } #left_nav { display: none } #results { border-bottom: 1px solid #E0E0E0; min-width: 0px; margin-left: 0px; padding: 0px 10px; } #results > table { display: none; } .theater { border-top: 1px solid #E0E0E0; border-radius: 5px; box-shadow: 3px -7px 20px -7px #E0E0E0; } .desc { border-left: 1px solid #E0E0E0; border-right: 1px solid #E0E0E0; padding: 10px; } #left_nav { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); border: none; width: 13.4em; color: white; z-index: 1000; } #left_nav .section { margin-top: 25px; font-size: 0.8em; font-family: 'Helvetica Neue'; font-weight: 200; } #left_nav a { color: white; text-decoration: none; } #filters-overlay { color: white; } #filters-overlay-close-button { position: absolute; top: 0px; right: 0px; font-size: 30px; padding: 10px; } #gb { min-width: 0px; } /* Search area */ .gb_R.gb_pd { width: 95vw; } #gbq2 { padding-left: 10px; padding-top: 10px; } /* Search input */ #gbqfqw { height: 40px; } #gbqfq { height: 31px; } /* Search button */ #gbqfb { height: 40px; } /* Notification & User */ .gb_La.gb_oe.gb_R.gb_ne.gb_T { padding-right: 10px; padding-left: 10px; } /* Notifications */ .gb_Xb.gb_Qb.gb_R.gb_Zb { padding: 0 0 0 25px; } #gbwa { display: none; } .gb_ae.gb_R.gb_oe.gb_he{ display: none; } #title_bar { padding-top: 14px; font-size: 15px; font-weight: 400; } #filter-button { margin: 0px 10px 0px 10px; float: right; font-size: 15px; font-weight: 400; font-family: 'Tahoma'; } #filter-icon { height: 15px; width: 15px; } #filters-overlay { background: rgba(0,0,0,0.8); position: absolute; height: 100%; width: 100%; z-index: 999; } .gb_Q { display: none; } #gbq1 { display: none; } .theater .showtimes { margin: 0px; } .theater .show_left { float: none; margin: 0; width: inherit; padding: 0px 10px 0px 10px; border-left: 1px solid #E0E0E0; border-right: 1px solid #E0E0E0; } .theater .show_right { float: none; margin: 0; width: inherit; padding: 0px 10px 0px 10px; border-left: 1px solid #E0E0E0; border-right: 1px solid #E0E0E0; } #bottom_search { display: none; } /* TODO: how to select element succeeding an element */ center { display: none; } .name a { text-decoration: none; } #navbar img { display: none; } #navbar td { padding: 5px; } #navbar td.b { color: black; } #navbar a { text-decoration: none; } p.clear { margin: 0px; }}";

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
		// Add stylesheet in page
		var style = document.createElement("style");
		style.setAttribute("media", "only screen and (max-width : 500px)")
		style.appendChild(document.createTextNode("")); // Hack for WebKit
		document.head.appendChild(style);
		style.sheet.insertRule(custom_styles);

		// Remove certain inline styles
		$('#gb').removeAttr('style');
		$('.gb_La').removeAttr('style');

		// Add some new elements
		$('#title_bar').append('<div id="filter-button"> <img id="filter-icon" src="filter.png"> Filter</div>');
		$('body').prepend("<div id='filters-overlay' style='display: none'><div id='filters-overlay-close-button'>X</div>");

		// Add click listeners
		$('.desc').on('click', self.toggleTheater);
		$('#filter-button').on('click', self.showFilters);
		$('#filters-overlay-close-button').on('click', self.hideFilters);
	};

	self.initialize();
};

// Add meta viewport tag
var viewPortTag = document.createElement('meta');
viewPortTag.id = "viewport";
viewPortTag.name = "viewport";
viewPortTag.content = "max-width=500px; initial-scale=1.0;";
document.getElementsByTagName('head')[0].appendChild(viewPortTag);

// See if media query satisfies
var mq = window.matchMedia("screen and (max-width: 500px)");
if (mq.matches) {
	var mt = new MobileTransformer();
	mt.transform();
}

});