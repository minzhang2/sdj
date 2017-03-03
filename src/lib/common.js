/**
 * rem的计算以及其他常用变量的存储
 * @author: minzhang
 * @update: 2016-09-27
 */
;
(function () {
    /**
     * 高清解决方案
     * @param {Number} [baseFontSize = 100] - 基础fontSize, 默认100px;
     * @param {Number} [fontscale = 1] - 有的业务希望能放大一定比例的字体;
     */
    function resizeRoot(baseFontSize, fontscale) {
        var _baseFontSize = baseFontSize || 100;
        var _fontscale = fontscale || 1;
        var win = window;
        var doc = win.document;
        var ua = navigator.userAgent;
        var matches = ua.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i);
        var UCversion = ua.match(/U3\/((\d+|\.){5,})/i);
        var isUCHd = UCversion && parseInt(UCversion[1].split('.').join(''), 10) >= 80;
        var isIos = navigator.appVersion.match(/(iphone|ipad|ipod)/gi);
        var dpr = win.devicePixelRatio || 1;
        if (!isIos && !(matches && matches[1] > 534) && !isUCHd) {
            // 如果非iOS, 非Android4.3以上, 非UC内核, 就不执行高清, dpr设为1;
            dpr = 1;
        }
        var scale = 1 / dpr;

        var metaEl = doc.querySelector('meta[name="viewport"]');
        if (!metaEl) {
            metaEl = doc.createElement('meta');
            metaEl.setAttribute('name', 'viewport');
            doc.head.appendChild(metaEl);
        }
        metaEl.setAttribute('content', 'width=device-width,user-scalable=no,initial-scale=' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale);
        window.rem = _baseFontSize / 2 * dpr * _fontscale;
        doc.documentElement.style.fontSize = window.rem + 'px';
        window.viewportScale = dpr;
    }

    // 屏幕旋转的情况下
    window.addEventListener('resize', resizeRoot, false);

    resizeRoot();

})();

// app相关配置
;
(function () {

    var base = 'http://' + location.host;

    // 系统路径
    window.CONTEXTPATH = base + '/shuangdj/kb';

    // 页面访问路径
    window.PATHNAME = base + location.pathname.match('^.*(.\/)')[0];

    if ('addEventListener' in document) {
        window.addEventListener('load', function () {
            FastClick.attach(document.body);
        }, false);
    }

})();