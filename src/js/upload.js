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