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