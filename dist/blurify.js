(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('blurify', factory) :
    (global.blurify = factory());
}(this, function () { 'use strict';

    function blurify() {
        console.log('blurify');
    }

    return blurify;

}));
//# sourceMappingURL=blurify.js.map
