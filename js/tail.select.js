/*
 |  tail.select - Another solution to make (multiple) select fields beautiful, written in vanillaJS!
 |  @author     SamBrishes@pytesNET
 |  @version    0.4.2 - Beta
 |  @website    https://www.github.com/pytesNET/tail.select
 |
 |  @license    X11 / MIT License
 |  @copyright  Copyright © 2014 - 2018 SamBrishes, pytesNET <pytes@gmx.net>
 */
;(function(factory){
    if(typeof(define) == "function" && define.amd){
        define(factory);
    } else {
        if(typeof(window.tail) == "undefined"){
            window.tail = {};
        }
        window.tail.select = factory();

        // Assign to jQuery
        if(typeof(jQuery) != "undefined"){
            jQuery.fn.tailselect = function(options){
                var _r = [], instance;
                this.each(function(){
                    if((instance = tail.select(this, options)) !== false){ _r.push(instance); }
                });
                return (_r.length === 1)? _r[0]: (_r.length === 0)? false: _r;
            }
        }

        // Assign to MooTools
        if(typeof(MooTools) !== "undefined"){
            Element.implement({
                tailselect: function(options){ return new tail.select(this, options); }
            });
        }
    }
}(function(){
    "use strict";
    var w = window, d = window.document;

    /*
     |  HELPER METHODs
     */
    var tail = {
        hasClass: function(el, name){
            return (new RegExp("(|\s+)" + name + "(\s+|)")).test(el.className || "");
        },
        addClass: function(el, name){
            if("className" in el && !(new RegExp("(|\s+)" + name + "(\s+|)")).test(el.className)){
                el.className = (el.className.trim() + " " + name.trim()).trim();
            }
            return el;
        },
        removeClass: function(el, name){
            var regex = new RegExp("(|\s+)(" + name + ")(\s+|)");
            if("className" in el && regex.test(el.className)){
                el.className = (el.className.replace(regex, "$1$3")).trim();
            }
            return el;
        },
        trigger: function(el, event, opt){
            if(CustomEvent && CustomEvent.name){
                var ev = new CustomEvent(event, opt);
            } else {
                var ev = d.createEvent("CustomEvent");
                ev.initCustomEvent(event, !!opt.bubbles, !!opt.cancelable, opt.detail);
            }
            return el.dispatchEvent(ev);
        },
        clone: function(object, replace){
            replace = (typeof(replace) == "object")? replace: {};
            if(Object.assign){
                return Object.assign({}, object, replace);
            }
            var clone = object.constructor();
            for(var key in object){
                clone[key] = (key in replace)? replace[key]: object[key];
            }
            return clone;
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
     |  SELECT CONSTRUCTOR
     |  @since  0.3.0
     |  @update 0.4.0
     */
    var tailSelect = function(element, config){
        if(typeof(element) == "string"){
            element = d.querySelectorAll(element);
        }
        if(element instanceof NodeList || element instanceof HTMLCollection || element instanceof Array){
            for(var _r = [], l = element.length, i = 0; i < l; i++){
                _r.push(new tailSelect(element[i], config));
            }
            return (_r.length === 1)? _r[0]: ((_r.length === 0)? false: _r);
        }
        if(!(element.tagName && element.tagName == "SELECT")){
            return false;
        }
        if(typeof(this) == "undefined" || !this.init){
            return new tailSelect(element, config);
        }

        // Check Element
        if(tailSelect.inst[element.getAttribute("data-tail-select")]){
            return tailSelect.inst[element.getAttribute("data-tail-select")];
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

        // Init Instance
        this.e = element;
        this.id = ++tailSelect.count;
        this.con = tail.clone(tailSelect.defaults, config);
        tailSelect.inst["tail-" + this.id] = this;
        return this.init();
    };
    tailSelect.version = "0.4.2";
    tailSelect.status = "beta";
    tailSelect.count = 0;
    tailSelect.inst = {};

    /*
     |  OPTIONS CONSTRUCTOR
     |  @since  0.3.0
     |  @update 0.4.0
     */
    var tailOptions = function(select, parent){
        if(typeof(this) == "undefined" || !this.init){
            return new tailOptions(select, parent);
        }
        this.self = parent;
        this.select = select;
        return this;
    }

    /*
     |  STORAGE :: DEFAULT OPTIONS
     */
    tailSelect.defaults = {
        width: null,
        height: 350,
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
        multiSelectAll: false,          // NEW IN **0.4.0**
        multiSelectGroup: true,         // NEW IN **0.4.0**
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
        bindSourceSelect: false,
        cbLoopItem: undefined,          // NEW IN **0.4.0**
        cbLoopGroup: undefined          // NEW IN **0.4.0**
    };

    /*
     |  STORAGE :: STRINGS
     */
    tailSelect.strings = {
        all: "All",
        none: "None",
        actionAll: "Select All",
        actionNone: "Unselect All",
        empty: "No Options available",
        emptySearch: "No Options found",
        limit: "You can't select more Options",
        placeholder: "Select an Option...",
        placeholderMulti: "Select up to :limit Options...",
        search: "Type in to search..."
    };
    var __ = function(key){
        return (key in tailSelect.strings)? tailSelect.strings[key]: key;
    };

    /*
     |  TAIL.SELECT HANDLER
     */
    tailSelect.prototype = {
        e: null,            // The <select> Field
        id: 0,              // The unique select ID
        con: {},            // The current configuration object
        events: {},         // Internal Event Storage
        options: {},        // The tail.options instance
        select: null,       // The tail.select container
        label: null,        // The tail.select label
        dropdown: null,     // The tail.select dropdown
        search: null,       // The tail.select search
        container: null,    // The tail.select container
        csvInput: null,     // The hidden CSV Input Field

        /*
         |  INTERNAL :: (RESET &) INIT SELECT FIELD
         |  @since  0.3.0
         |  @update 0.4.0
         */
        init: function(){
            var self = this, classes = new Array("tail-select");
            this.events = {};

            // Build Select ClassNames
            var c = (this.con.classNames === true)? this.e.className: this.con.classNames;
            if(typeof(c) == "string" || c instanceof Array){
                classes.push((c instanceof Array)? c.join(" "): c);
            }
            if(self.con.hideSelected){ classes.push("hide-selected"); }
            if(self.con.hideDisabled){ classes.push("hide-disabled"); }
            if(self.con.multiple){     classes.push("multiple");      }
            if(self.con.deselect){     classes.push("deselect");      }

            // Build Main
            var tailHTML = '<div class="tail-select-label"><span class="tail-label-count">0</span>'
                         + '<span class="tail-label-inner"></span></div>'
                         + '<div class="tail-select-dropdown"><div class="tail-dropdown-search">'
                         + '<input type="text" class="tail-search-input" placeholder="" /></div>'
                         + '<div class="tail-dropdown-inner"></div>'
                         + '</div><input type="hidden" name="" value="" />';
            this.select  = d.createElement("DIV");
            this.select.innerHTML = tailHTML;
            this.select.className = classes.join(" ");
            if(!isNaN(parseInt(this.con.width, 10))){
                this.select.style.width = parseInt(this.con.width, 10) + "px";
            }

            // Assign Label
            this.label = this.select.querySelector(".tail-select-label");
            this.label.addEventListener("click", function(event){
                self.toggle.call(self);
            });
            if(!this.con.multiple || (this.con.multiple && !this.con.multiShowCount)){
                this.label.removeChild(this.label.querySelector(".tail-label-count"));
            }

            // Assign Dropdown
            this.dropdown = this.select.querySelector(".tail-select-dropdown");
            if(!isNaN(parseInt(this.con.width, 10))){
                this.dropdown.style.width = parseInt(this.con.width, 10) + "px";
            }
            if(!isNaN(parseInt(this.con.height, 10))){
                this.dropdown.style.maxHeight = parseInt(this.con.height, 10) + "px";
            }

            // Assign Search
            this.search = this.dropdown.querySelector(".tail-dropdown-search");
            this.search.querySelector("input").setAttribute("placeholder", __("search"));
            this.search.querySelector("input").addEventListener("input", function(event){
                tail[(this.value.length > 2? "add": "remove") + "Class"](self.select, "in-search");
                self.build.call(self, (this.value.length > 2)? this.value: undefined,
                                self.con.cbLoopItem, self.con.cbLoopGroup);
            });
            if(!this.con.search){
                this.dropdown.removeChild(this.search);
            }

            // Assign CSV Input
            this.csvInput = this.select.querySelector("input[type='hidden']");
            this.csvInput.name = this.e.getAttribute("name") || this.id;
            if(!this.csvInput){
                this.select.removeChild(this.csvInput);
            }

            // Prepare Container
            if(this.con.multiple && d.querySelector(this.con.multiContainer)){
                this.container = d.querySelector(this.con.multiContainer);
                this.container.className += " tail-select-container";
            }

            // Prepare Options
            this.options = new tailOptions(this.e, self).init();
            for(var key in this.con.items){
                if(typeof(this.con.items[key]) == "string"){
                    this.con.items[key] = {value: this.con.items[key]};
                }
                this.options.add(key, this.con.items[key].value, this.con.items[key].group,
                    this.con.items[key].selected, this.con.items[key].disabled,
                    this.con.items[key].description);
            }
            this.build(null, this.con.cbLoopItem, this.con.cbLoopGroup);
            this.bind(false);

            // Append and Return
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
         |  INTERNAL :: BUILD DROPDOWN LIST
         |  @since  0.3.0
         |  @update 0.4.0
         */
        build: function(search, cb_item, cb_group){
            search = (typeof(search) == "string")? search: false;

            // Get Root
            var root = d.createElement("UL");
                root.className = "tail-dropdown";
                root.setAttribute("data-group", "#");

            // Walk
            var self = this, item, ul = root, li, a1, a2, func = (search)? "finder": "walker",
                args = (search)? [search]: [this.con.sortItems, this.con.sortGroups];
            while(item = this.options[func].apply(this.options, args)){
                if(item.group != ul.getAttribute("data-group")){
                    ul = (cb_group || this.createGroup).call(this, item.group, search);
                    ul.setAttribute("data-group", item.group);
                    root.appendChild(ul);
                }

                // Create Item
                li = (cb_item || this.createItem).call(this, item, ul, search);
                li.setAttribute("data-key", item.key);
                li.setAttribute("data-group", item.group);
                li.addEventListener("click", function(event){
                    self.bind.call(self, event, this);
                });
                ul.appendChild(li);

                // Container
                if(item.selected){
                    this.setContainer(item, "select");
                }
            }

            // Empty | Select All
            var count = root.querySelectorAll("*[data-key]").length;
            if(count == 0){
                li = d.createElement("LI");
                li.innerText = __("empty");
                li.className = "tail-dropdown-empty";
                root.appendChild(li);
            } else if(this.con.multiple && this.con.multiLimit < 0 && this.con.multiSelectAll){
                a1 = d.createElement("BUTTON"), a2 = d.createElement("BUTTON");
                a1.innerText = __("actionAll");
                a1.className = "tail-all";
                a1.addEventListener("click", function(event){
                    event.preventDefault();
                    var items = this.parentElement.parentElement.querySelectorAll("*[data-key]");
                    for(var l = items.length, i = 0; i < l; i++){
                        self.choose.call(self, "select", items[i].getAttribute("data-key"), items[i].getAttribute("data-group"));
                    }
                })
                a2.innerText = __("actionNone");
                a2.className = "tail-none";
                a2.addEventListener("click", function(event){
                    event.preventDefault();
                    var items = this.parentElement.parentElement.querySelectorAll("*[data-key]");
                    for(var l = items.length, i = 0; i < l; i++){
                        self.choose.call(self, "unselect", items[i].getAttribute("data-key"), items[i].getAttribute("data-group"));
                    }
                })

                // Add Element
                li = d.createElement("LI");
                li.className = "tail-dropdown-action";
                li.appendChild(a1);
                li.appendChild(a2);
                root.insertBefore(li, root.children[0]);
            }

            // Add and Return
            this.dropdown.querySelector(".tail-dropdown-inner").innerHTML = "";
            this.dropdown.querySelector(".tail-dropdown-inner").appendChild(root);
            this.setCSVInput().setCounter().setLabel();
            return this;
        },

        /*
         |  INTERNAL :: EVENT LISTENER
         |  @since  0.3.0
         |  @update 0.4.0
         */
        bind: function(event, item){
            if(event !== false){
                if(!item.hasAttribute("data-key")){
                    return false;
                }
                var key = item.getAttribute("data-key"), group = item.getAttribute("data-group") || "#";

                // Select Option
                if(!this.choose("toggle", key, group)){
                    return false;
                }
                if(this.con.stayOpen || this.con.multiple){
                    return true;
                }
                return this.close();
            }

            // Close
            var self = this;
            d.addEventListener("click", function(ev){
                if(!tail.hasClass(self.select, "active") || tail.hasClass(self.select, "idle")){
                    return false;
                }
                if(self.con.stayOpen){
                    return false;
                }

                var targets = [self.e, self.select, self.container];
                for(var l = targets.length, i = 0; i < l; i++){
                    if(targets[i] && (targets[i].contains(ev.target) || targets[i] == ev.target)){
                        return false;
                    }
                    if(!ev.target.parentElement){
                        return false;
                    }
                }
                return self.close.call(self);
            });

            // Bind Source Select
            if(!this.con.bindSourceSelect){
                return true;
            }
            this.e.addEventListener("change", function(event){
                var handle = function(options, selected){
                    var i, l, o, item, compare = self.options.selected.slice(0);
                    for(l = options.length, i = 0; i < l; i++){
                        o = options[i];
                        item = self.options.get(
                            (o.value || o.innerText),
                            (o.parentElement.tagName === "OPTGROUP")? o.parentElement.label: "#"
                        );
                        if(item == null){
                            continue;
                        }
                        if(!self.options.is("selected", item)){
                            self.options.handle("select", item)
                        }
                        if(compare.indexOf(o) >= 0){
                            compare.splice(compare.indexOf(o), 1);
                        }
                    }
                    for(i in compare){
                        self.options.handle("unselect", compare[i]);
                    }
                };

                if(!this.multiple && this.selectedIndex){
                    self.choose("select", this.options[this.selectedIndex]);
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
            return true;
        },

        /*
         |  INTERNAL :: INTERNAL CALLBACK
         |  @since  0.3.0
         |  @update 0.4.0
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

            // Handle
            this.setLabel().setCounter().setContainer(item, state).setCSVInput();
            this.trigger("change", item, state);
            return true;
        },

        /*
         |  INTERNAL :: TRIGGER EVENT HANDLER
         |  @since  0.4.0
         */
        trigger: function(event){
            tail.trigger(this.select, "tail.select::" + event, {
                bubbles: false, cancelable: true, detail: {args: arguments, self: this}
            });
            for(var l = (this.events[event] || []).length, i = 0; i < l; i++){
                this.events[event][i].cb.apply(this, (function(args, a, b){
                    for(var l = a.length, i = 0; i < l; ++i){
                        args[i-1] = a[i];
                    }
                    args[i] = b;
                    return args;
                }(new Array(arguments.length), arguments, this.events[event][i].args)));
            }
        },

        /*
         |  DEFAULT :: CALLBACK -> CREATE GROUP
         |  @since  0.4.0
         */
        createGroup: function(group, search){
            var ul = d.createElement("UL"), self = this;
                ul.className = "tail-dropdown-optgroup";
                ul.innerHTML = '<li class="tail-optgroup-title"><b>' + group + '</b></li>';
            if(this.con.multiple && this.con.multiLimit < 0 && this.con.multiSelectGroup){
                var a1 = d.createElement("BUTTON"), a2 = d.createElement("BUTTON");
                    a1.innerText = __("none");
                    a1.className = "tail-none";
                    a1.addEventListener("click", function(event){
                        event.preventDefault();
                        var items = this.parentElement.parentElement.querySelectorAll("*[data-key]");
                        for(var l = items.length, i = 0; i < l; i++){
                            self.choose.call(self, "unselect", items[i].getAttribute("data-key"), items[i].getAttribute("data-group"));
                        }
                    });
                    a2.innerText = __("all");
                    a2.className = "tail-all";
                    a2.addEventListener("click", function(event){
                        event.preventDefault();
                        var items = this.parentElement.parentElement.querySelectorAll("*[data-key]");
                        for(var l = items.length, i = 0; i < l; i++){
                            self.choose.call(self, "select", items[i].getAttribute("data-key"), items[i].getAttribute("data-group"));
                        }
                    });
                ul.children[0].appendChild(a1);
                ul.children[0].appendChild(a2);
            }
            return ul;
        },

        /*
         |  DEFAULT :: CALLBACK -> CREATE ITEM
         |  @since  0.4.0
         */
        createItem: function(item, optgroup, search){
            var li = d.createElement("LI");
                li.className = "tail-dropdown-option" + ((item.selected)? " selected": "") + ((item.disabled)? " disabled": "");

            // Inner Text
            if(search && search.length > 0 && this.con.searchMarked){
                li.innerHTML = item.value.replace(new RegExp("(" + search + ")", "i"), "<mark>$1</mark>");
            } else {
                li.innerText = item.value;
            }

            // Inner Description
            if(this.con.descriptions && item.description){
                li.innerHTML += '<span class="tail-option-description">' + item.description + '</span>';
            }
            return li;
        },

        /*
         |  PUBLIC :: SET / UPDATE LABEL
         |  @since  0.3.0
         |  @update 0.4.0
         |
         |  @param  multi   The string or translation key (tailSelect.strings)
         |                  NULL / UNDEFINED to update the label automatically.
         */
        setLabel: function(string){
            if(typeof(string) != "string"){
                if(this.dropdown.querySelectorAll("*[data-key]").length == 0){
                    string = "empty" + (tail.hasClass(this.select, "in-search")? "Search": "");
                } else if(this.con.multiLimit >= 0 && this.con.multiLimit <= this.options.selected.length){
                    string = "limit";
                } else if(this.con.multiple){
                    if(typeof(this.con.placeholder) == "string" && this.con.placeholder.length > 0){
                        string = this.con.placeholder;
                    } else {
                        string = "placeholder" + (this.con.multiple && this.con.multiLimit >= 0? "Multi": "");
                    }
                } else if(this.options.selected.length == 0){
                    string = "placeholder";
                } else {
                    string = this.options.selected[0].innerText;
                }
            }
            string = __(string).replace(":limit", this.con.multiLimit);
            this.label.querySelector(".tail-label-inner").innerText = string;
            return this;
        },

        /*
         |  PUBLIC :: SET / UPDATE COUNTER
         |  @since  0.3.0
         |  @update 0.4.0
         */
        setCounter: function(count){
            if(this.label.querySelector(".tail-label-count")){
                count = (count == undefined)? (this.options.selected || []).length: count;
                this.label.querySelector(".tail-label-count").innerText = count;
            }
            return this;
        },

        /*
         |  PUBLIC :: SET / UPDATE CONTAINER
         |  @since  0.3.0
         |  @update 0.4.1
         */
        setContainer: function(item, state){
            if(this.container){
                var self = this, hndl = d.createElement("DIV"), selector;
                if(state == "select"){
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
                    selector = "[data-group='" + item.group + "'][data-key='" + item.key + "']";
                    if(hndl = this.container.querySelector(selector)){
                        hndl.parentElement.removeChild(hndl);
                    }
                }
            }
            return this;
        },

        /*
         |  PUBLIC :: SET / UPDATE CSV INPUT FIELD
         |  @since  0.4.0
         */
        setCSVInput: function(){
            if(this.csvInput && this.con.csvOutput && ["select", "unselect"].indexOf(state) >= 0){
                var selected = [];
                for(var l = this.options.selected.length, i = 0; i < l; i++){
                    selected.push(this.options.selected[i].value);
                }
                this.csvInput.value = selected.join(this.con.csvSeparator || ",");
            }
            return this;
        },

        /*
         |  PUBLIC :: CHOOSE AN OPTION
         |  @since  0.3.0
         |  @update 0.4.0
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
                    this.choose(state, key[k][0], key[k][1] || "#")
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
         |  PUBLIC :: OPEN DROPDOWN
         |  @since  0.3.0
         |  @update 0.4.0
         */
        open: function(animate){
            if(tail.hasClass(this.select, "active") || tail.hasClass(this.select, "idle")){
                return false;
            }

            // Calculate Dropdown Height
            var clone = this.dropdown.cloneNode(true);
                clone.style.cssText = "height:auto;opacity:0;display:block;visibility:hidden;";
                clone.style.maxHeight = this.con.height + "px";
                clone.className += " cloned";
            this.dropdown.parentElement.appendChild(clone);
            var height = this.con.height, search = 0;
                height = (height > clone.clientHeight)? clone.clientHeight: height;
            if(this.con.search){
                search = clone.querySelector(".tail-dropdown-search").clientHeight;
            }
            this.dropdown.parentElement.removeChild(clone);

            // Calculate Viewport
            var pos = this.select.getBoundingClientRect(),
                bottom = w.innerHeight-(pos.top+pos.height),
                view = ((height+search) > bottom)? pos.top > bottom: false;
            if(this.con.openAbove === true || (this.con.openAbove !== false && view)){
                view = true;
                height = Math.min((height), pos.top-10);
                tail.addClass(this.select, "open-top");
            } else {
                view = false;
                height = Math.min((height), bottom-10);
                tail.removeClass(this.select, "open-top");
            }
            this.dropdown.style.maxHeight = height + "px";
            this.dropdown.querySelector(".tail-dropdown-inner").style.maxHeight = height-search-2 + "px";

            // Final Function
            var final = function(){
                tail.addClass(tail.removeClass(self.select, "idle"), "active");
                this.dropdown.style.height = "auto";
                this.label.removeAttribute("style");
                if(this.con.search && this.con.searchFocus){
                    this.dropdown.querySelector("input").focus();
                }
                this.trigger.call(this, "open");
            }, self = this;

            // Open
            if(this.con.animate && animate !== false){
                this.label.style.zIndex = 25;
                this.dropdown.style.cssText += "height:0;display:block;overflow:hidden;";

                tail.addClass(self.select, "idle");
                tail.animate(this.dropdown, function(){
                    var h = parseInt(this.style.height, 10), m = parseInt(this.style.maxHeight, 10);
                    if(h < m){
                        this.style.height = ((h+50 > m)? m: h+50) + "px";
                        return true;
                    }
                    final.call(self);
                    return false;
                });
            } else {
                final.call(this);
            }
            return this;
        },

        /*
         |  PUBLIC :: CLOSE DROPDOWN
         |  @since  0.3.0
         |  @update 0.4.0
         */
        close: function(animate){
            if(!tail.hasClass(this.select, "active") || tail.hasClass(this.select, "idle")){
                return false;
            }
            var final = function(){
                tail.removeClass(tail.removeClass(this.select, "idle"), "active");
                this.dropdown.removeAttribute("style");
                this.dropdown.querySelector(".tail-dropdown-inner").removeAttribute("style");
                this.trigger.call(this, "close");
            }, self = this;

            // Close
            if(this.con.animate && animate !== false){
                tail.addClass(this.select, "idle");
                tail.animate(this.dropdown, function(){
                    if((parseInt(this.offsetHeight, 10)-50) > 0){
                        this.style.height = (parseInt(this.offsetHeight, 10)-50) + "px";
                        return true;
                    }
                    final.call(self);
                    return false;
                }, 1, true);
            } else {
                final.call(this);
            }
            return this;
        },

        /*
         |  PUBLIC :: TOGGLE DROPDOWN
         |  @since  0.3.0
         |  @update 0.4.0
         */
        toggle: function(animate){
            if(tail.hasClass(this.select, "idle")){
                return false;
            }
            if(!tail.hasClass(this.select, "active")){
                return this.open(animate);
            }
            return this.close(animate);
        },

        /*
         |  PUBLIC :: REMOVE SELECT
         |  @since  0.3.0
         |  @update 0.4.0
         */
        remove: function(){
            this.e.style.removeProperty("display");
            this.e.removeAttribute("data-tail-select");
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
         |  PUBLIC :: RELOAD SELECT
         |  @since  0.3.0
         |  @update 0.4.0
         */
        reload: function(){
            this.remove();
            return this.init();
        },

        /*
         |  PUBLIC :: GET|SET CONFIG
         |  @since  0.4.0
         */
        config: function(key, value){
            if(typeof(key) == "undefined"){
                return this.con;
            } else if(!(key in this.con)){
                return false;
            }

            // Set | Return
            if(typeof(value) == "undefined"){
                return this.con[key];
            }
            this.con[key] = value;
            return this;
        },

        /*
         |  PUBLIC :: CUSTOM EVENT LISTENER
         |  @since  0.4.0
         |
         |  @param  string  'open', 'close', 'change'
         |  @param  callb.  A custom callback function.
         |  @param  array   An array with own arguments, which should pass to the callback too.
         */
        on: function(event, callback, args){
            if(["open", "close", "change"].indexOf(event) < 0 || typeof(callback) != "function"){
                return false;
            }
            if(!(event in this.events)){
                this.events[event] = [];
            }
            this.events[event].push({cb: callback, args: (args instanceof Array)? args: []});
            return this;
        }
    };

    /*
     |  TAIL.OPTIONS HANDLER
     */
    tailOptions.prototype = {
        /*
         |  INTERNAL :: REPLACE TYPOs
         |  @since  0.3.0
         |  @update 0.4.0
         */
        _replaceTypo: function(state){
            return state.replace("disabled", "disable").replace("enabled", "enable")
                        .replace("selected", "select").replace("unselected", "unselect");
        },

        /*
         |  INIT OPTIONS CLASS
         |  @since  0.3.0
         |  @update 0.4.0
         */
        init: function(){
            this.length = 0;
            this.selected = [];
            this.disabled = [];
            this.items = {"#": {}};
            this.groups = {};

            // Set Items
            for(var l = this.select.options.length, i = 0; i < l; i++){
                this.set(this.select.options[i]);
            }
            if(!this.self.con.multiple && !this.self.con.deselect && this.selected.length == 0){

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
         |  @update 0.4.1
         |
         |  @param  object  The <option> element within the respective <select> field.
         |  @param  bool    TRUE to reBuild tail.select, FALSE to do it not.
         |
         |  @return bool    Returns true if the option could be added, false if not.
         */
        set: function(opt, rebuild){
            var key = opt.value || opt.text, group = opt.parentElement, self = this.self, changed = false;
                group = ((group.tagName == "OPTGROUP")? group.label: "#");

            // Check Group
            if(group != "#" && !(group in this.groups)){
                this.items[group] = {};
                this.groups[group] = opt.parentElement;
            } else if(key in this.items[group]){
                return false;
            }

            // Selection
            opt.selected = (self.con.multiple || self.con.deselect)? opt.hasAttribute("selected"): opt.selected;

            if(self.con.multiple && this.self.con.multiLimit >= 0){
                if(this.self.con.multiLimit <= this.selected.length){
                    changed = true;
                    opt.selected = false;
                }
            }

            // Sanitize Description
            if(opt.hasAttribute("data-description")){
                var span = d.createElement("SPAN");
                    span.innerHTML = opt.getAttribute("data-description");
                opt.setAttribute("data-description", span.innerHTML);
            }

            // Add Item
            this.items[group][key] = {
                key: key,
                value: opt.text,
                description: opt.getAttribute("data-description") || null,
                group: group,
                option: opt,
                optgroup: (group != "#")? this.groups[group]: undefined,
                selected: opt.selected,
                disabled: opt.disabled
            }
            if(changed || opt.selected){
                this.handle("select", key, group);
            }
            if(opt.disabled){
                this.handle("disable", key, group);
            }
            this.length++;
            if(rebuild){
                this.self.callback.call(this.self, this.items[group][key], "rebuild");
            }
            return true;
        },

        /*
         |  ADD (CREATE) A NEW OPTION
         |  @since  0.3.0
         |  @update 0.4.0
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

            // Add Option and Return
            if(group == "#"){
                this.select.appendChild(option)
            } else {
                this.groups[group].appendChild(option)
            }
            return this.set(option, true);
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
         |  @update 0.4.0
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

                if(this.selected.indexOf(item.option) < 0){
                    this.selected.push(item.option);
                }
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
         |  @update 0.4.2
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
                    var regex = "<.*?value=\"(" + search + ")\".*?>";
                } else if(keys == "optional" || keys == "eitheror"){
                    var regex = "<.*?(?:value=\"(" + search + "))?\".*?>";
                } else {
                    var regex = "<.*?>";
                }
                regex += "([^<>]*(" + search + ")" + (keys == "eitheror"? "?": "") + ")[^<>]*<\/option>";
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
                item = this.get(this.self.e.options[num-1]);
                if(item === null){
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
         |  @update 0.4.0
         |
         |  @param  string  <see finder()>
         |  @param  string  <see finder()>
         */
        find: function(search, keys, groups){
            var items = [];
            while((item = this.finder(search, keys)) !== false){
                items.push(item);
            }
            return items;
        },

        /*
         |  NEW OPTIONS WALKER
         |  @since  0.4.0
         |
         |  @param  multi   Use "ASC" or "DESC" or pass an own callback function.
         |  @param  multi   Use "ASC" or "DESC" or pass an own callback function.
         |
         |  @return multi   Walks through each single options and returns false on the end!
         */
        walker: function(orderi, orderg){
            if(typeof(this._inLoop) != "undefined" && this._inLoop){
                if(this._inItems.length > 0){
                    var key = this._inItems.shift();
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
                    if(orderi == "ASC"){
                        keys.sort();
                    } else if(orderi == "DESC"){
                        keys.sort().reverse();
                    } else if(typeof(orderi) == "function"){
                        keys = orderi.call(this, keys);
                    }
                    this._inItems = keys;
                    this._inGroup = group;
                    return this.walker(null, null);
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
            if(orderg == "ASC"){
                groups.sort();
            } else if(orderg == "DESC"){
                groups.sort().reverse();
            } else if(typeof(orderg) == "function"){
                groups.orderg.call(this);
            }
            groups.unshift("#");

            // Init Loop
            this._inLoop = true;
            this._inItems = [];
            this._inGroups = groups;
            return this.walker(orderi, null);
        },

        /*
         |  WALK THROUGH ALL OPTIONs
         |  @since  0.3.0
         |  @update 0.4.0   DEPRECATED
         */
        walk: function(item_order, group_oder, deprecated){
            return this.walker(item_order, group_order);
        }
    }

    // Return
    return tailSelect;
}));
