require(["prism.min", "menuspy.min", "tail.demo", "source/tail.select"], function(prism, menu, website, select){
    "use strict";
    var w = window, d = window.document;
    var href = window.location.href.slice(0, window.location.href.lastIndexOf("/")+1);
    var ajax = function(value, callback, argument){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                callback(JSON.parse(this.responseText), argument);
            }
        };
        xhttp.open("GET", href + "assets/data/demo." + value + ".json", true);
        xhttp.send();
    }
    website();

    tail.select(".select")
    tail.select(".select-search", {
        search: true
    });
    tail.select("#select-special", {
        search: true,
        animate: true,
        descriptions: true
    });
    tail.select(".select-description", {
        search: true,
        descriptions: true
    });
    tail.select(".select-deselect", {
        search: true,
        descriptions: true,
        deselect: true,
    });
    tail.select(".select-limit", {
        search: true,
        descriptions: true,
        multiLimit: 10
    });
    tail.select(".select-move", {
        search: true,
        descriptions: true,
        hideSelected: true,
        hideDisabled: true,
        multiLimit: 15,
        multiShowCount: false,
        multiContainer: ".tail-move-container"
    });

    // tail.select Element
    var mani = tail.select(".select-manipulatable", {
        search: true,
        descriptions: true,
        multiLimit: 15,
        animate: true
    });

    // Action Buttons
    var buttons = d.querySelectorAll("button[data-select]"), l = buttons.length;
    for(var i = 0; i < l; i++){
        buttons[i].addEventListener("click", function(event){
            if(this.disabled){
                return;
            }
            event.preventDefault();
            event.stopPropagation(); // Prevent document handler.
            action = this.getAttribute("data-select"),
            value  = this.getAttribute("data-value") || null;

            if(action == "open"){
                mani.open();
            } else if(action == "close"){
                mani.close();
            } else if(action == "toggle"){
                mani.toggle();
            } else if(action == "remove"){
                for(var b = 0; b < l; b++){
                    if(buttons[b].getAttribute("data-select") == "reinit"){
                        buttons[b].disabled = false;
                    } else {
                        buttons[b].disabled = true;
                    }
                }
                mani.remove();
            } else if(action == "reinit"){
                for(var b = 0; b < l; b++){
                    if(buttons[b].getAttribute("data-select") == "reinit"){
                        buttons[b].disabled = true;
                    } else {
                        buttons[b].disabled = false;
                    }
                }
                mani.init();
            } else if(action == "onload"){
                this.disabled = true;
                this.className = this.className.replace("button-red", "loading");

                var items = mani.options.items[this.getAttribute("data-group")];
                for(var key in items){
                    mani.options.remove(key, items[key].group);
                }
                this.setAttribute("data-select", "load");
                this.removeAttribute("data-group");
                this.disabled = false;
                this.innerText = this.innerText.replace("Unload", "Load");
                this.className = this.className.replace("loading", "").trim();
            } else if(action == "load"){
                this.disabled = true;
                this.className += " loading";

                ajax(value, function(items, element){
                    var group = null;
                    for(var l = items.length, i = 0; i < l; i++){
                        mani.options.add(items[i].value, items[i].text, items[i].group, false, false, items[i].desc);
                        if(group == null){
                            group =items[i].group;
                        }
                    }
                    element.disabled = false;
                    element.setAttribute("data-select", "onload");
                    element.setAttribute("data-group", group);
                    element.innerText = element.innerText.replace("Load", "Unload");
                    element.className = element.className.replace("loading", "button-red");
                }, this);
            }
        });
    }
});
