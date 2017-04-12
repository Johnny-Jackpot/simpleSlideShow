"use strict";

(function($) {
	var settings = {
		duration: 400,
		slides:   null,
		left:     null,
		right:    null,
		pause:    true,
		loop:     false
	};

	var currentSlide = 0,
	    offset		 = 0,
        slides       = null,
        leftButton   = null,
        rightButton  = null,
        timer        = null,
        delay        = settings.duration + 100;

	var methods = {

		init: function(params) {
			settings = $.extend(settings, params);						
			methods._checksettings();
			
			slides        = $(settings.slides);
        	leftButton    = $(settings.left);
        	rightButton   = $(settings.right);


        	//set up default period of changing slides
        	if (	   settings.loop		!=  false    &&
        		typeof settings.loop 		=== 'object' && 
        		typeof settings.loop.period !== 'number') {
        		settings.loop = {period: 15000};
        	}

        	if (settings.loop) {
        		methods.run.apply(this);

        		//reset timer after click on control button
        		methods._onClickResetTimer.apply(this, [leftButton, rightButton]);        		
        	}       	

	    	methods._setUpSlides.apply(this);

	    	rightButton.bind('click.slide', methods.left.bind(this));
			leftButton.bind('click.slide', methods.right.bind(this));

			$(window).bind('resize.reSetUpSlides', methods._setUpSlides.bind(this));

	    	return this;
		},
		

		_setUpSlides: function() {
			offset = this.width();
	    	slides.css({left: offset});
	    	$(slides[currentSlide]).css({left: 0});	    	

	    	var prev = (currentSlide == 0) ? slides.length - 1 : currentSlide - 1;

			$(slides[prev]).css({left: -offset});
		},

		_checksettings: function() {
			if (!settings.slides)
	    		throw new Error('Selector for slides in slider is null');
	    	if (!settings.left)
	    		throw new Error('Selector for "left" control button is null');
	    	if (!settings.right)
	    		throw new Error('Selector for "right" control button is null');
	    	if (settings.loop && typeof settings.loop.period != 'number')
	    		throw new Error('Loop period must be a number');	    	
		},

		//begin slide show
		run: function() {
			if (false == settings.pause) {
				clearInterval(timer);
				timer = setInterval(methods.left.bind(this), settings.loop.period);
				return this;
			}

			this
				.mouseenter(function() {
					clearInterval(timer);						
				})
				.mouseleave(function() {
					clearInterval(timer);
					timer = setInterval(methods.left.bind(this), settings.loop.period);
				}.bind(this))
				.mouseleave();

			return this;
		},

		//stop slide show
		stop: function() {
			clearInterval(timer);
			return this;
		},

		//reset timer after click on control element
		_onClickResetTimer: function() {
			var elems = Array.prototype.slice.call(arguments);
			elems.forEach(function(item) {
				item.bind('click.resetTimer', function() {
					methods.stop.apply(this);
					methods.run.apply(this);
				}.bind(this));
			}.bind(this));
		},

		//move slides from right to left
		left: function() {
			rightButton.unbind('.slide');

			var rightSlide = (currentSlide === slides.length - 1) ? 
                			0 : currentSlide + 1;

			var leftSlide = (currentSlide === 0) ?
			    			slides.length - 1 : currentSlide - 1;

			$(slides[leftSlide]).css({left: offset});

			$(slides[currentSlide]).animate({
				left: '-=' + offset + 'px'
			}, settings.duration);

			$(slides[rightSlide]).animate({
			 	left: '-=' + offset + 'px'
			}, settings.duration);

			currentSlide++;

			if (currentSlide === slides.length) currentSlide = 0;

			setTimeout(function() {
				rightButton.bind('click.slide', methods.left.bind(this));
			}.bind(this), delay);

			return this;
		},

		//move slides from left to right
		right: function() {
			leftButton.unbind('.slide');			

			var leftSlide = (currentSlide === 0) ?
			    			slides.length - 1 : currentSlide - 1;

			var nextLeftSlide = (leftSlide === 0) ?
							slides.length - 1 : leftSlide - 1;

			$(slides[nextLeftSlide]).css({left: -offset});

			$(slides[currentSlide]).animate({
				left: '+=' + offset + 'px'
			}, settings.duration);

			$(slides[leftSlide]).animate({
			 	left: '+=' + offset + 'px'
			}, settings.duration);

			currentSlide--;

			if (currentSlide < 0) currentSlide = slides.length - 1;

			setTimeout(function() {
				leftButton.bind('click.slide', methods.right.bind(this));
			}.bind(this), delay);

			return this;
		}
	};		

	$.fn.sly = function(method) {

		if (/^_/.test(method) && methods[method])
			$.error('Can not access private method: "' + method + '.');
		else if (methods[method])
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		else if (typeof method === 'object')
			return methods.init.apply(this, arguments);
		else
			$.error('Method "' + method + '" doesn`t exist.');
		
	};

})(jQuery);

/*
Usage

$('#slider').sly({
	left: '#left',
	right: '#right',
	slides: '#slider .slide',
	loop: {
		period: 3000
	}
})

*/