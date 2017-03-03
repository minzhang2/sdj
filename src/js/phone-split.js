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