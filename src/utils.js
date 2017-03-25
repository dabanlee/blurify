export function preloadImages(images) {
    let newimages = [],
        loadedImagesCount = 0,
        postAction = function () {};

    images = (typeof images != 'object') ? [images] : images;

    function imageLoadPost() {
        loadedImagesCount++;
        if (loadedImagesCount == images.length) postAction(newimages);
    }

    images.map((image, i) => {
        newimages[i] = new Image();
        newimages[i].crossOrigin = '*';
        newimages[i].src = image.dataset ? image.dataset.src : image.getAttribute('data-src');
        newimages[i].onload = function () {
            imageLoadPost();
        };
        newimages[i].onerror = function () {
            imageLoadPost();
        };
    });

    return {
        done(callback) {
            postAction = callback || postAction;
        },
    };
}

export function cssSupport(...args) {
    let el = document.createElement('div'),
        property = args[0],
        value = args[1];
    if (args.length === 1) {
        return property in el.style ? true : false;
    } else if (args.length === 2) {
        el.style[property] = value;
        return el.style[property] ? true : false;
    } else {
        return false;
    }
}
