/**
 * modal
 * @author: minzhang
 * @update: 2016-12-16
 */
;
(function ($) {
    "use strict";

    var timeout;

    $.toptip = function (text, duration, type) {
        if (!text) return;
        if (typeof duration === typeof "a") {
            type = duration;
            duration = undefined;
        }
        duration = duration || 3000;
        var className = type ? 'bg-' + type : 'bg-danger';
        var $t = $('.ui-toptips').remove();
        $t = $('<div class="ui-toptips"></div>').appendTo(document.body);
        $t.html(text);
        $t[0].className = 'ui-toptips ' + className

        clearTimeout(timeout);

        if (!$t.hasClass('ui-toptips-visible')) {
            $t.show().width();
            $t.addClass('ui-toptips-visible');
        }

        timeout = setTimeout(function () {
            $t.removeClass('ui-toptips-visible').transitionEnd(function () {
                $t.remove();
            });
        }, duration);
    }
})($);