(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('blurify', factory) :
    (global.blurify = factory());
}(this, function () { 'use strict';

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

    function preloadImages(images) {
        var newimages = [],
            loadedImagesCount = 0,
            postAction = function postAction() {};

        images = (typeof images === 'undefined' ? 'undefined' : _typeof(images)) != 'object' ? [images] : images;

        function imageLoadPost() {
            loadedImagesCount++;
            if (loadedImagesCount == images.length) postAction(newimages);
        }

        images.map(function (image, i) {
            newimages[i] = new Image();
            newimages[i].crossOrigin = '*';
            newimages[i].src = image.dataset.src;
            newimages[i].onload = function () {
                imageLoadPost();
            };
            newimages[i].onerror = function () {
                imageLoadPost();
            };
        });

        return {
            done: function done(callback) {
                postAction = callback || postAction;
            }
        };
    }

    function cssSupport() {
        var el = document.createElement('div'),
            property = arguments.length <= 0 ? undefined : arguments[0],
            value = arguments.length <= 1 ? undefined : arguments[1];
        if (arguments.length === 1) {
            return property in el.style ? true : false;
        } else if (arguments.length === 2) {
            el.style[property] = value;
            return el.style[property] ? true : false;
        } else {
            return false;
        }
    }

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var blurify = function () {
        function blurify(options) {
            _classCallCheck(this, blurify);

            this.options = options;
            this.blur = options.blur || 6;
            this.mode = options.mode || 'css';
            this.$els = options.images.nodeType === 1 ? [options.images] : [].slice.call(options.images);

            if (this.mode == 'auto') {
                cssSupport('filter', 'blur(1px)') ? this.useCSSMode() : this.useCanvasMode();
            } else if (this.mode == 'css') {
                this.useCSSMode();
            } else {
                this.useCanvasMode();
            }
        }

        _createClass(blurify, [{
            key: 'useCSSMode',
            value: function useCSSMode() {
                var _this = this;

                this.$els.map(function (el) {
                    el.src = el.dataset.src;
                    el.style['filter'] = el.style['-webkit-filter'] = 'blur(' + _this.options.blur + 'px)';
                });
            }
        }, {
            key: 'useCanvasMode',
            value: function useCanvasMode() {
                var _this2 = this;

                this.imageType = this.options.imageType || 'image/jpeg';
                preloadImages(this.$els).done(function (images) {
                    images.map(function (image, index) {
                        _this2.$els[index].src = _this2.getDataURL(image);
                    });
                });
            }
        }, {
            key: 'blurify',
            value: function blurify(canvas, blur) {
                var ctx = canvas.getContext('2d');
                ctx.globalAlpha = 0.5;
                for (var y = -blur; y <= blur; y += 2) {
                    for (var x = -blur; x <= blur; x += 2) {
                        ctx.drawImage(canvas, x, y);
                        if (x >= 0 && y >= 0) ctx.drawImage(canvas, -(x - 1), -(y - 1));
                    }
                }
                ctx.globalAlpha = 1;
            }
        }, {
            key: 'getDataURL',
            value: function getDataURL(image) {
                var canvas = document.createElement('canvas'),
                    ctx = canvas.getContext('2d');

                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
                this.blurify(canvas, this.blur);
                return canvas.toDataURL(this.imageType);
            }
        }]);

        return blurify;
    }();

    return blurify;

}));
//# sourceMappingURL=blurify.js.map
