/** 
* sdj-ui V0.0.1 
* By minzhang
*/
/**
 * 工具方法
 * @author: minzhang
 * @update: 2016-09-29
 */
;
(function () {
    "use strict";

    var utils = {},
        objectToString = {}.toString, // 类型检测
        numberRegExp = /^\d*$/; // 纯数字

    /**
     * 时间格式化
     * @param   {Object} date   Date
     * @param   {String} format 格式化参数
     * @returns {String} 格式化Date
     */
    var formatDate = function (date, format) {
        var regExps = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'H+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            'S': date.getMilliseconds()
        };

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 -
                RegExp.$1.length));
        }

        for (var reg in regExps) {
            var regExp = new RegExp('(' + reg + ')'),
                temp = regExps[reg] + '',
                real;
            if (regExp.test(format)) {
                real = RegExp.$1.length == 1 ? temp : ('00' + temp).substr(temp.length);
                format = format.replace(RegExp.$1, real);
            }
        }

        return format;
    };

    /**
     * 将字符串转为日期
     * @param   {String} value   需要格式化的时间字符串 或者 Date
     * @param   {String} formats 格式
     * @returns {String} 格式化后的时间
     */
    utils.parseDate = function (value, format) {

        // 标准转换格式
        var stand = 'yyyy/MM/dd HH:mm:ss',
            now = new Date(),
            idx = 0,
            date,
            length,
            reg;

        // 匹配格式库
        var formats = [
                    'yyyyMMddHHmmss',
                    'yyyyMMddHHmm',
                    'yyyyMMdd',
                    'yyyy-MM-dd HH:mm:ss',
                    'yyyy-MM-dd HH:mm',
                    'yyyy-MM-dd',
                    'HHmmss',
                    'HH:mm:ss',
                    'HH:mm'
                ];

        var regExps = {
            'y+': now.getFullYear(),
            'M+': now.getMonth() + 1,
            'd+': now.getDate(),
            'H+': 0,
            'm+': 0,
            's+': 0
        };

        if (objectToString.call(value) === '[object Number]') {
            value = new Date(value);
        }

        // 如果是日期，则直接返回
        if (objectToString.call(value) === '[object Date]') {
            date = value;
        } else {
            for (length = formats.length; idx < length; idx++) {
                var newData = stand;
                format = formats[idx];

                if (format.length != value.length) {
                    continue;
                }

                for (reg in regExps) {
                    var regExp = new RegExp('(' + reg + ')'),
                        index = format.search(regExp),
                        temp = '';
                    if (index == 0) {
                        temp = value.substr(index, RegExp.$1.length);
                        if (!numberRegExp.test(temp)) {
                            break;
                        }
                    } else {
                        temp = regExps[reg] + '';
                    }
                    temp = temp.length == 1 ? '0' + temp : temp;
                    newData = newData.replace(regExp, temp);
                }

                try {
                    date = new Date(newData);
                    if (date.toString() == 'Invalid Date') {
                        continue;
                    }
                    break;
                } catch (e) {
                    continue;
                }
            }
        }

        // 如果存在格式化
        if (format) {
            return formatDate(date, format);
        } else {
            return date;
        }
    };

    /**
     * 对'<','>','&','''进行字符转义
     * @param {Number} num 化整后的整数
     */
    utils.html2Escape = function (sHtml) {
        return sHtml.replace(/[<>&']/g,
            function (c) {
                return {
                    '<': '&lt;',
                    '>': '&gt;',
                    '&': '&amp;',
                    '"': '&quot;'
                }[c]
            })
    };

    /**
     * 获取url所带的参数
     * @param {String} name 参数名称
     * @returns {String} 参数所带的数据
     */
    utils.getQueryString = function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        //            var r = window.location.search.substr(1).match(reg);
        var r = decodeURI(window.location.search).substr(1).match(reg);
        if (r != null) return r[2];
        return ''
    };

    /**
     * 获取小数位数
     * @param {Number} num 小数部分位数
     */
    var digits = function (num) {
        var length;
        try {
            length = num.toString().split('.')[1].length;
        } catch (e) {
            length = 0;
        }
        return length;
    };

    /**
     * 将小数化为整数
     * @param {Number} num 化整后的整数
     */
    var integer = function (num) {
        return Number(num.toString().replace('.', ''));
    };

    /**
     * 加法运算
     * @param   {Number} arg1 被加数
     * @param   {Number} arg2 加数
     * @returns {Number} 和
     */
    utils.add = function (arg1, arg2) {
        var n = Math.max(digits(arg1), digits(arg2)),
            m = Math.pow(10, n);
        return (utils.mul(arg1, m) + utils.mul(arg2, m)) / m;
    };

    /**
     * 减法运算
     * @param   {Number} arg1 被减数
     * @param   {Number} arg2 减数
     * @returns {Number} 差
     */
    utils.sub = function (arg1, arg2) {
        var n = Math.max(digits(arg1), digits(arg2)),
            m = Math.pow(10, n);
        return (utils.mul(arg1, m) - utils.mul(arg2, m)) / m;
    };

    /**
     * 乘法运算
     * @param   {Number} arg1 被乘数
     * @param   {Number} arg2 乘数
     * @returns {Number} 积
     */
    utils.mul = function (arg1, arg2) {
        var n = digits(arg1) + digits(arg2),
            m = Math.pow(10, n);
        return integer(arg1) * integer(arg2) / m;
    };

    /**
     * 除法运算
     * @param   {Number} arg1 被除数
     * @param   {Number} arg2 除数
     * @returns {Number} 商
     */
    utils.div = function (arg1, arg2) {
        var n = digits(arg2) - digits(arg1),
            m = Math.pow(10, n);
        return (integer(arg1) / integer(arg2)) * m;
    };

    /**
     * ajax数据请求
     * @param   {String} url 数据请求地址
     * @param   {Object} param 数据请求参数
     * @param   {Function} success 数据返回成功处理函数
     * @param   {Function} error 数据返回失败处理函数
     */
    utils.ajax = function (opt) {
        $.ajax({
            url: opt.url,
            type: opt.type || 'post',
            data: opt.data || {},
            dataType: opt.dataType || 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function (res) {
                $.hideIndicator();
                if (res.succeed) {
                    opt.success && opt.success(res.data);
                } else {
                    opt.error && opt.error(res);
                    $.toast(res.message);
                }
            },
            error: function (res) {
                $.toast('数据获取失败');
                $.hideIndicator();
                opt.error && opt.error(res);
            }
        });
    };

    // 拼接产生md5码
    utils.md5Data = function (params) {
        var secretStr = '', // 需要加密的串
            secret = 'vJ`(<:VRo_$->7[TAc/5', // 加密码
            time = Date.now(), // 时间戳
            str = ''; // get请求需要加的参数

        for (var props in params) {
            str += props + '=' + params[props] + '&';
            secretStr += params[props];
        }
        secretStr += time;

        return '?' + str.slice(0, -1) + '&time=' + time + '&mac=' + $.md5(secretStr + secret);
    };

    /**
     * 获取地理位置
     * @param   {Function} callback 请求到地理位置后的回调函数
     */
    utils.getLocation = function (callback) {
        // if (APP.lat) {
        //     callback && callback();
        //     return;
        // }
        var geo = navigator.geolocation;
        if (geo) {
            geo.getCurrentPosition(function (position) {
                // var coords = position.coords;
                // APP.lat = coords.latitude;
                // APP.lon = coords.longitude;
                callback && callback(position);
            }, function (error) {
                // // 杭州默认坐标
                // APP.lat = 30.259244;
                // APP.lon = 120.219375;
                // callback && callback();
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        console.log('位置服务被拒绝');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.log('暂时获取不到位置信息');
                        break;
                    case error.TIMEOUT:
                        console.log('获取位置信息超时');
                        break;
                    case error.UNKNOWN_ERROR:
                        console.log('未知错误');
                        break;
                }
            });
        } else {
            // // 杭州默认坐标
            // APP.lat = 30.259244;
            // APP.lon = 120.219375;
            // callback && callback();
            // utils.alert('Geolocation is not supported by this browser.');
            utils.alert('地理位置是无法获取.');
        }
    };

    // 设置过期时间
    function getsec(str) {
        var str1 = str.substring(1, str.length) * 1,
            str2 = str.substring(0, 1);

        if (str2 == "s") {
            return str1 * 1000;
        } else if (str2 == "h") {
            return str1 * 60 * 60 * 1000;
        } else if (str2 == "d") {
            return str1 * 24 * 60 * 60 * 1000;
        }
    }

    /**
     * 设置cookie
     * @param   {String} name cookie的key
     * @param   {String} value cookie的value
     * @param   {String} time cookie的过期时间
     */
    utils.setCookie = function (name, value, time) {
        var strsec = getsec(time || 'd7'),
            exp = new Date();
        // 设置名称为name,值为value的Cookie
        exp.setTime(exp.getTime() + strsec);
        // 时间可以不要，但路径(path)必须要填写，因为JS的默认路径是当前页，如果不填，此cookie只在当前页面生效！~
        document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString();
    };

    //读取cookies
    utils.getCookie = function (name) {
        var arr,
            reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');

        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    };

    //删除cookies
    utils.delCookie = function (name) {
        var exp = new Date(),
            cval = utils.getCookie(name);

        exp.setTime(exp.getTime() - (1 * 24 * 60 * 60 * 1000));

        if (cval != null) {
            document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
        }
    };

    // 加载js
    utils.loadScript = function (sScriptSrc, callback) {
        var oHead = document.getElementsByTagName('head')[0];
        if (oHead) {
            var oScript = document.createElement('script');
            oScript.setAttribute('src', sScriptSrc);
            oScript.setAttribute('type', 'text/javascript');
            var loadFunction = function () {
                if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    callback()
                }
            };
            oScript.onreadystatechange = loadFunction;
            oScript.onload = callback;
            oHead.appendChild(oScript)
        }
    };

    // 将json参数拼接在url后面
    utils.json2arr = function (json) {
        if (!json) {
            return '';
        }
        var arr = [];
        for (var prop in json) {
            arr.push(prop + '=' + json[prop]);
        }
        return '?' + arr.join('&');
    };

    /**
     * 通过经纬度坐标来计算两点间的距离
     * @param {Object} lat1
     * @param {Object} lng1
     * @param {Object} lat2
     * @param {Object} lng2
     */
    utils.getFlatternDistance = function (lat1, lng1, lat2, lng2) {
        var EARTH_RADIUS = 6378137.0; //单位M
        var PI = Math.PI;

        var getRad = function (d) {
            return d * PI / 180.0;
        }

        var f = getRad((lat1 + lat2) / 2);
        var g = getRad((lat1 - lat2) / 2);
        var l = getRad((lng1 - lng2) / 2);

        var sg = Math.sin(g);
        var sl = Math.sin(l);
        var sf = Math.sin(f);

        var s, c, w, r, d, h1, h2;
        var a = EARTH_RADIUS;
        var fl = 1 / 298.257;

        sg = sg * sg;
        sl = sl * sl;
        sf = sf * sf;

        s = sg * (1 - sl) + (1 - sf) * sl;
        c = (1 - sg) * (1 - sl) + sf * sl;

        w = Math.atan(Math.sqrt(s / c));
        r = Math.sqrt(s * c) / w;
        d = 2 * w * a;
        h1 = (3 * r - 1) / 2 / c;
        h2 = (3 * r + 1) / 2 / s;

        return (d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg)) / 1000).toFixed(1);
    };

    // 校验手机号
    utils.checkPhone = function (val) {
        if (/^1[3|4|5|8|7][0-9]\d{8}$/.test(val)) {
            return true;
        }
        return false;
    };

    // 格式化手机号
    utils.phoneFormat = function (str) {
        var arr = str.split(''); // 删除空格

        // 将字符串重新排列加入空格
        if (arr.length >= 3) {
            arr.splice(3, 0, ' ')
            if (arr.length >= 8) {
                arr.splice(8, 0, ' ')
            }
        }

        return arr.join('');
    };

    // Bytes 智能转换为 KB， MB，GB
    utils.readablizeBytes = function (bytes) {
        var s = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        var e = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
    };
    
    // 设置title，解决微信和一些浏览器无法改变title的问题
    utils.setTitle = function (title) {
        var body = document.getElementsByTagName('body')[0];
        document.title = title;
        var iframe = document.createElement("iframe");
        iframe.setAttribute("src", "https://image.shuangdj.com/favicon.ico");

        function load() {
            setTimeout(function () {
                iframe.removeEventListener(load, false);
                document.body.removeChild(iframe);
            }, 0);
        }
        iframe.addEventListener('load', load, false);
        document.body.appendChild(iframe);
    };

    $.utils = utils;

})($);
/**
 * 基于jquery的拓展
 * @author: minzhang
 * @update: 2016-12-16
 */

;
(function ($) {
    "use strict";

    //support
    $.support = (function () {
        var support = {
            touch: !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch)
        };
        return support;
    })();

    $.touchEvents = {
        start: $.support.touch ? 'touchstart' : 'mousedown',
        move: $.support.touch ? 'touchmove' : 'mousemove',
        end: $.support.touch ? 'touchend' : 'mouseup'
    };

    function __dealCssEvent(eventNameArr, callback) {
        var events = eventNameArr,
            i, dom = this; // jshint ignore:line

        function fireCallBack(e) {
            /*jshint validthis:true */
            if (e.target !== this) return;
            callback.call(this, e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
    }

    $.fn.animationEnd = function (callback) {
        __dealCssEvent.call(this, ['webkitAnimationEnd', 'animationend'], callback);
        return this;
    };

    $.fn.transitionEnd = function (callback) {
        __dealCssEvent.call(this, ['webkitTransitionEnd', 'transitionend'], callback);
        return this;
    };

    $.fn.transition = function (duration) {
        if (typeof duration !== 'string') {
            duration = duration + 'ms';
        }
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransitionDuration = elStyle.MozTransitionDuration = elStyle.transitionDuration = duration;
        }
        return this;
    };

    $.fn.transform = function (transform) {
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransform = elStyle.MozTransform = elStyle.transform = transform;
        }
        return this;
    };

    $.getTouchPosition = function (e) {
        e = e.originalEvent || e; //jquery wrap the originevent
        if (e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend') {
            return {
                x: e.targetTouches[0].pageX,
                y: e.targetTouches[0].pageY
            };
        } else {
            return {
                x: e.pageX,
                y: e.pageY
            };
        }
    };

    $.fn.scrollHeight = function () {
        return this[0].scrollHeight;
    };

    $.getTranslate = function (el, axis) {
        var matrix, curTransform, curStyle, transformMatrix;

        // automatic axis detection
        if (typeof axis === 'undefined') {
            axis = 'x';
        }

        curStyle = window.getComputedStyle(el, null);
        if (window.WebKitCSSMatrix) {
            // Some old versions of Webkit choke when 'none' is passed; pass
            // empty string instead in this case
            transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === 'none' ? '' : curStyle.webkitTransform);
        } else {
            transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
            matrix = transformMatrix.toString().split(',');
        }

        if (axis === 'x') {
            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix)
                curTransform = transformMatrix.m41;
            //Crazy IE10 Matrix
            else if (matrix.length === 16)
                curTransform = parseFloat(matrix[12]);
            //Normal Browsers
            else
                curTransform = parseFloat(matrix[4]);
        }
        if (axis === 'y') {
            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix)
                curTransform = transformMatrix.m42;
            //Crazy IE10 Matrix
            else if (matrix.length === 16)
                curTransform = parseFloat(matrix[13]);
            //Normal Browsers
            else
                curTransform = parseFloat(matrix[5]);
        }

        return curTransform || 0;
    };

    $.requestAnimationFrame = function (callback) {
        if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);
        else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);
        else if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame(callback);
        else {
            return window.setTimeout(callback, 1000 / 60);
        }
    };

    $.cancelAnimationFrame = function (id) {
        if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id);
        else if (window.webkitCancelAnimationFrame) return window.webkitCancelAnimationFrame(id);
        else if (window.mozCancelAnimationFrame) return window.mozCancelAnimationFrame(id);
        else {
            return window.clearTimeout(id);
        }
    };

    $.fn.join = function (arg) {
        return this.toArray().join(arg);
    }

})($);
/**
 * 设备信息的判断函数
 * @author: minzhang
 * @update: 2016-12-16
 */

;
(function ($) {
    "use strict";
    var device = {},
        ua = navigator.userAgent;

    var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
        ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
        iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

    device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;

    // Android
    if (android) {
        device.os = 'android';
        device.osVersion = android[2];
        device.android = true;
        device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
    }

    if (ipad || iphone || ipod) {
        device.os = 'ios';
        device.ios = true;
    }

    // iOS
    if (iphone && !ipod) {
        device.osVersion = iphone[2].replace(/_/g, '.');
        device.iphone = true;
    }

    if (ipad) {
        device.osVersion = ipad[2].replace(/_/g, '.');
        device.ipad = true;
    }

    if (ipod) {
        device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
        device.iphone = true;
    }

    // iOS 8+ changed UA
    if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
        if (device.osVersion.split('.')[0] === '10') {
            device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
        }
    }

    // Webview
    device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);

    // Minimal UI
    if (device.os && device.os === 'ios') {
        var osVersionArr = device.osVersion.split('.');
        device.minimalUi = !device.webView &&
            (ipod || iphone) &&
            (osVersionArr[0] * 1 === 7 ? osVersionArr[1] * 1 >= 1 : osVersionArr[0] * 1 > 7) &&
            $('meta[name="viewport"]').length > 0 && $('meta[name="viewport"]').attr('content').indexOf('minimal-ui') >= 0;
    }

    // Check for status bar and fullscreen app mode
    var windowWidth = $(window).width(),
        windowHeight = $(window).height();

    device.statusBar = false;

    if (device.webView && (windowWidth * windowHeight === screen.width * screen.height)) {
        device.statusBar = true;
    } else {
        device.statusBar = false;
    }

    // Classes
    var classNames = [];

    // Pixel Ratio
    device.pixelRatio = window.devicePixelRatio || 1;
    classNames.push('pixel-ratio-' + Math.floor(device.pixelRatio));
    if (device.pixelRatio >= 2) {
        classNames.push('retina');
    }

    // OS classes
    if (device.os) {
        classNames.push(device.os, device.os + '-' + device.osVersion.split('.')[0], device.os + '-' + device.osVersion.replace(/\./g, '-'));
        if (device.os === 'ios') {
            var major = parseInt(device.osVersion.split('.')[0], 10);
            for (var i = major - 1; i >= 6; i--) {
                classNames.push('ios-gt-' + i);
            }
        }
    }
    // Status bar classes
    if (device.statusBar) {
        classNames.push('with-statusbar-overlay');
    } else {
        $('html').removeClass('with-statusbar-overlay');
    }

    // Add html classes
    if (classNames.length > 0) $('html').addClass(classNames.join(' '));

    // keng..
    device.isWeixin = /MicroMessenger/i.test(ua);

    $.device = device;
})($);
/*
 * artTemplate - Template Engine
 * https://github.com/aui/artTemplate
 * Released under the MIT, BSD, and GPL Licenses
 */

