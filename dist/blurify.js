(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('blurify', factory) :
	(global.blurify = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function preload(imageUrls) {
    var images = [],
        count = 0,
        doneAction = function doneAction() {};

    imageUrls = (typeof imageUrls === 'undefined' ? 'undefined' : _typeof(imageUrls)) != 'object' ? [imageUrls] : imageUrls;

    imageUrls.length === 0 && doneAction(images);

    imageUrls.map(function (image, i) {
        images[i] = new Image();
        images[i].crossOrigin = '*';
        images[i].src = image.dataset ? image.dataset.src : image.getAttribute('data-src');
        images[i].onload = imageLoad;
        images[i].onerror = imageLoad;
    });

    function imageLoad() {
        count++;
        if (count == imageUrls.length) doneAction(images);
    }

    return {
        done: function done() {
            doneAction = arguments[0] || doneAction;
        }
    };
}

function cssSupport() {
    var el = document.createElement('div');
    var property = arguments[0];

    switch (arguments.length) {
        case 1:
            return property in el.style ? true : false;
        case 2:
            el.style[property] = arguments[1];
            return el.style[property] ? true : false;
        default:
            return false;
    }
}

function blurify(options) {
    if (!(this instanceof blurify)) return new (Function.prototype.bind.apply(blurify, [null].concat(Array.prototype.slice.call(arguments))))();

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
    this.$els = options.images.nodeType === 1 ? [options.images] : [].slice.call(options.images);

    if (this.mode == 'auto') {
        cssSupport('filter', 'blur(1px)') ? this.useCSSMode() : this.useCanvasMode();
    } else if (this.mode == 'css') {
        this.blur = this.blur / 2;
        this.useCSSMode();
    } else {
        this.useCanvasMode();
    }
}

blurify.prototype.useCSSMode = function () {
    var _this = this;

    this.$els.map(function (el) {
        el.src = el.dataset ? el.dataset.src : el.getAttribute('data-src');
        el.style['filter'] = el.style['-webkit-filter'] = 'blur(' + _this.blur + 'px)';
    });
};

blurify.prototype.useCanvasMode = function () {
    var _this2 = this;

    this.imageType = this.options.imageType || 'image/jpeg';
    preload(this.$els).done(function (images) {
        images.map(function (image, index) {
            _this2.$els[index].src = _this2.getDataURL(image);
        });
    });
};

blurify.prototype.blurify = function (canvas, blur) {
    var ctx = canvas.getContext('2d');
    ctx.globalAlpha = 1 / (2 * blur);
    for (var y = -blur; y <= blur; y += 2) {
        for (var x = -blur; x <= blur; x += 2) {
            ctx.drawImage(canvas, x, y);
            if (x >= 0 && y >= 0) ctx.drawImage(canvas, -(x - 1), -(y - 1));
        }
    }
    ctx.globalAlpha = 1;
};

blurify.prototype.getDataURL = function (image) {
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    this.blurify(canvas, this.blur);
    return canvas.toDataURL(this.imageType);
};

return blurify;

})));
//# sourceMappingURL=blurify.js.map
