(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('babel-runtime/helpers/toConsumableArray'), require('babel-runtime/helpers/classCallCheck'), require('babel-runtime/helpers/createClass'), require('babel-runtime/helpers/typeof')) :
    typeof define === 'function' && define.amd ? define('blurify', ['babel-runtime/helpers/toConsumableArray', 'babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass', 'babel-runtime/helpers/typeof'], factory) :
    (global.blurify = factory(global._toConsumableArray,global._classCallCheck,global._createClass,global._typeof));
}(this, function (_toConsumableArray,_classCallCheck,_createClass,_typeof) { 'use strict';

    _toConsumableArray = 'default' in _toConsumableArray ? _toConsumableArray['default'] : _toConsumableArray;
    _classCallCheck = 'default' in _classCallCheck ? _classCallCheck['default'] : _classCallCheck;
    _createClass = 'default' in _createClass ? _createClass['default'] : _createClass;
    _typeof = 'default' in _typeof ? _typeof['default'] : _typeof;

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
            newimages[i].src = image.src;
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

    var blurify = function () {
        function blurify(options) {
            var _this = this;

            _classCallCheck(this, blurify);

            this.blur = options.blur || 6;
            this.imageType = options.imageType || 'image/jpeg';
            this.$els = [].concat(_toConsumableArray(options.images));
            preloadImages(this.$els).done(function (images) {
                images.map(function (image, index) {
                    _this.$els[index].src = _this.getDataURL(image);
                });
            });
        }

        _createClass(blurify, [{
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
