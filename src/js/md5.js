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