;
(function () {


	/**
	 * 模板引擎
	 * @name    template
	 * @param   {String}            模板名
	 * @param   {Object, String}    数据。如果为字符串则编译并缓存编译结果
	 * @return  {String, Function}  渲染好的HTML字符串或者渲染方法
	 */
	var template = function (filename, content) {
		return typeof content === 'string' ? compile(content, {
			filename: filename
		}) : renderFile(filename, content);
	};


	template.version = '3.0.0';


	/**
	 * 设置全局配置
	 * @name    template.config
	 * @param   {String}    名称
	 * @param   {Any}       值
	 */
	template.config = function (name, value) {
		defaults[name] = value;
	};



	var defaults = template.defaults = {
		openTag: '<%', // 逻辑语法开始标签
		closeTag: '%>', // 逻辑语法结束标签
		escape: true, // 是否编码输出变量的 HTML 字符
		cache: true, // 是否开启缓存（依赖 options 的 filename 字段）
		compress: false, // 是否压缩输出
		parser: null // 自定义语法格式器 @see: template-syntax.js
	};


	var cacheStore = template.cache = {};


	/**
	 * 渲染模板
	 * @name    template.render
	 * @param   {String}    模板
	 * @param   {Object}    数据
	 * @return  {String}    渲染好的字符串
	 */
	template.render = function (source, options) {
		return compile(source, options);
	};


	/**
	 * 渲染模板(根据模板名)
	 * @name    template.render
	 * @param   {String}    模板名
	 * @param   {Object}    数据
	 * @return  {String}    渲染好的字符串
	 */
	var renderFile = template.renderFile = function (filename, data) {
		var fn = template.get(filename) || showDebugInfo({
			filename: filename,
			name: 'Render Error',
			message: 'Template not found'
		});
		return data ? fn(data) : fn;
	};


	/**
	 * 获取编译缓存（可由外部重写此方法）
	 * @param   {String}    模板名
	 * @param   {Function}  编译好的函数
	 */
	template.get = function (filename) {

		var cache;

		if (cacheStore[filename]) {
			// 使用内存缓存
			cache = cacheStore[filename];
		} else if (typeof document === 'object') {
			// 加载模板并编译
			var elem = document.getElementById(filename);

			if (elem) {
				var source = (elem.value || elem.innerHTML)
					.replace(/^\s*|\s*$/g, '');
				cache = compile(source, {
					filename: filename
				});
			}
		}

		return cache;
	};


	var toString = function (value, type) {

		if (typeof value !== 'string') {

			type = typeof value;
			if (type === 'number') {
				value += '';
			} else if (type === 'function') {
				value = toString(value.call(value));
			} else {
				value = '';
			}
		}

		return value;

	};


	var escapeMap = {
		"<": "&#60;",
		">": "&#62;",
		'"': "&#34;",
		"'": "&#39;",
		"&": "&#38;"
	};


	var escapeFn = function (s) {
		return escapeMap[s];
	};

	var escapeHTML = function (content) {
		return toString(content)
			.replace(/&(?![\w#]+;)|[<>"']/g, escapeFn);
	};


	var isArray = Array.isArray || function (obj) {
		return ({}).toString.call(obj) === '[object Array]';
	};


	var each = function (data, callback) {
		var i, len;
		if (isArray(data)) {
			for (i = 0, len = data.length; i < len; i++) {
				callback.call(data, data[i], i, data);
			}
		} else {
			for (i in data) {
				callback.call(data, data[i], i);
			}
		}
	};


	var utils = template.utils = {

		$helpers: {},

		$include: renderFile,

		$string: toString,

		$escape: escapeHTML,

		$each: each

	};
	/**
	 * 添加模板辅助方法
	 * @name    template.helper
	 * @param   {String}    名称
	 * @param   {Function}  方法
	 */
	template.helper = function (name, helper) {
		helpers[name] = helper;
	};

	var helpers = template.helpers = utils.$helpers;




	/**
	 * 模板错误事件（可由外部重写此方法）
	 * @name    template.onerror
	 * @event
	 */
	template.onerror = function (e) {
		var message = 'Template Error\n\n';
		for (var name in e) {
			message += '<' + name + '>\n' + e[name] + '\n\n';
		}

		if (typeof console === 'object') {
			console.error(message);
		}
	};


	// 模板调试器
	var showDebugInfo = function (e) {

		template.onerror(e);

		return function () {
			return '{Template Error}';
		};
	};


	/**
	 * 编译模板
	 * 2012-6-6 @TooBug: define 方法名改为 compile，与 Node Express 保持一致
	 * @name    template.compile
	 * @param   {String}    模板字符串
	 * @param   {Object}    编译选项
	 *
	 *      - openTag       {String}
	 *      - closeTag      {String}
	 *      - filename      {String}
	 *      - escape        {Boolean}
	 *      - compress      {Boolean}
	 *      - debug         {Boolean}
	 *      - cache         {Boolean}
	 *      - parser        {Function}
	 *
	 * @return  {Function}  渲染方法
	 */
	var compile = template.compile = function (source, options) {

		// 合并默认配置
		options = options || {};
		for (var name in defaults) {
			if (options[name] === undefined) {
				options[name] = defaults[name];
			}
		}


		var filename = options.filename;


		try {

			var Render = compiler(source, options);

		} catch (e) {

			e.filename = filename || 'anonymous';
			e.name = 'Syntax Error';

			return showDebugInfo(e);

		}


		// 对编译结果进行一次包装

		function render(data) {

			try {

				return new Render(data, filename) + '';

			} catch (e) {

				// 运行时出错后自动开启调试模式重新编译
				if (!options.debug) {
					options.debug = true;
					return compile(source, options)(data);
				}

				return showDebugInfo(e)();

			}

		}

		render.prototype = Render.prototype;
		render.toString = function () {
			return Render.toString();
		};


		if (filename && options.cache) {
			cacheStore[filename] = render;
		}


		return render;

	};

	// 数组迭代
	var forEach = utils.$each;

	// 静态分析模板变量
	var KEYWORDS =
		// 关键字
		'break,case,catch,continue,debugger,default,delete,do,else,false' + ',finally,for,function,if,in,instanceof,new,null,return,switch,this' + ',throw,true,try,typeof,var,void,while,with'

	// 保留字
	+',abstract,boolean,byte,char,class,const,double,enum,export,extends' + ',final,float,goto,implements,import,int,interface,long,native' + ',package,private,protected,public,short,static,super,synchronized' + ',throws,transient,volatile'

	// ECMA 5 - use strict
	+ ',arguments,let,yield'

	+ ',undefined';

	var REMOVE_RE = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g;
	var SPLIT_RE = /[^\w$]+/g;
	var KEYWORDS_RE = new RegExp(["\\b" + KEYWORDS.replace(/,/g, '\\b|\\b') + "\\b"].join('|'), 'g');
	var NUMBER_RE = /^\d[^,]*|,\d[^,]*/g;
	var BOUNDARY_RE = /^,+|,+$/g;
	var SPLIT2_RE = /^$|,+/;


	// 获取变量
	function getVariable(code) {
		return code
			.replace(REMOVE_RE, '')
			.replace(SPLIT_RE, ',')
			.replace(KEYWORDS_RE, '')
			.replace(NUMBER_RE, '')
			.replace(BOUNDARY_RE, '')
			.split(SPLIT2_RE);
	};


	// 字符串转义
	function stringify(code) {
		return "'" + code
			// 单引号与反斜杠转义
			.replace(/('|\\)/g, '\\$1')
			// 换行符转义(windows + linux)
			.replace(/\r/g, '\\r')
			.replace(/\n/g, '\\n') + "'";
	}


	function compiler(source, options) {

		var debug = options.debug;
		var openTag = options.openTag;
		var closeTag = options.closeTag;
		var parser = options.parser;
		var compress = options.compress;
		var escape = options.escape;



		var line = 1;
		var uniq = {
			$data: 1,
			$filename: 1,
			$utils: 1,
			$helpers: 1,
			$out: 1,
			$line: 1
		};



		var isNewEngine = ''.trim; // '__proto__' in {}
		var replaces = isNewEngine ? ["$out='';", "$out+=", ";", "$out"] : ["$out=[];", "$out.push(", ");", "$out.join('')"];

		var concat = isNewEngine ? "$out+=text;return $out;" : "$out.push(text);";

		var print = "function(){" + "var text=''.concat.apply('',arguments);" + concat + "}";

		var include = "function(filename,data){" + "data=data||$data;" + "var text=$utils.$include(filename,data,$filename);" + concat + "}";

		var headerCode = "'use strict';" + "var $utils=this,$helpers=$utils.$helpers," + (debug ? "$line=0," : "");

		var mainCode = replaces[0];

		var footerCode = "return new String(" + replaces[3] + ");"

		// html与逻辑语法分离
		forEach(source.split(openTag), function (code) {
			code = code.split(closeTag);

			var $0 = code[0];
			var $1 = code[1];

			// code: [html]
			if (code.length === 1) {

				mainCode += html($0);

				// code: [logic, html]
			} else {

				mainCode += logic($0);

				if ($1) {
					mainCode += html($1);
				}
			}


		});

		var code = headerCode + mainCode + footerCode;

		// 调试语句
		if (debug) {
			code = "try{" + code + "}catch(e){" + "throw {" + "filename:$filename," + "name:'Render Error'," + "message:e.message," + "line:$line," + "source:" + stringify(source) + ".split(/\\n/)[$line-1].replace(/^\\s+/,'')" + "};" + "}";
		}

		try {


			var Render = new Function("$data", "$filename", code);
			Render.prototype = utils;

			return Render;

		} catch (e) {
			e.temp = "function anonymous($data,$filename) {" + code + "}";
			throw e;
		}

		// 处理 HTML 语句
		function html(code) {

			// 记录行号
			line += code.split(/\n/).length - 1;

			// 压缩多余空白与注释
			if (compress) {
				code = code
					.replace(/\s+/g, ' ')
					.replace(/<!--[\w\W]*?-->/g, '');
			}

			if (code) {
				code = replaces[1] + stringify(code) + replaces[2] + "\n";
			}

			return code;
		}


		// 处理逻辑语句
		function logic(code) {

			var thisLine = line;

			if (parser) {

				// 语法转换插件钩子
				code = parser(code, options);

			} else if (debug) {

				// 记录行号
				code = code.replace(/\n/g, function () {
					line++;
					return "$line=" + line + ";";
				});

			}


			// 输出语句. 编码: <%=value%> 不编码:<%=#value%>
			// <%=#value%> 等同 v2.0.3 之前的 <%==value%>
			if (code.indexOf('=') === 0) {

				var escapeSyntax = escape && !/^=[=#]/.test(code);

				code = code.replace(/^=[=#]?|[\s;]*$/g, '');

				// 对内容编码
				if (escapeSyntax) {

					var name = code.replace(/\s*\([^\)]+\)/, '');

					// 排除 utils.* | include | print

					if (!utils[name] && !/^(include|print)$/.test(name)) {
						code = "$escape(" + code + ")";
					}

					// 不编码
				} else {
					code = "$string(" + code + ")";
				}


				code = replaces[1] + code + replaces[2];

			}

			if (debug) {
				code = "$line=" + thisLine + ";" + code;
			}

			// 提取模板中的变量名
			forEach(getVariable(code), function (name) {

				// name 值可能为空，在安卓低版本浏览器下
				if (!name || uniq[name]) {
					return;
				}

				var value;

				// 声明模板变量
				// 赋值优先级:
				// [include, print] > utils > helpers > data
				if (name === 'print') {

					value = print;

				} else if (name === 'include') {

					value = include;

				} else if (utils[name]) {

					value = "$utils." + name;

				} else if (helpers[name]) {

					value = "$helpers." + name;

				} else {

					value = "$data." + name;
				}

				headerCode += name + "=" + value + ",";
				uniq[name] = true;


			});

			return code + "\n";
		}


	};



	// 定义模板引擎的语法


	defaults.openTag = '{{';
	defaults.closeTag = '}}';


	var filtered = function (js, filter) {
		var parts = filter.split(':');
		var name = parts.shift();
		var args = parts.join(':') || '';

		if (args) {
			args = ', ' + args;
		}

		return '$helpers.' + name + '(' + js + args + ')';
	}


	defaults.parser = function (code, options) {

		// var match = code.match(/([\w\$]*)(\b.*)/);
		// var key = match[1];
		// var args = match[2];
		// var split = args.split(' ');
		// split.shift();

		code = code.replace(/^\s/, '');

		var split = code.split(' ');
		var key = split.shift();
		var args = split.join(' ');



		switch (key) {

			case 'if':

				code = 'if(' + args + '){';
				break;

			case 'else':

				if (split.shift() === 'if') {
					split = ' if(' + split.join(' ') + ')';
				} else {
					split = '';
				}

				code = '}else' + split + '{';
				break;

			case '/if':

				code = '}';
				break;

			case 'each':

				var object = split[0] || '$data';
				var as = split[1] || 'as';
				var value = split[2] || '$value';
				var index = split[3] || '$index';

				var param = value + ',' + index;

				if (as !== 'as') {
					object = '[]';
				}

				code = '$each(' + object + ',function(' + param + '){';
				break;

			case '/each':

				code = '});';
				break;

			case 'echo':

				code = 'print(' + args + ');';
				break;

			case 'print':
			case 'include':

				code = key + '(' + split.join(',') + ');';
				break;

			default:

				// 过滤器（辅助方法）
				// {{value | filterA:'abcd' | filterB}}
				// >>> $helpers.filterB($helpers.filterA(value, 'abcd'))
				// TODO: {{ddd||aaa}} 不包含空格
				if (/^\s*\|\s*[\w\$]/.test(args)) {

					var escape = true;

					// {{#value | link}}
					if (code.indexOf('#') === 0) {
						code = code.substr(1);
						escape = false;
					}

					var i = 0;
					var array = code.split('|');
					var len = array.length;
					var val = array[i++];

					for (; i < len; i++) {
						val = filtered(val, array[i]);
					}

					code = (escape ? '=' : '=#') + val;

					// 即将弃用 {{helperName value}}
				} else if (template.helpers[key]) {

					code = '=#' + key + '(' + split.join(',') + ');';

					// 内容直接输出 {{value}}
				} else {

					code = '=' + code;
				}

				break;
		}


		return code;
	};



	// RequireJS && SeaJS
	if (typeof define === 'function') {
		define(function () {
			return template;
		});

		// NodeJS
	} else if (typeof exports !== 'undefined') {
		module.exports = template;
	} else {
		this.template = template;
	}

	$.template = template;

})($);
/**
 * template帮助 函数
 * @author: minzhang
 * @update: 2016-09-29
 */

;
(function () {

	$.template.config('escape', false);
	/**
	 * 对日期进行格式化，
	 * @param date 要格式化的日期
	 * @param format 进行格式化的模式字符串
	 */
	$.template.helper('dateFormat', $.utils.parseDate);

	/**
	 * 乘法运算
	 * @param   {Number} arg1 被乘数
	 * @param   {Number} arg2 乘数
	 * @returns {Number} 积
	 */
	$.template.helper('mul', $.utils.mul);

	/**
	 * 除法运算
	 * @param   {Number} arg1 被除数
	 * @param   {Number} arg2 除数
	 * @returns {Number} 商
	 */
	$.template.helper('div', $.utils.div);

	/**
	 * 加法
	 * @param   {Number} arg1 被加法
	 * @param   {Number} arg2 加法
	 * @returns {Number} 和
	 */
	$.template.helper('add', $.utils.add);

	/**
	 * 减法
	 * @param   {Number} arg1 被减数
	 * @param   {Number} arg2 减数
	 * @returns {Number} 差
	 */
	$.template.helper('sub', $.utils.sub);

	/**
	 * 最小数
	 * @param   {Number} arg1 参数
	 * @param   {Number} arg2 参数
	 * @returns {Number} 最小数
	 */
	$.template.helper('min', function (arg1, arg2) {
		return Math.min(arg1, arg2);
	});

	/**
	 * 处理技师的空闲时间
	 * @param   {Number} arg1 参数
	 * @param   {Number} arg2 参数
	 * @returns {Number} 最小数
	 */
	$.template.helper('formatFreeDate', function (arg) {
		var min = Math.floor($.utils.div(arg, 60000));
		return min >= 180 ? '3小时' : (min + '分钟');
	});

	// 将json数据转化为字符串json
	$.template.helper('stringify', function (obj) {
		return JSON.stringify(obj);
	});

})($);
/**
 * fastclick
 * @author: minzhang
 * @update: 2016-09-29
 */
;
(function () {
    'use strict';

    /**
     * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
     *
     * @codingstandard ftlabs-jsv2
     * @copyright The Financial Times Limited [All Rights Reserved]
     * @license MIT License (see LICENSE.txt)
     */

    /*jslint browser:true, node:true, elision:true*/
    /*global Event, Node*/


    /**
     * Instantiate fast-clicking listeners on the specified layer.
     *
     * @constructor
     * @param {Element} layer The layer to listen on
     * @param {Object} [options={}] The options to override the defaults
     */
    function FastClick(layer, options) {
        var oldOnClick;

        options = options || {};

        /**
         * Whether a click is currently being tracked.
         *
         * @type boolean
         */
        this.trackingClick = false;


        /**
         * Timestamp for when click tracking started.
         *
         * @type number
         */
        this.trackingClickStart = 0;


        /**
         * The element being tracked for a click.
         *
         * @type EventTarget
         */
        this.targetElement = null;


        /**
         * X-coordinate of touch start event.
         *
         * @type number
         */
        this.touchStartX = 0;


        /**
         * Y-coordinate of touch start event.
         *
         * @type number
         */
        this.touchStartY = 0;


        /**
         * ID of the last touch, retrieved from Touch.identifier.
         *
         * @type number
         */
        this.lastTouchIdentifier = 0;


        /**
         * Touchmove boundary, beyond which a click will be cancelled.
         *
         * @type number
         */
        this.touchBoundary = options.touchBoundary || 10;


        /**
         * The FastClick layer.
         *
         * @type Element
         */
        this.layer = layer;

        /**
         * The minimum time between tap(touchstart and touchend) events
         *
         * @type number
         */
        this.tapDelay = options.tapDelay || 200;

        /**
         * The maximum time for a tap
         *
         * @type number
         */
        this.tapTimeout = options.tapTimeout || 700;

        if (FastClick.notNeeded(layer)) {
            return;
        }

        // Some old versions of Android don't have Function.prototype.bind
        function bind(method, context) {
            return function () {
                return method.apply(context, arguments);
            };
        }


        var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
        var context = this;
        for (var i = 0, l = methods.length; i < l; i++) {
            context[methods[i]] = bind(context[methods[i]], context);
        }

        // Set up event handlers as required
        if (deviceIsAndroid) {
            layer.addEventListener('mouseover', this.onMouse, true);
            layer.addEventListener('mousedown', this.onMouse, true);
            layer.addEventListener('mouseup', this.onMouse, true);
        }

        layer.addEventListener('click', this.onClick, true);
        layer.addEventListener('touchstart', this.onTouchStart, false);
        layer.addEventListener('touchmove', this.onTouchMove, false);
        layer.addEventListener('touchend', this.onTouchEnd, false);
        layer.addEventListener('touchcancel', this.onTouchCancel, false);

        // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
        // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
        // layer when they are cancelled.
        if (!Event.prototype.stopImmediatePropagation) {
            layer.removeEventListener = function (type, callback, capture) {
                var rmv = Node.prototype.removeEventListener;
                if (type === 'click') {
                    rmv.call(layer, type, callback.hijacked || callback, capture);
                } else {
                    rmv.call(layer, type, callback, capture);
                }
            };

            layer.addEventListener = function (type, callback, capture) {
                var adv = Node.prototype.addEventListener;
                if (type === 'click') {
                    adv.call(layer, type, callback.hijacked || (callback.hijacked = function (event) {
                        if (!event.propagationStopped) {
                            callback(event);
                        }
                    }), capture);
                } else {
                    adv.call(layer, type, callback, capture);
                }
            };
        }

        // If a handler is already declared in the element's onclick attribute, it will be fired before
        // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
        // adding it as listener.
        if (typeof layer.onclick === 'function') {

            // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
            // - the old one won't work if passed to addEventListener directly.
            oldOnClick = layer.onclick;
            layer.addEventListener('click', function (event) {
                oldOnClick(event);
            }, false);
            layer.onclick = null;
        }
    }

    /**
     * Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
     *
     * @type boolean
     */
    var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

    /**
     * Android requires exceptions.
     *
     * @type boolean
     */
    var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


    /**
     * iOS requires exceptions.
     *
     * @type boolean
     */
    var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


    /**
     * iOS 4 requires an exception for select elements.
     *
     * @type boolean
     */
    var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


    /**
     * iOS 6.0-7.* requires the target element to be manually derived
     *
     * @type boolean
     */
    var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

    /**
     * BlackBerry requires exceptions.
     *
     * @type boolean
     */
    var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

    /**
     * 判断是否组合型label
     * @type {Boolean}
     */
    var isCompositeLabel = false;

    /**
     * Determine whether a given element requires a native click.
     *
     * @param {EventTarget|Element} target Target DOM element
     * @returns {boolean} Returns true if the element needs a native click
     */
    FastClick.prototype.needsClick = function (target) {

        // 修复bug: 如果父元素中有 label
        // 如果label上有needsclick这个类，则用原生的点击，否则，用模拟点击
        var parent = target;
        while (parent && (parent.tagName.toUpperCase() !== "BODY")) {
            if (parent.tagName.toUpperCase() === "LABEL") {
                isCompositeLabel = true;
                if ((/\bneedsclick\b/).test(parent.className)) return true;
            }
            parent = parent.parentNode;
        }

        switch (target.nodeName.toLowerCase()) {

            // Don't send a synthetic click to disabled inputs (issue #62)
            case 'button':
            case 'select':
            case 'textarea':
                if (target.disabled) {
                    return true;
                }

                break;
            case 'input':

                // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
                if ((deviceIsIOS && target.type === 'file') || target.disabled) {
                    return true;
                }

                break;
            case 'label':
            case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
            case 'video':
                return true;
        }

        return (/\bneedsclick\b/).test(target.className);
    };


    /**
     * Determine whether a given element requires a call to focus to simulate click into element.
     *
     * @param {EventTarget|Element} target Target DOM element
     * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
     */
    FastClick.prototype.needsFocus = function (target) {
        switch (target.nodeName.toLowerCase()) {
            case 'textarea':
                return true;
            case 'select':
                return !deviceIsAndroid;
            case 'input':
                switch (target.type) {
                    case 'button':
                    case 'checkbox':
                    case 'file':
                    case 'image':
                    case 'radio':
                    case 'submit':
                        return false;
                }

                // No point in attempting to focus disabled inputs
                return !target.disabled && !target.readOnly;
            default:
                return (/\bneedsfocus\b/).test(target.className);
        }
    };


    /**
     * Send a click event to the specified element.
     *
     * @param {EventTarget|Element} targetElement
     * @param {Event} event
     */
    FastClick.prototype.sendClick = function (targetElement, event) {
        var clickEvent, touch;

        // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
        if (document.activeElement && document.activeElement !== targetElement) {
            document.activeElement.blur();
        }

        touch = event.changedTouches[0];

        // Synthesise a click event, with an extra attribute so it can be tracked
        clickEvent = document.createEvent('MouseEvents');
        clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
        clickEvent.forwardedTouchEvent = true;
        targetElement.dispatchEvent(clickEvent);
    };

    FastClick.prototype.determineEventType = function (targetElement) {

        //Issue #159: Android Chrome Select Box does not open with a synthetic click event
        if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
            return 'mousedown';
        }

        return 'click';
    };


    /**
     * @param {EventTarget|Element} targetElement
     */
    FastClick.prototype.focus = function (targetElement) {
        var length;

        // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
        var unsupportedType = ['date', 'time', 'month', 'number', 'email'];
        if (deviceIsIOS && targetElement.setSelectionRange && unsupportedType.indexOf(targetElement.type) === -1) {
            length = targetElement.value.length;
            targetElement.setSelectionRange(length, length);
        } else {
            targetElement.focus();
        }
    };


    /**
     * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
     *
     * @param {EventTarget|Element} targetElement
     */
    FastClick.prototype.updateScrollParent = function (targetElement) {
        var scrollParent, parentElement;

        scrollParent = targetElement.fastClickScrollParent;

        // Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
        // target element was moved to another parent.
        if (!scrollParent || !scrollParent.contains(targetElement)) {
            parentElement = targetElement;
            do {
                if (parentElement.scrollHeight > parentElement.offsetHeight) {
                    scrollParent = parentElement;
                    targetElement.fastClickScrollParent = parentElement;
                    break;
                }

                parentElement = parentElement.parentElement;
            } while (parentElement);
        }

        // Always update the scroll top tracker if possible.
        if (scrollParent) {
            scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
        }
    };


    /**
     * @param {EventTarget} targetElement
     * @returns {Element|EventTarget}
     */
    FastClick.prototype.getTargetElementFromEventTarget = function (eventTarget) {

        // On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
        if (eventTarget.nodeType === Node.TEXT_NODE) {
            return eventTarget.parentNode;
        }

        return eventTarget;
    };


    /**
     * On touch start, record the position and scroll offset.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchStart = function (event) {
        var targetElement, touch, selection;

        // Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
        if (event.targetTouches.length > 1) {
            return true;
        }

        targetElement = this.getTargetElementFromEventTarget(event.target);
        touch = event.targetTouches[0];

        if (deviceIsIOS) {

            // Only trusted events will deselect text on iOS (issue #49)
            selection = window.getSelection();
            if (selection.rangeCount && !selection.isCollapsed) {
                return true;
            }

            if (!deviceIsIOS4) {

                // Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
                // when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
                // with the same identifier as the touch event that previously triggered the click that triggered the alert.
                // Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
                // immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
                // Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
                // which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
                // random integers, it's safe to to continue if the identifier is 0 here.
                if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
                    event.preventDefault();
                    return false;
                }

                this.lastTouchIdentifier = touch.identifier;

                // If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
                // 1) the user does a fling scroll on the scrollable layer
                // 2) the user stops the fling scroll with another tap
                // then the event.target of the last 'touchend' event will be the element that was under the user's finger
                // when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
                // is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
                this.updateScrollParent(targetElement);
            }
        }

        this.trackingClick = true;
        this.trackingClickStart = event.timeStamp;
        this.targetElement = targetElement;

        this.touchStartX = touch.pageX;
        this.touchStartY = touch.pageY;

        // Prevent phantom clicks on fast double-tap (issue #36)
        if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
            event.preventDefault();
        }

        return true;
    };


    /**
     * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.touchHasMoved = function (event) {
        var touch = event.changedTouches[0],
            boundary = this.touchBoundary;

        if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
            return true;
        }

        return false;
    };


    /**
     * Update the last position.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchMove = function (event) {
        if (!this.trackingClick) {
            return true;
        }

        // If the touch has moved, cancel the click tracking
        if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
            this.trackingClick = false;
            this.targetElement = null;
        }

        return true;
    };


    /**
     * Attempt to find the labelled control for the given label element.
     *
     * @param {EventTarget|HTMLLabelElement} labelElement
     * @returns {Element|null}
     */
    FastClick.prototype.findControl = function (labelElement) {

        // Fast path for newer browsers supporting the HTML5 control attribute
        if (labelElement.control !== undefined) {
            return labelElement.control;
        }

        // All browsers under test that support touch events also support the HTML5 htmlFor attribute
        if (labelElement.htmlFor) {
            return document.getElementById(labelElement.htmlFor);
        }

        // If no for attribute exists, attempt to retrieve the first labellable descendant element
        // the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
        return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
    };


    /**
     * On touch end, determine whether to send a click event at once.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchEnd = function (event) {
        var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

        if (!this.trackingClick) {
            return true;
        }

        // Prevent phantom clicks on fast double-tap (issue #36)
        if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
            this.cancelNextClick = true;
            return true;
        }

        if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
            return true;
        }
        //修复安卓微信下，input type="date" 的bug，经测试date,time,month已没问题
        var unsupportedType = ['date', 'time', 'month'];
        if (unsupportedType.indexOf(event.target.type) !== -1) {
            return false;
        }
        // Reset to prevent wrong click cancel on input (issue #156).
        this.cancelNextClick = false;

        this.lastClickTime = event.timeStamp;

        trackingClickStart = this.trackingClickStart;
        this.trackingClick = false;
        this.trackingClickStart = 0;

        // On some iOS devices, the targetElement supplied with the event is invalid if the layer
        // is performing a transition or scroll, and has to be re-detected manually. Note that
        // for this to function correctly, it must be called *after* the event target is checked!
        // See issue #57; also filed as rdar://13048589 .
        if (deviceIsIOSWithBadTarget) {
            touch = event.changedTouches[0];

            // In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
            targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
            targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
        }

        targetTagName = targetElement.tagName.toLowerCase();
        if (targetTagName === 'label') {
            forElement = this.findControl(targetElement);
            if (forElement) {
                this.focus(targetElement);
                if (deviceIsAndroid) {
                    return false;
                }

                targetElement = forElement;
            }
        } else if (this.needsFocus(targetElement)) {

            // Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
            // Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
            if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
                this.targetElement = null;
                return false;
            }

            this.focus(targetElement);
            this.sendClick(targetElement, event);

            // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
            // Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
            if (!deviceIsIOS || targetTagName !== 'select') {
                this.targetElement = null;
                event.preventDefault();
            }

            return false;
        }

        if (deviceIsIOS && !deviceIsIOS4) {

            // Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
            // and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
            scrollParent = targetElement.fastClickScrollParent;
            if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
                return true;
            }
        }

        // Prevent the actual click from going though - unless the target node is marked as requiring
        // real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
        if (!this.needsClick(targetElement)) {
            event.preventDefault();
            this.sendClick(targetElement, event);
        }

        return false;
    };


    /**
     * On touch cancel, stop tracking the click.
     *
     * @returns {void}
     */
    FastClick.prototype.onTouchCancel = function () {
        this.trackingClick = false;
        this.targetElement = null;
    };


    /**
     * Determine mouse events which should be permitted.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onMouse = function (event) {

        // If a target element was never set (because a touch event was never fired) allow the event
        if (!this.targetElement) {
            return true;
        }

        if (event.forwardedTouchEvent) {
            return true;
        }

        // Programmatically generated events targeting a specific element should be permitted
        if (!event.cancelable) {
            return true;
        }

        // Derive and check the target element to see whether the mouse event needs to be permitted;
        // unless explicitly enabled, prevent non-touch click events from triggering actions,
        // to prevent ghost/doubleclicks.
        if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

            // Prevent any user-added listeners declared on FastClick element from being fired.
            if (event.stopImmediatePropagation) {
                event.stopImmediatePropagation();
            } else {

                // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
                event.propagationStopped = true;
            }

            // Cancel the event
            event.stopPropagation();
            // 允许组合型label冒泡
            if (!isCompositeLabel) {
                event.preventDefault();
            }
            // 允许组合型label冒泡
            return false;
        }

        // If the mouse event is permitted, return true for the action to go through.
        return true;
    };


    /**
     * On actual clicks, determine whether this is a touch-generated click, a click action occurring
     * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
     * an actual click which should be permitted.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onClick = function (event) {
        var permitted;

        // It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
        if (this.trackingClick) {
            this.targetElement = null;
            this.trackingClick = false;
            return true;
        }

        // Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
        if (event.target.type === 'submit' && event.detail === 0) {
            return true;
        }

        permitted = this.onMouse(event);

        // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
        if (!permitted) {
            this.targetElement = null;
        }

        // If clicks are permitted, return true for the action to go through.
        return permitted;
    };


    /**
     * Remove all FastClick's event listeners.
     *
     * @returns {void}
     */
    FastClick.prototype.destroy = function () {
        var layer = this.layer;

        if (deviceIsAndroid) {
            layer.removeEventListener('mouseover', this.onMouse, true);
            layer.removeEventListener('mousedown', this.onMouse, true);
            layer.removeEventListener('mouseup', this.onMouse, true);
        }

        layer.removeEventListener('click', this.onClick, true);
        layer.removeEventListener('touchstart', this.onTouchStart, false);
        layer.removeEventListener('touchmove', this.onTouchMove, false);
        layer.removeEventListener('touchend', this.onTouchEnd, false);
        layer.removeEventListener('touchcancel', this.onTouchCancel, false);
    };


    /**
     * Check whether FastClick is needed.
     *
     * @param {Element} layer The layer to listen on
     */
    FastClick.notNeeded = function (layer) {
        var metaViewport;
        var chromeVersion;
        var blackberryVersion;
        var firefoxVersion;

        // Devices that don't support touch don't need FastClick
        if (typeof window.ontouchstart === 'undefined') {
            return true;
        }

        // Chrome version - zero for other browsers
        chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

        if (chromeVersion) {

            if (deviceIsAndroid) {
                metaViewport = document.querySelector('meta[name=viewport]');

                if (metaViewport) {
                    // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
                    if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
                        return true;
                    }
                    // Chrome 32 and above with width=device-width or less don't need FastClick
                    if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
                        return true;
                    }
                }

                // Chrome desktop doesn't need FastClick (issue #15)
            } else {
                return true;
            }
        }

        if (deviceIsBlackBerry10) {
            blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

            // BlackBerry 10.3+ does not require Fastclick library.
            // https://github.com/ftlabs/fastclick/issues/251
            if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
                metaViewport = document.querySelector('meta[name=viewport]');

                if (metaViewport) {
                    // user-scalable=no eliminates click delay.
                    if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
                        return true;
                    }
                    // width=device-width (or less than device-width) eliminates click delay.
                    if (document.documentElement.scrollWidth <= window.outerWidth) {
                        return true;
                    }
                }
            }
        }

        // IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
        if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
            return true;
        }

        // Firefox version - zero for other browsers
        firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

        if (firefoxVersion >= 27) {
            // Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

            metaViewport = document.querySelector('meta[name=viewport]');
            if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
                return true;
            }
        }

        // IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
        // http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
        if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
            return true;
        }

        return false;
    };


    /**
     * Factory method for creating a FastClick object
     *
     * @param {Element} layer The layer to listen on
     * @param {Object} [options={}] The options to override the defaults
     */
    FastClick.attach = function (layer, options) {
        return new FastClick(layer, options);
    };

    window.FastClick = FastClick;

}());
 /**
  * 中文的MD5加密
  * @author: minzhang
  * @update: 2016-09-29
  */

 ;
 (function () {
 	"use strict";

 	var md5 = function (a) {
 		function b(a, b) {
 			var c = (a & 65535) + (b & 65535);
 			return (a >> 16) + (b >> 16) + (c >> 16) << 16 | c & 65535
 		}

 		function c(a, c, d, f, k, o) {
 			a = b(b(c, a), b(f, o));
 			return b(a << k | a >>> 32 - k, d)
 		}

 		function d(a, b, d, f, k, o, g) {
 			return c(b & d | ~b & f, a, b, k, o, g)
 		}

 		function f(a, b, d, f, k, o, g) {
 			return c(b & f | d & ~f, a, b, k, o, g)
 		}

 		function k(a, b, d, f, k, o, g) {
 			return c(d ^ (b | ~f), a, b, k, o, g)
 		}

 		return function (a) {
 			var b = "",
 				c, d;
 			for (d = 0; d < a.length; d += 1) c = a.charCodeAt(d), b += "0123456789abcdef".charAt(c >>> 4 & 15) + "0123456789abcdef".charAt(c & 15);
 			return b
 		}(function (a) {
 			var e = unescape(encodeURIComponent(a)),
 				m, a = [];
 			a[(e.length >> 2) - 1] = void 0;
 			for (m = 0; m < a.length; m += 1) a[m] = 0;
 			for (m = 0; m < 8 * e.length; m += 8) a[m >> 5] |= (e.charCodeAt(m / 8) & 255) << m % 32;
 			e = 8 * e.length;
 			a[e >> 5] |= 128 << e % 32;
 			a[(e + 64 >>> 9 << 4) + 14] = e;
 			for (var p, n, o, g = 1732584193, h = -271733879, i = -1732584194, j = 271733878, e = 0; e < a.length; e += 16) m = g, p = h, n = i, o = j, g = d(g, h, i, j, a[e], 7, -680876936), j = d(j, g, h, i, a[e + 1], 12, -389564586), i = d(i, j, g, h, a[e + 2], 17, 606105819), h = d(h, i, j, g, a[e + 3], 22, -1044525330), g = d(g, h, i, j, a[e + 4], 7, -176418897), j = d(j, g, h, i, a[e + 5], 12, 1200080426), i = d(i, j, g, h, a[e + 6], 17, -1473231341), h = d(h, i, j, g, a[e + 7], 22, -45705983), g = d(g, h, i, j, a[e + 8], 7, 1770035416), j = d(j, g, h, i, a[e + 9], 12, -1958414417), i = d(i, j, g, h, a[e + 10], 17, -42063), h = d(h, i, j, g, a[e + 11], 22, -1990404162), g = d(g, h, i, j, a[e + 12], 7, 1804603682), j = d(j, g, h, i, a[e + 13], 12, -40341101), i = d(i, j, g, h, a[e + 14], 17, -1502002290), h = d(h, i, j, g, a[e + 15], 22, 1236535329), g = f(g, h, i, j, a[e + 1], 5, -165796510), j = f(j, g, h, i, a[e + 6], 9, -1069501632), i = f(i, j, g, h, a[e + 11], 14, 643717713), h = f(h, i, j, g, a[e], 20, -373897302), g = f(g, h, i, j, a[e + 5], 5, -701558691), j = f(j, g, h, i, a[e + 10], 9, 38016083), i = f(i, j, g, h, a[e + 15], 14, -660478335), h = f(h, i, j, g, a[e + 4], 20, -405537848), g = f(g, h, i, j, a[e + 9], 5, 568446438), j = f(j, g, h, i, a[e + 14], 9, -1019803690), i = f(i, j, g, h, a[e + 3], 14, -187363961), h = f(h, i, j, g, a[e + 8], 20, 1163531501), g = f(g, h, i, j, a[e + 13], 5, -1444681467), j = f(j, g, h, i, a[e + 2], 9, -51403784), i = f(i, j, g, h, a[e + 7], 14, 1735328473), h = f(h, i, j, g, a[e + 12], 20, -1926607734), g = c(h ^ i ^ j, g, h, a[e + 5], 4, -378558), j = c(g ^ h ^ i, j, g, a[e + 8], 11, -2022574463), i = c(j ^ g ^ h, i, j, a[e + 11], 16, 1839030562), h = c(i ^ j ^ g, h, i, a[e + 14], 23, -35309556), g = c(h ^ i ^ j, g, h, a[e + 1], 4, -1530992060), j = c(g ^ h ^ i, j, g, a[e + 4], 11, 1272893353), i = c(j ^ g ^ h, i, j, a[e + 7], 16, -155497632), h = c(i ^ j ^ g, h, i, a[e + 10], 23, -1094730640), g = c(h ^ i ^ j, g, h, a[e + 13], 4, 681279174), j = c(g ^ h ^ i, j, g, a[e], 11, -358537222), i = c(j ^ g ^ h, i, j, a[e + 3], 16, -722521979), h = c(i ^ j ^ g, h, i, a[e + 6], 23, 76029189), g = c(h ^ i ^ j, g, h, a[e + 9], 4, -640364487), j = c(g ^ h ^ i, j, g, a[e + 12], 11, -421815835), i = c(j ^ g ^ h, i, j, a[e + 15], 16, 530742520), h = c(i ^ j ^ g, h, i, a[e + 2], 23, -995338651), g = k(g, h, i, j, a[e], 6, -198630844), j = k(j, g, h, i, a[e + 7], 10, 1126891415), i = k(i, j, g, h, a[e + 14], 15, -1416354905), h = k(h, i, j, g, a[e + 5], 21, -57434055), g = k(g, h, i, j, a[e + 12], 6, 1700485571), j = k(j, g, h, i, a[e + 3], 10, -1894986606), i = k(i, j, g, h, a[e + 10], 15, -1051523), h = k(h, i, j, g, a[e + 1], 21, -2054922799), g = k(g, h, i, j, a[e + 8], 6, 1873313359), j = k(j, g, h, i, a[e + 15], 10, -30611744), i = k(i, j, g, h, a[e + 6], 15, -1560198380), h = k(h, i, j, g, a[e + 13], 21, 1309151649), g = k(g, h, i, j, a[e + 4], 6, -145523070), j = k(j, g, h, i, a[e + 11], 10, -1120210379), i = k(i, j, g, h, a[e + 2], 15, 718787259), h = k(h, i, j, g, a[e + 9], 21, -343485551), g = b(g, m), h = b(h, p), i = b(i, n), j = b(j, o);
 			a = [g, h, i, j];
 			m = "";
 			for (e = 0; e < 32 * a.length; e += 8) m += String.fromCharCode(a[e >> 5] >>> e % 32 & 255);
 			return m
 		}(a));
 	}

 	$.md5 = md5;

 })();
