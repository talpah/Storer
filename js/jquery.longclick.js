/**
 * Created by cosmin on 2/5/14.
 */
(function ($) {
    $.fn.longClick = function (callback, timeout) {
        var timer;
        timeout = timeout || 500;
        $(this).mousedown(function () {
            timer = setTimeout(function () {
                callback();
            }, timeout);
            return false;
        });
        $(document).mouseup(function () {
            clearTimeout(timer);
            return false;
        });
    };

})(jQuery);