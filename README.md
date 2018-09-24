# blurify

![travis](https://api.travis-ci.org/JustClear/blurify.svg?branch=master)
[![dependencies](https://david-dm.org/justclear/blurify.svg)](https://david-dm.org/justclear/blurify#info=dependencies&view=table)
[![devDependencies](https://david-dm.org/justclear/blurify/dev-status.svg)](https://david-dm.org/justclear/blurify#info=devDependencies&view=table)

blurify.js is a tiny(~2kb) library to blur pictures, with graceful downgrade support from `css` mode to `canvas` mode.

## Installation

```sh
$ npm i blurify
```

## DEMO

[Demo](https://justclear.github.io/blurify/)

## Usage

### blurify(options)

blurify the images with given `options`:

- `images` { Element }, blurify target elements.
- `blur` { Int }, extent of blur, defaulting to `6`.
- `mode` { String }, mode of blurify.
    - `css`: use `filter` property.(`default`)
    - `canvas`: use `canvas` export base64.
    - `auto`: use `css` mode firstly, otherwise switch to `canvas` mode by automatically.

```js
import blurify from 'blurify';

new blurify({
    images: document.querySelectorAll('.blurify'),
    blur: 6,
    mode: 'css',
});

// or in shorthand

blurify(6, document.querySelectorAll('.blurify'));
```

### License

Licensed under the [MIT License](https://github.com/JustClear/blurify/blob/master/LICENSE)