/**
 * 观察者模式
 * @author: minzhang
 * @update: 2016-10-31
 */
;
(function () {
	$.observer = function () {
		var ob = function () {
			//订阅者数组
			this.subscribers = [];
		}
		ob.prototype = {
			//订阅方法，返回订阅event标识符
			sub: function (evt, fn) {
				this.subscribers[evt] ? this.subscribers[evt].push(fn) : (this.subscribers[evt] = []) && this.subscribers[evt].push(fn);
				//                    return '{"evt":"' + evt +'","fn":"' + (this.subscribers[evt].length - 1) + '"}';
			},
			//发布方法，成功后返回自身
			pub: function (evt, args) {
				if (this.subscribers[evt]) {
					for (var i in this.subscribers[evt]) {
						if (typeof (this.subscribers[evt][i]) === 'function') {
							this.subscribers[evt][i](args);
						}
					};
					return this;
				}
				return false;
			},
			//解除订阅，需传入订阅event标识符
			unsub: function (subId) {
				try {
					var id = JSON.parse(subId);
					this.subscribers[id.evt][id.fn] = null;
					delete this.subscribers[id.evt][id.fn];
				} catch (err) {
					console.log(err);
				}
			}
		}
		return new ob();
	}
})(window);
/**
 * 添加到浏览器的缓存中，可以利用浏览器的返回键进行返回
 * @param   {Object} state 给页面添加state
 * @param   {String} title 添加浏览器history缓存的title
 * @param   {Function} callback 监听浏览器变化的回调函数
 */
;
(function ($) {
	window.addEventListener("load", function () {
		if (history.state && history.state.page) {
			//                history.replaceState(null, '');
			history.go(0 - history.state.page);
		}
	});
	
	$.router = function () {
		var Router = function () {
			var that = this;
			that.oldTitle = document.title;
			//订阅者数组
			this.historys = [];
			window.addEventListener("popstate", function (e) {
				e.preventDefault();
				that.historys.length && that.historys.pop()();
				$.utils.setTitle(that.oldTitle);
			});
		}
		Router.prototype = {
			// 添加到history中
			push: function (state, title, callback) {
				this.historys.push(callback);
				history.pushState(state, title);
				$.utils.setTitle(title);
			},

		}
		return new Router();
	}
})($);
/**
 * modal
 * @author: minzhang
 * @update: 2016-12-16
 */

;(function($) {
  "use strict";

  var defaults;
  
  $.modal = function(params, onOpen) {
    params = $.extend({}, defaults, params);


    var buttons = params.buttons;

    var buttonsHtml = buttons.map(function(d, i) {
      return '<button type="button" class="ui-btn-dialog ui-light ' + (d.className || "") + '">' + d.text + '</button>';
    }).join("");

    var tpl = '<div class="ui-dialog-wrap"><div class="ui-dialog">' +
                '<div class="ui-dialog-hd"><div class="ui-dialog-title">' + params.title + '</div></div>' +
                ( params.text ? '<div class="ui-dialog-bd">'+params.text+'</div>' : '')+
                '<div class="ui-dialog-ft">' + buttonsHtml + '</div>' +
              '</div></div>';
    
    var dialog = $.openModal(tpl, onOpen);

    dialog.find(".ui-btn-dialog").each(function(i, e) {
      var el = $(e);
      el.click(function() {
        //先关闭对话框，再调用回调函数
        if(params.autoClose) $.closeModal();

        if(buttons[i].onClick) {
          buttons[i].onClick.call(dialog);
        }
      });
    });

    return dialog;
  };

  $.openModal = function(tpl, onOpen) {
    var mask = $("<div class='ui-mask'></div>").appendTo(document.body);
    mask.show();

    var dialog = $(tpl).appendTo(document.body);
 
    if (onOpen) {
      dialog.transitionEnd(function () {
        onOpen.call(dialog);
      });
    }   

    dialog.show();
    mask.addClass("ui-mask-visible");
    dialog.addClass("ui-dialog-visible");


    return dialog;
  }

  $.closeModal = function() {
    $(".ui-mask-visible").removeClass("ui-mask-visible").transitionEnd(function() {
      $(this).remove();
    });
    $(".ui-dialog-visible").removeClass("ui-dialog-visible").transitionEnd(function() {
      $(this).remove();
    });
  };

  $.alert = function(text, title, onOK) {
    var config;
    if (typeof text === 'object') {
      config = text;
    } else {
      if (typeof title === 'function') {
        onOK = arguments[1];
        title = undefined;
      }

      config = {
        text: text,
        title: title,
        onOK: onOK
      }
    }
    return $.modal({
      text: config.text,
      title: config.title,
      buttons: [{
        text: defaults.buttonOK,
        className: "primary",
        onClick: config.onOK
      }]
    });
  }

  $.confirm = function(text, title, onOK, onCancel) {
    var config;
    if (typeof text === 'object') {
      config = text
    } else {
      if (typeof title === 'function') {
        onCancel = arguments[2];
        onOK = arguments[1];
        title = undefined;
      }

      config = {
        text: text,
        title: title,
        onOK: onOK,
        onCancel: onCancel
      }
    }
    return $.modal({
      text: config.text,
      title: config.title,
      buttons: [
      {
        text: defaults.buttonCancel,
        className: "default",
        onClick: config.onCancel
      },
      {
        text: defaults.buttonOK,
        className: "primary",
        onClick: config.onOK
      }]
    });
  };

  //如果参数过多，建议通过 config 对象进行配置，而不是传入多个参数。
  $.prompt = function(text, title, onOK, onCancel, input) {
    var config;
    if (typeof text === 'object') {
      config = text;
    } else {
      if (typeof title === 'function') {
        input = arguments[3];
        onCancel = arguments[2];
        onOK = arguments[1];
        title = undefined;
      }
      config = {
        text: text,
        title: title,
        input: input,
        onOK: onOK,
        onCancel: onCancel,
        empty: false  //allow empty
      }
    }

    var modal = $.modal({
      text: '<p class="ui-prompt-text">'+(config.text || '')+'</p><input type="text" class="ui-input ui-prompt-input" id="ui-prompt-input" value="' + (config.input || '') + '" />',
      title: config.title,
      autoClose: false,
      buttons: [
      {
        text: defaults.buttonCancel,
        className: "default",
        onClick: function () {
          $.closeModal();
          config.onCancel && config.onCancel.call(modal);
        }
      },
      {
        text: defaults.buttonOK,
        className: "primary",
        onClick: function() {
          var input = $("#ui-prompt-input").val();
          if (!config.empty && (input === "" || input === null)) {
            modal.find('.ui-prompt-input').focus()[0].select();
            return false;
          }
          $.closeModal();
          config.onOK && config.onOK.call(modal, input);
        }
      }]
    }, function () {
      this.find('.ui-prompt-input').focus()[0].select();
    });

    return modal;
  };

  //如果参数过多，建议通过 config 对象进行配置，而不是传入多个参数。
  $.login = function(text, title, onOK, onCancel, username, password) {
    var config;
    if (typeof text === 'object') {
      config = text;
    } else {
      if (typeof title === 'function') {
        password = arguments[4];
        username = arguments[3];
        onCancel = arguments[2];
        onOK = arguments[1];
        title = undefined;
      }
      config = {
        text: text,
        title: title,
        username: username,
        password: password,
        onOK: onOK,
        onCancel: onCancel
      }
    }

    var modal = $.modal({
      text: '<p class="ui-prompt-text">'+(config.text || '')+'</p>' +
            '<input type="text" class="ui-input ui-prompt-input" id="ui-prompt-username" value="' + (config.username || '') + '" placeholder="输入用户名" />' +
            '<input type="password" class="ui-input ui-prompt-input" id="ui-prompt-password" value="' + (config.password || '') + '" placeholder="输入密码" />',
      title: config.title,
      autoClose: false,
      buttons: [
      {
        text: defaults.buttonCancel,
        className: "default",
        onClick: function () {
          $.closeModal();
          config.onCancel && config.onCancel.call(modal);
        }
      }, {
        text: defaults.buttonOK,
        className: "primary",
        onClick: function() {
          var username = $("#ui-prompt-username").val();
          var password = $("#ui-prompt-password").val();
          if (!config.empty && (username === "" || username === null)) {
            modal.find('#ui-prompt-username').focus()[0].select();
            return false;
          }
          if (!config.empty && (password === "" || password === null)) {
            modal.find('#ui-prompt-password').focus()[0].select();
            return false;
          }
          $.closeModal();
          config.onOK && config.onOK.call(modal, username, password);
        }
      }]
    }, function () {
      this.find('#ui-prompt-username').focus()[0].select();
    });

    return modal;
  };

  defaults = $.modal.prototype.defaults = {
    title: "提示",
    text: undefined,
    buttonOK: "确定",
    buttonCancel: "取消",
    buttons: [{
      text: "确定",
      className: "primary"
    }],
    autoClose: true //点击按钮自动关闭对话框，如果你不希望点击按钮就关闭对话框，可以把这个设置为false
  };

})($);
;(function($) {
  "use strict";

  var defaults;
  
  var show = function(params) {

    var mask = $("<div class='ui-mask ui-actions-mask'></div>").appendTo(document.body);

    var actions = params.actions || [];

    var actionsHtml = actions.map(function(d, i) {
      return '<div class="ui-actionsheet-cell ui-light ' + (d.className || "") + '">' + d.text + '</div>';
    }).join("");

    var titleHtml = "";
    
    if (params.title) {
      titleHtml = '<div class="ui-actionsheet-title">' + params.title + '</div>';
    }

    var tpl = '<div class="ui-actionsheet " id="ui-actionsheet">'+
                titleHtml +
                '<div class="ui-actionsheet-menu">'+
                actionsHtml +
                '</div>'+
                '<div class="ui-actionsheet-action">'+
                  '<div class="ui-actionsheet-cell ui-actionsheet-cancel ui-light">取消</div>'+
                  '</div>'+
                '</div>';
    var dialog = $(tpl).appendTo(document.body);

    dialog.find(".ui-actionsheet-menu .ui-actionsheet-cell, .ui-actionsheet-action .ui-actionsheet-cell").each(function(i, e) {
      $(e).click(function() {
        $.closeActions();
        params.onClose && params.onClose();
        if(actions[i] && actions[i].onClick) {
          actions[i].onClick();
        }
      })
    });

    mask.show();
    dialog.show();
    mask.addClass("ui-mask-visible");
    dialog.addClass("ui-actionsheet-toggle");
  };

  var hide = function() {
    $(".ui-mask").removeClass("ui-mask-visible").transitionEnd(function() {
      $(this).remove();
    });
    $(".ui-actionsheet").removeClass("ui-actionsheet-toggle").transitionEnd(function() {
      $(this).remove();
    });
  }

  $.actions = function(params) {
    params = $.extend({}, defaults, params);
    show(params);
  }

  $.closeActions = function() {
    hide();
  }

  $(document).on("click", ".ui-actions-mask", function() {
    $.closeActions();
  });

  var defaults = $.actions.prototype.defaults = {
    title: undefined,
    onClose: undefined,
    /*actions: [{
      text: "菜单",
      className: "color-danger",
      onClick: function() {
        console.log(1);
      }
    },{
      text: "菜单2",
      className: "color-success",
      onClick: function() {
        console.log(2);
      }
    }]*/
  }

})($);

