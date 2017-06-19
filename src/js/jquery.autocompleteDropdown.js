/*
* AUTOCOMPLETE DROPDOWN - Use dropdowns as an autocomplete box, with the ability to add new options
* Version: 0.0.1 (IN DEVELOPMENT)
* License: MIT
* Author: Lee Jones <mail@leejones.me.uk>
* Website: http://leejones.me.uk/
* Copyright 2017 Lee Jones, All Rights Reserved
*/


(function($) {

	function AutocompleteDropdown()
	{
		this.customPlaceholderText = false,
		this.wrapperClass = 'autocomplete-dropdown',
		this.inputClass = false,
		this.onChange = null,
		this.allowAdditions = true,
		this.noResultsText = 'No results found',
		this.onSelect = null;
	}

	AutocompleteDropdown.prototype = {
		constructor: AutocompleteDropdown,
		instances: {},
		init: function(domNode, settings)
		{
			var self = this;
			$.extend(self, settings);
			self.isTouch = 'ontouchend' in document;
			self.$select = $(domNode);
			dataSettings = self.$select.data() || {}
			self.id = domNode.id;
			self.name = domNode.name;
			self.options = [];
			self.$options = self.$select.find('option');
			if(self.$select.is(':disabled')){
				self.disabled = true;
			}
			if (self.$options.length)
			{
				self.$options.each(function(i) {
					var $option = $(this);
					if($option.hasClass('label') && i === 0)
					{
						self.hasLabel = true;
						self.label = $option.text();
						$option.attr('value','');
					}
					else
					{
						self.options.push({
							domNode: $option[0],
							title: $option.text(),
							value: $option.val(),
							selected: $option.is(':selected')
						});
					}
					if($option.is(':selected') && !$option.hasClass('label'))
					{
						self.selected = {
							index: i,
							title: $option.text()
						};
						self.focusIndex = i;
					}
				});

				window.console.log(dataSettings);

				self.render();
			}
		},

		render: function()
		{
			var self = this,
				touchClass = self.isTouch && self.nativeTouch ? ' touch' : '',
				disabledClass = self.disabled ? ' disabled' : '',
				label = self.customPlaceholderText ? self.customPlaceholderText : self.hasLabel ? self.label : '',
				inputClass = self.inputClass ? self.inputClass : '';
			
			self.$container = self.$select.wrap('<div class="'+self.wrapperClass+disabledClass+touchClass+'"><div class="old" /></div>').parent().parent();
			self.$searchbox = $('<input type="text" class="'+inputClass+'" placeholder="'+label+'" />').appendTo(self.$container);
			self.$searchResults = $('<div class="results"><ul /></div>').appendTo(self.$container);
			self.$list = self.$searchResults.find('ul');
			if (self.selected)
			{
				self.$searchbox.val(self.selected.title);
			}

			self.bindHandlers();
		},

		getMaxHeight: function()
		{
			var self = this;
			
			self.maxHeight = 0;
			
			for(var i = 0; i < self.$items.length; i++)
			{
				var $item = self.$items.eq(i);
				self.maxHeight += $item.outerHeight();
				if(self.cutOff === i+1)
				{
					break;
				}
			}
		},

		bindTouchHandlers: function()
		{
			var	self = this;

			self.$container.on('click.autocompleteDropdown', function()
			{
				self.$select.focus();
			});

			self.$select.on({
				change: function()
				{
					var	$selected = $(this).find('option:selected'),
						title = $selected.text(),
						value = $selected.val();
						
					self.$searchbox.val(title);
					if(typeof self.onSelect === 'function')
					{
						self.onSelect.call(self.$select[0],{
							title: title, 
							value: value
						});
					}
				},
				focus: function()
				{
					self.$container.addClass('focus');
				},
				blur: function()
				{
					self.$container.removeClass('focus');
				}
			});
		},

		bindHandlers: function()
		{
			var self = this;

			self.$searchbox.on({
				'focus.autocompleteDropdown': function(){
					self.$container.addClass('focus');
					self.inFocus = true;
				},
				'blur.autocompleteDropdown': function(){
					self.$container.removeClass('focus');
					self.inFocus = false;
				},
				'keyup.autocompleteDropdown': function()
				{
					self.query = self.$searchbox.val().toUpperCase();
					if (self.query.length !== 0)
					{
						self.search();
					}
					else
					{
						self.close();
					}
				}
			});
		},

		unbindHandlers: function()
		{
			var self = this;
			
			self.$container
				.add(self.$select)
				.add(self.$searchbox)
				.off('.autocompleteDropdown');
		},

		open: function()
		{
			var self = this;

			self.$select.focus();
			self.$container.addClass('open');
			self.$searchResults.css('height',self.maxHeight+'px');
		},

		close: function()
		{
			var self = this;
			$(self.$searchResults.find('ul')).html('');
			self.$container.removeClass('open');
		},

		closeAll: function()
		{
			var self = this,
				instances = Object.getPrototypeOf(self).instances;
			
			for(var key in instances)
			{
				var instance = instances[key];
				instance.close();
			}
		},

		search: function()
		{
			var self = this,
				getTitle = function(i)
				{
					return self.options[i].title.toUpperCase();
				};

			var search = new RegExp(self.query.replace(/[^\w\s]/gi, ''), 'i');
			self.search_results = [];
			for(var i = 0; i < self.options.length; i++)
			{
				var title = getTitle(i);
				if (title.match(search))
				{
					self.search_results.push(self.options[i]);
				}
			}

			self.resultsNumber = self.search_results.length;

			$(self.$searchResults.find('ul')).html('');
			if (self.resultsNumber > 0)
			{
				$.each(self.search_results, function() {
					$('<li data-value="'+this.value+'">'+this.title+'</li>').appendTo(self.$searchResults.find('ul'));
				});
			}
			else if (self.allowAdditions === false || dataSettings.allowAdditions === false)
			{
				var noresults = self.noResultsText || dataSettings.noResultsText;
				$('<li>'+noresults+'</li>').appendTo(self.$searchResults.find('ul'));
			}
			else
			{
				$('<li>Add "'+self.$searchbox.val()+'"</li>').appendTo(self.$searchResults.find('ul'));
			}

			self.$results = self.$list.find('li');

			self.$results.on({
				'click': function() {
					var $this 		= $(this),
						value 		= $this.data('value'),
						text		= $this.text(),
						searchText	= self.$searchbox.val();
					
					if (value === '' || value === undefined)
					{
						$('<option value="'+searchText+'" selected></option>').appendTo(self.$select);
						self.$searchbox.val(searchText);
					}
					else
					{
						self.$select.val(value);
						self.$searchbox.val(text);
					}

					if(typeof self.onChange === 'function')
					{
						self.onChange.call(self.$select[0],{
							title: title, 
							value: value
						});
					}

					self.close();
				}
			});

			self.open();
		},

		notInViewport: function(scrollTop)
		{
			var self = this,
				range = {
					min: scrollTop,
					max: scrollTop + (window.innerHeight || document.documentElement.clientHeight)
				},
				menuBottom = self.$searchResults.offset().top + self.maxHeight;
				
			if(menuBottom >= range.min && menuBottom <= range.max)
			{
				return 0;
			}
			else
			{
				return (menuBottom - range.max) + 5;
			}
		},
		
		destroy: function()
		{
			var self = this;
			self.unbindHandlers();
			self.$select.unwrap().siblings().remove();
			self.$select.unwrap();
			delete Object.getPrototypeOf(self).instances[self.$select[0].id];
		},
	};

	var instantiate = function(domNode, settings)
	{
		domNode.id = !domNode.id ? 'AutocompleteDropdown'+rand() : domNode.id;
		var instance = new AutocompleteDropdown();
		if(!instance.instances[domNode.id])
		{
			instance.instances[domNode.id] = instance;
			instance.init(domNode, settings);
		}
	},
	rand = function()
	{
		return ('00000'+(Math.random()*16777216<0).toString(16)).substr(-6).toUpperCase();
	};
	
	$.fn.autocompleteDropdown = function()
	{
		var args = arguments,
			dataReturn = [],
			eachReturn;
			
		eachReturn = this.each(function()
		{
			if(args && typeof args[0] === 'string')
			{
				var data = AutocompleteDropdown.prototype.instances[this.id][args[0]](args[1], args[2]);
				if (data)
				{
					dataReturn.push(data);
				}
			}
			else
			{
				instantiate(this, args[0]);
			}
		});
		
		if(dataReturn.length)
		{
			return dataReturn.length > 1 ? dataReturn : dataReturn[0];
		}
		else
		{
			return eachReturn;
		}
	};

	$(function() {
		if(typeof Object.getPrototypeOf !== 'function')
		{
			if(typeof 'test'.prototype === 'object')
			{
				Object.getPrototypeOf = function(object)
				{
					return object.prototype;
				};
			}
			else
			{
				Object.getPrototypeOf = function(object)
				{
					return object.constructor.prototype;
				};
			}
		}
		
		$('select.autocomplete').each(function() {
			var json = $(this).attr('data-settings'),
				settings = json ? $.parseJSON(json) : {}; 
			instantiate(this, settings);
		});
	});
})(jQuery);