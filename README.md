global-replaceify [![Build Status](https://travis-ci.org/nolanlawson/global-replaceify.svg?branch=master)](https://travis-ci.org/nolanlawson/global-replaceify)
=====

Browserify transform to replace global variables with custom content.

For instance, you could use it to replace all references to the global `process` object with `require('my-custom-process-impl')` or `__process` (to prevent Browserify from inserting its own built-in implementation).

Installation
----

    npm install --save global-replaceify

API
---

```js
browserify(/* ... */).transform('global-replaceify', {
  replacements: {
    global: 'myCustomGlobal',
    process: 'myCustomProcess',
    /// etc.
  }
});
```

Example usage
---

Input file:

```js
// index.js
var foo = process.browser;
var bar = global.setTimeout;
var baz = Buffer.from("yolo");
```

Transform:

```js
browserify('./index.js').transform('global-replaceify', {
  replacements: {
    process: '__process',
    global: 'window',
    Buffer: 'MyFakeBuffer'
  }
});
```

Output file:

```js
var foo = __process.browser;
var bar = window.setTimeout;
var baz = MyFakeBuffer.from("yolo");
```

As with any Browserify transform, it can also be applied globally using `global: true`.

```js
browserify('./index.js').transform('global-replaceify', {
  global: true,
  replacements: {
    process: '__process',
    global: 'window',
    Buffer: 'MyFakeBuffer'
  }
});
```

CLI usage
---

Replacements can be passed in via the command line:

```bash
browserify -t [ global-replaceify --replacements [ --foo bar ] ] ./index.js
```

You can also specify multiple replacements: 

```bash
browserify -t [ global-replaceify --replacements [ --process myProcess --global myGlobal ] ] ./index.js
```

And you can also apply it, *ahem*, globally using `-g`:

```bash
browserify -g [ global-replaceify --replacements [ --foo bar ] ] ./index.js                       
```  

package.json usage
---

As with any Browserify transform, options can also be specified in `package.json`:

```json
{
  "browserify": {
    "transform": [["global-replaceify", { "replacements": {"process": "myCustomProcess"} }]]
  }
}
```

Details
----

Whatever string you provide as a replacement will be directly inlined. So for instance if you do:

```js
  replacements: {
    Buffer: 'require("buffer")'
  }
```

...then you can replace global variables with custom `require()` statements. Browserify will attempt to pull in
the `require()`d dependency like it normally would.

So for instance:

```js
  replacements: {
    $: 'require("jquery")',
    window: 'require("global")'
  }
```

This can be used to upgrade legacy code that references global variables, and point those globals to
explicit `require()` calls instead.