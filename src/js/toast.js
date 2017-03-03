/**
 * modal
 * @author: minzhang
 * @update: 2016-12-16
 */

;
(function ($) {
    "use strict";

    var defaults;

    var show = function (html, className) {

        className = className || "";
        var mask = $("<div class='ui-mask-transparent'></div>").appendTo(document.body);

        var tpl = '<div class="ui-toast-wrap"><div class="ui-toast ' + className + '">' + html + '</div></div>';
        var dialog = $(tpl).appendTo(document.body);

        dialog.show();
        dialog.addClass("ui-toast-visible");
    };

    var hide = function (callback) {
        $(".ui-mask-transparent").remove();
        $(".ui-toast-visible").removeClass("ui-toast-visible").transitionEnd(function () {
            var $this = $(this);
            $this.remove();
            callback && callback($this);
        });
    }

    $.toast = function (text, type, callback) {
        type = type || 'text';
        
        var className = 'ui-toast-' + type;
        
        text = type == 'text' ? '<div>' + text + '</div>' : text;
        
        show('<i class="ui-icon-toast"></i><div class="ui-toast-content">' + text+ '</div>', className);

        setTimeout(function () {
            hide(callback);
        }, toastDefaults.duration);
    }
    
    $.showIndicator = function () {
        if ($('.ui-preloader-indicator')[0]) return;
        $('body').append('<div class="ui-mask-transparent"></div><div class="ui-preloader-indicator"><span class="ui-preloader"></span></div>');
    };

    $.hideIndicator = function () {
        $('.ui-mask-transparent, .ui-preloader-indicator').remove();
    };

    $.showLoading = function (text) {
        show('<div class="ui-loading"><i class="ui-icon-loading"></i></div><div class="ui-toast-content">' + (text || "加载中...") + '</div>', 'ui-toast-loading');
    }

    $.hideLoading = function () {
        hide();
    }

    var toastDefaults = $.toast.prototype.defaults = {
        duration: 2000
    }

})($);