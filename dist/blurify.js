(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.blurify = factory();
}(typeof self !== 'undefined' ? self : this, function () { 'use strict';

    function preload(images) {
        var imageNodes = [];
        var count = 0, doneAction = function (images) { };
        images = (typeof images != 'object') ? [images] : images;
        images.length === 0 && doneAction(imageNodes);
        images.map(function (image) {
            var _image = new Image();
            _image.crossOrigin = '*';
            _image.src = image.dataset ? image.dataset.src : image.getAttribute('data-src');
            _image.onload = imageLoad;
            _image.onerror = imageLoad;
            imageNodes.push(_image);
        });
        function imageLoad() {
            count++;
            if (count == images.length)
                doneAction(imageNodes);
        }
        return {
            done: function (cb) {
                doneAction = arguments[0] || doneAction;
            }
        };
    }
    function cssSupport(key, value) {
        var element = document.createElement('div');
        switch (arguments.length) {
            case 1:
                return key in element.style ? true : false;
            case 2:
                element.style[key] = value;
                return element.style[key] ? true : false;
            default:
                return false;
        }
    }

    function blurify(options) {
        if (options === void 0) { options = {
            blur: 6,
            mode: 'auto',
            images: []
        }; }
        if (!(this instanceof blurify))
            return new blurify(options);
        if (typeof options === 'number') {
            options = {
                blur: options,
                images: arguments[1],
                mode: 'auto'
            };
        }
        this.options = options;
        this.blur = options.blur || 6;
        this.mode = options.mode || 'css';
        console.log();
        this.$els = options.images.nodeType == 1 ? [options.images] : [].slice.call(options.images);
        if (this.mode == 'auto') {
            cssSupport('filter', 'blur(1px)') ? this.useCSSMode() : this.useCanvasMode();
        }
        else if (this.mode == 'css') {
            this.blur = this.blur / 2;
            this.useCSSMode();
        }
        else {
            this.useCanvasMode();
        }
    }
    blurify.prototype.useCSSMode = function () {
        var _this = this;
        console.log(this.$els);
        this.$els.map(function (el) {
            console.log('el', el);
            el.src = el.dataset ? el.dataset.src : el.getAttribute('data-src');
            el.style['filter'] = el.style['-webkit-filter'] = "blur(" + _this.blur + "px)";
        });
    };
    blurify.prototype.useCanvasMode = function () {
        var _this = this;
        this.imageType = this.options.imageType || "image/jpeg";
        preload(this.$els).done(function (images) {
            images.map(function (image, index) {
                _this.$els[index].src = _this.getDataURL(image);
            });
        });
    };
    blurify.prototype.blurify = function (canvas, blur) {
        var ctx = canvas.getContext('2d');
        ctx.globalAlpha = 1 / (2 * +blur);
        for (var y = -blur; y <= blur; y += 2) {
            for (var x = -blur; x <= blur; x += 2) {
                ctx.drawImage(canvas, x, y);
                if (x >= 0 && y >= 0)
                    ctx.drawImage(canvas, -(x - 1), -(y - 1));
            }
        }
        ctx.globalAlpha = 1;
    };
    blurify.prototype.getDataURL = function (image) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        this.blurify(canvas, this.blur);
        return canvas.toDataURL(this.imageType);
    };

    return blurify;

}));
//# sourceMappingURL=blurify.js.map