/*======================================================
************   Calendar   ************
======================================================*/
/* global $:true */
/*jshint unused: false*/
+function ($) {
  "use strict";
  var rtl = false;
  var defaults;
  var Calendar = function (params) {
      var p = this;
      params = params || {};
      for (var def in defaults) {
          if (typeof params[def] === 'undefined') {
              params[def] = defaults[def];
          }
      }
      p.params = params;
      p.initialized = false;

      // Inline flag
      p.inline = p.params.container ? true : false;

      // Is horizontal
      p.isH = p.params.direction === 'horizontal';

      // RTL inverter
      var inverter = p.isH ? (rtl ? -1 : 1) : 1;

      // Animating flag
      p.animating = false;

      // Should be converted to popover
      function isPopover() {
          var toPopover = false;
          if (!p.params.convertToPopover && !p.params.onlyInPopover) return toPopover;
          if (!p.inline && p.params.input) {
              if (p.params.onlyInPopover) toPopover = true;
              else {
                  if ($.device.ios) {
                      toPopover = $.device.ipad ? true : false;
                  }
                  else {
                      if ($(window).width() >= 768) toPopover = true;
                  }
              }
          } 
          return toPopover; 
      }
      function inPopover() {
          if (p.opened && p.container && p.container.length > 0 && p.container.parents('.popover').length > 0) return true;
          else return false;
      }

      // Format date
      function formatDate(date) {
          date = new Date(date);
          var year = date.getFullYear();
          var month = date.getMonth();
          var month1 = month + 1;
          var day = date.getDate();
          var weekDay = date.getDay();
          return p.params.dateFormat
              .replace(/yyyy/g, year)
              .replace(/yy/g, (year + '').substring(2))
              .replace(/mm/g, month1 < 10 ? '0' + month1 : month1)
              .replace(/m/g, month1)
              .replace(/MM/g, p.params.monthNames[month])
              .replace(/M/g, p.params.monthNamesShort[month])
              .replace(/dd/g, day < 10 ? '0' + day : day)
              .replace(/d/g, day)
              .replace(/DD/g, p.params.dayNames[weekDay])
              .replace(/D/g, p.params.dayNamesShort[weekDay]);
      }


      // Value
      p.addValue = function (value) {
          if (p.params.multiple) {
              if (!p.value) p.value = [];
              var inValuesIndex;
              for (var i = 0; i < p.value.length; i++) {
                  if (new Date(value).getTime() === new Date(p.value[i]).getTime()) {
                      inValuesIndex = i;
                  }
              }
              if (typeof inValuesIndex === 'undefined') {
                  p.value.push(value);
              }
              else {
                  p.value.splice(inValuesIndex, 1);
              }
              p.updateValue();
          }
          else {
              p.value = [value];
              p.updateValue();
          }
      };
      p.setValue = function (arrValues) {
        var date = new Date(arrValues[0]);
        p.setYearMonth(date.getFullYear(), date.getMonth());
        p.addValue(+ date);
      };
      p.updateValue = function () {
          p.wrapper.find('.picker-calendar-day-selected').removeClass('picker-calendar-day-selected');
          var i, inputValue;
          for (i = 0; i < p.value.length; i++) {
              var valueDate = new Date(p.value[i]);
              p.wrapper.find('.picker-calendar-day[data-date="' + valueDate.getFullYear() + '-' + valueDate.getMonth() + '-' + valueDate.getDate() + '"]').addClass('picker-calendar-day-selected');
          }
          if (p.params.onChange) {
            p.params.onChange(p, p.value.map(formatDate), p.value.map(function (d) {
              return + new Date(typeof d === typeof 'a' ? d.split(/\D/).filter(function (a) { return !!a; }).join("-") : d);
            }));
          }
          if (p.input && p.input.length > 0) {
              if (p.params.formatValue) inputValue = p.params.formatValue(p, p.value);
              else {
                  inputValue = [];
                  for (i = 0; i < p.value.length; i++) {
                      inputValue.push(formatDate(p.value[i]));
                  }
                  inputValue = inputValue.join(', ');
              } 
              $(p.input).val(inputValue);
              $(p.input).trigger('change');
          }
      };

      // Columns Handlers
      p.initCalendarEvents = function () {
          var col;
          var allowItemClick = true;
          var isTouched, isMoved, touchStartX, touchStartY, touchCurrentX, touchCurrentY, touchStartTime, touchEndTime, startTranslate, currentTranslate, wrapperWidth, wrapperHeight, percentage, touchesDiff, isScrolling;
          function handleTouchStart (e) {
              if (isMoved || isTouched) return;
              // e.preventDefault();
              isTouched = true;
              var position = $.getTouchPosition(e);
              touchStartX = touchCurrentY = position.x;
              touchStartY = touchCurrentY = position.y;
              touchStartTime = (new Date()).getTime();
              percentage = 0;
              allowItemClick = true;
              isScrolling = undefined;
              startTranslate = currentTranslate = p.monthsTranslate;
          }
          function handleTouchMove (e) {
              if (!isTouched) return;
              var position = $.getTouchPosition(e);
              touchCurrentX = position.x;
              touchCurrentY = position.y;
              if (typeof isScrolling === 'undefined') {
                  isScrolling = !!(isScrolling || Math.abs(touchCurrentY - touchStartY) > Math.abs(touchCurrentX - touchStartX));
              }
              if (p.isH && isScrolling) {
                  isTouched = false;
                  return;
              }
              e.preventDefault();
              if (p.animating) {
                  isTouched = false;
                  return;   
              }
              allowItemClick = false;
              if (!isMoved) {
                  // First move
                  isMoved = true;
                  wrapperWidth = p.wrapper[0].offsetWidth;
                  wrapperHeight = p.wrapper[0].offsetHeight;
                  p.wrapper.transition(0);
              }
              e.preventDefault();

              touchesDiff = p.isH ? touchCurrentX - touchStartX : touchCurrentY - touchStartY;
              percentage = touchesDiff/(p.isH ? wrapperWidth : wrapperHeight);
              currentTranslate = (p.monthsTranslate * inverter + percentage) * 100;

              // Transform wrapper
              p.wrapper.transform('translate3d(' + (p.isH ? currentTranslate : 0) + '%, ' + (p.isH ? 0 : currentTranslate) + '%, 0)');

          }
          function handleTouchEnd (e) {
              if (!isTouched || !isMoved) {
                  isTouched = isMoved = false;
                  return;
              }
              isTouched = isMoved = false;
              
              touchEndTime = new Date().getTime();
              if (touchEndTime - touchStartTime < 300) {
                  if (Math.abs(touchesDiff) < 10) {
                      p.resetMonth();
                  }
                  else if (touchesDiff >= 10) {
                      if (rtl) p.nextMonth();
                      else p.prevMonth();
                  }
                  else {
                      if (rtl) p.prevMonth();
                      else p.nextMonth();   
                  }
              }
              else {
                  if (percentage <= -0.5) {
                      if (rtl) p.prevMonth();
                      else p.nextMonth();
                  }
                  else if (percentage >= 0.5) {
                      if (rtl) p.nextMonth();
                      else p.prevMonth();
                  }
                  else {
                      p.resetMonth();
                  }
              }

              // Allow click
              setTimeout(function () {
                  allowItemClick = true;
              }, 100);
          }

          function handleDayClick(e) {
              if (!allowItemClick) return;
              var day = $(e.target).parents('.picker-calendar-day');
              if (day.length === 0 && $(e.target).hasClass('picker-calendar-day')) {
                  day = $(e.target);
              }
              if (day.length === 0) return;
              // if (day.hasClass('picker-calendar-day-selected') && !p.params.multiple) return;
              if (day.hasClass('picker-calendar-day-disabled')) return;
              if (day.hasClass('picker-calendar-day-next')) p.nextMonth();
              if (day.hasClass('picker-calendar-day-prev')) p.prevMonth();
              var dateYear = day.attr('data-year');
              var dateMonth = day.attr('data-month');
              var dateDay = day.attr('data-day');
              if (p.params.onDayClick) {
                  p.params.onDayClick(p, day[0], dateYear, dateMonth, dateDay);
              }
              p.addValue(new Date(dateYear, dateMonth, dateDay).getTime());
              if (p.params.closeOnSelect && !p.params.multiple) p.close();
          }

          p.container.find('.picker-calendar-prev-month').on('click', p.prevMonth);
          p.container.find('.picker-calendar-next-month').on('click', p.nextMonth);
          p.container.find('.picker-calendar-prev-year').on('click', p.prevYear);
          p.container.find('.picker-calendar-next-year').on('click', p.nextYear);
          p.wrapper.on('click', handleDayClick);
          if (p.params.touchMove) {
              p.wrapper.on($.touchEvents.start, handleTouchStart);
              p.wrapper.on($.touchEvents.move, handleTouchMove);
              p.wrapper.on($.touchEvents.end, handleTouchEnd);
          }
              
          p.container[0].f7DestroyCalendarEvents = function () {
              p.container.find('.picker-calendar-prev-month').off('click', p.prevMonth);
              p.container.find('.picker-calendar-next-month').off('click', p.nextMonth);
              p.container.find('.picker-calendar-prev-year').off('click', p.prevYear);
              p.container.find('.picker-calendar-next-year').off('click', p.nextYear);
              p.wrapper.off('click', handleDayClick);
              if (p.params.touchMove) {
                  p.wrapper.off($.touchEvents.start, handleTouchStart);
                  p.wrapper.off($.touchEvents.move, handleTouchMove);
                  p.wrapper.off($.touchEvents.end, handleTouchEnd);
              }
          };
          

      };
      p.destroyCalendarEvents = function (colContainer) {
          if ('f7DestroyCalendarEvents' in p.container[0]) p.container[0].f7DestroyCalendarEvents();
      };

      // Calendar Methods
      p.daysInMonth = function (date) {
          var d = new Date(date);
          return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      };
      p.monthHTML = function (date, offset) {
          date = new Date(date);
          var year = date.getFullYear(),
              month = date.getMonth(),
              day = date.getDate();
          if (offset === 'next') {
              if (month === 11) date = new Date(year + 1, 0);
              else date = new Date(year, month + 1, 1);
          }
          if (offset === 'prev') {
              if (month === 0) date = new Date(year - 1, 11);
              else date = new Date(year, month - 1, 1);
          }
          if (offset === 'next' || offset === 'prev') {
              month = date.getMonth();
              year = date.getFullYear();
          }
          var daysInPrevMonth = p.daysInMonth(new Date(date.getFullYear(), date.getMonth()).getTime() - 10 * 24 * 60 * 60 * 1000),
              daysInMonth = p.daysInMonth(date),
              firstDayOfMonthIndex = new Date(date.getFullYear(), date.getMonth()).getDay();
          if (firstDayOfMonthIndex === 0) firstDayOfMonthIndex = 7;
          
          var dayDate, currentValues = [], i, j,
              rows = 6, cols = 7,
              monthHTML = '',
              dayIndex = 0 + (p.params.firstDay - 1),    
              today = new Date().setHours(0,0,0,0),
              minDate = p.params.minDate ? new Date(p.params.minDate).getTime() : null,
              maxDate = p.params.maxDate ? new Date(p.params.maxDate).getTime() : null;

          if (p.value && p.value.length) {
              for (i = 0; i < p.value.length; i++) {
                  currentValues.push(new Date(p.value[i]).setHours(0,0,0,0));
              }
          }
              
          for (i = 1; i <= rows; i++) {
              var rowHTML = '';
              var row = i;
              for (j = 1; j <= cols; j++) {
                  var col = j;
                  dayIndex ++;
                  var dayNumber = dayIndex - firstDayOfMonthIndex;
                  var addClass = '';
                  if (dayNumber < 0) {
                      dayNumber = daysInPrevMonth + dayNumber + 1;
                      addClass += ' picker-calendar-day-prev';
                      dayDate = new Date(month - 1 < 0 ? year - 1 : year, month - 1 < 0 ? 11 : month - 1, dayNumber).getTime();
                  }
                  else {
                      dayNumber = dayNumber + 1;
                      if (dayNumber > daysInMonth) {
                          dayNumber = dayNumber - daysInMonth;
                          addClass += ' picker-calendar-day-next';
                          dayDate = new Date(month + 1 > 11 ? year + 1 : year, month + 1 > 11 ? 0 : month + 1, dayNumber).getTime();
                      }
                      else {
                          dayDate = new Date(year, month, dayNumber).getTime();    
                      }
                  }
                  // Today
                  if (dayDate === today) addClass += ' picker-calendar-day-today';
                  // Selected
                  if (currentValues.indexOf(dayDate) >= 0) addClass += ' picker-calendar-day-selected';
                  // Weekend
                  if (p.params.weekendDays.indexOf(col - 1) >= 0) {
                      addClass += ' picker-calendar-day-weekend';
                  }
                  // Disabled
                  if ((minDate && dayDate < minDate) || (maxDate && dayDate > maxDate)) {
                      addClass += ' picker-calendar-day-disabled';   
                  }

                  dayDate = new Date(dayDate);
                  var dayYear = dayDate.getFullYear();
                  var dayMonth = dayDate.getMonth();
                  rowHTML += '<div data-year="' + dayYear + '" data-month="' + dayMonth + '" data-day="' + dayNumber + '" class="picker-calendar-day' + (addClass) + '" data-date="' + (dayYear + '-' + dayMonth + '-' + dayNumber) + '"><span>'+dayNumber+'</span></div>';
              }
              monthHTML += '<div class="picker-calendar-row">' + rowHTML + '</div>';
          }
          monthHTML = '<div class="picker-calendar-month" data-year="' + year + '" data-month="' + month + '">' + monthHTML + '</div>';
          return monthHTML;
      };
      p.animating = false;
      p.updateCurrentMonthYear = function (dir) {
          if (typeof dir === 'undefined') {
              p.currentMonth = parseInt(p.months.eq(1).attr('data-month'), 10);
              p.currentYear = parseInt(p.months.eq(1).attr('data-year'), 10);   
          }
          else {
              p.currentMonth = parseInt(p.months.eq(dir === 'next' ? (p.months.length - 1) : 0).attr('data-month'), 10);
              p.currentYear = parseInt(p.months.eq(dir === 'next' ? (p.months.length - 1) : 0).attr('data-year'), 10);
          }
          p.container.find('.current-month-value').text(p.params.monthNames[p.currentMonth]);
          p.container.find('.current-year-value').text(p.currentYear);
              
      };
      p.onMonthChangeStart = function (dir) {
          p.updateCurrentMonthYear(dir);
          p.months.removeClass('picker-calendar-month-current picker-calendar-month-prev picker-calendar-month-next');
          var currentIndex = dir === 'next' ? p.months.length - 1 : 0;

          p.months.eq(currentIndex).addClass('picker-calendar-month-current');
          p.months.eq(dir === 'next' ? currentIndex - 1 : currentIndex + 1).addClass(dir === 'next' ? 'picker-calendar-month-prev' : 'picker-calendar-month-next');

          if (p.params.onMonthYearChangeStart) {
              p.params.onMonthYearChangeStart(p, p.currentYear, p.currentMonth);
          }
      };
      p.onMonthChangeEnd = function (dir, rebuildBoth) {
          p.animating = false;
          var nextMonthHTML, prevMonthHTML, newMonthHTML;
          p.wrapper.find('.picker-calendar-month:not(.picker-calendar-month-prev):not(.picker-calendar-month-current):not(.picker-calendar-month-next)').remove();
          
          if (typeof dir === 'undefined') {
              dir = 'next';
              rebuildBoth = true;
          }
          if (!rebuildBoth) {
              newMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), dir);
          }
          else {
              p.wrapper.find('.picker-calendar-month-next, .picker-calendar-month-prev').remove();
              prevMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), 'prev');
              nextMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), 'next');
          }
          if (dir === 'next' || rebuildBoth) {
              p.wrapper.append(newMonthHTML || nextMonthHTML);
          }
          if (dir === 'prev' || rebuildBoth) {
              p.wrapper.prepend(newMonthHTML || prevMonthHTML);
          }
          p.months = p.wrapper.find('.picker-calendar-month');
          p.setMonthsTranslate(p.monthsTranslate);
          if (p.params.onMonthAdd) {
              p.params.onMonthAdd(p, dir === 'next' ? p.months.eq(p.months.length - 1)[0] : p.months.eq(0)[0]);
          }
          if (p.params.onMonthYearChangeEnd) {
              p.params.onMonthYearChangeEnd(p, p.currentYear, p.currentMonth);
          }
      };
      p.setMonthsTranslate = function (translate) {
          translate = translate || p.monthsTranslate || 0;
          if (typeof p.monthsTranslate === 'undefined') p.monthsTranslate = translate;
          p.months.removeClass('picker-calendar-month-current picker-calendar-month-prev picker-calendar-month-next');
          var prevMonthTranslate = -(translate + 1) * 100 * inverter;
          var currentMonthTranslate = -translate * 100 * inverter;
          var nextMonthTranslate = -(translate - 1) * 100 * inverter;
          p.months.eq(0).transform('translate3d(' + (p.isH ? prevMonthTranslate : 0) + '%, ' + (p.isH ? 0 : prevMonthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
          p.months.eq(1).transform('translate3d(' + (p.isH ? currentMonthTranslate : 0) + '%, ' + (p.isH ? 0 : currentMonthTranslate) + '%, 0)').addClass('picker-calendar-month-current');
          p.months.eq(2).transform('translate3d(' + (p.isH ? nextMonthTranslate : 0) + '%, ' + (p.isH ? 0 : nextMonthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
      };
      p.nextMonth = function (transition) {
          if (typeof transition === 'undefined' || typeof transition === 'object') {
              transition = '';
              if (!p.params.animate) transition = 0;
          }
          var nextMonth = parseInt(p.months.eq(p.months.length - 1).attr('data-month'), 10);
          var nextYear = parseInt(p.months.eq(p.months.length - 1).attr('data-year'), 10);
          var nextDate = new Date(nextYear, nextMonth);
          var nextDateTime = nextDate.getTime();
          var transitionEndCallback = p.animating ? false : true;
          if (p.params.maxDate) {
              if (nextDateTime > new Date(p.params.maxDate).getTime()) {
                  return p.resetMonth();
              }
          }
          p.monthsTranslate --;
          if (nextMonth === p.currentMonth) {
              var nextMonthTranslate = -(p.monthsTranslate) * 100 * inverter;
              var nextMonthHTML = $(p.monthHTML(nextDateTime, 'next')).transform('translate3d(' + (p.isH ? nextMonthTranslate : 0) + '%, ' + (p.isH ? 0 : nextMonthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
              p.wrapper.append(nextMonthHTML[0]);
              p.months = p.wrapper.find('.picker-calendar-month');
              if (p.params.onMonthAdd) {
                  p.params.onMonthAdd(p, p.months.eq(p.months.length - 1)[0]);
              }
          }
          p.animating = true;
          p.onMonthChangeStart('next');
          var translate = (p.monthsTranslate * 100) * inverter;

          p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
          if (transitionEndCallback) {
              p.wrapper.transitionEnd(function () {
                  p.onMonthChangeEnd('next');
              });
          }
          if (!p.params.animate) {
              p.onMonthChangeEnd('next');
          }
      };
      p.prevMonth = function (transition) {
          if (typeof transition === 'undefined' || typeof transition === 'object') {
              transition = '';
              if (!p.params.animate) transition = 0;
          }
          var prevMonth = parseInt(p.months.eq(0).attr('data-month'), 10);
          var prevYear = parseInt(p.months.eq(0).attr('data-year'), 10);
          var prevDate = new Date(prevYear, prevMonth + 1, -1);
          var prevDateTime = prevDate.getTime();
          var transitionEndCallback = p.animating ? false : true;
          if (p.params.minDate) {
              if (prevDateTime < new Date(p.params.minDate).getTime()) {
                  return p.resetMonth();
              }
          }
          p.monthsTranslate ++;
          if (prevMonth === p.currentMonth) {
              var prevMonthTranslate = -(p.monthsTranslate) * 100 * inverter;
              var prevMonthHTML = $(p.monthHTML(prevDateTime, 'prev')).transform('translate3d(' + (p.isH ? prevMonthTranslate : 0) + '%, ' + (p.isH ? 0 : prevMonthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
              p.wrapper.prepend(prevMonthHTML[0]);
              p.months = p.wrapper.find('.picker-calendar-month');
              if (p.params.onMonthAdd) {
                  p.params.onMonthAdd(p, p.months.eq(0)[0]);
              }
          }
          p.animating = true;
          p.onMonthChangeStart('prev');
          var translate = (p.monthsTranslate * 100) * inverter;
          p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
          if (transitionEndCallback) {
              p.wrapper.transitionEnd(function () {
                  p.onMonthChangeEnd('prev');
              });
          }
          if (!p.params.animate) {
              p.onMonthChangeEnd('prev');
          }
      };
      p.resetMonth = function (transition) {
          if (typeof transition === 'undefined') transition = '';
          var translate = (p.monthsTranslate * 100) * inverter;
          p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
      };
      p.setYearMonth = function (year, month, transition) {
          if (typeof year === 'undefined') year = p.currentYear;
          if (typeof month === 'undefined') month = p.currentMonth;
          if (typeof transition === 'undefined' || typeof transition === 'object') {
              transition = '';
              if (!p.params.animate) transition = 0;
          }
          var targetDate;
          if (year < p.currentYear) {
              targetDate = new Date(year, month + 1, -1).getTime();
          }
          else {
              targetDate = new Date(year, month).getTime();
          }
          if (p.params.maxDate && targetDate > new Date(p.params.maxDate).getTime()) {
              return false;
          }
          if (p.params.minDate && targetDate < new Date(p.params.minDate).getTime()) {
              return false;
          }
          var currentDate = new Date(p.currentYear, p.currentMonth).getTime();
          var dir = targetDate > currentDate ? 'next' : 'prev';
          var newMonthHTML = p.monthHTML(new Date(year, month));
          p.monthsTranslate = p.monthsTranslate || 0;
          var prevTranslate = p.monthsTranslate;
          var monthTranslate, wrapperTranslate;
          var transitionEndCallback = p.animating ? false : true;
          if (targetDate > currentDate) {
              // To next
              p.monthsTranslate --;
              if (!p.animating) p.months.eq(p.months.length - 1).remove();
              p.wrapper.append(newMonthHTML);
              p.months = p.wrapper.find('.picker-calendar-month');
              monthTranslate = -(prevTranslate - 1) * 100 * inverter;
              p.months.eq(p.months.length - 1).transform('translate3d(' + (p.isH ? monthTranslate : 0) + '%, ' + (p.isH ? 0 : monthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
          }
          else {
              // To prev
              p.monthsTranslate ++;
              if (!p.animating) p.months.eq(0).remove();
              p.wrapper.prepend(newMonthHTML);
              p.months = p.wrapper.find('.picker-calendar-month');
              monthTranslate = -(prevTranslate + 1) * 100 * inverter;
              p.months.eq(0).transform('translate3d(' + (p.isH ? monthTranslate : 0) + '%, ' + (p.isH ? 0 : monthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
          }
          if (p.params.onMonthAdd) {
              p.params.onMonthAdd(p, dir === 'next' ? p.months.eq(p.months.length - 1)[0] : p.months.eq(0)[0]);
          }
          p.animating = true;
          p.onMonthChangeStart(dir);
          wrapperTranslate = (p.monthsTranslate * 100) * inverter;
          p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? wrapperTranslate : 0) + '%, ' + (p.isH ? 0 : wrapperTranslate) + '%, 0)');
          if (transitionEndCallback) {
             p.wrapper.transitionEnd(function () {
                  p.onMonthChangeEnd(dir, true);
              }); 
          }
          if (!p.params.animate) {
              p.onMonthChangeEnd(dir);
          }
      };
      p.nextYear = function () {
          p.setYearMonth(p.currentYear + 1);
      };
      p.prevYear = function () {
          p.setYearMonth(p.currentYear - 1);
      };
      

      // HTML Layout
      p.layout = function () {
          var pickerHTML = '';
          var pickerClass = '';
          var i;
          
          var layoutDate = p.value && p.value.length ? p.value[0] : new Date().setHours(0,0,0,0);
          var prevMonthHTML = p.monthHTML(layoutDate, 'prev');
          var currentMonthHTML = p.monthHTML(layoutDate);
          var nextMonthHTML = p.monthHTML(layoutDate, 'next');
          var monthsHTML = '<div class="picker-calendar-months"><div class="picker-calendar-months-wrapper">' + (prevMonthHTML + currentMonthHTML + nextMonthHTML) + '</div></div>';
          // Week days header
          var weekHeaderHTML = '';
          if (p.params.weekHeader) {
              for (i = 0; i < 7; i++) {
                  var weekDayIndex = (i + p.params.firstDay > 6) ? (i - 7 + p.params.firstDay) : (i + p.params.firstDay);
                  var dayName = p.params.dayNamesShort[weekDayIndex];
                  weekHeaderHTML += '<div class="picker-calendar-week-day ' + ((p.params.weekendDays.indexOf(weekDayIndex) >= 0) ? 'picker-calendar-week-day-weekend' : '') + '"> ' + dayName + '</div>';
                  
              }
              weekHeaderHTML = '<div class="picker-calendar-week-days">' + weekHeaderHTML + '</div>';
          }
          pickerClass = 'weui-picker-calendar ' + (p.params.cssClass || '');
          if(!p.inline) pickerClass = 'weui-picker-modal ' + pickerClass;
          var toolbarHTML = p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText) : '';
          if (p.params.toolbar) {
              toolbarHTML = p.params.toolbarTemplate
                  .replace(/{{closeText}}/g, p.params.toolbarCloseText)
                  .replace(/{{monthPicker}}/g, (p.params.monthPicker ? p.params.monthPickerTemplate : ''))
                  .replace(/{{yearPicker}}/g, (p.params.yearPicker ? p.params.yearPickerTemplate : ''));
          }

          pickerHTML =
              '<div class="' + (pickerClass) + '">' +
                  toolbarHTML +
                  '<div class="picker-modal-inner">' +
                      weekHeaderHTML +
                      monthsHTML +
                  '</div>' +
              '</div>';
              
              
          p.pickerHTML = pickerHTML;    
      };

      // Input Events
      function openOnInput(e) {
          e.preventDefault();
          if (p.opened) return;
          p.open();
          if (p.params.scrollToInput && !isPopover()) {
              var pageContent = p.input.parents('.page-content');
              if (pageContent.length === 0) return;

              var paddingTop = parseInt(pageContent.css('padding-top'), 10),
                  paddingBottom = parseInt(pageContent.css('padding-bottom'), 10),
                  pageHeight = pageContent[0].offsetHeight - paddingTop - p.container.height(),
                  pageScrollHeight = pageContent[0].scrollHeight - paddingTop - p.container.height(),
                  newPaddingBottom;

              var inputTop = p.input.offset().top - paddingTop + p.input[0].offsetHeight;
              if (inputTop > pageHeight) {
                  var scrollTop = pageContent.scrollTop() + inputTop - pageHeight;
                  if (scrollTop + pageHeight > pageScrollHeight) {
                      newPaddingBottom = scrollTop + pageHeight - pageScrollHeight + paddingBottom;
                      if (pageHeight === pageScrollHeight) {
                          newPaddingBottom = p.container.height();
                      }
                      pageContent.css({'padding-bottom': (newPaddingBottom) + 'px'});
                  }
                  pageContent.scrollTop(scrollTop, 300);
              }
          }
      }
      function closeOnHTMLClick(e) {
          if (inPopover()) return;
          if (p.input && p.input.length > 0) {
              if (e.target !== p.input[0] && $(e.target).parents('.weui-picker-modal').length === 0) p.close();
          }
          else {
              if ($(e.target).parents('.weui-picker-modal').length === 0) p.close();   
          }
      }

      if (p.params.input) {
          p.input = $(p.params.input);
          if (p.input.length > 0) {
              if (p.params.inputReadOnly) p.input.prop('readOnly', true);
              if (!p.inline) {
                  p.input.on('click', openOnInput);    
              }
              if (p.params.inputReadOnly) {
                  p.input.on('focus mousedown', function (e) {
                      e.preventDefault();
                  });
              }
          }
              
      }
      
      //iphone 上无法正确触发 click，会导致点击外面无法关闭
      if (!p.inline) $(document).on('click touchend', closeOnHTMLClick);

      // Open
      function onPickerClose() {
          p.opened = false;
          if (p.input && p.input.length > 0) p.input.parents('.page-content').css({'padding-bottom': ''});
          if (p.params.onClose) p.params.onClose(p);

          // Destroy events
          p.destroyCalendarEvents();
      }

      p.opened = false;
      p.open = function () {
          var toPopover = isPopover() && false;
          var updateValue = false;
          if (!p.opened) {
              // Set date value
              if (!p.value) {
                  if (p.params.value) {
                      p.value = p.params.value;
                      updateValue = true;
                  }
              }

              // Layout
              p.layout();

              // Append
              if (toPopover) {
                  p.pickerHTML = '<div class="popover popover-picker-calendar"><div class="popover-inner">' + p.pickerHTML + '</div></div>';
                  p.popover = $.popover(p.pickerHTML, p.params.input, true);
                  p.container = $(p.popover).find('.weui-picker-modal');
                  $(p.popover).on('close', function () {
                      onPickerClose();
                  });
              }
              else if (p.inline) {
                  p.container = $(p.pickerHTML);
                  p.container.addClass('picker-modal-inline');
                  $(p.params.container).append(p.container);
              }
              else {
                  p.container = $($.openPicker(p.pickerHTML));
                  $(p.container)
                  .on('close', function () {
                      onPickerClose();
                  });
              }

              // Store calendar instance
              p.container[0].f7Calendar = p;
              p.wrapper = p.container.find('.picker-calendar-months-wrapper');

              // Months
              p.months = p.wrapper.find('.picker-calendar-month');

              // Update current month and year
              p.updateCurrentMonthYear();

              // Set initial translate
              p.monthsTranslate = 0;
              p.setMonthsTranslate();

              // Init events
              p.initCalendarEvents();

              // Update input value
              if (updateValue) p.updateValue();
              
          }

          // Set flag
          p.opened = true;
          p.initialized = true;
          if (p.params.onMonthAdd) {
              p.months.each(function () {
                  p.params.onMonthAdd(p, this);
              });
          }
          if (p.params.onOpen) p.params.onOpen(p);
      };

      // Close
      p.close = function () {
          if (!p.opened || p.inline) return;
          p.animating = false;  //有可能还有动画没做完，因此animating设置还没改。
          if (inPopover()) {
              $.closePicker(p.popover);
              return;
          }
          else {
              $.closePicker(p.container);
              return;
          }
      };

      // Destroy
      p.destroy = function () {
          p.close();
          if (p.params.input && p.input.length > 0) {
              p.input.off('click focus', openOnInput);
              p.input.data("calendar", null);
          }
          $('html').off('click', closeOnHTMLClick);
      };

      if (p.inline) {
          p.open();
      }

      return p;
  };

  var format = function(d) {
    return d < 10 ? "0"+d : d;
  }


  $.fn.calendar = function (params, args) {
      params = params || {};
      return this.each(function() {
        var $this = $(this);
        if(!$this[0]) return;
        var p = {};
        if($this[0].tagName.toUpperCase() === "INPUT") {
          p.input = $this;
        } else {
          p.container = $this;
        }

        var calendar = $this.data("calendar");

        if(!calendar) {
          if(typeof params === typeof "a") {
          } else {
            if(!params.value && $this.val()) params.value = [$this.val()];
            //默认显示今天
            if(!params.value) {
              var today = new Date();
              params.value = [today.getFullYear() + "-" + format(today.getMonth() + 1) + "-" + format(today.getDate())];
            }
            calendar = $this.data("calendar", new Calendar($.extend(p, params)));
          }
        }

        if(typeof params === typeof "a") {
          calendar[params].call(calendar, args);
        }
      });
  };

  defaults = $.fn.calendar.prototype.defaults = {
    value: undefined, // 通过JS赋值，注意是数组
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    firstDay: 1, // First day of the week, Monday
    weekendDays: [0, 6], // Sunday and Saturday
    multiple: false,
    dateFormat: 'yyyy-mm-dd',
    direction: 'horizontal', // or 'vertical'
    minDate: null,
    maxDate: null,
    touchMove: true,
    animate: true,
    closeOnSelect: true,
    monthPicker: true,
    monthPickerTemplate: 
        '<div class="picker-calendar-month-picker">' +
            '<a href="javascript:;" class="link icon-only picker-calendar-prev-month"><i class="icon icon-prev"></i></a>' +
            '<div class="current-month-value"></div>' +
            '<a href="javascript:;" class="link icon-only picker-calendar-next-month"><i class="icon icon-next"></i></a>' +
        '</div>',
    yearPicker: true,
    yearPickerTemplate: 
        '<div class="picker-calendar-year-picker">' +
            '<a href="javascript:;" class="link icon-only picker-calendar-prev-year"><i class="icon icon-prev"></i></a>' +
            '<span class="current-year-value"></span>' +
            '<a href="javascript:;" class="link icon-only picker-calendar-next-year"><i class="icon icon-next"></i></a>' +
        '</div>',
    weekHeader: true,
    // Common settings
    scrollToInput: true,
    inputReadOnly: true,
    convertToPopover: true,
    onlyInPopover: false,
    toolbar: true,
    toolbarCloseText: 'Done',
    toolbarTemplate: 
        '<div class="toolbar">' +
            '<div class="toolbar-inner">' +
                '{{yearPicker}}' +
                '{{monthPicker}}' +
                // '<a href="#" class="link close-picker">{{closeText}}</a>' +
            '</div>' +
        '</div>',
    /* Callbacks
    onMonthAdd
    onChange
    onOpen
    onClose
    onDayClick
    onMonthYearChangeStart
    onMonthYearChangeEnd
    */
  };

}($);

/**
 * datetime-picker
 * @author: minzhang
 * @update: 2016-12-16
 */

;
(function ($) {
	"use strict";


	var defaults;

	var formatNumber = function (n) {
		return n < 10 ? "0" + n : n;
	}

	var Datetime = function (input, params) {
		this.input = $(input);
		this.params = params;

		this.initMonthes = ('01 02 03 04 05 06 07 08 09 10 11 12').split(' ');

		this.initYears = (function () {
			var arr = [];
			for (var i = 1950; i <= 2030; i++) {
				arr.push(i);
			}
			return arr;
		})();

		var p = $.extend({}, params, this.getConfig());
		$(this.input).picker(p);
	}

	Datetime.prototype = {
		getDays: function (max) {
			var days = [];
			for (var i = 1; i <= (max || 31); i++) {
				days.push(i < 10 ? "0" + i : i);
			}
			return days;
		},

		getDaysByMonthAndYear: function (month, year) {
			var int_d = new Date(year, parseInt(month) + 1 - 1, 1);
			var d = new Date(int_d - 1);
			return this.getDays(d.getDate());
		},
		getConfig: function () {
			var today = new Date(),
				params = this.params,
				self = this,
				lastValidValues;

			var config = {
				rotateEffect: false, //为了性能
				cssClass: 'datetime-picker',

				value: [today.getFullYear(), formatNumber(today.getMonth() + 1), formatNumber(today.getDate()), formatNumber(today.getHours()), (formatNumber(today.getMinutes()))],

				onChange: function (picker, values, displayValues) {
					var cols = picker.cols;
					var days = self.getDaysByMonthAndYear(values[1], values[0]);
					var currentValue = values[2];
					if (currentValue > days.length) currentValue = days.length;
					picker.cols[4].setValue(currentValue);

					//check min and max
					var current = new Date(values[0] + '-' + values[1] + '-' + values[2]);
					var valid = true;
					if (params.min) {
						var min = new Date(typeof params.min === "function" ? params.min() : params.min);

						if (current < +min) {
							picker.setValue(lastValidValues);
							valid = false;
						}
					}
					if (params.max) {
						var max = new Date(typeof params.max === "function" ? params.max() : params.max);
						if (current > +max) {
							picker.setValue(lastValidValues);
							valid = false;
						}
					}

					valid && (lastValidValues = values);

					if (self.params.onChange) {
						self.params.onChange.apply(this, arguments);
					}
				},

				formatValue: function (p, values, displayValues) {
					return self.params.format(p, values, displayValues);
				},

				cols: [
					{
						values: (function () {
							var maxYear = params.max ? +params.max.split('-')[0] : 2050;
							var years = [];
							for (var i = 1950; i <= maxYear; i++) years.push(i);
							return years;
						})()
          },
					{
						divider: true, // 这是一个分隔符
						content: params.yearSplit
          },
					{
						values: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
          },
					{
						divider: true, // 这是一个分隔符
						content: params.monthSplit
          },
					{
						values: (function () {
							var dates = [];
							for (var i = 1; i <= 31; i++) dates.push(formatNumber(i));
							return dates;
						})()
          },

        ]
			}

			if (params.dateSplit) {
				config.cols.push({
					divider: true,
					content: params.dateSplit
				})
			}

			config.cols.push({
				divider: true,
				content: params.datetimeSplit
			})

			var times = self.params.times();
			if (times && times.length) {
				config.cols = config.cols.concat(times);
			}

			var inputValue = this.input.val();
			if (inputValue) config.value = params.parse(inputValue);
			if (this.params.value) {
				this.input.val(this.params.value);
				config.value = params.parse(this.params.value);
			}

			return config;
		}
	}

	$.fn.datetimePicker = function (params) {
		params = $.extend({}, defaults, params);
		return this.each(function () {
			if (!this) return;
			var $this = $(this);
			var datetime = $this.data("datetime");
			if (!datetime) $this.data("datetime", new Datetime(this, params));
			return datetime;
		});
	};

	defaults = $.fn.datetimePicker.prototype.defaults = {
		input: undefined, // 默认值
		min: undefined, // YYYY-MM-DD 最大最小值只比较年月日，不比较时分秒
		max: undefined, // YYYY-MM-DD
		yearSplit: '-',
		monthSplit: '-',
		dateSplit: '', // 默认为空
		datetimeSplit: ' ', // 日期和时间之间的分隔符，不可为空
		times: function () {
			return [ // 自定义的时间
				{
					values: (function () {
						var hours = [];
						for (var i = 0; i < 24; i++) hours.push(formatNumber(i));
						return hours;
					})()
        },
				{
					divider: true, // 这是一个分隔符
					content: ':'
        },
				{
					values: (function () {
						var minutes = [];
						for (var i = 0; i < 60; i++) minutes.push(formatNumber(i));
						return minutes;
					})()
        }
      ];
		},
		format: function (p, values) { // 数组转换成字符串
			return p.cols.map(function (col) {
				return col.value || col.content;
			}).join('');
		},
		parse: function (str) {
			// 把字符串转换成数组，用来解析初始值
			// 如果你的定制的初始值格式无法被这个默认函数解析，请自定义这个函数。比如你的时间是 '子时' 那么默认情况这个'时'会被当做分隔符而导致错误，所以你需要自己定义parse函数
			// 默认兼容的分隔符
			var t = str.split(this.datetimeSplit);
			return t[0].split(/\D/).concat(t[1].split(/:|时|分|秒/)).filter(function (d) {
				return !!d;
			})
		}
	}

})($);
/**
 * 点击态处理
 * @author: minzhang
 * @update: 2016-11-10
 */
;
(function () {
    var classList = ['.ui-light', '.ui-btn', '.ui-list-item-middle'],
        classListStr = classList.join(', ');

    $(function () {
        $(document.body).on('touchstart', classListStr, function () {
            var $this = $(this);
            $this.addClass('active');
            setTimeout(function () {
                if ($this.hasClass('active')) {
                    $this.removeClass('active');
                }
            }, 300);
        }).on('touchend', classListStr, function () {
            $(this).removeClass('active');
        });
    });
})();
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
/*
 * 设置手机号3-4-4分隔
 * minzhang
 * 2016-8-9
 */
;
(function ($) {
    'use strict'

    function phoneSplit(ele, options) {
        this.len = 0; // 历史value长度
        this.posi = 0; // 历史光标的位置
        this.element = ele; // input对象
        this.options = options;
        this.first = true;
        this.init();
    }

    // 初始化
    phoneSplit.prototype.init = function () {
        this.event();
    };

    // 绑定事件
    phoneSplit.prototype.event = function () {
        if (this.options) {
            // input事件
            this.element.off('input', this.options.target, $.proxy(this.inputEventHandle, this)).on('input', this.options.target, $.proxy(this.inputEventHandle, this));
            // click的事件
            this.element.off('click', this.options.target, $.proxy(this.clickEventHandle, this)).on('click', this.options.target, $.proxy(this.clickEventHandle, this));
        } else {
            // input事件
            this.element.off('input', $.proxy(this.inputEventHandle, this)).on('input', $.proxy(this.inputEventHandle, this));
            // click的事件
            this.element.off('click', $.proxy(this.clickEventHandle, this)).on('click', $.proxy(this.clickEventHandle, this));
        }
    };

    // focus的事件处理
    phoneSplit.prototype.clickEventHandle = function () {
        if (this.options && this.first) {
            this.first = false;
            this.element = this.element.find(this.options.target);
        }
        // 获取当前的光标位置
        this.posi = this.element[0].selectionStart;
    };

    // input的事件处理
    phoneSplit.prototype.inputEventHandle = function () {
        if (this.element.val().length > 13) {
            this.element.val(this.element.val().slice(0, 13));
        }

        if (this.options && this.first) {
            this.first = false;
            this.element = this.element.find(this.options.target);
        }
        var nua = navigator.userAgent, // 浏览器类型
            math = /^\d{1,3}$|^\d{3} \d{1,4}$|^\d{3} \d{4} \d{1,4}$/, // 手机号码3 4 4正则验证
            len = this.element.val().length,
            value;

        // 获取当前的光标位置
        this.posi = this.element[0].selectionStart;

        value = this.element.val();
        // 将空格或非数字替换
        if (/[^\d|\s]/g.test(value)) {
            this.element.val(value.replace(/[^\d|\s]/g, ''));
            this.posi -= 1;
        }
        // 在长度为3和8的时候在后边插入一个空格
        value = this.element.val();
        if (value.length === 3 || value.length === 8) {
            this.element.val(value + ' ');
            this.posi += 1;
            if (len < this.len) { // 删除去掉空格，光标向前移一位
                this.element.val(value.slice(0, (value.length - 1)));
                this.posi -= 1;
            } else {
                if (this.posi === 7) {
                    this.posi -= 1;
                }
            };
        }

        // 删除空格时删除空格前的一个数字
        value = this.element.val();
        if (this.posi == 3 || this.posi == 8) {
            if (len < this.len) {
                this.element.val(value.slice(0, (this.posi - 1)) + value.slice(this.posi, value.length));
                this.posi -= 1;
            }
        }

        // 如果用户其中某个位置输入错误，删除其中一个字符，则使用正则将手机号重新格式化
        if (!math.test(this.element.val())) {
            var str = this.element.val().replace(/\s|[a-zA-Z]/g, ''), // 剔除用户主动选择的插入位置的字符和空格
                arr = str.split(""); // 删除空格

            // 将字符串重新排列加入空格
            if (arr.length >= 3) {
                arr.splice(3, 0, " ");
                if (arr.length >= 8) {
                    arr.splice(8, 0, " ");
                }
            }

            str = arr.join("");
            this.element.val(str);
            this.len = this.element.val().length;
        }

        // 设置光标的位置
        this.setCursorPosition(this.element[0], this.posi);
        // 将新的长度赋值给历史长度
        this.len = this.element.val().length;
    };

    /*
     * 设置input的光标位置
     * param [DOMelement] ctrl input对象
     * param [Number] pos 光标的位置
     */
    phoneSplit.prototype.setCursorPosition = function (ctrl, pos) {
        if (ctrl.setSelectionRange) {
            ctrl.focus();
            ctrl.setSelectionRange(pos, pos);
        } else if (ctrl.createTextRange) {
            var range = ctrl.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    };

    // 基于zepto的组件
    $.fn.phoneSplit = function (options) {
        if (!this) {
            return;
        }

        new phoneSplit(this, options);

        return this;
    };
})($);
/**
 * Picker
 * @author: minzhang
 * @update: 2016-12-16
 */
;
(function ($) {
    "use strict";
    var Picker = function (params) {
        var p = this;
        var defaults = {
            updateValuesOnMomentum: false,
            updateValuesOnTouchmove: true,
            rotateEffect: false,
            momentumRatio: 7,
            freeMode: false,
            // Common settings
            scrollToInput: true,
            inputReadOnly: true,
            toolbar: true,
            toolbarCloseText: '完成',
            title: '请选择',
            toolbarTemplate: '<div class="toolbar">\
          <div class="toolbar-inner">\
          <a href="javascript:;" class="picker-button close-picker">{{closeText}}</a>\
          <h1 class="title">{{title}}</h1>\
          </div>\
          </div>',
        };
        params = params || {};
        for (var def in defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = defaults[def];
            }
        }
        p.params = params;
        p.cols = [];
        p.initialized = false;

        // Inline flag
        p.inline = p.params.container ? true : false;

        // 3D Transforms origin bug, only on safari
        var originBug = $.device.ios || (navigator.userAgent.toLowerCase().indexOf('safari') >= 0 && navigator.userAgent.toLowerCase().indexOf('chrome') < 0) && !$.device.android;

        // Should be converted to popover
        function isPopover() {
            var toPopover = false;
            if (!p.params.convertToPopover && !p.params.onlyInPopover) return toPopover;
            if (!p.inline && p.params.input) {
                if (p.params.onlyInPopover) toPopover = true;
                else {
                    if ($.device.ios) {
                        toPopover = $.device.ipad ? true : false;
                    } else {
                        if ($(window).width() >= 768) toPopover = true;
                    }
                }
            }
            return toPopover;
        }

        function inPopover() {
            if (p.opened && p.container && p.container.length > 0 && p.container.parents('.popover').length > 0) return true;
            else return false;
        }

        // Value
        p.setValue = function (arrValues, transition) {
            var valueIndex = 0;
            for (var i = 0; i < p.cols.length; i++) {
                if (p.cols[i] && !p.cols[i].divider) {
                    p.cols[i].setValue(arrValues[valueIndex], transition);
                    valueIndex++;
                }
            }
        };
        p.updateValue = function () {
            var newValue = [];
            var newDisplayValue = [];
            for (var i = 0; i < p.cols.length; i++) {
                if (!p.cols[i].divider) {
                    newValue.push(p.cols[i].value);
                    newDisplayValue.push(p.cols[i].displayValue);
                }
            }
            if (newValue.indexOf(undefined) >= 0) {
                return;
            }
            p.value = newValue;
            p.displayValue = newDisplayValue;
            if (p.params.onChange) {
                p.params.onChange(p, p.value, p.displayValue);
            }
            if (p.input && p.input.length > 0) {
                $(p.input).val(p.params.formatValue ? p.params.formatValue(p, p.value, p.displayValue) : p.value.join(' '));
                $(p.input).trigger('change');
            }
        };

        // Columns Handlers
        p.initPickerCol = function (colElement, updateItems) {
            var colContainer = $(colElement);
            var colIndex = colContainer.index();
            var col = p.cols[colIndex];
            if (col.divider) return;
            col.container = colContainer;
            col.wrapper = col.container.find('.picker-items-col-wrapper');
            col.items = col.wrapper.find('.picker-item');

            var i, j;
            var wrapperHeight, itemHeight, itemsHeight, minTranslate, maxTranslate;
            col.replaceValues = function (values, displayValues) {
                col.destroyEvents();
                col.values = values;
                col.displayValues = displayValues;
                var newItemsHTML = p.columnHTML(col, true);
                col.wrapper.html(newItemsHTML);
                col.items = col.wrapper.find('.picker-item');
                col.calcSize();
                col.setValue(col.values[0], 0, true);
                col.initEvents();
            };
            col.calcSize = function () {
                if (p.params.rotateEffect) {
                    col.container.removeClass('picker-items-col-absolute');
                    if (!col.width) col.container.css({
                        width: ''
                    });
                }
                var colWidth, colHeight;
                colWidth = 0;
                colHeight = col.container[0].offsetHeight;
                wrapperHeight = col.wrapper[0].offsetHeight;
                itemHeight = col.items[0].offsetHeight;
                itemsHeight = itemHeight * col.items.length;
                minTranslate = colHeight / 2 - itemsHeight + itemHeight / 2;
                maxTranslate = colHeight / 2 - itemHeight / 2;
                if (col.width) {
                    colWidth = col.width;
                    if (parseInt(colWidth, 10) === colWidth) colWidth = colWidth + 'px';
                    col.container.css({
                        width: colWidth
                    });
                }
                if (p.params.rotateEffect) {
                    if (!col.width) {
                        col.items.each(function () {
                            var item = $(this);
                            item.css({
                                width: 'auto'
                            });
                            colWidth = Math.max(colWidth, item[0].offsetWidth);
                            item.css({
                                width: ''
                            });
                        });
                        col.container.css({
                            width: (colWidth + 2) + 'px'
                        });
                    }
                    col.container.addClass('picker-items-col-absolute');
                }
            };
            col.calcSize();

            col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)').transition(0);


            var activeIndex = 0;
            var animationFrameId;

            // Set Value Function
            col.setValue = function (newValue, transition, valueCallbacks) {
                if (typeof transition === 'undefined') transition = '';
                var newActiveIndex = col.wrapper.find('.picker-item[data-picker-value="' + newValue + '"]').index();
                if (typeof newActiveIndex === 'undefined' || newActiveIndex === -1) {
                    return;
                }
                var newTranslate = -newActiveIndex * itemHeight + maxTranslate;
                // Update wrapper
                col.wrapper.transition(transition);
                col.wrapper.transform('translate3d(0,' + (newTranslate) + 'px,0)');

                // Watch items
                if (p.params.updateValuesOnMomentum && col.activeIndex && col.activeIndex !== newActiveIndex) {
                    $.cancelAnimationFrame(animationFrameId);
                    col.wrapper.transitionEnd(function () {
                        $.cancelAnimationFrame(animationFrameId);
                    });
                    updateDuringScroll();
                }

                // Update items
                col.updateItems(newActiveIndex, newTranslate, transition, valueCallbacks);
            };

            col.updateItems = function (activeIndex, translate, transition, valueCallbacks) {
                if (typeof translate === 'undefined') {
                    translate = $.getTranslate(col.wrapper[0], 'y');
                }
                if (typeof activeIndex === 'undefined') activeIndex = -Math.round((translate - maxTranslate) / itemHeight);
                if (activeIndex < 0) activeIndex = 0;
                if (activeIndex >= col.items.length) activeIndex = col.items.length - 1;
                var previousActiveIndex = col.activeIndex;
                col.activeIndex = activeIndex;
                /*
                col.wrapper.find('.picker-selected, .picker-after-selected, .picker-before-selected').removeClass('picker-selected picker-after-selected picker-before-selected');

                col.items.transition(transition);
                var selectedItem = col.items.eq(activeIndex).addClass('picker-selected').transform('');
                var prevItems = selectedItem.prevAll().addClass('picker-before-selected');
                var nextItems = selectedItem.nextAll().addClass('picker-after-selected');
                */
                //去掉 .picker-after-selected, .picker-before-selected 以提高性能
                col.wrapper.find('.picker-selected').removeClass('picker-selected');
                if (p.params.rotateEffect) {
                    col.items.transition(transition);
                }
                var selectedItem = col.items.eq(activeIndex).addClass('picker-selected').transform('');

                if (valueCallbacks || typeof valueCallbacks === 'undefined') {
                    // Update values
                    col.value = selectedItem.attr('data-picker-value');
                    col.displayValue = col.displayValues ? col.displayValues[activeIndex] : col.value;
                    // On change callback
                    if (previousActiveIndex !== activeIndex) {
                        if (col.onChange) {
                            col.onChange(p, col.value, col.displayValue);
                        }
                        p.updateValue();
                    }
                }

                // Set 3D rotate effect
                if (!p.params.rotateEffect) {
                    return;
                }
                var percentage = (translate - (Math.floor((translate - maxTranslate) / itemHeight) * itemHeight + maxTranslate)) / itemHeight;

                col.items.each(function () {
                    var item = $(this);
                    var itemOffsetTop = item.index() * itemHeight;
                    var translateOffset = maxTranslate - translate;
                    var itemOffset = itemOffsetTop - translateOffset;
                    var percentage = itemOffset / itemHeight;

                    var itemsFit = Math.ceil(col.height / itemHeight / 2) + 1;

                    var angle = (-18 * percentage);
                    if (angle > 180) angle = 180;
                    if (angle < -180) angle = -180;
                    // Far class
                    if (Math.abs(percentage) > itemsFit) item.addClass('picker-item-far');
                    else item.removeClass('picker-item-far');
                    // Set transform
                    item.transform('translate3d(0, ' + (-translate + maxTranslate) + 'px, ' + (originBug ? -110 : 0) + 'px) rotateX(' + angle + 'deg)');
                });
            };

            function updateDuringScroll() {
                animationFrameId = $.requestAnimationFrame(function () {
                    col.updateItems(undefined, undefined, 0);
                    updateDuringScroll();
                });
            }

            // Update items on init
            if (updateItems) col.updateItems(0, maxTranslate, 0);

            var allowItemClick = true;
            var isTouched, isMoved, touchStartY, touchCurrentY, touchStartTime, touchEndTime, startTranslate, returnTo, currentTranslate, prevTranslate, velocityTranslate, velocityTime;

            function handleTouchStart(e) {
                if (isMoved || isTouched) return;
                e.preventDefault();
                isTouched = true;
                var position = $.getTouchPosition(e);
                touchStartY = touchCurrentY = position.y;
                touchStartTime = (new Date()).getTime();

                allowItemClick = true;
                startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
            }

            function handleTouchMove(e) {
                if (!isTouched) return;
                e.preventDefault();
                allowItemClick = false;
                var position = $.getTouchPosition(e);
                touchCurrentY = position.y;
                if (!isMoved) {
                    // First move
                    $.cancelAnimationFrame(animationFrameId);
                    isMoved = true;
                    startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
                    col.wrapper.transition(0);
                }
                e.preventDefault();

                var diff = touchCurrentY - touchStartY;
                currentTranslate = startTranslate + diff;
                returnTo = undefined;

                // Normalize translate
                if (currentTranslate < minTranslate) {
                    currentTranslate = minTranslate - Math.pow(minTranslate - currentTranslate, 0.8);
                    returnTo = 'min';
                }
                if (currentTranslate > maxTranslate) {
                    currentTranslate = maxTranslate + Math.pow(currentTranslate - maxTranslate, 0.8);
                    returnTo = 'max';
                }
                // Transform wrapper
                col.wrapper.transform('translate3d(0,' + currentTranslate + 'px,0)');

                // Update items
                col.updateItems(undefined, currentTranslate, 0, p.params.updateValuesOnTouchmove);

                // Calc velocity
                velocityTranslate = currentTranslate - prevTranslate || currentTranslate;
                velocityTime = (new Date()).getTime();
                prevTranslate = currentTranslate;
            }

            function handleTouchEnd(e) {
                if (!isTouched || !isMoved) {
                    isTouched = isMoved = false;
                    return;
                }
                isTouched = isMoved = false;
                col.wrapper.transition('');
                if (returnTo) {
                    if (returnTo === 'min') {
                        col.wrapper.transform('translate3d(0,' + minTranslate + 'px,0)');
                    } else col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)');
                }
                touchEndTime = new Date().getTime();
                var velocity, newTranslate;
                if (touchEndTime - touchStartTime > 300) {
                    newTranslate = currentTranslate;
                } else {
                    velocity = Math.abs(velocityTranslate / (touchEndTime - velocityTime));
                    newTranslate = currentTranslate + velocityTranslate * p.params.momentumRatio;
                }

                newTranslate = Math.max(Math.min(newTranslate, maxTranslate), minTranslate);

                // Active Index
                var activeIndex = -Math.floor((newTranslate - maxTranslate) / itemHeight);

                // Normalize translate
                if (!p.params.freeMode) newTranslate = -activeIndex * itemHeight + maxTranslate;

                // Transform wrapper
                col.wrapper.transform('translate3d(0,' + (parseInt(newTranslate, 10)) + 'px,0)');

                // Update items
                col.updateItems(activeIndex, newTranslate, '', true);

                // Watch items
                if (p.params.updateValuesOnMomentum) {
                    updateDuringScroll();
                    col.wrapper.transitionEnd(function () {
                        $.cancelAnimationFrame(animationFrameId);
                    });
                }

                // Allow click
                setTimeout(function () {
                    allowItemClick = true;
                }, 100);
            }

            function handleClick(e) {
                if (!allowItemClick) return;
                $.cancelAnimationFrame(animationFrameId);
                /*jshint validthis:true */
                var value = $(this).attr('data-picker-value');
                col.setValue(value);
            }

            col.initEvents = function (detach) {
                var method = detach ? 'off' : 'on';
                col.container[method]($.touchEvents.start, handleTouchStart);
                col.container[method]($.touchEvents.move, handleTouchMove);
                col.container[method]($.touchEvents.end, handleTouchEnd);
                col.items[method]('click', handleClick);
            };
            col.destroyEvents = function () {
                col.initEvents(true);
            };

            col.container[0].f7DestroyPickerCol = function () {
                col.destroyEvents();
            };

            col.initEvents();

        };
        p.destroyPickerCol = function (colContainer) {
            colContainer = $(colContainer);
            if ('f7DestroyPickerCol' in colContainer[0]) colContainer[0].f7DestroyPickerCol();
        };
        // Resize cols
        function resizeCols() {
            if (!p.opened) return;
            for (var i = 0; i < p.cols.length; i++) {
                if (!p.cols[i].divider) {
                    p.cols[i].calcSize();
                    p.cols[i].setValue(p.cols[i].value, 0, false);
                }
            }
        }
        $(window).on('resize', resizeCols);

        // HTML Layout
        p.columnHTML = function (col, onlyItems) {
            var columnItemsHTML = '';
            var columnHTML = '';
            if (col.divider) {
                columnHTML += '<div class="picker-items-col picker-items-col-divider ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '">' + col.content + '</div>';
            } else {
                for (var j = 0; j < col.values.length; j++) {
                    columnItemsHTML += '<div class="picker-item" data-picker-value="' + col.values[j] + '">' + (col.displayValues ? col.displayValues[j] : col.values[j]) + '</div>';
                }
                columnHTML += '<div class="picker-items-col ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '"><div class="picker-items-col-wrapper">' + columnItemsHTML + '</div></div>';
            }
            return onlyItems ? columnItemsHTML : columnHTML;
        };
        p.layout = function () {
            var pickerHTML = '';
            var pickerClass = '';
            var i;
            p.cols = [];
            var colsHTML = '';
            for (i = 0; i < p.params.cols.length; i++) {
                var col = p.params.cols[i];
                colsHTML += p.columnHTML(p.params.cols[i]);
                p.cols.push(col);
            }
            pickerClass = 'ui-picker-modal picker-columns ' + (p.params.cssClass || '') + (p.params.rotateEffect ? ' picker-3d' : '') + (p.params.cols.length === 1 ? ' picker-columns-single' : '');
            pickerHTML =
                '<div class="' + (pickerClass) + '">' +
                (p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText).replace(/{{title}}/g, p.params.title) : '') +
                '<div class="picker-modal-inner picker-items">' +
                colsHTML +
                '<div class="picker-center-highlight"></div>' +
                '</div>' +
                '</div>';

            p.pickerHTML = pickerHTML;
        };

        // Input Events
        function openOnInput(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 解决光标在input上点击picker也会弹出输入法的bug
            document.activeElement && document.activeElement.blur(); 
            
            if (p.opened) return;
            p.open();
            if (p.params.scrollToInput && !isPopover()) {
                var pageContent = p.input.parents('.content');
                if (pageContent.length === 0) return;

                var paddingTop = parseInt(pageContent.css('padding-top'), 10),
                    paddingBottom = parseInt(pageContent.css('padding-bottom'), 10),
                    pageHeight = pageContent[0].offsetHeight - paddingTop - p.container.height(),
                    pageScrollHeight = pageContent[0].scrollHeight - paddingTop - p.container.height(),
                    newPaddingBottom;
                var inputTop = p.input.offset().top - paddingTop + p.input[0].offsetHeight;
                if (inputTop > pageHeight) {
                    var scrollTop = pageContent.scrollTop() + inputTop - pageHeight;
                    if (scrollTop + pageHeight > pageScrollHeight) {
                        newPaddingBottom = scrollTop + pageHeight - pageScrollHeight + paddingBottom;
                        if (pageHeight === pageScrollHeight) {
                            newPaddingBottom = p.container.height();
                        }
                        pageContent.css({
                            'padding-bottom': (newPaddingBottom) + 'px'
                        });
                    }
                    pageContent.scrollTop(scrollTop, 300);
                }
            }
        }

        function closeOnHTMLClick(e) {
            if (inPopover()) return;
            if (p.input && p.input.length > 0) {
                if (e.target !== p.input[0] && $(e.target).parents('.ui-picker-modal').length === 0) p.close();
            } else {
                if ($(e.target).parents('.ui-picker-modal').length === 0) p.close();
            }
        }

        if (p.params.input) {
            p.input = $(p.params.input);
            if (p.input.length > 0) {
                if (p.params.inputReadOnly) p.input.prop('readOnly', true);
                if (!p.inline) {
                    p.input.closest('.ui-list-item').on('click', openOnInput);
                }
                if (p.params.inputReadOnly) {
                    p.input.on('focus mousedown', function (e) {
                        e.preventDefault();
                    });
                }
            }

        }

        if (!p.inline) $('html').on('click', closeOnHTMLClick);

        // Open
        function onPickerClose() {
            p.opened = false;
            if (p.input && p.input.length > 0) p.input.parents('.page-content').css({
                'padding-bottom': ''
            });
            if (p.params.onClose) p.params.onClose(p);

            // Destroy events
            p.container.find('.picker-items-col').each(function () {
                p.destroyPickerCol(this);
            });
        }

        p.opened = false;
        p.open = function () {
            var toPopover = isPopover();

            if (!p.opened) {

                // Layout
                p.layout();

                // Append
                if (toPopover) {
                    p.pickerHTML = '<div class="popover popover-picker-columns"><div class="popover-inner">' + p.pickerHTML + '</div></div>';
                    p.popover = $.popover(p.pickerHTML, p.params.input, true);
                    p.container = $(p.popover).find('.ui-picker-modal');
                    $(p.popover).on('close', function () {
                        onPickerClose();
                    });
                } else if (p.inline) {
                    p.container = $(p.pickerHTML);
                    p.container.addClass('picker-modal-inline');
                    $(p.params.container).append(p.container);
                } else {
                    p.container = $($.openPicker(p.pickerHTML));
                    $(p.container)
                        .on('close', function () {
                            onPickerClose();
                        });
                }

                // Store picker instance
                p.container[0].f7Picker = p;

                // Init Events
                p.container.find('.picker-items-col').each(function () {
                    var updateItems = true;
                    if ((!p.initialized && p.params.value) || (p.initialized && p.value)) updateItems = false;
                    p.initPickerCol(this, updateItems);
                });

                // Set value
                if (!p.initialized) {
                    if (p.params.value) {
                        p.setValue(p.params.value, 0);
                    }
                } else {
                    if (p.value) p.setValue(p.value, 0);
                }
            }

            // Set flag
            p.opened = true;
            p.initialized = true;

            if (p.params.onOpen) p.params.onOpen(p);
        };

        // Close
        p.close = function (force) {
            if (!p.opened || p.inline) return;
            if (inPopover()) {
                $.closePicker(p.popover);
                return;
            } else {
                $.closePicker(p.container);
                return;
            }
        };

        // Destroy
        p.destroy = function () {
            p.close();
            if (p.params.input && p.input.length > 0) {
                p.input.closest('.ui-list-item').off('click focus', openOnInput);
            }
            $('html').off('click', closeOnHTMLClick);
            $(window).off('resize', resizeCols);
        };

        if (p.inline) {
            p.open();
        }

        return p;
    };

    $(document).on("click", ".close-picker", function () {
        var pickerToClose = $('.ui-picker-modal.ui-picker-modal-visible');
        if (pickerToClose.length > 0) {
            $.closePicker(pickerToClose);
        }
    });

    //修复picker会滚动页面的bug
    $(document).on($.touchEvents.move, ".picker-modal-inner", function (e) {
        e.preventDefault();
    });


    $.openPicker = function (tpl, className, callback) {

        if (typeof className === "function") {
            callback = className;
            className = undefined;
        }

        $.closePicker();
        
        var mask = $("<div class='ui-mask'></div>").appendTo(document.body);
//        mask.show();
        
        var container = $("<div class='ui-picker-container " + (className || "") + "'></div>").appendTo(document.body);
//        container.show();
        
        mask.addClass("ui-mask-visible");
        container.addClass("ui-picker-container-visible");

        //关于布局的问题，如果直接放在body上，则做动画的时候会撑开body高度而导致滚动条变化。
        var dialog = $(tpl).appendTo(container);

        dialog.width(); //通过取一次CSS值，强制浏览器不能把上下两行代码合并执行，因为合并之后会导致无法出现动画。

        dialog.addClass("ui-picker-modal-visible");

        callback && container.on("close", callback);

        return dialog;
    }

    $.updatePicker = function (tpl) {
        var container = $(".ui-picker-container-visible");
        if (!container[0]) return false;

        container.html("");

        var dialog = $(tpl).appendTo(container);

        dialog.addClass("ui-picker-modal-visible");

        return dialog;
    }

    $.closePicker = function (container, callback) {
        if (typeof container === "function") callback = container;
        $(".ui-mask-visible").removeClass("ui-mask-visible").transitionEnd(function() {
          $(this).remove();
        });
        $(".ui-picker-modal-visible").removeClass("ui-picker-modal-visible").transitionEnd(function () {
            $(this).parent().remove();
            callback && callback();
        }).trigger("close");
    };

    $.fn.picker = function (params) {
        var args = arguments;
        return this.each(function () {
            if (!this) return;
            var $this = $(this);

            var picker = $this.data("picker");
            if (!picker) {
                params = params || {};
                var inputValue = $this.val();
                if (params.value === undefined && inputValue !== "") {
                    params.value = params.cols.length > 1 ? inputValue.split(" ") : [inputValue];
                }
                var p = $.extend({
                    input: this
                }, params);
                picker = new Picker(p);
                $this.data("picker", picker);
            }
            if (typeof params === typeof "a") {
                picker[params].apply(picker, Array.prototype.slice.call(args, 1));
            }
        });
    };
})($);
/**
 * Pull to refreh
 * @author: minzhang
 * @update: 2016-12-16
 */

;
(function ($) {
    "use strict";

    var PTR = function (el) {
        this.container = $(el);
        this.distance = 100;
        this.attachEvents();
    }

    PTR.prototype.touchStart = function (e) {
        if (this.container.hasClass("refreshing")) return;
        var p = $.getTouchPosition(e);
        this.start = p;
        this.diffX = this.diffY = 0;
    };

    PTR.prototype.touchMove = function (e) {
        if (this.container.hasClass("refreshing")) return;
        if (!this.start) return false;
        if (this.container.scrollTop() > 0) return;
        var p = $.getTouchPosition(e);
        this.diffX = p.x - this.start.x;
        this.diffY = p.y - this.start.y;
        if (this.diffY < 0) return;
        this.container.addClass("touching");
        e.preventDefault();
        e.stopPropagation();
        this.diffY = Math.pow(this.diffY, 0.8);
        this.container.css("transform", "translate3d(0, " + this.diffY + "px, 0)");

        if (this.diffY < this.distance) {
            this.container.removeClass("pull-up").addClass("pull-down");
        } else {
            this.container.removeClass("pull-down").addClass("pull-up");
        }
    };
    PTR.prototype.touchEnd = function (e) {
        e.stopImmediatePropagation();
        this.start = false;
        if (this.diffY <= 0 || this.container.hasClass("refreshing")) return;
        this.container.removeClass("touching");
        this.container.removeClass("pull-down pull-up");
        this.container.css("transform", "");
        if (Math.abs(this.diffY) <= this.distance) {} else {
            this.container.addClass("refreshing");
            this.container.trigger("pull-to-refresh");
        }
        
    };

    PTR.prototype.attachEvents = function () {
        var el = this.container;
        el.addClass("ui-pull-to-refresh");
        el.on($.touchEvents.start, $.proxy(this.touchStart, this));
        el.on($.touchEvents.move, $.proxy(this.touchMove, this));
        el.on($.touchEvents.end, $.proxy(this.touchEnd, this));
    };

    var pullToRefresh = function (el) {
        new PTR(el);
    };

    var pullToRefreshDone = function (el) {
        setTimeout(function() {
            $(el).removeClass("refreshing");
        }, 300);
    }

    $.fn.pullToRefresh = function () {
        return this.each(function () {
            pullToRefresh(this);
        });
    }

    $.fn.pullToRefreshDone = function () {
        return this.each(function () {
            pullToRefreshDone(this);
        });
    }

})($);
/* global $:true */
;(function($) {
  "use strict";

  $(document).on("click", ".ui-search-bar label", function(e) {
    $(e.target).parents(".ui-search-bar").addClass("ui-search-focusing");
  }) 
  .on("blur", ".ui-search-input", function(e) {
    var $input = $(e.target);
    if(!$input.val()) $input.parents(".ui-search-bar").removeClass("ui-search-focusing");
  })
  .on("click", ".ui-search-cancel", function(e) {
    var $input = $(e.target).parents(".ui-search-bar").removeClass("ui-search-focusing").find(".ui-search-input").val("").blur();
  })
  .on("click", ".ui-icon-clear", function(e) {
    var $input = $(e.target).parents(".ui-search-bar").find(".ui-search-input").val("").focus();
  });

})($);

/**
 * Select
 * @author: minzhang
 * @update: 2016-12-16
 */ 
;
(function ($) {
    "use strict";

    var defaults;

    var Select = function (input, config) {

        var self = this;
        this.config = config;

        //init empty data
        this.data = {
            values: '',
            titles: '',
            origins: [],
            length: 0
        };

        this.$input = $(input);
        this.$input.prop("readOnly", true);

        this.initConfig();

        config = this.config;

        this.$input.closest('.ui-list-item').click($.proxy(this.open, this));

    }

    Select.prototype.initConfig = function () {
        this.config = $.extend({}, defaults, this.config);

        var config = this.config;

        if (!config.items || !config.items.length) return;

        config.items = config.items.map(function (d, i) {
            if (typeof d == typeof "a") {
                return {
                    title: d,
                    value: d
                };
            }

            return d;
        });


        this.tpl = $.template.compile(config.template);

        if (config.input !== undefined) this.$input.val(config.input);

        this.parseInitValue();
        
           var values = this.$input.attr('data-values') || '',
            titles = this.$input.val() || '';

        if(values.length && titles.length) {
            this.updateInputValue($(values.split(',')), $(titles.split(',')));
        }

        this._init = true;
    }

    Select.prototype.updateInputValue = function (values, titles) {
        var v, t;
        if (this.config.multi) {
            v = values.join(this.config.split);
            t = titles.join(this.config.split);
        } else {
            v = values[0];
            t = titles[0];
        }

        //caculate origin data
        var origins = [];

        this.config.items.forEach(function (d) {
            values.each(function (i, dd) {
                if (d.value == dd) origins.push(d);
            });
        });

        this.$input.val(t).data("values", v);
        this.$input.attr("value", t).attr("data-values", v);

        var data = {
            values: v,
            titles: t,
            valuesArray: values,
            titlesArray: titles,
            origins: origins,
            length: origins.length
        };
        this.data = data;
        this.$input.trigger("change", data);
        this.config.onChange && this.config.onChange.call(this, data);
    }

    Select.prototype.parseInitValue = function () {
        var value = this.$input.val();
        var items = this.config.items;

        //如果input为空，只有在第一次初始化的时候才保留默认选择。因为后来就是用户自己取消了全部选择，不能再为他选中默认值。
        if (!this._init && (value === undefined || value == null || value === "")) return;

        var titles = this.config.multi ? value.split(this.config.split) : [value];
        for (var i = 0; i < items.length; i++) {
            items[i].checked = false;
            for (var j = 0; j < titles.length; j++) {
                if (items[i].title === titles[j]) {
                    items[i].checked = true;
                }
            }
        }
    }

    Select.prototype._bind = function (dialog) {
        var self = this,
            config = this.config;
        dialog.on("change", function (e) {
                var checked = dialog.find("input:checked");
                var values = checked.map(function () {
                    return $(this).val();
                });
                var titles = checked.map(function () {
                    return $(this).data("title");
                });
                self.updateInputValue(values, titles);

            
                if (config.autoClose && !config.multi) $.closePicker();
            })
            .on("click", ".close-select", function () {
                self.close();
            });
    }

    //更新数据
    Select.prototype.update = function (config) {
        this.config = $.extend({}, this.config, config);
        this.initConfig();
        if (this._open) {
            this._bind($.updatePicker(this.getHTML()));
        }
    }

    Select.prototype.open = function (values, titles) {

        if (this._open) return;

        this.parseInitValue();

        var config = this.config;

        var dialog = this.dialog = $.openPicker(this.getHTML(), $.proxy(this.onClose, this));

        this._bind(dialog);

        this._open = true;
        if (config.onOpen) config.onOpen(this);
    }

    Select.prototype.close = function (callback, force) {
        var self = this,
            beforeClose = this.config.beforeClose;

        if (typeof callback === typeof true) {
            force === callback;
        }
        if (!force) {
            if (beforeClose && typeof beforeClose === 'function' && beforeClose.call(this, this.data.values, this.data.titles) === false) {
                return false
            }
            if (this.config.multi) {
                if (this.config.min !== undefined && this.data.length < this.config.min) {
                    $.toast("请至少选择" + this.config.min + "个", "text");
                    return false
                }
                if (this.config.max !== undefined && this.data.length > this.config.max) {
                    $.toast("最多只能选择" + this.config.max + "个", "text");
                    return false 
                }
            }
        }
        $.closePicker(function () {
            self.onClose();
            callback && callback();
        });
    }

    Select.prototype.onClose = function () {
        this._open = false;
        if (this.config.onClose) this.config.onClose(this);
    }

    Select.prototype.getHTML = function (callback) {
        var config = this.config;
        return this.tpl({
            items: config.items,
            title: config.title,
            multi: config.multi,
            closeText: config.closeText
        })
    }


    $.fn.select = function (params, args) {

        return this.each(function () {
            var $this = $(this);
            if (!$this.data("ui-select")) $this.data("ui-select", new Select(this, params));

            var select = $this.data("ui-select");

            if (typeof params === typeof "a") select[params].call(select, args);

            return select;
        });
    }
    
    defaults = $.fn.select.prototype.defaults = {
        items: [],
        input: undefined, //输入框的初始值
        title: "请选择",
        multi: false,
        closeText: "确定",
        autoClose: true, //是否选择完成后自动关闭，只有单选模式下才有效
        onChange: undefined, //function
        beforeClose: undefined, // function 关闭之前，如果返回false则阻止关闭
        onClose: undefined, //function
        onOpen: undefined, //function
        split: ",", //多选模式下的分隔符
        min: undefined, //多选模式下可用，最少选择数
        max: undefined, //单选模式下可用，最多选择数
        template: 
        '<div class="ui-picker-modal ui-select-modal">' +
        '   <div class="toolbar"><div class="toolbar-inner"><a href="javascript:;" class="picker-button close-select">{{closeText}}</a><h1 class="title">{{title}}</h1></div></div>' +
        '   <div class="ui-cells ui-cells-radio">' +
        '   {{each items as value}}' +
        '       <label class="ui-cell ui-check-label" for="ui-select-id-{{value.title}}">' +
        '           <div class="ui-cell-bd ui-cell-primary">' +
        '               <p>{{value.title}}</p>' +
        '           </div>' +
        '           <div class="ui-cell-ft">' +
        '               <input type="{{if multi}}checkbox{{else}}radio{{/if}}" class="ui-check" name="ui-select" id="ui-select-id-{{value.title}}" value="{{value.value}}" {{if value.checked}}checked="checked"{{/if}} data-title="{{value.title}}">' +
        '               <span class="ui-icon-checked"></span>' +
        '           </div>' +
        '       </label>' +
        '   {{/each}}' +
        '   </div>' +
        '</div>'
    }

})($);
/**
 * Popup
 * @author: minzhang
 * @update: 2016-12-16
 */

;
(function ($) {
    "use strict";


    //Popup 和 picker 之类的不要共用一个弹出方法，因为这样会导致 在 popup 中再弹出 picker 的时候会有问题。

    $.openPopup = function (popup, className) {

        $.closePopup();

        popup = $(popup);
        popup.show();
        popup.width();
        popup.addClass("ui-popup-container-visible");
        var modal = popup.find(".ui-popup-modal");
        modal.width();
        modal.transitionEnd(function () {
            modal.trigger("open");
        });
    }


    $.closePopup = function (container, remove) {
        container = $(container || ".ui-popup-container-visible");
        container.find('.ui-popup-modal').transitionEnd(function () {
            var $this = $(this);
            $this.trigger("close");
            container.hide();
            remove && container.remove();
        })
        container.removeClass("ui-popup-container-visible")
    };


    $(document).on("click", ".close-popup, .ui-popup-overlay", function () {
            $.closePopup();
        })
        .on("click", ".open-popup", function () {
            $($(this).data("target")).popup();
        })
        .on("click", ".ui-popup-container", function (e) {
            if ($(e.target).hasClass("ui-popup-container")) $.closePopup();
        })

    $.fn.popup = function () {
        return this.each(function () {
            $.openPopup(this);
        });
    };

})($);
/**
 * tab切换
 * @author: minzhang
 * @update: 2016-09-29
 */

;
(function ($) {
    "use strict";

    var showTab = function (tab, tabLink, force) {
        var newTab = $('#' + tab);
        if (arguments.length === 2) {
            if (typeof tabLink === 'boolean') {
                force = tabLink;
            }
        }
        if (newTab.length === 0) return false;
        if (newTab.hasClass('active')) {
            if (force) newTab.trigger('show');
            return false;
        }
        var tabs = newTab.parent('.ui-tab-content');
        if (tabs.length === 0) return false;

        // Remove active class from old tabs
        var oldTab = tabs.children('.ui-tab-item.active').removeClass('active');
        // Add active class to new tab
        newTab.addClass('active');
        // Trigger 'show' event on new tab
        newTab.trigger('show');

        // Find related link for new tab
        if (tabLink) tabLink = $(tabLink);
        else {
            // Search by id
            if (typeof tab === 'string') tabLink = $('.ui-tab-link[data-href="' + tab + '"]');
            else tabLink = $('.ui-tab-link[data-href="' + newTab.attr('id') + '"]');
            // Search by data-tab
            if (!tabLink || tabLink && tabLink.length === 0) {
                $('[data-tab]').each(function () {
                    if (newTab.is($(this).attr('data-tab'))) tabLink = $(this);
                });
            }
        }
        if (tabLink.length === 0) return;

        // Find related link for old tab
        var oldTabLink;
        if (oldTab && oldTab.length > 0) {
            // Search by id
            var oldTabId = oldTab.attr('id');
            if (oldTabId) oldTabLink = $('.ui-tab-link[data-href="' + oldTabId + '"]');
            // Search by data-tab
            if (!oldTabLink || oldTabLink && oldTabLink.length === 0) {
                $('[data-tab]').each(function () {
                    if (oldTab.is($(this).attr('data-tab'))) oldTabLink = $(this);
                });
            }
        }

        // Update links' classes
        if (tabLink && tabLink.length > 0) tabLink.addClass('active');
        if (oldTabLink && oldTabLink.length > 0) oldTabLink.removeClass('active');
        tabLink.trigger('active');

        //app.refreshScroller();

        return true;
    };

    var old = $.showTab;
    $.showTab = showTab;

    $.showTab.noConflict = function () {
        $.showTab = old;
        return this;
    };
    //        //a标签上的click事件，在iscroll下响应有问题
    //        $(document).on("click", ".tab-link", function (e) {
    //            e.preventDefault();
    //            var clicked = $(this);
    //            showTab(clicked.data("tab") || clicked.attr('href'), clicked);
    //        });

})($);
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
;
(function ($) {

    var debug = false;

    var root = this;

    var EXIF = function (obj) {
        if (obj instanceof EXIF) return obj;
        if (!(this instanceof EXIF)) return new EXIF(obj);
        this.EXIFwrapped = obj;
    };

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = EXIF;
        }
        exports.EXIF = EXIF;
    } else {
        root.EXIF = EXIF;
    }

    var ExifTags = EXIF.Tags = {

        // version tags
        0x9000: "ExifVersion", // EXIF version
        0xA000: "FlashpixVersion", // Flashpix format version

        // colorspace tags
        0xA001: "ColorSpace", // Color space information tag

        // image configuration
        0xA002: "PixelXDimension", // Valid width of meaningful image
        0xA003: "PixelYDimension", // Valid height of meaningful image
        0x9101: "ComponentsConfiguration", // Information about channels
        0x9102: "CompressedBitsPerPixel", // Compressed bits per pixel

        // user information
        0x927C: "MakerNote", // Any desired information written by the manufacturer
        0x9286: "UserComment", // Comments by user

        // related file
        0xA004: "RelatedSoundFile", // Name of related sound file

        // date and time
        0x9003: "DateTimeOriginal", // Date and time when the original image was generated
        0x9004: "DateTimeDigitized", // Date and time when the image was stored digitally
        0x9290: "SubsecTime", // Fractions of seconds for DateTime
        0x9291: "SubsecTimeOriginal", // Fractions of seconds for DateTimeOriginal
        0x9292: "SubsecTimeDigitized", // Fractions of seconds for DateTimeDigitized

        // picture-taking conditions
        0x829A: "ExposureTime", // Exposure time (in seconds)
        0x829D: "FNumber", // F number
        0x8822: "ExposureProgram", // Exposure program
        0x8824: "SpectralSensitivity", // Spectral sensitivity
        0x8827: "ISOSpeedRatings", // ISO speed rating
        0x8828: "OECF", // Optoelectric conversion factor
        0x9201: "ShutterSpeedValue", // Shutter speed
        0x9202: "ApertureValue", // Lens aperture
        0x9203: "BrightnessValue", // Value of brightness
        0x9204: "ExposureBias", // Exposure bias
        0x9205: "MaxApertureValue", // Smallest F number of lens
        0x9206: "SubjectDistance", // Distance to subject in meters
        0x9207: "MeteringMode", // Metering mode
        0x9208: "LightSource", // Kind of light source
        0x9209: "Flash", // Flash status
        0x9214: "SubjectArea", // Location and area of main subject
        0x920A: "FocalLength", // Focal length of the lens in mm
        0xA20B: "FlashEnergy", // Strobe energy in BCPS
        0xA20C: "SpatialFrequencyResponse", //
        0xA20E: "FocalPlaneXResolution", // Number of pixels in width direction per FocalPlaneResolutionUnit
        0xA20F: "FocalPlaneYResolution", // Number of pixels in height direction per FocalPlaneResolutionUnit
        0xA210: "FocalPlaneResolutionUnit", // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
        0xA214: "SubjectLocation", // Location of subject in image
        0xA215: "ExposureIndex", // Exposure index selected on camera
        0xA217: "SensingMethod", // Image sensor type
        0xA300: "FileSource", // Image source (3 == DSC)
        0xA301: "SceneType", // Scene type (1 == directly photographed)
        0xA302: "CFAPattern", // Color filter array geometric pattern
        0xA401: "CustomRendered", // Special processing
        0xA402: "ExposureMode", // Exposure mode
        0xA403: "WhiteBalance", // 1 = auto white balance, 2 = manual
        0xA404: "DigitalZoomRation", // Digital zoom ratio
        0xA405: "FocalLengthIn35mmFilm", // Equivalent foacl length assuming 35mm film camera (in mm)
        0xA406: "SceneCaptureType", // Type of scene
        0xA407: "GainControl", // Degree of overall image gain adjustment
        0xA408: "Contrast", // Direction of contrast processing applied by camera
        0xA409: "Saturation", // Direction of saturation processing applied by camera
        0xA40A: "Sharpness", // Direction of sharpness processing applied by camera
        0xA40B: "DeviceSettingDescription", //
        0xA40C: "SubjectDistanceRange", // Distance to subject

        // other tags
        0xA005: "InteroperabilityIFDPointer",
        0xA420: "ImageUniqueID" // Identifier assigned uniquely to each image
    };

    var TiffTags = EXIF.TiffTags = {
        0x0100: "ImageWidth",
        0x0101: "ImageHeight",
        0x8769: "ExifIFDPointer",
        0x8825: "GPSInfoIFDPointer",
        0xA005: "InteroperabilityIFDPointer",
        0x0102: "BitsPerSample",
        0x0103: "Compression",
        0x0106: "PhotometricInterpretation",
        0x0112: "Orientation",
        0x0115: "SamplesPerPixel",
        0x011C: "PlanarConfiguration",
        0x0212: "YCbCrSubSampling",
        0x0213: "YCbCrPositioning",
        0x011A: "XResolution",
        0x011B: "YResolution",
        0x0128: "ResolutionUnit",
        0x0111: "StripOffsets",
        0x0116: "RowsPerStrip",
        0x0117: "StripByteCounts",
        0x0201: "JPEGInterchangeFormat",
        0x0202: "JPEGInterchangeFormatLength",
        0x012D: "TransferFunction",
        0x013E: "WhitePoint",
        0x013F: "PrimaryChromaticities",
        0x0211: "YCbCrCoefficients",
        0x0214: "ReferenceBlackWhite",
        0x0132: "DateTime",
        0x010E: "ImageDescription",
        0x010F: "Make",
        0x0110: "Model",
        0x0131: "Software",
        0x013B: "Artist",
        0x8298: "Copyright"
    };

    var GPSTags = EXIF.GPSTags = {
        0x0000: "GPSVersionID",
        0x0001: "GPSLatitudeRef",
        0x0002: "GPSLatitude",
        0x0003: "GPSLongitudeRef",
        0x0004: "GPSLongitude",
        0x0005: "GPSAltitudeRef",
        0x0006: "GPSAltitude",
        0x0007: "GPSTimeStamp",
        0x0008: "GPSSatellites",
        0x0009: "GPSStatus",
        0x000A: "GPSMeasureMode",
        0x000B: "GPSDOP",
        0x000C: "GPSSpeedRef",
        0x000D: "GPSSpeed",
        0x000E: "GPSTrackRef",
        0x000F: "GPSTrack",
        0x0010: "GPSImgDirectionRef",
        0x0011: "GPSImgDirection",
        0x0012: "GPSMapDatum",
        0x0013: "GPSDestLatitudeRef",
        0x0014: "GPSDestLatitude",
        0x0015: "GPSDestLongitudeRef",
        0x0016: "GPSDestLongitude",
        0x0017: "GPSDestBearingRef",
        0x0018: "GPSDestBearing",
        0x0019: "GPSDestDistanceRef",
        0x001A: "GPSDestDistance",
        0x001B: "GPSProcessingMethod",
        0x001C: "GPSAreaInformation",
        0x001D: "GPSDateStamp",
        0x001E: "GPSDifferential"
    };

    var StringValues = EXIF.StringValues = {
        ExposureProgram: {
            0: "Not defined",
            1: "Manual",
            2: "Normal program",
            3: "Aperture priority",
            4: "Shutter priority",
            5: "Creative program",
            6: "Action program",
            7: "Portrait mode",
            8: "Landscape mode"
        },
        MeteringMode: {
            0: "Unknown",
            1: "Average",
            2: "CenterWeightedAverage",
            3: "Spot",
            4: "MultiSpot",
            5: "Pattern",
            6: "Partial",
            255: "Other"
        },
        LightSource: {
            0: "Unknown",
            1: "Daylight",
            2: "Fluorescent",
            3: "Tungsten (incandescent light)",
            4: "Flash",
            9: "Fine weather",
            10: "Cloudy weather",
            11: "Shade",
            12: "Daylight fluorescent (D 5700 - 7100K)",
            13: "Day white fluorescent (N 4600 - 5400K)",
            14: "Cool white fluorescent (W 3900 - 4500K)",
            15: "White fluorescent (WW 3200 - 3700K)",
            17: "Standard light A",
            18: "Standard light B",
            19: "Standard light C",
            20: "D55",
            21: "D65",
            22: "D75",
            23: "D50",
            24: "ISO studio tungsten",
            255: "Other"
        },
        Flash: {
            0x0000: "Flash did not fire",
            0x0001: "Flash fired",
            0x0005: "Strobe return light not detected",
            0x0007: "Strobe return light detected",
            0x0009: "Flash fired, compulsory flash mode",
            0x000D: "Flash fired, compulsory flash mode, return light not detected",
            0x000F: "Flash fired, compulsory flash mode, return light detected",
            0x0010: "Flash did not fire, compulsory flash mode",
            0x0018: "Flash did not fire, auto mode",
            0x0019: "Flash fired, auto mode",
            0x001D: "Flash fired, auto mode, return light not detected",
            0x001F: "Flash fired, auto mode, return light detected",
            0x0020: "No flash function",
            0x0041: "Flash fired, red-eye reduction mode",
            0x0045: "Flash fired, red-eye reduction mode, return light not detected",
            0x0047: "Flash fired, red-eye reduction mode, return light detected",
            0x0049: "Flash fired, compulsory flash mode, red-eye reduction mode",
            0x004D: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
            0x004F: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
            0x0059: "Flash fired, auto mode, red-eye reduction mode",
            0x005D: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
            0x005F: "Flash fired, auto mode, return light detected, red-eye reduction mode"
        },
        SensingMethod: {
            1: "Not defined",
            2: "One-chip color area sensor",
            3: "Two-chip color area sensor",
            4: "Three-chip color area sensor",
            5: "Color sequential area sensor",
            7: "Trilinear sensor",
            8: "Color sequential linear sensor"
        },
        SceneCaptureType: {
            0: "Standard",
            1: "Landscape",
            2: "Portrait",
            3: "Night scene"
        },
        SceneType: {
            1: "Directly photographed"
        },
        CustomRendered: {
            0: "Normal process",
            1: "Custom process"
        },
        WhiteBalance: {
            0: "Auto white balance",
            1: "Manual white balance"
        },
        GainControl: {
            0: "None",
            1: "Low gain up",
            2: "High gain up",
            3: "Low gain down",
            4: "High gain down"
        },
        Contrast: {
            0: "Normal",
            1: "Soft",
            2: "Hard"
        },
        Saturation: {
            0: "Normal",
            1: "Low saturation",
            2: "High saturation"
        },
        Sharpness: {
            0: "Normal",
            1: "Soft",
            2: "Hard"
        },
        SubjectDistanceRange: {
            0: "Unknown",
            1: "Macro",
            2: "Close view",
            3: "Distant view"
        },
        FileSource: {
            3: "DSC"
        },

        Components: {
            0: "",
            1: "Y",
            2: "Cb",
            3: "Cr",
            4: "R",
            5: "G",
            6: "B"
        }
    };

    function addEvent(element, event, handler) {
        if (element.addEventListener) {
            element.addEventListener(event, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + event, handler);
        }
    }

    function imageHasData(img) {
        return !!(img.exifdata);
    }


    function base64ToArrayBuffer(base64, contentType) {
        contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || ''; // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
        base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
        var binary = atob(base64);
        var len = binary.length;
        var buffer = new ArrayBuffer(len);
        var view = new Uint8Array(buffer);
        for (var i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
        }
        return buffer;
    }

    function objectURLToBlob(url, callback) {
        var http = new XMLHttpRequest();
        http.open("GET", url, true);
        http.responseType = "blob";
        http.onload = function (e) {
            if (this.status == 200 || this.status === 0) {
                callback(this.response);
            }
        };
        http.send();
    }

    function getImageData(img, callback) {
        function handleBinaryFile(binFile) {
            var data = findEXIFinJPEG(binFile);
            var iptcdata = findIPTCinJPEG(binFile);
            img.exifdata = data || {};
            img.iptcdata = iptcdata || {};
            if (callback) {
                callback.call(img);
            }
        }

        if (img.src) {
            if (/^data\:/i.test(img.src)) { // Data URI
                var arrayBuffer = base64ToArrayBuffer(img.src);
                handleBinaryFile(arrayBuffer);

            } else if (/^blob\:/i.test(img.src)) { // Object URL
                var fileReader = new FileReader();
                fileReader.onload = function (e) {
                    handleBinaryFile(e.target.result);
                };
                objectURLToBlob(img.src, function (blob) {
                    fileReader.readAsArrayBuffer(blob);
                });
            } else {
                var http = new XMLHttpRequest();
                http.onload = function () {
                    if (this.status == 200 || this.status === 0) {
                        handleBinaryFile(http.response);
                    } else {
                        throw "Could not load image";
                    }
                    http = null;
                };
                http.open("GET", img.src, true);
                http.responseType = "arraybuffer";
                http.send(null);
            }
        } else if (window.FileReader && (img instanceof window.Blob || img instanceof window.File)) {
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                if (debug) console.log("Got file of length " + e.target.result.byteLength);
                handleBinaryFile(e.target.result);
            };

            fileReader.readAsArrayBuffer(img);
        }
    }

    function findEXIFinJPEG(file) {
        var dataView = new DataView(file);

        if (debug) console.log("Got file of length " + file.byteLength);
        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
            if (debug) console.log("Not a valid JPEG");
            return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength,
            marker;

        while (offset < length) {
            if (dataView.getUint8(offset) != 0xFF) {
                if (debug) console.log("Not a valid marker at offset " + offset + ", found: " + dataView.getUint8(offset));
                return false; // not a valid marker, something is wrong
            }

            marker = dataView.getUint8(offset + 1);
            if (debug) console.log(marker);

            // we could implement handling for other markers here,
            // but we're only looking for 0xFFE1 for EXIF data

            if (marker == 225) {
                if (debug) console.log("Found 0xFFE1 marker");

                return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);

                // offset += 2 + file.getShortAt(offset+2, true);

            } else {
                offset += 2 + dataView.getUint16(offset + 2);
            }

        }

    }

    function findIPTCinJPEG(file) {
        var dataView = new DataView(file);

        if (debug) console.log("Got file of length " + file.byteLength);
        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
            if (debug) console.log("Not a valid JPEG");
            return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength;


        var isFieldSegmentStart = function (dataView, offset) {
            return (
                dataView.getUint8(offset) === 0x38 &&
                dataView.getUint8(offset + 1) === 0x42 &&
                dataView.getUint8(offset + 2) === 0x49 &&
                dataView.getUint8(offset + 3) === 0x4D &&
                dataView.getUint8(offset + 4) === 0x04 &&
                dataView.getUint8(offset + 5) === 0x04
            );
        };

        while (offset < length) {

            if (isFieldSegmentStart(dataView, offset)) {

                // Get the length of the name header (which is padded to an even number of bytes)
                var nameHeaderLength = dataView.getUint8(offset + 7);
                if (nameHeaderLength % 2 !== 0) nameHeaderLength += 1;
                // Check for pre photoshop 6 format
                if (nameHeaderLength === 0) {
                    // Always 4
                    nameHeaderLength = 4;
                }

                var startOffset = offset + 8 + nameHeaderLength;
                var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);

                return readIPTCData(file, startOffset, sectionLength);

                break;

            }


            // Not the marker, continue searching
            offset++;

        }

    }
    var IptcFieldMap = {
        0x78: 'caption',
        0x6E: 'credit',
        0x19: 'keywords',
        0x37: 'dateCreated',
        0x50: 'byline',
        0x55: 'bylineTitle',
        0x7A: 'captionWriter',
        0x69: 'headline',
        0x74: 'copyright',
        0x0F: 'category'
    };

    function readIPTCData(file, startOffset, sectionLength) {
        var dataView = new DataView(file);
        var data = {};
        var fieldValue, fieldName, dataSize, segmentType, segmentSize;
        var segmentStartPos = startOffset;
        while (segmentStartPos < startOffset + sectionLength) {
            if (dataView.getUint8(segmentStartPos) === 0x1C && dataView.getUint8(segmentStartPos + 1) === 0x02) {
                segmentType = dataView.getUint8(segmentStartPos + 2);
                if (segmentType in IptcFieldMap) {
                    dataSize = dataView.getInt16(segmentStartPos + 3);
                    segmentSize = dataSize + 5;
                    fieldName = IptcFieldMap[segmentType];
                    fieldValue = getStringFromDB(dataView, segmentStartPos + 5, dataSize);
                    // Check if we already stored a value with this name
                    if (data.hasOwnProperty(fieldName)) {
                        // Value already stored with this name, create multivalue field
                        if (data[fieldName] instanceof Array) {
                            data[fieldName].push(fieldValue);
                        } else {
                            data[fieldName] = [data[fieldName], fieldValue];
                        }
                    } else {
                        data[fieldName] = fieldValue;
                    }
                }

            }
            segmentStartPos++;
        }
        return data;
    }



    function readTags(file, tiffStart, dirStart, strings, bigEnd) {
        var entries = file.getUint16(dirStart, !bigEnd),
            tags = {},
            entryOffset, tag,
            i;

        for (i = 0; i < entries; i++) {
            entryOffset = dirStart + i * 12 + 2;
            tag = strings[file.getUint16(entryOffset, !bigEnd)];
            if (!tag && debug) console.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
            tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
        }
        return tags;
    }


    function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
        var type = file.getUint16(entryOffset + 2, !bigEnd),
            numValues = file.getUint32(entryOffset + 4, !bigEnd),
            valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart,
            offset,
            vals, val, n,
            numerator, denominator;

        switch (type) {
            case 1: // byte, 8-bit unsigned int
            case 7: // undefined, 8-bit byte, value depending on field
                if (numValues == 1) {
                    return file.getUint8(entryOffset + 8, !bigEnd);
                } else {
                    offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getUint8(offset + n);
                    }
                    return vals;
                }

            case 2: // ascii, 8-bit byte
                offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                return getStringFromDB(file, offset, numValues - 1);

            case 3: // short, 16 bit int
                if (numValues == 1) {
                    return file.getUint16(entryOffset + 8, !bigEnd);
                } else {
                    offset = numValues > 2 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getUint16(offset + 2 * n, !bigEnd);
                    }
                    return vals;
                }

            case 4: // long, 32 bit int
                if (numValues == 1) {
                    return file.getUint32(entryOffset + 8, !bigEnd);
                } else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getUint32(valueOffset + 4 * n, !bigEnd);
                    }
                    return vals;
                }

            case 5: // rational = two long values, first is numerator, second is denominator
                if (numValues == 1) {
                    numerator = file.getUint32(valueOffset, !bigEnd);
                    denominator = file.getUint32(valueOffset + 4, !bigEnd);
                    val = new Number(numerator / denominator);
                    val.numerator = numerator;
                    val.denominator = denominator;
                    return val;
                } else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        numerator = file.getUint32(valueOffset + 8 * n, !bigEnd);
                        denominator = file.getUint32(valueOffset + 4 + 8 * n, !bigEnd);
                        vals[n] = new Number(numerator / denominator);
                        vals[n].numerator = numerator;
                        vals[n].denominator = denominator;
                    }
                    return vals;
                }

            case 9: // slong, 32 bit signed int
                if (numValues == 1) {
                    return file.getInt32(entryOffset + 8, !bigEnd);
                } else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getInt32(valueOffset + 4 * n, !bigEnd);
                    }
                    return vals;
                }

            case 10: // signed rational, two slongs, first is numerator, second is denominator
                if (numValues == 1) {
                    return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset + 4, !bigEnd);
                } else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getInt32(valueOffset + 8 * n, !bigEnd) / file.getInt32(valueOffset + 4 + 8 * n, !bigEnd);
                    }
                    return vals;
                }
        }
    }

    function getStringFromDB(buffer, start, length) {
        var outstr = "";
        for (n = start; n < start + length; n++) {
            outstr += String.fromCharCode(buffer.getUint8(n));
        }
        return outstr;
    }

    function readEXIFData(file, start) {
        if (getStringFromDB(file, start, 4) != "Exif") {
            if (debug) console.log("Not valid EXIF data! " + getStringFromDB(file, start, 4));
            return false;
        }

        var bigEnd,
            tags, tag,
            exifData, gpsData,
            tiffOffset = start + 6;

        // test for TIFF validity and endianness
        if (file.getUint16(tiffOffset) == 0x4949) {
            bigEnd = false;
        } else if (file.getUint16(tiffOffset) == 0x4D4D) {
            bigEnd = true;
        } else {
            if (debug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
            return false;
        }

        if (file.getUint16(tiffOffset + 2, !bigEnd) != 0x002A) {
            if (debug) console.log("Not valid TIFF data! (no 0x002A)");
            return false;
        }

        var firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);

        if (firstIFDOffset < 0x00000008) {
            if (debug) console.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset + 4, !bigEnd));
            return false;
        }

        tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);

        if (tags.ExifIFDPointer) {
            exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
            for (tag in exifData) {
                switch (tag) {
                    case "LightSource":
                    case "Flash":
                    case "MeteringMode":
                    case "ExposureProgram":
                    case "SensingMethod":
                    case "SceneCaptureType":
                    case "SceneType":
                    case "CustomRendered":
                    case "WhiteBalance":
                    case "GainControl":
                    case "Contrast":
                    case "Saturation":
                    case "Sharpness":
                    case "SubjectDistanceRange":
                    case "FileSource":
                        exifData[tag] = StringValues[tag][exifData[tag]];
                        break;

                    case "ExifVersion":
                    case "FlashpixVersion":
                        exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
                        break;

                    case "ComponentsConfiguration":
                        exifData[tag] =
                            StringValues.Components[exifData[tag][0]] +
                            StringValues.Components[exifData[tag][1]] +
                            StringValues.Components[exifData[tag][2]] +
                            StringValues.Components[exifData[tag][3]];
                        break;
                }
                tags[tag] = exifData[tag];
            }
        }

        if (tags.GPSInfoIFDPointer) {
            gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
            for (tag in gpsData) {
                switch (tag) {
                    case "GPSVersionID":
                        gpsData[tag] = gpsData[tag][0] +
                            "." + gpsData[tag][1] +
                            "." + gpsData[tag][2] +
                            "." + gpsData[tag][3];
                        break;
                }
                tags[tag] = gpsData[tag];
            }
        }

        return tags;
    }

    EXIF.getData = function (img, callback) {
        if ((img instanceof Image || img instanceof HTMLImageElement) && !img.complete) return false;

        if (!imageHasData(img)) {
            getImageData(img, callback);
        } else {
            if (callback) {
                callback.call(img);
            }
        }
        return true;
    }

    EXIF.getTag = function (img, tag) {
        if (!imageHasData(img)) return;
        return img.exifdata[tag];
    }

    EXIF.getAllTags = function (img) {
        if (!imageHasData(img)) return {};
        var a,
            data = img.exifdata,
            tags = {};
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                tags[a] = data[a];
            }
        }
        return tags;
    }

    EXIF.pretty = function (img) {
        if (!imageHasData(img)) return "";
        var a,
            data = img.exifdata,
            strPretty = "";
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                if (typeof data[a] == "object") {
                    if (data[a] instanceof Number) {
                        strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
                    } else {
                        strPretty += a + " : [" + data[a].length + " values]\r\n";
                    }
                } else {
                    strPretty += a + " : " + data[a] + "\r\n";
                }
            }
        }
        return strPretty;
    }

    EXIF.readFromBinaryFile = function (file) {
        return findEXIFinJPEG(file);
    }

    $.EXIF = EXIF;
})($);

