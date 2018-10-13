tail.select
===========
[![npm](https://s.pytes.net/9e506510)](https://s.pytes.net/2a8c886a)
[![npm](https://s.pytes.net/3fd8be97)](https://s.pytes.net/2a8c886a)
[![License](https://s.pytes.net/8257ac72)](LICENSE.md)
[![plainJS](https://s.pytes.net/cb2d2d94)](https://s.pytes.net/21d65dff)
[![Author](https://s.pytes.net/5542d1fa)](https://s.pytes.net/5be37d0a)

The **tail.select** script is back, completely rewritten in pure vanilla JavaScript and ready to
beautify your (multiple) select fields again and now even a lot better as the deprecated jQuery
Version back in 2014!

[Wanna see **tail.select** in action?](https://github.pytes.net/tail.select)
[Wanne translate **tail.select** in your language?](https://github.com/pytesNET/tail.select/wiki/Help-Translating)

Features
--------
-   Compatible with all modern browsers, and also for **IE >= 9**.
-   Supports Single and Multiple Select fields, also deselect- and limitable!
-   Offers a Search field within the dropdown list to find the desired options quickly!
-   Offers a Description text to describe each single option!
-   Allows to manipulate (add, edit and delete) each single option during the runtime.
-   Bindings for the jQuery and MooTools library and usable as **AMD**.
-   No dependencies, just include and use it!
-   Event Listeners to bind your own function on each action.
-   ... and many settings to configure the environment and its behavior!

Install & Embed
---------------
It's recommended to use the [Published Releases](https://github.com/pytesNET/tail.select/releases)
instead of downloading the master branch, because the master branch may contains 'unreleased' changes,
which may not work as expected! You can **download** the latest published **tail.select** Release as
[.tar](https://github.com/pytesNET/tail.select/tarball/master) or as [.zip](https://github.com/pytesNET/tail.select/zipball/master)
archive, or by using NPM or YARN:

```markup
npm install tail.select --save
```

```markup
yarn add tail.select --save
```

### Using a CDN
You can also use the awesome CDN services from jsDelivr or UNPKG.

```markup
https://cdn.jsdelivr.net/npm/tail.select@latest/
```

```markup
https://unpkg.com/tail.select/
```

Documentation
-------------
The Documentation has been moved to [GitHubs Wiki Pages](https://github.com/pytesNET/tail.select/wiki),
but I will keep a table of contents list here and some basic instructions.

-   [Instructions](https://github.com/pytesNET/tail.select/wiki/instructions)
-   [Default Usage](https://github.com/pytesNET/tail.select/wiki/default-usage)
-   [Public Options](https://github.com/pytesNET/tail.select/wiki/public-options)
-   [Public Methods](https://github.com/pytesNET/tail.select/wiki/public-methods)
-   [Events & Callbacks](https://github.com/pytesNET/tail.select/wiki/events-callbacks)


### Basic Instructions
You can pass up to 2 arguments to the **tail.select** constructor, the first parameter is required
and need to be an `Element`, a `NodeList`, a `HTMLCollection`, an Array with `Element` objects or
just a single selector as `string`, which calls the `querySelectorAll()` method on its own. The
second parameter is optional and, if set, MUST be an object with your *tail.select* options.

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <link type="text/css" rel="stylesheet" href="css/tail.select.css" />
    </head>
    <body>
        <script type="text/javascript" src="js/tail.select.min.js"></script>

        <select>
            <!-- Your <optgroup> and <option> Elements -->
        </select>

        <script type="text/javascript">
            document.addEventListener("DOMContentLoaded", function(){
                tail.select("select", { /* Your Options */ });
            });
        </script>
    </body>
</html>
```

### Default options
Please check out [GitHubs Wiki Pages](https://github.com/pytesNET/tail.select/wiki) to read more
about each single option!

```javascript
tail.select("select", {
    width:              null,
    height:             350,
    classNames:         null,
    placeholder:        null,
    deselect:           false,
    animate:            true,
    openAbove:          null,
    stayOpen:           false,
    startOpen:          false,
    multiple:           false,
    multiLimit:         -1,
    multiShowCount:     true,
    multiContainer:     false,
    multiSelectAll:     false,      // NEW IN 0.4.0
    multiSelectGroup:   true,       // NEW IN 0.4.0
    descriptions:       false,
    items:              {},
    sortItems:          false,
    sortGroups:         false,
    search:             false,
    searchFocus:        true,
    searchMarked:       true,
    csvOutput:          false,
    csvSeparator:       ",",
    hideSelect:         true,
    hideSelected:       false,
    hideDisabled:       false,
    bindSourceSelect:   false,
    cbLoopItem:         undefined   // NEW IN 0.4.0
    cbLoopGroup:        undefined   // NEW IN 0.4.0
});
```

Thanks To
---------
Awesome Help by Awesome Companies and Projects

-   [jsCompress](https://jscompress.com)
-   [Codacy](https://app.codacy.com)
-   [prismJS](https://prismjs.com)
-   [MenuSpy](https://github.com/lcdsantos/menuspy)
