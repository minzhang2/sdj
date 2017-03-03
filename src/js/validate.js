+ (function ($) {
    $.fn.ValidateForm = function (options) {
        this.each(function () {
            new validateForm(this);
        });
    };
    var validateForm = function (elem) {
        this.elem = elem;
        this.opt = {
            //提示信息
            tips_required: '不能为空',
            tips_email: '邮箱地址格式有误',
            tips_num: '请填写数字',
            tips_chinese: '请填写中文',
            tips_mobile: '手机号码格式有误',
            tips_idcard: '身份证号码格式有误',
            tips_pwdequal: '两次密码不一致',
            tips_ajax: '信息已经存在',
            tips_numletter: '请输入数字和字母的组合字符',
            tips_length: '',
            tips_passport: '护照格式有误',

            //正则
            reg_email: /^\w+\@[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/i, //验证邮箱
            reg_num: /^\d+$/, //验证数字
            reg_chinese: /^[\u4E00-\u9FA5]+$/, //验证中文
            reg_mobile: /^1[34578]{1}[0-9]{9}$/, //验证手机
            reg_idcard: /^\d{14}\d{3}?\w$/, //验证身份证
            reg_numletter: /[^\d|chun]/, //验证数字和字母
            reg_passport: /^1[45][0-9]{7}|G[0-9]{8}|P[0-9]{7}|S[0-9]{7,8}|D[0-9]+$/ //验证护照
        };
        this.options = $.extend(this.opt);
        this.validate();
    };
    validateForm.prototype = {
        validate: function () {
            //validate form ;
            _this = this;
            var isValid = true;
            $(_this.elem).find("input,textarea").each(function () {
                var _validate = $(this).attr("check");
                if (_validate) {
                    var arr = _validate.split(' ');
                    for (var i = 0; i < arr.length; i++) {
                        if (!_this.check($(this), arr[i], $(this))) {
                            isValid = false; //验证不通过阻止表单提交，开关false
                            //return isValid; //跳出
                        }
                    }

                    return isValid;
                }
            });
        },
        check: function (obj, _match, elem) {
            var _val = $.trim($(elem).val());
            //根据验证情况，显示相应提示信息，返回相应的值
            switch (_match) {
                case 'required':
                    return _val ? true : _this.showErrorMsg(obj, this.opt.tips_required, false);
                case 'email':
                    return regmatch(_val, this.opt.reg_email) ? true : _this.showErrorMsg(obj, this.opt.tips_email, false);
                case 'num':
                    return regmatch(_val, this.opt.reg_num) ? true : _this.showErrorMsg(obj, this.opt.tips_num, false);
                case 'chinese':
                    return chk(_val, this.opt.reg_chinese) ? true : _this.showErrorMsg(obj, this.opt.tips_chinese, false);
                case 'mobile':
                    return regmatch(_val, this.opt.reg_mobile) ? true : _this.showErrorMsg(obj, this.opt.tips_mobile, false);
                case 'idcard':
                    return regmatch(_val, this.opt.reg_idcard) ? true : _this.showErrorMsg(obj, this.opt.tips_idcard, false);
                case 'numletter':
                    return regmatch(_val, this.opt.reg_numletter) ? true : _this.showErrorMsg(obj, this.opt.tips_numletter, false);
                case 'passport':
                    return regmatch(_val, this.opt.reg_passport) ? true : _this.showErrorMsg(obj, this.opt.tips_passport, false);
                case 'pwd1':
                    pwd1 = _val; //实时获取存储pwd1值
                    return true;
                case 'pwd2':
                    return pwdEqual(_val, pwd1) ? true : _this.showErrorMsg(obj, this.opt.tips_pwdequal, false);
                case 'ajaxvalid':
                    return ajaxValidate(_val, $(elem).attr("ajaxurl")) ? true : _this.showErrorMsg(obj, this.opt.tips_ajax, false);
                case 'length':
                    return pwdEqual(_val, elem) ? true : _this.showErrorMsg(obj, this.opt.tips_length, false);
                default:
                    return true;
            };
        },
        pwdEqual: function (val1, val2) {
            return val1 === val2 ? true : false;
        },
        regmatch: function (value, regExp) {
            if (value !== "") {
                return regExp.test(str);
            }
            return true;
        },
        chekLength: function (value, elem) {
            var result = true;
            if ($(elem).attr("min") !== false) {
                if (str.length < parseInt($(elem).attr("min"))) {
                    this.opt.tips_length = "至少输入" + $(elem).attr("min") + "位字符";
                    result = false;
                }
            }
            if ($(elem).attr("max") !== false) {
                if (str.length > parseInt($(elem).attr("max"))) {
                    this.opt.tips_length = "最多输入" + $(elem).attr("max") + "位字符";
                    result = false;
                }
            }
            return result;
        },
        ajaxValidate: function (value, url) {
            var isValid = false;
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    value: value
                },
                dataType: 'json',
                timeout: 300,
                async: false,
                success: function (result) {
                    this.opt.tips_ajax = result.Message;
                    isValid = result.Success;
                },
                error: function (xhr, type) {}
            })
            return isValid;
        },
        showErrorMsg: function (obj, msg, mark) {
            if (!mark) {
                Messages.ShowTip($(obj).attr("title") + msg);
            }
            return mark;
        }
    };

})($);