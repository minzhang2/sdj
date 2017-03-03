/**
 * Infinite:滚动加载
 * @author: minzhang
 * @update: 2016-09-29
 */

;
(function ($) {
    "use strict";

    var Infinite = function (el, distance) {
        this.initBind = true;
        this.container = $(el);
        this.container.data("infinite", this);
        this.distance = distance || 100;
        this.attachEvents();
    }

    Infinite.prototype.scroll = function () {
        var container = this.container;
        var offset = container.scrollHeight() - ($(window).height() + container.scrollTop());
        if (offset <= this.distance) {
            container.trigger("infinite");
        }
    }

    Infinite.prototype.attachEvents = function (off) {
        var el = this.container,
            scroll = el.find('.ui-infinite-scroll');
        var scrollContainer = (el[0].tagName.toUpperCase() === "BODY" ? $(document) : el);
        
        scrollContainer[off ? "off" : "on"]("scroll", $.proxy(this.scroll, this));
        if(this.initBind) { this.initBind = false; return;}
        if(el.data("infinite") && scroll.hasClass('ui-hide')) scroll.removeClass('ui-hide');
    };
    
    Infinite.prototype.detachEvents = function (off) {
        var scroll = this.container.find('.ui-infinite-scroll');
        this.attachEvents(true);
        if(!scroll.hasClass('ui-hide')) scroll.addClass('ui-hide');
    }

    $.fn.infinite = function (distance) {
        return this.each(function () {
            new Infinite(this, distance);
        });
    }
    
    $.fn.destroyInfinite = function () {
        return this.each(function () {
            var infinite = $(this).data("infinite");
            if (infinite && infinite.detachEvents) infinite.detachEvents();
        });
    }

})($);