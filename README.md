table-packer
============

A simple, pure JS UI layout library for HTML5 canvas and non browser based
JavaScript. Currently a WIP. Use with caution.

###TODO list:
 * Tests
 * Demo program
 * Customizable output format
 * Vertical alignment
 * Margins on rows


##Documentation
###Creating a new table

```javascript
var table = new TablePacker(xPos, yPos, width, height);
```
Where xPos and yPos represent the top-left corner of the table.

###Adding things

This will add an object with center alignment and no margins.

```javascript
table.add(myItem);
```

You can set horizontal alignments using the `left` and `right` functions. The margin
function sets the margin to one value on all sides:

```javascript
table.add(myItem).margin(10).left();
```
You can also set individual margins.

```javascript
table.add(myItem).margin("left", 10);
```

The `row` function completes the current row and starts a new one. The height of a row is
is the height of the highest item including margins. Empty rows have no effect.

```javascript
table.row();
```

###Laying out items

Once you've added everything to the table, call `layout`. It updates the position of each element.

```javascript
table.layout();
```


###Other things

The `each` method is calls a function for each item in the table.

```javascript
table.each(function(item) { /* Do stuff with item */ });
```


The `setBounds` function can resize the table.

```setBounds
table.setBounds(xPos, yPos, width, height);
```





