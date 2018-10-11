/*
 |  tail.select - A solution to make (multiple) selection fields beatiful again, written in vanillaJS!
 |  @author     SamBrishes@pytesNET
 |  @version    0.3.5 - Alpha
 |  @website    https://www.github.com/pytesNET/tail.select
 |
 |  @license    X11 / MIT License
 |  @copyright  Copyright © 2014 - 2018 SamBrishes, pytesNET <pytes@gmx.net>
 */
;(function(factory){
    if(typeof(define) == "function" && define.amd){
        define(factory);                // Asynchronous Module Definition
    } else {
        if(typeof(window.tail) == "undefined"){
            window.tail = {};
        }
        window.tail.select = factory();
    }
}(function(){
    "use strict";
    var w = window, d = window.document;

    /*
     |  HELPER METHODs
     */
    var tail = {
        hasClass: function(element, name){
            return (new RegExp("(|\s+)" + name + "(\s+|)")).test(element.className);
        },
        addClass: function(element, name){
            if(!(new RegExp("(|\s+)" + name + "(\s+|)")).test(element.className)){
                element.className = (element.className.trim() + " " + name.trim()).trim();
            }
            return element;
        },
        removeClass: function(element, name){
            var regex = new RegExp("(|\s+)(" + name + ")(\s+|)");
            if(regex.test(element.className)){
                element.className = (element.className.replace(regex, "$1$3")).trim();
            }
            return element;
        },
        trigger: function(e, event, opt){
            if(CustomEvent && CustomEvent.name){
                var ev = new CustomEvent(event, opt);
            } else {
                var ev = d.createEvent("CustomEvent");
                ev.initCustomEvent(event, !!opt.bubbles, !!opt.cancelable, opt.detail);
            }
            return e.dispatchEvent(ev);
        },
        clone: function(object, replace){
            replace = (typeof(replace) == "object")? replace: {};
            if(Object.assign){
                return Object.assign({}, object, replace);
            } else {
                var clone = object.constructor();
                for(var key in object){
                    if(key in replace){
                        clone[key] = replace[key];
                    } else if(key in object){
                        clone[key] = object[key];
                    }
                }
                return clone;
            }
        },
        animate: function(element, callback, delay, prevent){
            if(element.hasAttribute("data-tail-animation")){
                if(!prevent){
                    return;
                }
                clearInterval(tail.animation[element.getAttribute("data-tail-animation")]);
            }
            element.setAttribute("data-tail-animation", "tail-" + ++this.animationCounter);

            (function(e, func, delay){
                var tail = this;
                this.animation["tail-" + this.animationCounter] = setInterval(function(){
                    var animationID = e.getAttribute("data-tail-animation");
                    if(func.call(e, e) === false){
                        clearInterval(tail.animation[animationID]);
                        if(e.parentElement){
                            e.removeAttribute("data-tail-animation");
                        }
                    }
                }, delay);
            }).call(this, element, callback, delay);
        },
        animation: {},
        animationCounter: 0
    };

    /*
     |  CONSTRUCTOR
     |  @since  0.3.0
     |  @update 0.3.5
     */
    var tailSelect = function(element, config){
        if(typeof(element) == "string"){
            element = d.querySelectorAll(element);
        }
        if(element instanceof NodeList || element instanceof HTMLCollection){
            var _r = [];
            for(var l = element.length, i = 0; i < l; i++){
                _r.push(new tailSelect(element[i], config));
            }
            return (_r.length === 1)? _r[0]: ((_r.length === 0)? false: _r);
        }
        if(!(element instanceof Element) || (element.tagName && element.tagName !== "SELECT")){
            return false;
        }
        if(typeof(this) == "undefined" || !this.init){
            return new tailSelect(element, config);
        }

        // Check Element
        if(tailSelect.instances[element.getAttribute("data-tail-select")]){
            return tailSelect.instances[element.getAttribute("data-tail-select")];
        }

        // Get Element Options
        config = (typeof(config) == "object")? config: {};
        if(element.hasAttribute("multiple")){
            config.multiple = element.multiple;
        }
        if(element.hasAttribute("placeholder")){
            config.placeholder = element.placeholder;
        } else if(element.hasAttribute("data-placeholder")){
            config.placeholder = element.getAttribute("data-placeholder");
        }
        if(config.width && config.width === "auto"){
            config.width = element.offsetWidth + 30;
        }

        // Init Prototype Instance
        this.e = element;
        this.id = ++tailSelect.count;
        this.con = tail.clone(tailSelect.defaults, config);
        tailSelect.instances["tail-" + this.id] = this;
        return this.init();
    };
    tailSelect.version = "0.3.5";
    tailSelect.status = "alpha";
    tailSelect.count = 0;
    tailSelect.instances = {};

    /*
     |  STORAGE :: DEFAULT OPTIONS
     */
    tailSelect.defaults = {
        width: null,
        height: null,
        classNames: null,
        placeholder: null,
        deselect: false,
        animate: true,
        openAbove: null,
        stayOpen: false,
        startOpen: false,
        multiple: false,
        multiLimit: -1,
        multiShowCount: true,
        multiContainer: false,
        descriptions: false,
        items: {},
        sortItems: false,
        sortGroups: false,
        search: false,
        searchFocus: true,
        searchMarked: true,
        csvOutput: false,
        csvSeparator: ",",
        hideSelect: true,
        hideSelected: false,
        hideDisabled: false,
        bindSourceSelect: false
    };

    /*
     |  STORAGE :: STRINGS
     */
    tailSelect.strings = {
        empty: "No Options available",
        placeholder: "Select an Option...",
        multiLimit: "You can't select more Options",
        multiPlaceholder: "Select up to %d Options...",
        search: "Type in to search...",
        searchEmpty: "No Options found"
    };
    var __ = function(key){
        if(tailSelect.strings.hasOwnProperty(key)){
            return tailSelect.strings[key];
        }
        return key;
    };

    /*
     |  TAIL.SELECT HANDLER
     */
    tailSelect.prototype = {
        e: null,            // The <select> Field
        id: 0,              // The unique select ID
        con: {},            // The current configuration object

        options: {},        // The tail.options instance

        select: null,       // The tail.select container
        label: null,        // The tail.select label
        dropdown: null,     // The tail.select dropdown
        container: null,    // The tail.select container
        csvInput: null,     // The hidden CSV Input Field

        /*
         |  HANDLE :: (RESET &) INIT SELECT FIELD
         |  @since  0.3.0
         |  @update 0.3.5
         */
        init: function(){
            var self = this, classes = new Array("tail-select");

            // Build Select ClassNames
            var c = (this.con.classNames === true)? this.e.className: this.con.classNames;
            if(typeof(c) == "string" || c instanceof Array){
                classes.push((c instanceof Array)? c.join(" "): c);
            }
            if(self.con.hideSelected){ classes.push("hide-selected"); }
            if(self.con.hideDisabled){ classes.push("hide-disabled"); }
            if(self.con.multiple){     classes.push("multiple");      }
            if(self.con.deselect){     classes.push("deselect");      }

            // Create Select
            this.select = d.createElement("DIV");
            this.select.className = classes.join(" ");
            if(!isNaN(parseInt(this.con.width, 10))){
                this.select.style.width = parseInt(this.con.width, 10) + "px";
            }

            // Create Label
            this.label = d.createElement("DIV");
            this.label.className = "tail-select-label";
            if(this.con.multiple && this.con.multiShowCount){
                this.label.innerHTML = '<span class="tail-label-count">0</span>';
            }
            this.label.innerHTML += '<span class="tail-label-inner"></span>';
            this.label.addEventListener("click", function(event){
                self.toggle.call(self);
            });
            this.select.appendChild(this.label);
            this.setLabel("placeholder");

            // Create Dropdown
            this.dropdown = d.createElement("DIV");
            this.dropdown.className = "tail-select-dropdown";
            this.dropdown.innerHTML = '<div class="tail-dropdown-inner"></div>';
            if(!isNaN(parseInt(this.con.width, 10))){
                this.dropdown.style.width = parseInt(this.con.width, 10) + "px";
            }
            if(!isNaN(parseInt(this.con.height, 10))){
                this.dropdown.children[0].style.maxHeight = parseInt(this.con.height, 10) + "px";
            }
            this.select.appendChild(this.dropdown);

            // Create Search
            if(this.con.search){
                this.search = d.createElement("DIV");
                this.search.className = "tail-dropdown-search";
                this.search.innerHTML = '<input type="text" class="tail-search-input" />';
                this.search.querySelector("input").setAttribute("placeholder", __("search"));
                this.search.querySelector("input").addEventListener("input", function(event){
                    if(this.value.length > 2){
                        self.build(this.value);
                    } else {
                        self.build();
                    }
                });
                this.dropdown.insertBefore(this.search, this.dropdown.children[0]);
            }

            // Prepare Container
            if(this.con.multiple && d.querySelector(this.con.multiContainer)){
                this.container = d.querySelector(this.con.multiContainer);
                this.container.className += " tail-select-container";
            }

            // Create Hidden CSV
            if(this.con.csvOutput){
                var name = this.e.getAttribute("name") || this.id;
                    this.e.removeAttribute("name");

                this.csvInput = document.createElement("INPUT");
                this.csvInput.type = "hidden";
                this.csvInput.name = name;
                this.csvInput.value = "";
                this.select.appendChild(this.csvInput);
            }

            // Init Options
            this.options = new tailOptions(this.e, self);
            this.options.init();
            if(typeof(this.con.items) == "object"){
                for(var key in this.con.items){
                    if(typeof(this.con.items[key]) == "string"){
                        this.con.items[key] = {value: this.con.items[key]};
                    }
                    this.options.add(key, this.con.items[key].value, this.con.items[key].group,
                        this.con.items[key].selected, this.con.items[key].disabled)
                }
            }
            this.build();

            // Bind Document Event
            d.addEventListener("click", function(event){
                if(!tail.hasClass(self.select, "active")){
                    return;
                }
                if(!self.select.contains(event.target) && !self.e.contains(event.target)){
                    if(event.target != self.select && event.target != self.e){
                        if(!self.con.stayOpen){
                            self.close.call(self);
                        }
                    }
                }
            });

            // Bind Source Select
            if(this.con.bindSourceSelect){
                this.e.addEventListener("change", function(event){
                    var handle = function(options, selected){
                        var o, key, item, group, compare = self.options.selected.slice(0);
                        for(var l = options.length, i = 0; i < l; i++){
                            o = options[i];
                            key = o.value || o.innerText;
                            group = (o.parentElement.tagName == "OPTGROUP")? o.parentElement.label: "#";

                            if((item = self.options.get(key, group)) == null){
                                continue;
                            }
                            if(!self.options.is("selected", item)){
                                self.options.handle("select", item)
                            }
                            if(compare.indexOf(o) >= 0){
                                compare.splice(compare.indexOf(o), 1);
                            }
                        }
                        for(var i in compare){
                            self.options.handle("unselect", compare[i]);
                        }
                    };

                    if(!this.multiple && this.selectedIndex){
                        self.choose("select", this.options[this.selectedIndex])
                    } else if(this.selectedOptions){
                        handle(this.selectedOptions);
                    } else {
                        var selected = [];
                        for(var l = this.options.length, i = 0; i < l; i++){
                            if(this.options[i].selected){
                                selected.push(this.options[i])
                            }
                        }
                        handle(selected);
                    }
                });
            }

            // Insert and Return
            this.e.parentElement.insertBefore(this.select, this.e);
            this.e.setAttribute("data-tail-select", "tail-" + this.id);
            if(this.con.hideSelect){
                this.e.style.display = "none";
            }
            if(self.con.startOpen){
                this.open();
            }
            return this;
        },

        /*
         |  HANDLE :: BUILD DROPDOWN LIST
         |  @since  0.3.0
         |  @update 0.3.4
         */
        build: function(search){
            var optgroups = [], optgroup, option, self = this;
            optgroups[0] = d.createElement("UL");
            optgroups[0].className = "tail-dropdown";
            optgroup = optgroups[0];

            var call = function(item){
                if(typeof(item) == "string"){
                    if(item == "#"){
                        optgroup = optgroups[0];
                        return;
                    }
                    optgroup = d.createElement("UL");
                    optgroup.className = "tail-dropdown-optgroup";
                    optgroup.setAttribute("data-group", item);

                    // Add Group
                    optgroups.push(optgroup);
                    optgroups[0].appendChild(optgroup)

                    // Create Option Title
                    option = d.createElement("LI");
                    option.className = "tail-optgroup-title";
                    option.innerHTML = "<b>" + item + "</b>";
                } else {
                    option = d.createElement("LI");
                    option.className = "tail-dropdown-option" + ((item.selected)? " selected": "") + ((item.disabled)? " disabled": "");
                    if(search && search.length > 0 && self.con.searchMarked){
                        search = search.replace(/[\[\]\{\}\(\)\*\+\?\.\,\^\$\\\|\#\-]/g, "\\$&");
                        option.innerHTML = item.value.replace(new RegExp("(" + search + ")", "i"), "<mark>$1</mark>");
                    } else {
                        option.innerText = item.value;
                    }
                    if(self.con.descriptions && item.description){
                        option.innerHTML += '<span class="tail-option-description">' + item.description + '</span>';
                    }
                    option.setAttribute("data-key", item.key);
                    option.setAttribute("data-group", item.group);
                    option.addEventListener("click", function(event){
                        self.bind.call(self, event, this);
                    })
                }
                optgroup.appendChild(option);
                return option;
            }

            // Loop Technique
            var item, empty = true;
            while(true){
                if(typeof(search) === "string"){
                    item = this.options.finder(search)
                } else {
                    item = this.options.walk(this.con.sortItems, this.con.sortGroups, true);
                }
                if(item){
                    call(item);
                    if(item !== "#" && empty){
                        empty = false;
                    }
                } else {
                    break;
                }
            }
            if(empty){
                empty = call({key: null, value: ((search == undefined)? __("empty"): __("searchEmpty"))});
                empty.className += " label-only";
            }

            // Add to Dropdown
            this.dropdown.querySelector(".tail-dropdown-inner").innerHTML = "";
            this.dropdown.querySelector(".tail-dropdown-inner").appendChild(optgroups[0]);
            return this;
        },

        /*
         |  HANDLE :: EVENT LISTENER
         |  @since  0.3.0
         */
        bind: function(event, option){
            if(!option.hasAttribute("data-key")){
                return false;
            }
            var key = option.getAttribute("data-key"),
                group = option.getAttribute("data-group") || "#";

            // Select Option
            if(this.choose("toggle", key, group)){
                if(!this.con.stayOpen && !this.con.multiple){
                    this.close();
                }
            }
        },

        /*
         |  HANDLE :: INTERNAL CALLBACK
         |  @since  0.3.0
         |  @update 0.3.5
         */
        callback: function(item, state){
            var self = this;
            if(state == "rebuild"){
                return this.build();
            }

            // Set Element-Item States
            var element = this.dropdown.querySelector("[data-key='" + item.key + "'][data-group='" + item.group + "']");
            if(element){
                if(state == "select"){
                    tail.addClass(element, "selected");
                } else if(state == "unselect"){
                    tail.removeClass(element, "selected");
                } else if(state == "disable"){
                    tail.addClass(element, "disabled");
                } else if(state == "enable"){
                    tail.removeClass(element, "disabled");
                }
            }

            // Set Placeholder and Class Name
            if(["select", "unselect"].indexOf(state) >= 0){
                if(this.con.multiple){
                    if(this.con.multiLimit >= 0 && this.con.multiLimit <= this.options.selected.length){
                        tail.addClass(this.select, "limit");
                        this.setLabel("limit");
                    } else {
                        tail.removeClass(this.select, "limit");
                        this.setLabel("placeholder");
                    }
                } else {
                    this.setLabel((state == "unselect")? "placeholder": item.value);
                }
            }

            // Set Counter
            if(this.con.multiple && this.con.multiShowCount){
                this.setCounter();
            }

            // Move to Container
            if(this.container){
                this.setContainer(item, state);
            }

            // Update CSV
            if(this.csvInput && this.con.csvOutput && ["select", "unselect"].indexOf(state) >= 0){
                var selected = [];
                for(var l = this.options.selected.length, i = 0; i < l; i++){
                    selected.push(this.options.selected[i].value);
                }
                this.csvInput.value = selected.join(this.con.csvSeparator || ",");
            }

            // Call Event
            tail.trigger(this.select, "tail.select::" + state, {
                bubbles: false,
                cancelable: true,
                detail: self
            });
        },


        /*
         |  ACTION :: WRITE LABEL
         |  @since  0.3.0
         |  @update 0.3.4
         */
        setLabel: function(string){
            if(string == "placeholder"){
                if(typeof(this.con.placeholder) == "string" && this.con.placeholder.length > 0){
                    string = this.con.placeholder;
                } else {
                    if(this.con.multiple && this.con.multiLimit > 0){
                        string = __("multiPlaceholder").replace("%d", this.con.multiLimit);
                    } else {
                        string = __("placeholder");
                    }
                }
            } else if(string == "limit"){
                string = __("multiLimit")
            }
            this.label.querySelector(".tail-label-inner").innerText = string;
            return this;
        },

        /*
         |  ACTION :: WRITE COUNTER
         |  @since  0.3.0
         */
        setCounter: function(){
            var count = (this.options.selected || []).length;
            this.label.querySelector(".tail-label-count").innerText = count;
            return this;
        },

        /*
         |  ACTION :: WRITE CONTAINER
         |  @since  0.3.0
         */
        setContainer: function(item, state){
            var self = this;
            if(state == "select"){
                var hndl = d.createElement("DIV");
                    hndl.innerText = item.value;
                    hndl.className = "tail-select-handle";
                    hndl.setAttribute("data-key", item.key);
                    hndl.setAttribute("data-group", item.group);
                    hndl.addEventListener("click", function(event){
                        event.preventDefault();
                        self.choose.call(self, "unselect", this.getAttribute("data-key"),
                                         this.getAttribute("data-group"));
                    });
                this.container.appendChild(hndl);
            } else {
                var selector = "[data-group='" + item.group + "'][data-key='" + item.key + "']";
                var hndl = this.container.querySelector(selector);
                if(hndl){
                    hndl.parentElement.removeChild(hndl);
                }
            }
            return this;
        },

        /*
         |  ACTION :: CHOOSE AN OPTION
         |  @since  0.3.0
         |
         |  @param  string  The choosed state "select", "unselect" or "toggle"
         |                                    "disable" or "enable"
         |  @param  multi   <see tailOptions.get()>
         |                  or Use a list of touples [(key, group), (key, group)], wait this is the
         |                  wrong language: Use an Array with (key[, group]) Arrays.
         |  @param  multi   <see tailOptions.get()>
         |                  or undefined if @param2 is an Array.
         */
        choose: function(state, key, group){
            if(key instanceof Array){
                for(var k in key){
                    this.choose(state, key[k][0], key[k][1])
                }
                return this;
            }

            // Disable || Enable
            if(state == "enable" || state == "disable"){
                return this.options.handle(state, key, group);
            }

            // Select || Unselect || Toggle
            if(state == "toggle"){
                state = this.options.is("select", key, group)? "unselect": "select";
            }
            return this.options.handle(state, key, group)
        },

        /*
         |  ACTION :: OPEN DROPDOWN
         |  @since  0.3.0
         |  @update 0.3.2
         */
        open: function(){
            if(tail.hasClass(this.select, "active") || tail.hasClass(this.select, "idle")){
                return false;
            }

            // Calculate Open Condition
            var h = d.documentElement.offsetHeight,
                c = this.dropdown.cloneNode(true);
                c.style.cssText += "height:auto;opacity:0;display:block;visibility:hidden;";
                c.className += " clone";
            this.dropdown.parentElement.appendChild(c);
            var e = c.offsetHeight, t = this.select.offsetTop + e + 25;
            this.dropdown.parentElement.removeChild(c);
            if(this.con.openAbove === true || (this.con.openAbove === null && h <= t)){
                tail.addClass(this.select, "open-top");
            } else {
                tail.removeClass(this.select, "open-top");
            }

            // Open
            if(this.con.animate){
                var self = this;

                tail.addClass(self.select, "idle");
                this.label.style.zIndex = 25;
                this.dropdown.setAttribute("data-height", e);
                this.dropdown.style.cssText += "height:0;display:block;overflow:hidden;";
                tail.animate(this.dropdown, function(){
                    var h = parseInt(this.style.height, 10),
                        m = parseInt(this.getAttribute("data-height"), 10);
                    if(h < m){
                        this.style.height = ((h+50 > m)? m: h+50) + "px";
                        return true;
                    }
                    tail.addClass(self.select, "active");
                    tail.removeClass(self.select, "idle");

                    this.removeAttribute("style");
                    this.removeAttribute("data-height");
                    self.label.removeAttribute("style");
                    tail.trigger(self.select, "tail.select::open", {
                        bubbles: false, cancelable: true, detail: self
                    });
                    if(self.con.search && self.con.searchFocus){
                        self.dropdown.querySelector("input").focus();
                    }
                    return false;
                }, 1, true);
            } else {
                tail.addClass(this.select, "active");
                tail.trigger(this.select, "tail.select::open", {
                    bubbles: false, cancelable: true, detail: self
                });
                if(this.con.search && this.con.searchFocus){
                    this.dropdown.querySelector("input").focus();
                }
            }
            return this;
        },

        /*
         |  ACTION :: CLOSE DROPDOWN
         |  @since  0.3.0
         */
        close: function(){
            if(!tail.hasClass(this.select, "active") || tail.hasClass(this.select, "idle")){
                return false;
            }

            // Open
            if(this.con.animate){
                var self = this;

                tail.addClass(this.select, "idle");
                this.dropdown.style.overflow = "hidden";
                tail.animate(this.dropdown, function(){
                    var h = parseInt(this.offsetHeight, 10);
                    if((h-50) > 0){
                        this.style.height = (h-50) + "px";
                        return true;
                    }
                    tail.removeClass(self.select, "idle");
                    tail.removeClass(self.select, "active");
                    this.removeAttribute("style");
                    tail.trigger(self.select, "tail.select::close", {
                        bubbles: false, cancelable: true, detail: self
                    });
                    return false;
                }, 1, true);
            } else {
                tail.removeClass(this.select, "active");
                tail.trigger(this.select, "tail.select::close", {
                    bubbles: false, cancelable: true, detail: self
                });
            }
            return this;
        },

        /*
         |  ACTION :: TOGGLE DROPDOWN
         |  @since  0.3.0
         */
        toggle: function(){
            if(!tail.hasClass(this.select, "active")){
                return this.open();
            }
            return this.close();
        },

        /*
         |  ACTION :: REMOVE SELECT
         |  @since  0.3.0
         |  @update 0.3.5
         */
        remove: function(){
            this.e.style.display = "inherit";
            this.e.removeAttribute("data-tail-select");
            if(this.csvInput){
                this.e.setAttribute("name", this.csvInput.getAttribute("name"));
            }
            this.select.parentElement.removeChild(this.select);
            if(this.container){
                var handles = this.container.querySelectorAll(selector);
                for(var l = handles.length, i = 0; i < l; i++){
                    this.container.removeChild(handles[i]);
                }
            }
            return this;
        },

        /*
         |  ACTION :: RELOAD SELECT
         |  @since  0.3.0
         */
        reload: function(){
            this.remove();
            return new tailSelect(this.e, this.con);
        }
    };

    /*
     |  TAIL.OPTIONS HANDLER
     */
    var tailOptions = function(select, parent){
        if(!select.tagName || select.tagName != "SELECT" || !(parent instanceof tailSelect)){
            return false;
        }
        if(typeof(this) == "undefined"){
            return new tailOptions(select, parent);
        }

        // Init Class
        this.self = parent;
        this.select = select;
        return this;
    }
    tailOptions.prototype = {
        /*
         |  INTERNAL :: REPLACE TYPOs
         |  @since  0.3.0
         */
        _replaceTypo: function(state){
            state = state.replace("disabled", "disable");
            state = state.replace("enabled", "enable");
            state = state.replace("selected", "select");
            state = state.replace("unselected", "unselect");
            return state;
        },

        /*
         |  INIT OPTIONS CLASS
         |  @since  0.3.0
         |  @update 0.3.5
         */
        init: function(){
            this.length = 0;
            this.selected = [];
            this.disabled = [];
            this.items = {"#": {}};
            this.groups = {};

            // Set Items
            var l = this.select.options.length, o, k, i, g, t, self = this.self;
            for(i = 0; i < l; i++){
                o = this.select.options[i];
                k = o.value || o.innerText;
                g = (o.parentElement.tagName == "OPTGROUP")? o.parentElement.label: "#";

                // Check Group
                if(g !== "#" && !(g in this.groups)){
                    this.items[g] = {};
                    this.groups[g] = o.parentElement;
                }

                // Sanitize Description
                if(o.hasAttribute("data-description")){
                    var span = d.createElement("SPAN");
                        span.innerHTML = o.getAttribute("data-description");
                    o.setAttribute("data-description", span.innerHTML);
                }

                // Set Item
                this.items[g][k] = {
                    key: k,
                    value: o.innerText,
                    description: o.getAttribute("data-description") || null,
                    group: g,
                    option: o,
                    optgroup: this.groups[g],
                    selected: false,
                    disabled: false
                }

                // Set States
                t = (!self.con.multiple && self.con.deselect)? o.hasAttribute("selected"): o.selected;
                if(t && !o.disabled && !this.handle("select", k, g)){
                    o.selected = false;
                }
                if(o.disabled && !this.handle("disabled", k, g)){
                    o.disabled = false;
                }
                this.length++;
            }
            return this;
        },

        /*
         |  GET AN EXISTING OPTION
         |  @since  0.3.0
         |
         |  @param  multi   The respective option key.
         |                  The <option> element of the <select> element.
         |                  The <li>.tail-drowdown-option of the tail.select element.
         |  @param  multi   The respective group if @param1 is a string.
         |
         |  @return multi   The respective item object on success, FALSE on failure or NULL
         |                  if no option could be found!
         */
        get: function(key, group){
            if(typeof(key) == "object" && key.key && key.value){
                return key;
            }
            if(key instanceof Element && key.tagName){
                if(key.tagName == "OPTION"){
                    if(key.parentElement.tagName == "OPTGROUP"){
                        group = key.parentElement.label;
                    }
                    key = key.value || key.innerText;
                } else if(key.hasAttribute("data-key")){
                    if(key.parentElement.hasAttribute("data-group")){
                        optgroup = key.parentElement.getAttribute("data-group");
                    }
                    key = key.getAttribute("data-key")
                }
            }
            if(typeof(key) != "string"){
                return false;
            }

            // Get Item
            if(typeof(group) == "string" && group != "#"){
                if(!(group in this.groups)){
                    return null;
                }
                var items = this.items[group];
            } else {
                var items = this.items["#"];
            }
            return (key in items)? items[key]: null;
        },

        /*
         |  ADD (SET) AN EXISTING OPTION
         |  @since  0.3.0
         |
         |  @param  object  The <option> element within the respectove <select> field.
         |
         |  @return bool    Returns true if the option could be added, false if not.
         */
        set: function(option){
            if(!option.tagName || option.tagName != "OPTION"){
                return false;
            }
            var key = option.value || option.text,
                group = option.parentElement;
                group = ((group.tagName == "OPTGROUP")? group.label: "#");

            // Check Group & Item
            if(group != "#" && !(group in this.groups)){
                this.groups[group] = option.parentElement;
                this.items[group] = {};
            }
            if(key in this.items[group]){
                return false;
            }

            // Selection
            if(option.selected && this.self.con.multiple){
                if(this.self.con.multiLimit >= 0 && this.self.con.multiLimit <= this.selected.length){
                    option.selected = false;
                }
            } else if(option.selected && !this.self.con.multiple && this.selected.length > 0){
                option.selected = false;
            }

            // Add Item
            this.items[group][key] = {
                key: key,
                value: option.text,
                description: option.getAttribute("data-description") || null,
                group: group,
                option: option,
                optgroup: (group != "#")? this.groups[group]: undefined,
                selected: option.selected,
                disabled: option.disabled
            }
            if(this.items[group][key].selected){
                this.selected.push(this.items[group][key].option)
            }
            if(this.items[group][key].disabled){
                this.disabled.push(this.items[group][key].option)
            }
            this.length++;
            this.self.callback.call(this.self, this.items[group][key], "rebuild")
            return true;
        },

        /*
         |  ADD (CREATE) A NEW OPTION
         |  @since  0.3.0
         |  @update 0.3.5
         |
         |  @param  string  The option key.
         |  @param  string  The option value.
         |  @param  string  The option group or undefined.
         |  @param  bool    The option selected state or undefined.
         |  @param  bool    The option disabled state or undefined.
         |  @param  string  The option description.
         |
         |  @return bool    Returns true if the option could be created, false if not.
         */
        add: function(key, value, group, selected, disabled, description){
            if(this.get(key, group) != null){
                return false;
            }

            // Check Group
            group = (typeof(group) == "undefined")? "#": group;
            if(!(group in this.groups)){
                var optgroup = d.createElement("OPTGROUP")
                    optgroup.label = group;
                    this.select.appendChild(optgroup)
                this.groups[group] = optgroup;
                this.items[group] = {};
            }

            // Check Parameters
            selected = (typeof(selected) == "undefined")? false: !!selected;
            if(selected && this.self.con.multiple){
                if(this.self.con.multiLimit >= 0 && this.self.con.multiLimit <= this.selected.length){
                    selected = false;
                }
            } else if(selected && !this.self.con.multiple && this.selected.length > 0){
                option.selected = false;
            }
            disabled = (typeof(disabled) == "undefined")? false: !!disabled;

            // Create Option
            var option = d.createElement("OPTION");
                option.value = key;
                option.selected = selected;
                option.disabled = disabled;
                option.innerText = value;
            if(typeof(description) == "string"){
                var span = d.createElement("SPAN");
                    span.innerHTML = o.getAttribute("data-description");
                o.setAttribute("data-description", span.innerHTML);
            }

            // Add Option and Return
            if(group == "#"){
                this.select.appendChild(option)
            } else {
                this.groups[group].appendChild(option)
            }
            return this.set(option);
        },

        /*
         |  REMOVE AN EXISTING OPTION
         |  @since  0.3.0
         |
         |  @param  multi   <see get()>
         |  @param  multi   <see get()>
         |
         |  @return bool    Returns true if the option could be deleted, false if not.
         */
        remove: function(key, group){
            var item = this.get(key, group);
            if(!item){
                return false;
            }

            // Remove States
            if(item.selected){
                this.handle("unselect", item);
            }
            if(item.disabled){
                this.handle("enable", item);
            }

            // Remove Data
            item.option.parentElement.removeChild(item.option)
            delete this.items[item.group][item.key];
            this.length--;

            // Remove Optgroup
            if(Object.keys(this.items[item.group]).length === 0){
                delete this.items[item.group];
                delete this.groups[item.group];
            }

            // Return
            this.self.callback.call(this.self, item, "rebuild")
            return true;
        },

        /*
         |  CHECK AN EXISTING OPTION
         |  @since  0.3.0
         |
         |  @param  string  "disabled", "enabled", "selected" or "unselected"
         |  @param  multi   <see get()>
         |  @param  multi   <see get()>
         |
         |  @return bool    Returns true if the passed state is true, false if not,
         |                  and null on failure.
         */
        is: function(state, key, group){
            var state = this._replaceTypo(state), item = this.get(key, group);
            if(!item || ["select", "unselect", "disable", "enable"].indexOf(state) < 0){
                return null;
            }
            if (state == "disable" || state == "enable"){
                return (state == "disable")? item.disabled: !item.disabled;
            } else if (state == "select" || state == "unselect"){
                return (state == "select")? item.selected: !item.selected;
            }
            return false;
        },

        /*
         |  INTERACT WITH AN OPTION
         |  @since  0.3.0
         |
         |  @param  string  "disable", "enable", "select" or "unselect"
         |  @param  multi   <see get()>
         |  @param  multi   <see get()>
         |
         |  @return bool    Returns true if the state has been successfully setted, false if not
         |                  and null on failure.
         */
        handle: function(state, key, group, _force){
            var state = this._replaceTypo(state), item = this.get(key, group);
            if(!item || ["select", "unselect", "disable", "enable"].indexOf(state) < 0){
                return null;
            }

            // Disable || Enable
            if(state == "disable" || state == "enable"){
                if(state == "disable" && !(item.option in this.disabled)){
                    this.disabled.push(item.option)
                } else if(state == "disable" && item.option in this.selected){
                    this.disabled.splice(this.disabled.indexOf(item.option), 1);
                }
                item.disabled = (state == "disable");
                item.option.disabled = (state == "disable");

                this.self.callback.call(this.self, item, state)
                return true;
            }

            // Select || Unselect
            if(item.disabled || item.option.disabled){
                return false;
            }
            if(state == "select"){
                if(this.self.con.multiple && this.self.con.multiLimit >= 0){
                    if(this.self.con.multiLimit <= this.selected.length){
                        return false;
                    }
                } else if(!this.self.con.multiple){
                    for(var i in this.selected){
                        this.handle("unselect", this.selected[i], undefined, true)
                    }
                }

                this.selected.push(item.option);
                item.selected = true;
                item.option.selected = true;
                item.option.setAttribute("selected", "selected");
            } else if(state == "unselect"){
                if((!this.self.con.multiple && !this.self.con.deselect) && _force !== true){
                    return false;
                }

                this.selected.splice(this.selected.indexOf(item.option), 1);
                item.selected = false;
                item.option.selected = false;
                item.option.removeAttribute("selected");
            }
            this.self.callback.call(this.self, item, state)
            return true;
        },

        /*
         |  FIND SOME OPTIONs - WALKER EDITION
         |  @since  0.3.0
         |  @update 0.3.5
         |
         |  @param  string  The search term.
         |  @param  string  Experimental: May not work as expected!
         @                  Use 'required' if the search term MUST appear within the value attribute AND MUST within the text.
         @                  Use 'optional' if the search term MAY appear within the value attribute AND MUST within the text.
         @                  Use 'eitheror' if the search term MUST appear within the value OR within the text (or BOTH).
         */
        finder: function(search, keys){
            if(typeof(this._findLoop) == "undefined"){
                search = search.replace(/[\[\]{}()*+?.,^$\\|#-]/g, "\\$&");
                if(keys == "required"){
                    var regex = "\<[^<>]+value\=\"[^\"]*" + search + "[^\"]*\"\>";
                } else if(keys == "optional" || keys == "eitheror"){
                    var regex = "\<[^<>]+(value\=\"[^\"]*" + search + "[^\"]*\")?\>";
                } else {
                    var regex = "\<[^<>]+\>";
                }
                if(keys == "eitheror"){
                    regex += "[^<>]*(" + search + ")?[^<>]*";
                } else {
                    regex += "[^<>]*(" + search + ")[^<>]*";
                }
                regex += "\<[^<>]+\>";
            }

            // Start Walker
            if(typeof(this._findLoop) == "undefined"){
                this._findLoop = true;
                this._findRegex = new RegExp(regex, "gmi");
            }

            // Handle Walker
            var text = this.self.e.innerHTML, match, item, num;
            while((match = this._findRegex.exec(text)) !== null){
                num = (text.substr(0, this._findRegex.lastIndex).match(/\<\/option\>/g) || []).length;
                if((item = this.get(this.self.e.options[num-1])) == null){
                    continue;
                }
                return item;
            }

            // Close Walker
            delete this._findLoop;
            delete this._findRegex;
            return false;
        },

        /*
         |  FIND SOME OPTIONs - ARRAY EDITION
         |  @since  0.3.0
         |
         |  @param  string  <see finder()>
         |  @param  string  <see finder()>
         |  @param  string  <see finder()>
         */
        find: function(search, keys, groups){
            var items = [];
            while((item = this.finder(search, keys, groups)) !== false){
                items.push(item);
            }
            return items;
        },

        /*
         |  WALK THROUGH ALL OPTIONs
         |  @since  0.3.0
         |
         |  @param  multi   Use "ASC" or "DESC" or pass an own callback sort function.
         |  @param  multi   Use "ASC" or "DESC" or pass an own callback sort function.
         |  @param  bool    Use true to return the optgroup keys too, false to do it not.
         */
        walk: function(item_order, group_order, with_keys){
            if(typeof(this._inLoop) != "undefined" && this._inLoop){
                if(this._inItems.length > 0){
                    var key = this._inItems.shift()
                    return this.items[this._inGroup][key];
                }

                // Sort Items
                if(this._inGroups.length > 0){
                    while(this._inGroups.length > 0){
                        var group = this._inGroups.shift(), keys = Object.keys(this.items[group]);
                        if(keys.length > 0){
                            break;
                        }
                    }
                    if(item_order == "ASC"){
                        keys.sort();
                    } else if(item_order == "DESC"){
                        keys.sort().reverse();
                    } else if(typeof(item_order) == "function"){
                        keys.sort(item_order);
                    }
                    this._inItems = keys;
                    this._inGroup = group;
                    return (with_keys)? group: this.walk(null, null, with_keys);
                }

                // Delete and Exit
                delete this._inLoop;
                delete this._inItems;
                delete this._inGroup;
                delete this._inGroups;
                return false;
            }

            // Sort Groups
            var groups = Object.keys(this.groups);
            if(group_order == "ASC"){
                groups.sort();
            } else if(group_order == "DESC"){
                groups.sort().reverse();
            } else if(typeof(group_order) == "function"){
                groups.sort(group_order);
            }
            groups.unshift("#")

            // Init Loop
            this._inLoop = true;
            this._inItems = [];
            this._inGroups = groups;
            return this.walk(item_order, null, with_keys);
        }
    }

    // Assign to jQuery
    if(typeof(jQuery) != "undefined"){
        jQuery.fn.tailselect = function(options){
            var _r = [];
            this.each(function(){
                var instance = tailSelect(this);
                if(instance){
                    _r.push(instance);
                }
            });
            return (_r.length === 1)? _r[0]: (_r.length === 0)? false: _r;
        }
    }

    // Assign to MooTools
    if(typeof(MooTools) !== "undefined"){
        Element.implement({
            tailselect: function(options){
                return new tailSelect(this, options);
            }
        });
    }

    // Assign to Window
    if(typeof(w.tail) == "undefined"){
        w.tail = {};
    }
    w.tail.select = tailSelect;
    w.tail.options = tailOptions;
    return tailSelect;
}));
