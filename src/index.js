import {
    preload,
    cssSupport,
} from './utils';

export default function blurify(options) {
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
    let ctx = canvas.getContext('2d');
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
    let canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    this.blurify(canvas, this.blur);
    return canvas.toDataURL(this.imageType);
};
