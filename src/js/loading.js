/**
 * loading
 * @author: minzhang
 * @update: 2016-09-29
 */
;
(function ($) {
    $.showIndicator = function () {
        if ($('.preloader-indicator-modal')[0]) return;
        $('body').append('<div class="preloader-indicator-overlay modal-overlay-visible"></div><div class="preloader-indicator-modal"><span class="preloader preloader-white"></span></div>');
    };

    $.hideIndicator = function () {
        $('.preloader-indicator-overlay, .preloader-indicator-modal').remove();
    };
})($);