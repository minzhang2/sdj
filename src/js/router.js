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