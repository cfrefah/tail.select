/*
 *	TAIL.SELECT 0.2.0
 *	Copyright © 2014 - 2015 SamBrishes and pytesNET.
 *	Released under the MIT license.
 */
(function(){
	var $, tailMS;
	
	function tailSelect(){
		var _this = this;
		
		this.data = {};
		this.count = 0;
		
		this.tail = "data-tail";
		this.select = "data-select";
		this.options = {
			"single_deselect":		false,
			"multi_limit":			0,
			"multi_show_count":		true,
			"multi_hide_selected":	true,
			"multi_move_to":		"",
			"width":				"",
			"height":				"200px",
			"copy_class":			false,
			"description":			false,
			"hide_disabled":		false,
			"hide_on_mobile":		true,
			"hide_on_unsupported":	true,
			"text_empty":			"No options available...",
			"text_limit":			"You can't select more options!",
			"text_placeholder":		"Select an option..."
		};
		this.mobile = this.browser(true);
		this.supported = this.browser(false);
		
		$(document).bind("mousedown keydown", function(event){
			if(event.type == "keydown" && event.keyCode == 27){
				if($("div.tailms-select.tailms-status-open").length > 0){
					_this.change_status($("div.tailms-select.tailms-status-open").attr(_this.tail), "close");
				};
			};
			
			if(event.type == "mousedown"){
				if(!$(event.target).closest("div.tailms-select").length && $("div.tailms-select.tailms-status-open").length > 0){
					_this.change_status($("div.tailms-select.tailms-status-open").attr(_this.tail), "close");
				};
			};
		});
	};
	
	tailSelect.prototype.browser = function(mobile){
		if(mobile === true){
			try{
				document.createEvent("TouchEvent");
				return true;
			} catch(e) {
				return false;
			};
		} else {
			if(navigator.appVersion.search(/MSIE /) !== -1){
				var max = navigator.appVersion.length;
				var num = navigator.appVersion.search(/MSIE /);
				var version = navigator.appVersion.slice(num, max).replace(/MSIE /, "");
				version = version.split("."); version = (version[0]*1);
				if(isNaN(version) === false && version >= 8){ return true; };
			};
			if(navigator.userAgent.search(/MSIE /) !== -1){
				var max = navigator.userAgent.length;
				var num = navigator.userAgent.search(/MSIE /);
				var version = navigator.userAgent.slice(num, max).replace(/MSIE /, "");
				version = version.split("."); version = (version[0]*1);
				if(isNaN(version) === false && version >= 8){ return true; };
			};
			if(navigator.userAgent.search(/OPR\//) !== -1){
				var max = navigator.userAgent.length;
				var num = navigator.userAgent.search(/OPR\//);
				var version = navigator.userAgent.slice(num, max).replace(/OPR\//, "");
				version = version.split("."); version = (version[0]*1);
				if(isNaN(version) === false && version >= 15){ return true; };
			};
			if(navigator.userAgent.search(/Firefox\//) !== -1){
				var max = navigator.userAgent.length;
				var num = navigator.userAgent.search(/Firefox\//);
				var version = navigator.userAgent.slice(num, max).replace(/Firefox\//, "");
				version = version.split("."); version = (version[0]*1);
				if(isNaN(version) === false && version >= 5){ return true; };
			};
			if(navigator.userAgent.search(/Chrome\//) !== -1){
				var max = navigator.userAgent.length;
				var num = navigator.userAgent.search(/Chrome\//);
				var version = navigator.userAgent.slice(num, max).replace(/Chrome\//, "");
				version = version.split("."); version = (version[0]*1);
				if(isNaN(version) === false && version >= 17){ return true; };
			};
			/*
			if(navigator.userAgent.search(/Opera\//) !== -1){
				var max = navigator.userAgent.length;
				var num = navigator.userAgent.search(/Version\//);
				var version = (navigator.userAgent.slice(num, max).replace(/Version\//, "")*1);
				if(version >= 11){ return true; };
			};
			*/
			return false;
		};
	};
	
	tailSelect.prototype.register = function(element, config){
		if(typeof($(element).attr(this.select)) !== "undefined" || !$(element).is("select")){
			return false;
		};
		var id = "select_" + this.count;
		
		var settings = $.extend({"multiple": false}, this.options);
		for(var key in settings){
			if(typeof(config) !== "undefined" && config.hasOwnProperty(key)){
				if(typeof(config.key) === typeof(settings.key)){
					settings[key] = config[key];
				};
			};
		};
		if(typeof($(element).attr("data-placeholder")) !== "undefined"){
			settings.text_placeholder = $(element).attr("data-placeholder");
		};
		if(typeof($.prop) !== "undefined"){
			if($(element).prop("multiple") === "multiple" || $(element).prop("multiple") === true){
				settings.multiple = true;
			};
		} else {
			// jQuery 1.6 Fix
			if($(element).attr("multiple") === "multiple" || $(element).attr("multiple") === true || typeof($(element).attr("multiple")) === "string"){
				settings.multiple = true;
			};
		};
		
		if(settings.hide_on_mobile === true  && this.mobile === true){
			return false;
		};
		if(settings.hide_on_unsupported === true  && this.supported === false){
			return false;
		};
		
		$(element).attr(this.select, id);
		$(element).hide();
		
		var add = {};
		add[id] = {
			"selector":		$("select" + "[" + this.select + "='" + id + "']"),
			"options":		settings,
			"objects":		{},
			"items":		{}
		};
		$.extend(this.data, add);
		
		this.count++; 
		this.create(id);
		this.bind(id);
		
		add[id].selector.trigger("tailSelect:ready", [
			id,	add[id].selector, add[id]
		]);
		
		return add[id]["selector"];
	};
	
	tailSelect.prototype.create = function(id){
		var data = this.data[id];
		var config = data.options;
		
		data.objects["select"] = $("<div />");
		data.objects["select"].attr(this.tail, id);
		data.objects["select"].addClass("tailms-select");
		if(config.copy_class === true){
			data.objects["select"].addClass(data.selector.attr("class"));
		};
		if(config.description === true){
			data.objects["select"].addClass("tailms-with-descriptions");
		};
		if(config.multiple == true){
			data.objects["select"].addClass("tailms-multiple");
		} else {
			data.objects["select"].addClass("tailms-single");
		};
		if(config.multiple == false && config.single_deselect === true){
			data.objects["select"].addClass("tailms-allow-deselect");
		};
		if(typeof(trim) === "undefined") {
			if(config.width.replace(/^\s+|\s+$/g, "") !== ""){
				data.objects["select"].css("width", config.width);
			};
		} else {
			if(config.width.trim() !== false){
				data.objects["select"].css("width", config.width);
			};
		};
		data.objects["container"] = $("<div />");
		data.objects["container"].addClass("tailms-option-container");
		data.objects["container"].prepend($("<ul />", {"class": "tailms-active-list"})).hide();
		data.objects["input"] = $("<div />");
		data.objects["input"].addClass("tailms-input");
		data.objects["list"] = $("<ul />");
		data.objects["list"].addClass("tailms-option-list").hide();
		data.objects["list"].css("height", "auto");
		data.objects["list"].css("max-height", "0px");
		data.objects["placeholder"] = $("<span />").addClass("tailms-input-placeholder");
		data.objects["placeholder"].text(config.text_placeholder);
		if(config.multiple === true && config.multi_show_count === true){
			if(config.multi_limit === 0){
				data.objects["placeholder"].text("(0) " + config.text_placeholder);
			} else {
				data.objects["placeholder"].text("(0/" + config.multi_limit + ") " + config.text_placeholder);
			};
			data.objects.text
		};
		data.objects["puller"] = $("<span />");
		data.objects["puller"].addClass("tailms-input-puller");
		
		data.objects["list"].prependTo(data.objects["input"]);
		data.objects["placeholder"].prependTo(data.objects["input"]);
		data.objects["puller"].prependTo(data.objects["input"]);
		data.objects["input"].prependTo(data.objects["select"]);
		data.objects["container"].prependTo(data.objects["select"]);
		$(data.selector).after(data.objects["select"]);
		return this.reload(id);
	};
	
	tailSelect.prototype.reload = function(id){
		var data = this.data[id];
		var list = $(data.selector).clone();
		var items = {};
		
		for(var i = 0; i < $(list).find("option").length; i++){
			var item = $(list).find("option").eq(i);
			
			var single = false;
			items[i] = {
				"label":	"",
				"value":	"",
				"group":	false,
				"number":	i,
				"description": "",
				"selected": false,
				"disabled": false
			};
			
			items[i].label = $(item).text();
			if(typeof($(item).attr("value")) !== "undefined"){
				items[i].value = $(item).attr("value").replace(/"/g, "").replace(/'/g, "");
			} else {
				items[i].value = items[i].label.replace(/"/g, "").replace(/'/g, "");
			};
			$(data.selector).find("option").eq(i).attr("data-option", i);
			if($(item).parent().is("optgroup")){
				if(typeof($(item).parent().attr("label")) !== "undefined"){
					items[i].group = $(item).parent().attr("label");
				};
			};
			if(typeof($(item).attr("data-description")) !== "undefined"){
				items[i].description = $(item).attr("data-description").replace(/"/g, "").replace(/'/g, "");
			};
			if((typeof($.prop) !== "undefined" && $(item).prop("disabled") === true) || $(item).attr("disabled") === true){
				items[i].disabled = true;
			};
			if((typeof($.prop) !== "undefined" && ($(item).prop("selected") === true || $(data.selector).val() == $(item).attr("value"))) || $(item).attr("selected") === true){
				if(data.options.multiple == false){
					if(single == false){
						items[i].selected = true;
					} else {
						$(data.selector).find("option").eq(i).removeAttr("selected");
					};
					single = true;
				} else {
					items[i].selected = true;
				};
			};
		};
		data.items = items;
		
		if($.isEmptyObject(items)){
			return this.action_empty(id);
		};
		return this.render_list(id, items);
	};
	
	tailSelect.prototype.render_list = function(id, items){
		var data = this.data[id];
		var list = $(data.objects.list);
		
		if($(list).children("li").length > 0){
			$(list).children("li").remove();
		};
		
		var group = ""; var groupselector = "";
		$.each(items, function(index){
			var option = $("<li />").addClass("tailms-option");
			option.attr("data-value", this.value);
			option.attr("data-number", this.number);
			option.attr("data-disabled", "false");
			option.attr("data-selected", "false");
			
			var label = $("<span />").addClass("tailms-option-label");
			label.text(this.label).appendTo(option);
			
			if(data.options.description === true && this.description !== ""){
				var description = $("<span />").addClass("tailms-description");
				description.text(this.description).appendTo(option);
			};
			
			if(this.group !== false){
				if(this.group !== group){
					var optgroup = $("<li />").addClass("tailms-optgroup");
					optgroup.attr("data-label", this.group);
					
					var grouplabel = $("<span />").addClass("tailms-optgroup-label");
					grouplabel.text(this.group).appendTo(optgroup);
					
					groupselector = $("<ul />").addClass("tailms-option-sublist");
					groupselector.appendTo(optgroup);
					
					group = this.group;
					$(list).append(optgroup);
				};
				$(groupselector).append(option);
			} else {
				$(list).append(option);
			};
		});
		
		var _this = this;
		$.each(items, function(index){
			var item = $(list).find("li[data-number=" + this.number + "]");
			
			if(this.disabled === true){
				_this.action_disable(id, item);
			};
			if(this.selected === true){
				_this.action_select(id, item);
			};
		});
		return;
	};
	
	tailSelect.prototype.bind = function(id){
		var _this = this; 
		var data = this.data[id];
		
		$(data.objects.input).bind("mousedown", {"id":id}, function(event){
			if(event.which === 1 && $(event.target).is("div.tailms-input, span.tailms-input-placeholder, span.tailms-input-puller")){
				event.preventDefault();
				_this.change_status(event.data.id, "open", false);
			};
		});
		
		$(data.objects.list).find("li.tailms-option").bind("click", {"id":id}, function(event){
			event.preventDefault();
			_this.change_status(event.data.id, "select", this); 
		});
		
		if(data.options.multi_move_to === "container"){
			$(data.objects.container).find(".tailms-deselect").bind("click", {"id":id}, function(event){
				event.preventDefault();
				_this.change_status(event.data.id, "deselect", this); 
			});
		};
		
		if(typeof($.event.special.mousewheel) === "object"){
			$(data.objects.list).bind("mousewheel", function(event, data){
				var height = $(this).height();
				var scrollHeight = $(this).get(0).scrollHeight;
				
				if((this.scrollTop === (scrollHeight - height) && data < 0) || (this.scrollTop === 0 && data > 0)) {
					event.preventDefault();
				};
			});
		};
	};
	
	tailSelect.prototype.change_status = function(id, status, item){
		var data = this.data[id];
		
		if(status == "open"){
			if($(data.objects.select).hasClass("tailms-status-open")){
				$(data.objects.list).css("max-height", "0px");
				$(data.objects.list).hide();
				$(data.objects.select).removeClass("tailms-status-open");
			} else {
				if($(".tailms-select").hasClass("tailms-status-open")){
					$(".tailms-select").find(".tailms-option-list").css("max-height", "0px");
					$(".tailms-select").find(".tailms-option-list").hide();
					$(".tailms-select").removeClass("tailms-status-open");
				};
				
				var dataHeight = ""; var getHeight = "200px";
				if(typeof(trim) === "undefined") {
					if(data.options.height.replace(/^\s+|\s+$/g, "") !== ""){
						var getHeight = data.options.height.split(""); 
					};
				} else {
					if(data.options.height.trim() !== false){
						var getHeight = data.options.height.split(""); 
					};
				};
				
				for(var i = 0; i < getHeight.length; i++){
					var temp = getHeight[i];
					if(!isNaN(temp)){ dataHeight += temp; };
				};
				dataHeight = (dataHeight*1);
				
				
				var height = ($(data.objects.input).offset().top + $(data.objects.input).outerHeight() + dataHeight);
				var windowsHeight = ($(window).height()+$(window).scrollTop()-20);
				if(windowsHeight <= height){
					if(!$(data.objects.list).hasClass("tailms-view-top")){
						$(data.objects.list).addClass("tailms-view-top");
					};
				} else {
					if($(data.objects.list).hasClass("tailms-view-top")){
						$(data.objects.list).removeClass("tailms-view-top")
					};
				};
				
				$(data.objects.list).css("max-height", getHeight.join(""));
				$(data.objects.list).show();
				$(data.objects.select).addClass("tailms-status-open");
			};
		};
		
		if(status == "close"){
			$(data.objects.list).css("max-height", "0px");
			$(data.objects.list).hide();
			$(data.objects.select).removeClass("tailms-status-open");
		};
		
		if(status == "select"){
			if($(item).attr("data-selected") == "false"){
				this.action_select(id, item);
			} else {
				if(!(data.options.multiple === false && data.options.single_deselect === false)){
					this.action_deselect(id, item);
				};
			};
		};
		
		if(status == "deselect"){
			this.action_deselect(id, item);
		};
	};
	
	tailSelect.prototype.action_select = function(id, item){
		if(this.is_limit(id) || $(item).attr("data-disabled") === "true" || $(item).attr("data-selected") === "true"){
			return;
		};
		var data = this.data[id];
		var _this = this;
		
		if(data.options.multiple === false){
			if($(data.objects.list).find("li[data-selected='true']").length > 0){
				$.each($(data.objects.list).find("li[data-selected='true']"), function(index){
					_this.action_deselect(id, $(this).eq(index));
				});
			};
		};
		
		var option = $(data.selector).find("option[data-option='" + $(item).attr("data-number") + "']");
		if(typeof($.prop) !== "undefined"){
			$(option).prop("selected", true);
		};
		$(option).attr("selected", true); $(option).attr("selected", "selected");
		$(item).addClass("tailms-selected").attr("data-selected", "true");
		
		if(data.options.multiple === true && (data.options.multi_move_to === "top" || data.options.multi_move_to === "container")){
			var temp = $("<li />").addClass("tailms-option-dummy");
			temp.attr("data-holder", $(item).attr("data-number"));
			temp.hide().insertAfter($(item));
			
			if($(item).parent("ul").parent("li.tailms-optgroup").length > 0){
				if(data.options.hide_disabled === true){
					var count = $(item).parent("ul").children("li[data-selected='false'][data-disabled='false']").length;
				} else {
					var count = $(item).parent("ul").children("li[data-selected='false']").length;
				};
				if(count == 0){ $(item).parent("ul").parent(".tailms-optgroup").hide(); };
			};
			if(data.options.multi_move_to === "top"){
				$(item).prependTo($(data.objects.list));
			};
			if(data.options.multi_move_to === "container"){
				if($(data.objects.container).css("display") == "none"){
					$(data.objects.container).show();
				};
				$(item).append($("<span />", {"class": "tailms-close"})).appendTo($(data.objects.container).children("ul.tailms-active-list"));
			};
		};
		
		this.action_empty(id);
		this.action_placeholder(id, item);
		$(data.selector).trigger("tailSelect:change", [$(item), "selected", $(option)]);
		return;
	};
	
	tailSelect.prototype.action_deselect = function(id, item){
		if($(item).attr("data-disabled") === "true" || $(item).attr("data-selected") === "false"){
			return;
		};
		var data = this.data[id];
		
		if(data.options.multiple === true && (data.options.multi_move_to === "top" || data.options.multi_move_to === "container")){
			var temp = $(data.objects.list).find("li[data-holder='" + $(item).attr("data-number") + "']");
			if($(temp).parent("ul").parent("li.tailms-optgroup").length > 0){
				if($(temp).parent("ul").parent("li.tailms-optgroup").css("display") === "none"){
					$(temp).parent("ul").parent("li.tailms-optgroup").show();
				};
			};
			$(item).insertAfter($(temp));
			$(temp).remove();
			
			if(data.options.multi_move_to === "container"){
				$(item).children("span.tailms-close").remove();
				if($(data.objects.container).find("li").length == 0){
					$(data.objects.container).hide();
				};
			};
		};
		
		var option = $(data.selector).find("option[data-option='" + $(item).attr("data-number") + "']");
		if(typeof($.prop) !== "undefined"){
			$(option).prop("selected", false);
		};
		$(option).removeAttr("selected");
		$(item).removeClass("tailms-selected");
		$(item).attr("data-selected", "false");
		
		if(data.options.multiple === false){
			if($(data.selector).find("option[selected='selected']").length == 0){
				$(data.selector).selectedIndex = -1;
				$(data.selector).val([]);
			};
		};
		
		this.action_empty(id);
		this.action_placeholder(id, item);
		$(data.selector).trigger("tailSelect:change", [$(item), "deselected", $(option)]);
		return;
	};
	
	tailSelect.prototype.action_enable = function(id, item){
		if($(item).attr("data-disabled") === "false"){
			return;
		};
		var data = this.data[id];
		
		var option = $(data.selector).find("option[data-option='" + $(item).attr("data-number") + "']");
		$(option).removeAttr("disabled");
		$(item).removeClass("tailms-disabled");
		$(item).attr("data-disabled", "false");
		
		if($(item).parent("ul").parent("li.tailms-optgroup").length > 0){
			if($(item).parent("ul").parent("li.tailms-optgroup").css("display") === "none"){
				$(item).parent("ul").parent("li.tailms-optgroup").show();
			};
		};
		
		if(data.options.hide_disabled === true){ $(item).show(); };
		this.action_empty(id);
		this.action_placeholder(id, item);
		$(data.selector).trigger("tailSelect:change", [$(item), "enabled", $(option)]);
		return;
	};
	
	tailSelect.prototype.action_disable = function(id, item){
		if(typeof($(item).attr("data-number")) === "undefined" || $(item).attr("data-disabled") === "true"){
			return;
		};
		var data = this.data[id];
		
		var option = $(data.selector).find("option[data-option='" + $(item).attr("data-number") + "']");
		$(option).attr("disabled", true);
		$(option).attr("disabled", "disabled");
		$(item).addClass("tailms-disabled");
		$(item).attr("data-disabled", "true");
		$(option).removeAttr("selected");
		$(item).removeClass("tailms-selected");
		$(item).attr("data-selected", "false");
		
		if($(item).parent("ul").parent("li.tailms-optgroup").length > 0){
			if(data.options.hide_disabled === true){
				var count = $(item).parent("ul").children("li[data-selected='false'][data-disabled='false']").length;
			} else {
				var count = $(item).parent("ul").children("li[data-selected='false']").length;
			};
			if(count == 0){ $(item).parent("ul").parent(".tailms-optgroup").hide(); };
		};
		
		if(data.options.hide_disabled === true){ $(item).hide(); };
		this.action_empty(id);
		this.action_placeholder(id, item);
		$(data.selector).trigger("tailSelect:change", [$(item), "disabled", $(option)]);
		return;
	};
	
	tailSelect.prototype.action_empty = function(id){
		var data = this.data[id];
		var list = data.objects.list;
		
		if(data.options.hide_disabled === true){
			var counter = $(list).find("li.tailms-option[disabled='true']").length;
		} else {
			var counter = $(list).find("li.tailms-option").length;
		};
		
		if(counter === 0){
			if($(list).find("li.tailms-option-empty").length == 0){
				var li = $("<li />", {
					"class": "tailms-option-empty"
				}).text(data.options.text_empty);
				$(list).append(li);
			};
			$(data.selector).trigger("tailSelect:empty");
		} else {
			if($(list).find("li.tailms-option-empty").length != 0){
				$(list).find("li.tailms-option-empty").remove();
			};
		};
	};
	
	tailSelect.prototype.action_placeholder = function(id, item){
		var data = this.data[id];
		
		if(data.options.multiple === true){
			var text = "";
			var limit = data.options.multi_limit;
			var count = $(data.selector).find("option:selected").length;
			
			if(data.options.multi_show_count){
				text += "(" + count;
				if(limit !== 0){ text += "/" + limit; };
				text += ") ";
			};
			
			if(limit !== 0 && count >= limit){
				text += data.options.text_limit;
				$(data.objects.select).addClass("tailms-status-limit");
				$(data.selector).trigger("tailSelect:limit", [count, limit]);
			} else {
				text += data.options.text_placeholder;
				$(data.objects.select).removeClass("tailms-status-limit");
			};
			
			$(data.objects.placeholder).text(text);
		} else {
			if($(item).attr("data-selected") === "true"){
				$(data.objects.placeholder).text($(item).children("span.tailms-option-label").text());
			} else {
				$(data.objects.placeholder).text(data.options.text_placeholder);
			};
		};
	};
	
	tailSelect.prototype.action_remove = function(id){
		var data = this.data[id];
		
		$(data.objects.select).remove();
		$(data.selector).removeAttr(this.select);
		$(data.selector).show();
		delete this.data[id];
		this.count--;
		return true;
	};
	
	tailSelect.prototype.is_limit = function(id){
		var data = this.data[id];
		if(data.options.multiple === false || data.options.multi_limit === 0){ 
			return false; 
		};
		
		var limit = data.options.multi_limit;
		var count = $(data.selector).find("option:selected").length;
		
		if(count >= limit){
			return true;
		};
		return false;
	};
	
	tailSelect.prototype.functions = function(selector, action, option, value){
		if($.inArray(action, ["enable", "disable", "open", "close", "register", "reload", "remove"]) == -1){
			return false;
		};
		
		if(action === "register"){
			if(typeof($(selector).attr(this.select)) === "undefined"){
				this.register(selector, option);
			} else {
				return false;
			};
		};
		
		var id = $(selector).attr(this.select);
		if(typeof(id) === "undefined" || this.data.hasOwnProperty(id) === false){
			return false;
		};
		var data = this.data[id];
		
		if(action === "open" || action === "close"){
			this.change_status(id, action, false);
			return true;
		};
		if(action === "enable" || action == "disable"){
			if(option == "value" || option == "number" || option == "all"){
				if(option == "value" || option == "number"){
					if(typeof(value) === "string"){ value = [value]; };
				} else {
					option = "number"; value = [];
					$.each($(data.objects.list).find("li.tailms-option"), function(index){
						value[index] = $(this).attr("data-number");
					});
				};
				if($.isArray(value)){
					var temp;
					for(var i = 0; i < value.length; i++){
						if(option == "value"){ value[i].replace(/"/g, "").replace(/'/g, ""); };
						temp = $(data.objects.list).find("li.tailms-option[data-" + option + "='" + value[i] + "']");
						if(typeof(temp) !== "undefined"){
							if(action == "enable"){
								this.action_enable(id, temp);
							};
							if(action == "disable"){
								this.action_disable(id, temp);
							};
						};
					};
					return true;
				};
			};
		};
		if(action === "remove"){
			this.action_remove(id);
			return true;
		};
		if(action === "reload"){
			var temp = $.extend({}, data.options);
			this.action_remove(id);
			return this.register(selector, temp);
		};
		return false;
	};
	
	$ = jQuery;
	$.fn.extend({
		tailSelect: function(action, option, value){
			var data, temp;
			if(this.length > 1){ data = {}; };
			
			this.each(function(index){
				if(typeof(tailMS) == "undefined"){ tailMS = new tailSelect(); };
				if(typeof(action) == "undefined" || typeof(action) == "object"){
					temp = tailMS.register(this, action);
				} else {
					if($.inArray(action, ["enable", "disable", "open", "close", "register", "reload", "remove"]) > -1){
						temp = tailMS.functions(this, action, option, value);
					} else {
						temp = false;
					};
				};
				
				if(typeof(data) == "object"){
					data["element_" + index] = temp;
				} else {
					data = temp;
				};
				$(this).trigger("tailSelect:ready");
			});
			return data;
		}
	});
}).call(this);