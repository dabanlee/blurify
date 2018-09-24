(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.blurify = factory());
}(this, (function () { 'use strict';

    function preload(imageURLs) {
        const images = [];
        let count = 0,
            doneAction = () => {};

        imageURLs = (typeof imageURLs != 'object') ? [imageURLs] : imageURLs;

        imageURLs.length === 0 && doneAction(images);

        imageURLs.map((image, i) => {
            images[i] = new Image();
            images[i].crossOrigin = '*';
            images[i].src = image.dataset ? image.dataset.src : image.getAttribute('data-src');
            images[i].onload = imageLoad;
            images[i].onerror = imageLoad;
        });

        function imageLoad() {
            count++;
            if (count == imageURLs.length) doneAction(images);
        }

        return {
            done() {
                doneAction = arguments[0] || doneAction;
            },
        };
    }

    function cssSupport() {
        const element = document.createElement('div');
        const property = arguments[0];

        switch (arguments.length) {
            case 1:
                return property in element.style ? true : false;
            case 2:
                element.style[property] = arguments[1];
                return element.style[property] ? true : false;
            default:
                return false;
        }
    }

    function blurify(options) {
        if (!(this instanceof blurify)) return new blurify(...arguments);

        if (typeof options === 'number') {
            options = {
                blur: options,
                images: arguments[1],
                mode: 'auto',
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
        this.$els.map(el => {
            el.src = el.dataset ? el.dataset.src : el.getAttribute('data-src');
            el.style['filter'] = el.style['-webkit-filter'] = `blur(${this.blur}px)`;
        });
    };

    blurify.prototype.useCanvasMode = function () {
        this.imageType = this.options.imageType || `image/jpeg`;

        preload(this.$els).done(images => {
            images.map((image, index) => {
                this.$els[index].src = this.getDataURL(image);
            });
        });
    };

    blurify.prototype.blurify = function(canvas, blur) {
        const ctx = canvas.getContext('2d');
        ctx.globalAlpha = 1 / (2 * blur);
        for (let y = -blur; y <= blur; y += 2) {
            for (let x = -blur; x <= blur; x += 2) {
                ctx.drawImage(canvas, x, y);
                if (x >= 0 && y >= 0) ctx.drawImage(canvas, -(x - 1), -(y - 1));
            }
        }
        ctx.globalAlpha = 1;
    };

    blurify.prototype.getDataURL = function(image) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        this.blurify(canvas, this.blur);

        return canvas.toDataURL(this.imageType);
    };

    return blurify;

})));
//# sourceMappingURL=blurify.js.map
