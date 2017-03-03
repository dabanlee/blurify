(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define('blurify', factory) :
        (global.blurify = factory());
}(this, function () {
    'use strict';

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var asyncGenerator = function () {
        function AwaitValue(value) {
            this.value = value;
        }

        function AsyncGenerator(gen) {
            var front, back;

            function send(key, arg) {
                return new Promise(function (resolve, reject) {
                    var request = {
                        key: key,
                        arg: arg,
                        resolve: resolve,
                        reject: reject,
                        next: null
                    };

                    if (back) {
                        back = back.next = request;
                    } else {
                        front = back = request;
                        resume(key, arg);
                    }
                });
            }

            function resume(key, arg) {
                try {
                    var result = gen[key](arg);
                    var value = result.value;

                    if (value instanceof AwaitValue) {
                        Promise.resolve(value.value).then(function (arg) {
                            resume("next", arg);
                        }, function (arg) {
                            resume("throw", arg);
                        });
                    } else {
                        settle(result.done ? "return" : "normal", result.value);
                    }
                } catch (err) {
                    settle("throw", err);
                }
            }

            function settle(type, value) {
                switch (type) {
                    case "return":
                        front.resolve({
                            value: value,
                            done: true
                        });
                        break;

                    case "throw":
                        front.reject(value);
                        break;

                    default:
                        front.resolve({
                            value: value,
                            done: false
                        });
                        break;
                }

                front = front.next;

                if (front) {
                    resume(front.key, front.arg);
                } else {
                    back = null;
                }
            }

            this._invoke = send;

            if (typeof gen.return !== "function") {
                this.return = undefined;
            }
        }

        if (typeof Symbol === "function" && Symbol.asyncIterator) {
            AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
                return this;
            };
        }

        AsyncGenerator.prototype.next = function (arg) {
            return this._invoke("next", arg);
        };

        AsyncGenerator.prototype.throw = function (arg) {
            return this._invoke("throw", arg);
        };

        AsyncGenerator.prototype.return = function (arg) {
            return this._invoke("return", arg);
        };

        return {
            wrap: function (fn) {
                return function () {
                    return new AsyncGenerator(fn.apply(this, arguments));
                };
            },
            await: function (value) {
                return new AwaitValue(value);
            }
        };
    }();

    var classCallCheck = function (instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    };

    var createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var toConsumableArray = function (arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

            return arr2;
        } else {
            return Array.from(arr);
        }
    };

    var blurify = function () {
        function blurify(options) {
            var _this = this;
            classCallCheck(this, blurify);
            this.blur = options.blur || 6;
            this.$els = [...options.images];
            preloadImages(this.$els).done(function (images) {
                images.map(function (image, index) {
                    _this.$els[index].src = _this.getDataURL(image);
                });
            });
        }

        createClass(blurify, [{
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
                return canvas.toDataURL('image/jpeg');
            }
        }]);
        return blurify;
    }();

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
            newimages[i].src = image.getAttribute('data-src');
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

    return blurify;

}));
//# sourceMappingURL=blurify.js.map
