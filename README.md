# blurify

[![dependencies](https://david-dm.org/justclear/blurify.svg)](https://david-dm.org/justclear/blurify#info=dependencies&view=table)
[![devDependencies](https://david-dm.org/justclear/blurify/dev-status.svg)](https://david-dm.org/justclear/blurify#info=devDependencies&view=table)

## Installation

```sh
$ npm i blurify
```

## Demo

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
```
