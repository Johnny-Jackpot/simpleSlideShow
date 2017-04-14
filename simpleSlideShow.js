"use strict";

(function($) {

  function Sly(params, slider) {
    this.settings = {
      duration: 400,
      slides: null,
      left: null,
      right: null,
      pause: true,
      interval: null
    };
    this.currentSlide = 0;
    this.delay = this.settings.duration + 100;
    this.offset = 0;
    this.slider = slider;
    this.slides = null;
    this.leftButton = null;
    this.rightButton = null;
    this.timer = null;

    this._init(params);
  }

  Sly.prototype._init = function(params) {    
    this._setUpSettings(params)  
        ._selectElements()
        ._setUpSlides()
        ._setupControls()
        ._onResizeWindowUpdateSlides();

    if (this.settings.interval) this._setupLoop();
  };

  Sly.prototype._setupLoop = function() {
    this.run();
    this._onClickControlResetTimer();

    return this;
  };

  Sly.prototype._onResizeWindowUpdateSlides = function() {
    $(window).bind('resize.reSetUpSlides', this._setUpSlides.bind(this));

    return this;
  };  

  Sly.prototype._setUpSettings = function(params) {
    this.settings = $.extend(this.settings, params);

    return this;  
  };

  Sly.prototype._setupControls = function() {
    this.rightButton.bind('click.slide', this.onClickRightControl.bind(this));
    this.leftButton.bind('click.slide', this.onClickLeftControl.bind(this));

    return this;
  };

  Sly.prototype._selectElements = function() {
    this.slides = $(this.settings.slides);
    this.leftButton = $(this.settings.left);
    this.rightButton = $(this.settings.right);

    return this;
  };
  
  Sly.prototype._setUpSlides = function() {
    this.offset = this.slider.width();
    this.slides.css({left: this.offset});
    $(this.slides[this.currentSlide]).css({left: 0});
    var prev = (this.currentSlide == 0) ? 
        this.slides.length - 1 : this.currentSlide - 1;
    $(this.slides[prev]).css({left: -this.offset});

    return this;
  };   

  Sly.prototype._setupPause = function() {
    this._onMouseEnterSlider()
        ._onMouseLeaveSlider();    
  };

  Sly.prototype._onMouseEnterSlider = function() {
    this.slider.mouseenter(function() {
      clearInterval(this.timer);            
    }.bind(this));

    return this;
  };

  Sly.prototype._onMouseLeaveSlider = function() {
    this.slider.mouseleave(function() {
      clearInterval(this.timer);
      this.timer = setInterval(this.onClickRightControl.bind(this), this.settings.interval);
    }.bind(this));

    return this;
  };

  Sly.prototype._onClickControlResetTimer = function() {
    [this.leftButton, this.rightButton].forEach(function(item) {
      item.bind('click.resettimer', function() {        
        this.stop().run(); 
      }.bind(this));
    }.bind(this));
  };

  Sly.prototype.run = function(interval) {
    if (interval) this.settings.interval = interval;
    if (this.settings.pause) this._setupPause();
    clearInterval(this.timer);
    this.timer = setInterval(this.onClickRightControl.bind(this), this.settings.interval);

    return this;    
  };

  Sly.prototype.stop = function() {
    clearInterval(this.timer);
    return this;
  };

  Sly.prototype.onClickRightControl = function() {
    this.rightButton.unbind('.slide');

    var leftSlide = (this.currentSlide === 0) ?
        this.slides.length - 1 : this.currentSlide - 1;
    var rightSlide = (this.currentSlide === this.slides.length - 1) ? 
        0 : this.currentSlide + 1;    

    $(this.slides[leftSlide]).css({left: this.offset});
    $(this.slides[this.currentSlide]).animate({
      left: '-=' + this.offset + 'px'
    }, this.settings.duration);
    $(this.slides[rightSlide]).animate({
       left: '-=' + this.offset + 'px'
    }, this.settings.duration);

    this.currentSlide++;
    if (this.currentSlide === this.slides.length) this.currentSlide = 0;

    setTimeout(function() {
      this.rightButton.bind('click.slide', this.onClickRightControl.bind(this));
    }.bind(this), this.delay);
  };

  Sly.prototype.onClickLeftControl = function() {
    this.leftButton.unbind('.slide');      

    var leftSlide = (this.currentSlide === 0) ?
        this.slides.length - 1 : this.currentSlide - 1;
    //pay attention that this is not right slide
    var nextLeftSlide = (leftSlide === 0) ?
        this.slides.length - 1 : leftSlide - 1;

    $(this.slides[nextLeftSlide]).css({left: -this.offset});
    $(this.slides[this.currentSlide]).animate({
      left: '+=' + this.offset + 'px'
    }, this.settings.duration);
    $(this.slides[leftSlide]).animate({
       left: '+=' + this.offset + 'px'
    }, this.settings.duration);

    this.currentSlide--;
    if (this.currentSlide < 0) this.currentSlide = this.slides.length - 1;

    setTimeout(function() {
      this.leftButton.bind('click.slide', this.onClickLeftControl.bind(this));
    }.bind(this), this.delay);
  };     

  $.fn.sly = function(settings) {    
    return new Sly(settings, this);
  };

})(jQuery);


/*Usage*/

var elem = $('#slider').sly({
  left: '#left',
  right: '#right',
  slides: '#slider .slide'
});

var elem2 = $('#slider2').sly({
  left: '#left2',
  right: '#right2',
  slides: '#slider2 .slide',
  interval: 10000
});


