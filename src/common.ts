export function preload(images: HTMLImageElement[]) {
    const imageNodes: HTMLImageElement[] = [];
    let count = 0, doneAction = (images: any[]) => {};

    images = (typeof images != 'object') ? [images] : images;

    images.length === 0 && doneAction(imageNodes);

    images.map((image: HTMLImageElement) => {
        const _image = new Image();
        _image.crossOrigin = '*';
        _image.src = image.dataset ? image.dataset.src : image.getAttribute('data-src');
        _image.onload = imageLoad;
        _image.onerror = imageLoad;
        imageNodes.push(_image);
    });

    function imageLoad() {
        count++;
        if (count == images.length) doneAction(imageNodes);
    }

    return {
        done(cb: (images: []) => void) {
            doneAction = arguments[0] || doneAction;
        },
    };
}

export function cssSupport(key: string, value: string) {
    const element: HTMLDivElement = document.createElement('div');

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
