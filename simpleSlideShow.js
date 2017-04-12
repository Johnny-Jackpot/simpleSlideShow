"use strict";

(function($) {		

	$.fn.simpleSlideShow = function(settings) {		

		var settings = $.extend({
			duration: 400,
			slides:   null,
			left:     null,
			right:    null,
			pause:    true,
			loop:     false
		}, settings);


		var $this        = this,
		    currentSlide = 0,
		    offset		 = 0,
	        slides       = $(settings.slides),
	        leftButton   = $(settings.left),
	        rightButton  = $(settings.right),
	        timer        = null,
	        delay        = settings.duration + 100;

	    settings.loop = (settings.loop && typeof settings.loop === 'object') ? 
	    				settings.loop : {period: 15000};


	    function checksettings() {
	    	if (!settings.slides)
	    		throw new Error('Selector for slides in slider is null');
	    	if (!settings.left)
	    		throw new Error('Selector for "left" control button is null');
	    	if (!settings.right)
	    		throw new Error('Selector for "right" control button is null');
	    	if (settings.loop && typeof settings.loop.period != 'number')
	    		throw new Error('Loop period must be a number');	    	
	    }

		function init() {
			checksettings();

			offset = $this.width();
			slides.css({left: offset});
			$(slides[0]).css({left: 0});
			$(slides[slides.length - 1]).css({left: -offset});

			rightButton.bind('click', moveSlideToLeft);
			leftButton.bind('click', moveSlideToRight);

			if ((typeof settings.loop === 'object' 
				 && typeof settings.loop.period === 'number')
				 || settings.loop) {				
				initLoop();
			}
					
		}

		function initLoop() {
			if (false == settings.pause) {
				timer = setInterval(moveSlideToLeft, settings.loop.period);
				return;
			}

			$this
				.mouseenter(function() {
					if (timer) clearInterval(timer);						
				})
				.mouseleave(function() {
					timer = setInterval(moveSlideToLeft, settings.loop.period);
				})
				.mouseleave();
		}

		function updateInterval() {
			clearInterval(timer);
			timer = setInterval(moveSlideToLeft, settings.loop.period);
		}

		function moveSlideToLeft() {
			rightButton.unbind('click', moveSlideToLeft);

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
				rightButton.bind('click', moveSlideToLeft);
			}, delay);

			updateInterval();
		}

		function moveSlideToRight() {
			leftButton.unbind('click', moveSlideToRight);			

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
				leftButton.bind('click', moveSlideToRight);
			}, delay);

			updateInterval();
		}
		
		init();

		return this;
	};

})(jQuery);

/*

Usage:

$('#slider').simpleSlideShow({
	left: '#left',
	right: '#right',
	slides: '#slider .slide',
	loop: true
})

*/

$('#slider').simpleSlideShow({
	left: '#left',
	right: '#right',
	slides: '#slider .slide',
	loop: true
})