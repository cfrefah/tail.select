tail.select
===========
> Version: 0.3.0 (Alpha)<br />
> License: X11 / MIT<br />
> Author: SamBrishes, pytesNET

The tail.select script is back, completely re-written in pure vanilla JavaScript from scratch! It
offers almost the same functionality as the jQuery version, back in 2016, and has been enriched with
important and useful features.

**[Check out the demonstration](https://pytesnet.github.io/tail.select/)**

Features
--------
-   Single and Multiple select fields, deselect- and limitable
-   A search field, to find required options with ease
-   Hide and Move selected (and disabled) options
-   Manipulate, Add, Edit and Delete options on the fly
-   Optional descriptions to describe the single options
-   Optional dropdown open/close animation and handling options
-   ... and a few more feature-rich settings

Documentation
-------------
_The documentation is still WiP_

### Options
All options (with the default settings):

```javascript
tail.select("select", {
    width:              null,
    height:             null,
    classNames:         null,
    placeholder:        null,
    deselect:           false,
    animate:            false,
    openAbove:          null,
    stayOpen:           false,
    startOpen:          false,
    multiple:           false,
    multiLimit:         -1,
    multiShowCount:     true,
    multiContainer:     false,
    descriptions:       false,
    items:              {},
    sortItems:          false,
    sortGroups:         false,
    search:             false,
    searchFocus:        true,
    searchMarked:       true,
    hideSelect:         true,
    hideSelected:       false,
    hideDisabled:       false,
    bindSourceSelect:   false
});
```

#### width
`string|int`<br />
This options configures the width of the tail.select field as well as for the dropdown field, you
can use 'auto' to detect the current width or null (like the default) to set no width styling at all.

#### height
`string|int`<br />
This options configures the maxHeight of the tail.select dropdown popup field, you can also use
'null' (like the default) to set not maxHeight at all.

#### classNames
`string|array|bool`<br />
This options adds additional classNames to the main tail.select element. You can define your class
names as string or as array, set this option to 'true' to copy the class names of the source select
field.

#### placeholder
`string`<br />
This option sets the placeholder to the respective tail.select element, which is invisible on
single not-deselectale fields. This option gets overwritten by the 'placeholder' (or as fallback on
the 'data-placeholder') attribute on the respective source select field. If not placeholder is set
at all 'tail.select.strings.placeholder' will be used!

#### deselect
`bool`<br />
This option allows to deselect single select fields, which theoretically isn't possible in HTML. If
enabled, tail.select will use '<option>.hasAttribtue("selected")' instead of the '<option>.selected'
variable. Please note: This option affects single select fields only!

#### animate
`bool`<br />
This options animates the open / close sequence of the tail.select dropdown field. Therefore it uses
the classname 'iodle' during the animation.

#### openAbove
`bool`<br />
This option determines where the tail.select dropdown field is located. Use 'true' to open the
dropdown field always above the select field, use 'false' for the opposite or just keep it to
'null', which will use the bottom location unless there is no room left for it.

#### stayOpen
`bool`<br />
This option will prevent the call of the '.close()' method at the typical events, but you can still
call the '.close()' method on your own to close the dropdown field.

#### startOpen
`bool`<br />
This option will call the '.open()' method directly after the tail.select initialization has been
completed.

#### multiple
`bool`<br />
This option sets the 'single / multiple' option of the respective tail.select instance and gets
overwritten by the source select element during the initialization.

#### multiLimit
`int`<br />
This option allows to limit the selection to the respective number. Use '-1' to disable any limit,
use 0 to allow no selection at all. Please note: This option affects multiple select
fields only!

#### multiShowCount
`bool`<br />
This option shows a small counter to the left of the tail.select label. Please note: this option is
only available on multiple select fields!

#### multiContainer
`string`<br />
This option allow on string-based element selector only. If passed it will move special handle
objects to the respective element. Please note: This option is only available on multiple select
fields!

#### descriptions
`string`<br />
This option will enable the 'description' option on the respective tail.select instance. To add a
description to an option just use the 'data-description' attribute on the respective HTML element.

#### items
`object`<br />
This option can contain additional options, which should be shown within the tail.select instance
(The respective items gets also created in the source select element). Check our the
'tail.select.options' documentation for more informations!

#### sortItems
`string|function`<br />
This option configures the sort order of the shown options within the tail.select dropdown element.
You can use 'ASC', 'DESC' or your own callback sort function!

#### sortGroups
`string|function`<br />
This option configures the sort order of the shown option groups within the tail.select dropdown
element. You can use 'ASC', 'DESC' or your own callback sort function!

#### search
`bool`<br />
This option will enable the search input field within the tail.select dropdown field.

#### searchFocus
`bool`<br />
This option will set the focus automatically to the search input field, when the dropdown field gets
opened.

#### searchMarked
`bool`<br />
This option will 'mark' the search term on the respective option test within the given results.

#### hideSelect
`bool`<br />
This option will hide, set the 'display: none;' styling, to the source select element.

#### hideSelected
`bool`<br />
This option will hide all selected options within the tail.select dropdown list.

#### hideDisabled
`bool`<br />
This option will hide all disabled options within the tail.select dropdown list.

#### bindSourceSelect
`bool`<br />
This option will set an event listener to the source select element. Thus, all changes to the source
element will be taken over in the tail.select instance!
