export function preload(imageURLs) {
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

export function cssSupport() {
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
