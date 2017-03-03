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