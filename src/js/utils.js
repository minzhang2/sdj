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