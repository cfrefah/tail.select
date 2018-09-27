CHANGELOG
===========

Version 0.3.0 - Alpha
---------------------
-   Info: The complete script has been re-written from scratch and doesn't depend on jQuery anymore!
-   Info: The default design uses vectors from GitHubs [Octicons](https://octicons.github.com/).
-   Info: The minified version is compressed with [jsCompress](https://jscompress.com/).
-   Add: A search function / field within the dropdown area, which is partly still in a test phase.
-   Add: A complete new interface and a complete new design (including a new demonstration).
-   Add: The tail helper methods: `hasClass()`, `addClass()`, `removeClass()`, `trigger()` and
         `animate()`.
-   Add: The `tailSelect` prototype class handles all tail.select elements and the communication
         between the user and the elements as well as between the `tailOptions` class.
-   Add: The `tailOptions` prototyping class, which manages the original options and items. This new
         class is only responsible for the main item object collections as well as the original
         select field. The tail.select elements are handled by the main `tailSelect` class only!
-   Add: A `search`, `searchFocus` and `searchMarked` option to configure the new search feature.
-   Add: The new `bindSourceSelect` option, which allows to still use the source select field.
-   Add: The new `hideSelect` option to hide the source select field.
-   Add: The new `stayOpen` and `startOpen` option to manipulate the dropdown field.
-   Add: The new `items` option to add some additional options during the initialization, the new
         structure allows you to add and remove options also during the runtime. Use therefore
         the methods of the `tailOptions` prototype class.
-   Add: The new `sortItems` and `sortGroups` options, to sort the order of the options and the
         option groups in the dropdown field.
-   Add: The new `animate` and `openAbove` methods to control the dropdown behavior.
-   Add: The new strings `searchField`, `searchEmpty`, and`selectLimit` has been added.
-   Add: A german locale file.
-   Update: The events has been changed into 'tail.select::open', 'tail.select::close', and
            'tail.select::{state}'
-   Update: The complete HTML / ClassNames and CSS structure has been changed!
-   Update: The `copy_class` option has been renamed into `classNames` and allows now also a
            string as well as an array parameter. (You can still use `true` to copy the class
            names from the source select field.)
-   Update: The `single_deselect` option has been renamed into `deselect`, the behavior is the same.
-   Update: The `multi_limit` option has been renamed into `multiLimit` and requires now `-1` as
            parameter to enable the "unlimited" selection option (-1 is the default option!).
-   Update: The `multi_show_count` option has been renamed into `multiShowCount`, the behavior is
            the same.
-   Update: The `multi_move_to` option has been renamed into `multiContainer` and does now ONLY
            offer the possibility to "move" the selected options (in the form of handles) into the
            (with an plain selector linked) container. The possibility to "move" selected options
            to the top of the dropdown list has been removed!
-   Update: The `multi_hide_selected` option has been renamed into `hideSelected` and doesn't
            require a multiple select field anymore, the rest of the behavior is the same!
-   Update: The `description` option has been renamed into `descriptions`, the behavior is the same.
-   Update: The `hide_disabled` option has been renamed into `hideDisabled`, the behavior is almost
            the same, except that `hideDisabled` and `hideSelected` just add a new CSS class name
            to the main tail.select element.
-   Update: The `width` option keeps his name, but allows now 'auto' (to calculate the width from
            the source select element) and `null`, to set no width at all (default).
-   Update: The `height` option keeps his name, but allows now also `null` to set no maxHeight at
            all (which is also the default, it's may better to handle this with pure CSS).
-   Update: The string options `text_empty`, `text_limit` and `text_placeholder` has been moved
            to and own core object, which is accessible through the `tail.select.strings` variable.
-   Remove: The jQuery support has been completely removed.
-   Remove: The jQuery `mousewheel` plugin has been removed.
-   Remove: The option and functionality behind `hide_on_mobile` and `hide_on_supported` has been
            completely removed. There will be probably no substitute for this!
-   Remove: The feather icons has been replaced with the GitHub Octicons.

Version 0.2.0 - Alpha
---------------------
-   Info: Tested with and Includes now jQuery 1.4.0, 1.6.0 and 1.11.2
-   Add: (option) Specify a width
-   Add: (option) Auto-Disable on Mobile browsers
-   Add: (option) Auto-Disable on Unsupported browsers
-   Add: (option) Take class names from select fields
-   Add: 4 other functions: reload, open, close and remove
-   Add: Extended Class Names for each tail.Select status
-   Add: Prevent multi-selections on single select fields
-   Add: Open the select field ONLY if the left mouse button is pressed.
-   Update: The tail.Select design
-   Update: The tail.Select configuration
-   Update: The tail.Select HTML structure
-   Update: Embeds now the complete Feather icon font
-   Update: Feather icons are used now only via css (+ new icons are used)
-   Update:	A better and bigger demonstration (./demo/index.html)
-   Update:	Change placeholder attribute to data-placeholder
-   Bugfix: Open above Bug
-   Bugfix: Pull-Down / Pull-Up Switch-Icon Bug
-   Bugfix: Faulty De-Selection on Single-Select fields with optgroup
-   Remove: (function) "stringArray"
-   Remove: (function) "getIcon" and "switchIcon"
-   Remove: (function) Some other unused functions
-   Remove: (option) "icons"
-   Remove: (option) "multi_hide_selected"

Version 0.1.1 - Alpha
---------------------
-   Update: Some jQuery 1.4+ Compatibility fixes
-   Update: New render function with Compatibility to jQuery 1.4+
-   Bugfix: Optgroup-Sorting Bug
-   Bugfix: Few small Bugs

Version 0.1.0 - Alpha
---------------------
-   First Alpha Version
