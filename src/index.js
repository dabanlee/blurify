import {
    preloadImages,
} from './utils';

export default class blurify {
    constructor(options) {
        this.blur = options.blur || 6;
        this.mode = options.mode || 'css';
        this.$els = [...options.images];

        if (this.mode == 'canvas') {
            this.imageType = options.imageType || `image/jpeg`;
            preloadImages(this.$els).done(images => {
                images.map((image, index) => {
                    this.$els[index].src = this.getDataURL(image);
                });
            });
        } else {
            this.$els.map(el => {
                el.src = el.dataset.src;
                el.style['filter'] = el.style['-webkit-filter'] = `blur(${options.blur}px)`;
            });
        }
    }

    blurify(canvas, blur) {
        let ctx = canvas.getContext('2d');
        ctx.globalAlpha = 0.5;
        for (let y = -blur; y <= blur; y += 2) {
            for (let x = -blur; x <= blur; x += 2) {
                ctx.drawImage(canvas, x, y);
                if (x >= 0 && y >= 0) ctx.drawImage(canvas, -(x - 1), -(y - 1));
            }
        }
        ctx.globalAlpha = 1;
    }

    getDataURL(image) {
        let canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');

        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        this.blurify(canvas, this.blur);
        return canvas.toDataURL(this.imageType);
    }
}