;
(function ($) {

    var
        ua = navigator.userAgent,
        isInWechat = ~ua.indexOf('MicroMessenger'),
        isAndroid = ~ua.indexOf('Android'),
        isOldIos = (function () {
            var match = navigator.userAgent.match(/(\d)_\d like Mac OS/);
            return match && match[1] <= 7;
        })(),
        URL = window.URL || window.webkitURL;

    /**
     * 组件构造器
     * @param {file} 上传文件
     * @param {object} options选项
     *   - maxWidth {number} 最大宽度(如果最大高宽同时存在则根据原图的高宽比例来计算以哪个为准)，默认值1000
     *   - maxHeight {number} 最大高度，默认值1000
     *   - quality {number} 质量等级(类似PS保存事的质量等级，并不是压缩比例)，取值范围 0-1，默认值0.6
     *   - before {function} 压缩前handler
     *     - param {file} 原始上传文件
     *     - return {boolean} 是否放弃，返回false放弃压缩
     *   - done {function} 成功handler
     *     - param {file} 原始上传文件
     *     - param {string} 生成的base64图片
     *   - fail {function} 失败handler
     *     - param {file} 原始上传文件
     *   - complete {function} 完成handler
     *     - param {file} 原始上传文件
     *   - notSupport {function} 浏览器不支持handler
     *     - param {file} 原始上传文件
     */
    function html5ImgCompress(file, options) {
        var DEFAULTE = html5ImgCompress.DEFAULTE;

        this.file = file;
        this.options = {};

        for (var key in DEFAULTE) {
            this.options[key] = options[key] == null ? DEFAULTE[key] : options[key];
        }

        this.init();
    }

    html5ImgCompress.prototype = {
        init: function () {
            if (URL && File && document.createElement('canvas').getContext) {
                this.read(this.file);
            } else { // 浏览器不支持
                this.options.notSupport();
            }
        },
        /**
         * 读取文件，用canvas画出来并用toDataURL来压缩后转成base64
         * @param {file} 上传文件
         */
        read: function (file) {
            var
                self = this,
                img = new Image(),
                fileURL = URL.createObjectURL(file),
                size, canvas, ctx, iosImg, quality, encoder, base64, handler, iosRenderOptions;

            if (self.options.before(file) === false) return;

            img.src = fileURL;

            img.onload = function () {
                handler = function (orientation) {
                    quality = self.options.quality
                    size = self.getSize(img, orientation);
                    canvas = document.createElement('canvas');
                    canvas.width = size.width;
                    canvas.height = size.height;
                    ctx = canvas.getContext('2d');

                    // 设置为白色背景，jpg是不支持透明的，所以会被默认为canvas默认的黑色背景。
                    ctx.fillStyle = "#fff";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                              if (isOldIos) { // iOS6/iOS7
                                  iosImg = new $.MegaPixImage(img);
                                  iosRenderOptions = {
                                    maxWidth: canvas.width,
                                    maxHeight: canvas.height,
                                    orientation: orientation
                                  }
                                  if (~"68".indexOf(orientation)) { // 90，270度则高宽互换
                                    iosRenderOptions.maxWidth = canvas.height;
                                    iosRenderOptions.maxHeight = canvas.width;
                                  }
                                  iosImg.render(canvas, iosRenderOptions);
                                  base64 = canvas.toDataURL('image/jpeg', quality);
                    
                                  self.handler('done', canvas, img, fileURL, base64, file);
                              } else { // 其他设备
                    switch (orientation) { // 根据方向在画布不同的位置画图
                        case 3:
                            ctx.rotate(180 * Math.PI / 180);
                            ctx.drawImage(img, -canvas.width, -canvas.height, canvas.width, canvas.height);
                            break;
                        case 6:
                            ctx.rotate(90 * Math.PI / 180);
                            ctx.drawImage(img, 0, -canvas.width, canvas.height, canvas.width);
                            break;
                        case 8:
                            ctx.rotate(270 * Math.PI / 180);
                            ctx.drawImage(img, -canvas.height, 0, canvas.height, canvas.width);
                            break;
                        default:
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    }

                                if (isAndroid && isInWechat) { // 安卓微信下压缩有问题
                                    encoder = new $.JPEGEncoder();
                                    base64 = encoder.encode(ctx.getImageData(0, 0, canvas.width, canvas.height), quality * 100);
                                    self.handler('done', canvas, img, fileURL, base64, file);
                                } else {
                    base64 = canvas.toDataURL('image/jpeg', quality);
                                }

                    self.handler('done', canvas, img, fileURL, base64, file);
                                        }
                };

                if (!isAndroid) { // 非安卓需要获取orientation来drawImage，所以要以引入exif
                    $.EXIF.getData(img, function () {
                        handler($.EXIF.getTag(this, "Orientation"));
                    })
                } else {
                    handler();
                }
            };

            img.onerror = function () {
                self.handler('fail', canvas, img, fileURL, base64, file);
            };

        },
        // 处理句柄
        handler: function (action, canvas, img, fileURL, base64, file) {
            // 释放内存
            canvas = null;
            img = null;
            URL.revokeObjectURL(fileURL);

            this.options[action](file, base64);
            this.options['complete'](file);
        },
        /**
         * 图片最大高宽校正（方向和比例）
         * @param  {image} 图片
         * @param  {number} 图片方向 1)正常 3)180度 6)90度 8)270度
         * @return  {object}
         *   width: {number} 矫正后的width
         *   height: {number} 校正后的hieght
         */
        getSize: function (img, orientation) {
            var
                options = this.options,
                mW = options.maxWidth,
                mH = options.maxHeight,
                w = img.width,
                h = img.height,
                scale;

            if (~"68".indexOf(orientation)) { // 90，270度则高宽互换
                w = img.height;
                h = img.width;
            }

            scale = w / h;

            if (mW && mH) {
                if (scale >= mW / mH) {
                    if (w > mW) {
                        h = mW / scale;
                        w = mW;
                    }
                } else {
                    if (h > mH) {
                        w = mH * scale;
                        h = mH;
                    }
                }
            } else if (mW) {
                if (mW < w) {
                    h = mW / scale;
                    w = mW;
                }
            } else if (mH) {
                if (mH < h) {
                    w = mH * scale;
                    h = mH;
                }
            }

            return {
                width: w,
                height: h
            };
        }
    };

    // 默认参数
    html5ImgCompress.DEFAULTE = {
        maxWidth: 500,
        maxHeight: 500,
        quality: 1,
        before: function () {},
        done: function () {},
        fail: function () {},
        complete: function () {},
        notSupport: function () {}
    }

    $.html5ImgCompress = html5ImgCompress;
})($);
;
(function () {
    // 早期版本的浏览器需要用BlobBuilder来构造Blob，创建一个通用构造器来兼容早期版本
    var BlobConstructor = ((function () {
        try {
            new Blob();
            return true;
        } catch (e) {
            return false;
        }
    })()) ? window.Blob : function (parts, opts) {
        var bb = new(
            window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder || window.MozBlobBuilder
        );
        parts.forEach(function (p) {
            bb.append(p);
        });

        return bb.getBlob(opts ? opts.type : undefined);
    };

    // Android上的AppleWebKit 534以前的内核存在一个Bug，
    // 导致FormData加入一个Blob对象后，上传的文件是0字节
    function hasFormDataBug() {
        var bCheck = ~navigator.userAgent.indexOf('Android') && ~navigator.vendor.indexOf('Google') && !~navigator.userAgent.indexOf('Chrome');

        // QQ X5浏览器也有这个BUG
        return bCheck && navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 534 || /MQQBrowser/g.test(navigator.userAgent);
    }
    
    var FormDataShim = (function () {
        var formDataShimNums = 0;

        function FormDataShim() {
            var
            // Store a reference to this
                o = this,

                // Data to be sent
                parts = [],

                // Boundary parameter for separating the multipart values
                boundary = Array(21).join('-') + (+new Date() * (1e16 * Math.random())).toString(36),

                // Store the current XHR send method so we can safely override it
                oldSend = XMLHttpRequest.prototype.send;
            this.getParts = function () {
                return parts.toString();
            };
            this.append = function (name, value, filename) {
                parts.push('--' + boundary + '\r\nContent-Disposition: form-data; name="' + name + '"');

                if (value instanceof Blob) {
                    parts.push('; filename="' + (filename || 'blob') + '"\r\nContent-Type: ' + value.type + '\r\n\r\n');
                    parts.push(value);
                } else {
                    parts.push('\r\n\r\n' + value);
                }
                parts.push('\r\n');
            };

            formDataShimNums++;
            XMLHttpRequest.prototype.send = function (val) {
                var fr,
                    data,
                    oXHR = this;

                if (val === o) {
                    // Append the final boundary string
                    parts.push('--' + boundary + '--\r\n');
                    // Create the blob
                    data = new BlobConstructor(parts);

                    // Set up and read the blob into an array to be sent
                    fr = new FileReader();
                    fr.onload = function () {
                        oldSend.call(oXHR, fr.result);
                    };
                    fr.onerror = function (err) {
                        throw err;
                    };
                    fr.readAsArrayBuffer(data);

                    // Set the multipart content type and boudary
                    this.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
                    formDataShimNums--;
                    if (formDataShimNums == 0) {
                        XMLHttpRequest.prototype.send = oldSend;
                    }
                } else {
                    oldSend.call(this, val);
                }
            };
        };
        FormDataShim.prototype = Object.create(FormData.prototype);
        return FormDataShim;
    })();
    
    /**
     * 转换成formdata
     * @param dataURI
     * @returns {*}
     *
     * @source http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
     */
    function dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0){
            byteString = atob(dataURI.split(',')[1]);
        }else {
            byteString = unescape(dataURI.split(',')[1]);
        }

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new BlobConstructor([ia.buffer], {
            type: mimeString
        });
    }
    
    window.BlobFormDataShim = {
        FormData: hasFormDataBug() ? FormDataShim : FormData,
        dataURItoBlob: dataURItoBlob
    }

})();

