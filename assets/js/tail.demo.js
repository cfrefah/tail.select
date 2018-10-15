;(function(factory){
    if(typeof(define) == "function" && define.amd){
        define(factory);                // AMD - Anonymous Module
    } else {
        window.document.addEventListener("DOMContentLoaded", function(){
            (factory())();
        });
    }
}(function(){
	"use strict";
    var w = window, d = window.document;

    /*
     |  HELPER METHODs
     */
    var tail = {
        each: function(elements, callback, end_callback){
            if(typeof callback !== "function"){
                return false;
            }

            if(elements instanceof HTMLElement || elements instanceof Element){
                callback.call(elements, 1);
            } else if(elements instanceof NodeList || elements instanceof HTMLCollection){
                for(var i = 0; i < elements.length; i++){
                    callback.call(elements[i], (i+1));
                }
            }
            if(typeof end_callback == "function"){
                end_callback.call(elements);
            }
        },
        hasClass: function(e, name){
            return (new RegExp("(|\s+)" + name + "(\s+|)")).test(e.className);
        },
        addClass: function(e, name){
            if(!(new RegExp("(|\s+)" + name + "(\s+|)")).test(e.className)){
                e.className = (e.className.trim() + " " + name.trim()).trim();
            }
            return e;
        },
        removeClass: function(e, name){
            var regex = new RegExp("(|\s+)(" + name + ")(\s+|)");
            if(regex.test(e.className)){
                e.className = (e.className.replace(regex, "$1$3")).trim();
            }
            return e;
        }
    };

	/*
	 |	TOOLTIP
	 */
    var tooltipID = 0,
        tooltip = function(event){
        event.preventDefault();
        if(event.type === "mouseenter"){
            if(!this.hasAttribute("data-tooltip-id")){
                var element = d.createElement("DIV");
                    element.id = "tooltip-" + ++tooltipID;
                    element.innerText = this.getAttribute("data-tooltip");
                    element.className = "tooltip";
                    element.style.opacity = 0;
                    element.style.display = "block";
                    d.body.appendChild(element);

                // Get Position
                var position = function(element){
                    var position = {
                        top:    element.offsetTop    || 0,
                        left:   element.offsetLeft   || 0,
                        width:  element.offsetWidth  || 0,
                        height: element.offsetHeight || 0
                    };
                    while(element = element.offsetParent){
                        position.top  += element.offsetTop;
                        position.left += element.offsetLeft;
                    }
                    return position;
                }(this);

                // Calculate Position
                element.style.top = (position.top + position.height) + "px";
                element.style.left = (position.left + (position.width / 2) - (element.offsetWidth / 2)) + "px";

                // Add to Element
                this.setAttribute("data-tooltip-id", "tooltip-" + tooltipID);
            }
            tail.addClass(d.querySelector("#" + this.getAttribute("data-tooltip-id")), "active");
        } else if(event.type === "mouseleave"){
            if(this.hasAttribute("data-tooltip-id")){
                var element = d.querySelector("#" + this.getAttribute("data-tooltip-id"));
                tail.removeClass(element, "active");
                this.removeAttribute("data-tooltip-id");
                (function(e){
                    setTimeout(function(){ e.parentElement.removeChild(e); }, 150);
                })(element);
            }
        }
    };

    /*
     |  TOGGLE SOURCE CODE
     */
    var source = function(event){
        var container = this.nextElementSibling;
        if(!tail.hasClass(container, "active")){
            var coptainer = container.cloneNode(true);
                coptainer.style.height = "auto";
                coptainer.style.position = "absolute";
                coptainer.style.visibility = "hidden";
                coptainer.className += " active";

            this.parentElement.appendChild(coptainer);
            var height = coptainer.offsetHeight;
            this.parentElement.removeChild(coptainer);

            this.innerText = "Hide Example Code";
            tail.addClass(this, "active");
            tail.addClass(container, "active");
            container.style.height = height + "px";
        } else {
            container.removeAttribute("style");
            this.innerText = "Show Example Code";
            tail.removeClass(this, "active");
            tail.removeClass(container, "active");
        }
    }

    // Init Website
    var tailDemo = function(){
        tail.each(d.querySelectorAll("ul.main-navi > li > ul.sub-navi"), function(){
            var clone = this.cloneNode(true);
                clone.style.zIndex = "-1";
                clone.style.opacity = "0";
                clone.style.display = "block";
                clone.style.visibility = "hidden";
                this.parentElement.appendChild(clone);
            var width = clone.offsetWidth;
                this.parentElement.removeChild(clone);
            this.style.left = "50%";
            this.style.marginLeft = "-" + (width/2) + "px";
        });

        // Init Tooltips
        tail.each(d.querySelectorAll("*[data-tooltip]"), function(){
            this.addEventListener("mouseenter", tooltip);
            this.addEventListener("mouseleave", tooltip);
        });

        // Init ScrollSpy
        tail.each(d.querySelector("*[data-handle='menuspy']"), function(){
            new MenuSpy(this);
        });

        // Toggle Source Code
        tail.each(d.querySelectorAll("*[data-handle='example']"), function(){
            this.addEventListener("click", source);
        });
    }
    tailDemo.version = "2.2.1";

    // Return
    return tailDemo;
}));
