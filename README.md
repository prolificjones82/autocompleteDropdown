# Autocomplete Dropdown

## What is it?

This is a small jQuery plugin to designed to allow you to search through huge dropdown lists such as country lists in a typeahead style.

An additional feature is the ability to add a value if that value doesn't exist in the dropdown, making it useful for all dropdowns!

### Usage
---
Include the stylesheet in the header:

```html
<link rel="stylesheet" href="dist/css/autocompleteDropdown.css" />
```

The add jQuery (if needed) and the script to the footer of your page:

```html
<script src="jquery.1.11.min.js"></script>
<script src="dist/js/autocompleteDropdown-min.js"></script>
```

To add autocompletion to any of your select dropdowns simply give them a class of ```autocomplete```:

```html
<select class="autocomplete">
	<option value="something">Something</option>
</select>
```

On form submission the plugin will send across the options value the same as a standard dropdown. If you have added an option using the *Add New* function that option will send the text you had entered when you clicked *Add*.

### Preselecting Values
---

To preselect a value is simple. When displaying the dropdown simply add the ```selected``` to the option you require. This is useful for a page that includes multiple dropdown boxes with various contents.

```html
<select class="autocomplete">
	<option value="something" selected>Something</option>
	<option value="something-else">Something Else</option>
	<option value="another-thing">Another Thing</option>
</select>
```

### Placeholder text
---

You can specify your placeholder text in a number of ways. The easiest way it to add an option without a ```value``` and add the class of ```label```.

```html
<select class="autocomplete">
	<option class="label">Search...</option>
	<option value="something">Something</option>
	<option value="something-else">Something Else</option>
	<option value="another-thing">Another Thing</option>
</select>
```
The other option is to add a global placeholder text, this is done when initiating the plugin itself.

```javascript
$('select').autocompleteDropdown({
	customPlaceholderText: "Search...",
});
```

### Plugin Options
---

Most options have to be set globally when initiating the plugin, however a select few can be set on a select dropdown itself using _data-*_ attributes.

```javascript
$('select').autocompleteDropdown({
	customPlaceholderText: "Search...",
	wrapperClass: 'autocomplete-dropdown',
	inputClass: 'acdd-input',
	allowAdditions: true,
	noResultsText: 'No results found',
	onChange: function() {
		window.console.log('select has changed');
	},
	onSelect: function() {
		window.console.log('an option has been selected');
	},
});
```

#### Options Details

| Option                | Type     | Default               | Description                                                                                                        |
|-----------------------|----------|-----------------------|--------------------------------------------------------------------------------------------------------------------|
| customPlaceholderText | String   | false                 | Global text added to each autocomplete input field as placeholder text.                                            |
| wrapperClass          | String   | autocomplete-dropdown | Class used to target styles for the dropdown (Note: if this is changed the included stylesheet will need updating. |
| inputClass            | String   | null                  | Class used to enable style targeting of the autocomplete input field.                                              |
| allowAdditions        | Boolean  | true                  | Allow additions to the select field.                                                                               |
| noResultsText         | String   | No results found      | If ```allow additions``` is false, this is shown in place of the "Add ***" option.                                 |
| onChange              | Function | null                  | Add callback function to the select field onChange function.                                                       |
| onSelect              | Function | null                  | Add a callback to the click of the "Add ***" link. Only applicable if ```allowAdditions``` is set to ```true```    |

### Credit

Built and maintained by Lee Jones <mail@leejones.me.uk>
MIT License