/**
 * upload
 * @author: minzhang
 * @update: 2016-12-16
 */

;
(function ($) {
    "use strict";

    //    function dataURItoBlob(dataURI, type) {
    //        var binary = atob(dataURI.split(',')[1]);
    //        var array = [];
    //        for(var i = 0; i < binary.length; i++) {
    //            array.push(binary.charCodeAt(i));
    //        }
    //        return new Blob([new Uint8Array(array)], {type: type});
    //    }

    var k = 1024;

    var defaults;

    var noop = function () {};

    var Upload = function (ele, options) {
        var that = this;

        this.options = $.extend({}, defaults, options);
        this.tpl = $.template.compile(this.options.template);
        this.$ele = $(ele);
        this.$input = this.$ele.find('input');
        this.$btn = this.$ele.find('.ui-upload-btn-wrap');

        this.init();

        this.$ele
            .on('change', 'input', $.proxy(that.onChange, that))
            .on('click', '.ui-uploader-remove', $.proxy(that.onDelete, that));
    };

    Upload.prototype.init = function () {
        var options = this.options;

        options.fileList = options.fileList || [];

        if (options.fileList.length) {
            this.addHtml(options.fileList);
        }

        if (options.fileList.length >= options.maxLength) {
            !this.$btn.hasClass('ui-hide') && this.$btn.addClass('ui-hide');
            return;
        }
    };

    Upload.prototype.onChange = function (e) {
        var that = this,
            files = e.target.files;

        if (!files.length) {
            return;
        }

        new $.html5ImgCompress(files[0], {
            done: function (file, base64) {
                var options = that.options;

                var blob = BlobFormDataShim.dataURItoBlob(base64, file.type);
//                var blob = file;
                // 上传前
                if (options.beforeUpload && options.beforeUpload.call(that, blob) === false) return;
                that.ajax(blob);
            },
            notSupport: function (blob) {
                console.log('浏览器不支持！');
            }
        });

    };

    Upload.prototype.onDelete = function (e) {
        var that = this,
            $target = $(e.target),
            uid = $target.data('uid'),
            options = that.options;

        $target.closest('.ui-uploader-item').remove();

        options.fileList = options.fileList.filter(function (value) {
            return value.uid !== uid;
        });

        if (options.fileList.length < options.maxLength) {
            this.$btn.hasClass('ui-hide') && this.$btn.removeClass('ui-hide');
        }
    };

    Upload.prototype.ajax = function (file) {
        var that = this,
            options = that.options,
            formData = new FormData();
        
        formData = new BlobFormDataShim.FormData();

        // 上传中
        options.uploadProgress && options.uploadProgress.call(that, file);

        // 把上传的数据放入form_data
        formData.append("img", file);

        $.ajax({
            type: 'POST', // 上传文件要用POST
            url: options.action,
            dataType: 'json',
            cache: false,
            crossDomain: true, // 如果用到跨域，需要后台开启CORS
            processData: false, // 注意：不要 process data
            contentType: false, // 注意：不设置 contentType
            xhrFields: {
                withCredentials: true
            },
            data: formData,
        }).success(function (res) {
            if (res.success) {
                var item = {
                    uid: Date.now(),
                    url: res.data.image_url,
                };
                options.fileList.push(item);

                if (options.fileList.length >= options.maxLength) {
                    !that.$btn.hasClass('ui-hide') && that.$btn.addClass('ui-hide');
                }
                that.addHtml([item]);
                // 上传完成
                options.uploadComplete && options.uploadComplete.call(that, res);
            } else {
                // 上传失败
                options.uploadError && options.uploadError.call(that, res);
            }

            //以下代码解决chrome浏览器上传同一文件不能触发change事件的问题。
            that.$input = that.$input.clone().val('').replaceAll(that.$input);
        }).fail(function (res) {
            // 上传失败
            options.uploadError && options.uploadError.call(that, res);
            //以下代码解决chrome浏览器上传同一文件不能触发change事件的问题。
            that.$input = that.$input.clone().val('').replaceAll(that.$input);
        });
    };

    Upload.prototype.addHtml = function (data) {
        this.$btn.before(this.tpl({
            fileList: data,
        }));
    };

    $.fn.upload = function (options) {
        return this.each(function () {

            var $this = $(this);
            if (!$this.data("upload")) $this.data("upload", new Upload(this, options));

            var upload = $this.data("upload");

            if (typeof options === typeof "a") upload[options].call(upload);

            return upload;

        });
    }

    defaults = $.fn.upload.prototype.defaults = {
        action: '',
        fileList: null,
        maxSize: 5 * k * k, // 默认为5m
        maxLength: 1, // 最多上传个数
        beforeUpload: noop, //function 上传前
        uploadProgress: noop, // function 上传进行中
        uploadComplete: noop, //function 上传完成
        uploadError: noop, //function 上传失败
        fileDelete: noop, // function 删除文件
        template: '{{each fileList as value}}' +
            '<div class="ui-uploader-item">' +
            '   <div class="ui-uploader-item-content">' +
            '      <div class="ui-uploader-remove" data-uid="{{value.uid}}"></div>' +
            '      <img class="ui-uploader-img" src="{{value.url}}">' +
            '   </div>' +
            '</div>' +
            '{{/each}}',
    }

})($);