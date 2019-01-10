import { preload, cssSupport } from './common';

export default function blurify(options: {
    blur: number
    mode: string
    images: HTMLImageElement | HTMLImageElement[]
} = {
    blur: 6,
    mode: 'auto',
    images: [],
}) {
    if (!(this instanceof blurify)) return new blurify(options);

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
    console.log();
    
    this.$els = options.images.nodeType == 1 ? [options.images] : [].slice.call(options.images);

    if (this.mode == 'auto') {
        cssSupport('filter', 'blur(1px)') ? this.useCSSMode() : this.useCanvasMode();
    } else if (this.mode == 'css') {
        this.blur = this.blur / 2;
        this.useCSSMode();
    } else {
        this.useCanvasMode();
    }
}

blurify.prototype.useCSSMode = function (): void {
    console.log(this.$els);
    
    this.$els.map((el: HTMLImageElement) => {
        console.log('el', el);
        
        el.src = el.dataset ? el.dataset.src : el.getAttribute('data-src');
        el.style['filter'] = el.style['-webkit-filter'] = `blur(${this.blur}px)`;
    });
};

blurify.prototype.useCanvasMode = function (): void {
    this.imageType = this.options.imageType || `image/jpeg`;

    preload(this.$els).done((images: []) => {
        images.map((image, index) => {
            this.$els[index].src = this.getDataURL(image);
        });
    });
};

blurify.prototype.blurify = function (canvas: HTMLCanvasElement, blur: number | string): void {
    const ctx = canvas.getContext('2d');
    ctx.globalAlpha = 1 / (2 * +blur);
    for (let y = -blur; y <= blur; y += 2) {
        for (let x = -blur; x <= blur; x += 2) {
            ctx.drawImage(canvas, x, y);
            if (x >= 0 && y >= 0) ctx.drawImage(canvas, -(x - 1), -(y - 1));
        }
    }
    ctx.globalAlpha = 1;
};

blurify.prototype.getDataURL = function(image: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    this.blurify(canvas, this.blur);

    return canvas.toDataURL(this.imageType);
};
