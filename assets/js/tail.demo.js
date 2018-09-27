(function(window){
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
        hasClass: function(element, classname){
            var regex = new RegExp("(|\s+)" + classname + "(\s+|)");
            return regex.test(element.className);
        },
        addClass: function(element, classname){
            if(!this.hasClass(element, classname)){
                element.className = (element.className.trim() + " " + classname.trim()).trim();
            }
            return element;
        },
        removeClass: function(element, classname){
            var regex = new RegExp("(|\s+)(" + classname + ")(\s+|)");
            if(regex.test(element.className)){
                element.className = (element.className.replace(regex, "$1$3")).trim();
            }
            return element;
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

    // Ready
    d.addEventListener("DOMContentLoaded", function(){
        tail.each(d.querySelectorAll("*[data-tooltip]"), function(){
            this.addEventListener("mouseenter", tooltip);
            this.addEventListener("mouseleave", tooltip);
        });

        tail.each(d.querySelectorAll("*[data-handle='example']"), function(){
            this.addEventListener("click", function(event){
                event.preventDefault();

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
                    tail.addClass(container, "active");
                    container.style.height = height + "px";
                } else {
                    container.removeAttribute("style");
                    this.innerText = "Show Example Code";
                    tail.removeClass(container, "active");
                }
            });
        });
    });
})(this);
