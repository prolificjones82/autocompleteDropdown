# Autocomplete Dropdown

## What is it?
---

This is a small jQuery plugin to designed to allow you to search through huge dropdown lists such as country lists.

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

To add autocompletion to any of your select dropdowns simply give them a class of *autocomplete*:

```html
<select class="autocomplete">
	<option value="something">Something</option>
</select>
```

On form submission the plugin will send across the options value the same as a standard dropdown. If you have added an option using the *Add New* function that option will send the text you had entered when you clicked *Add*.

### Plugin Options

Most options have to be set globally when initiating the plugin, however a select few can be set on a select dropdown itself using _data-*_ attributes.

FEATURES TABLE GOES HERE

### Credit

Build and maintained by Lee Jones <mail@leejones.me.uk>
MIT License