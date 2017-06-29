export function preload(imageUrls) {
    let images = [],
        count = 0,
        doneAction = function () {};

    imageUrls = (typeof imageUrls != 'object') ? [imageUrls] : imageUrls;

    imageUrls.length === 0 && doneAction(images);

    imageUrls.map((image, i) => {
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
        done() {
            doneAction = arguments[0] || doneAction;
        },
    };
}

export function cssSupport() {
    const el = document.createElement('div');
    const property = arguments[0];

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
