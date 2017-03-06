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
        newimages[i].src = image.dataset.src;
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
