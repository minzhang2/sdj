/**
 * 图片懒加载
 * @author: minzhang
 * @update: 2016-09-29
 */
;
(function ($) {
    "use strict";
    var oImg,
        item,
        lazyLoad = {};

    lazyLoad.init = function (opt) {

        var defaults = {
            parent: $(document.documentElement)
        };

        opt = $.extend(defaults, opt);

        oImg = opt.parent.find('.' + opt.className).not('[data-load=true],[data-loaderror=true]');

        for (var i = 0; i < oImg.length; i++) {
            item = oImg[i];

            if (isInView($(item), opt.parent) || opt.inView) {
                (function (item) {
                    var img = new Image(),
                        src = item.getAttribute('data-src');

                    img.src = src;
                    img.onload = function () {
                        item.setAttribute('src', src);
                        item.setAttribute('data-load', 'true');
                    };
                    img.onerror = function () {
                        item.setAttribute('data-loaderror', 'true');
                    };
                })(item);
            }
        }
    };

    // 是否在可视范围内
    function isInView(ele, parent) {
        var eleOffset = ele.offset(),
            left = eleOffset.left,
            top = eleOffset.top,
            eleWidth = eleOffset.width,
            eleHeight = eleOffset.height,
            parentOffset = parent.offset(),
            parentHeight = parentOffset.height,
            parentWidth = parentOffset.width,
            parentLeft = parentOffset.left,
            parentTop = parentOffset.top;

        if (top + eleHeight < parentTop || top > parentTop + parentHeight || left > parentLeft + parentWidth || left + eleWidth < parentLeft) {
            return false;
        } else {
            return true;
        }
    }

    $.lazyLoad = lazyLoad;

})($);