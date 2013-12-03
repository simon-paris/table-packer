table-packer
============

A simple, pure JS UI layout library for HTML5 canvas and non browser based
JavaScript. Currently a WIP. Use with caution.

###TODO list:
 * Tests
 * Vertical alignment
 * Better demo


##Documentation
###Creating a new table

```javascript
    var table = new TablePacker(xPos, yPos, width, height);
```
Where xPos and yPos represent the top-left corner of the table.

###Adding things

To add an item to the table, use the `add` method.

```javascript
    table.add(myItem);
```

You can set horizontal alignments using the `left` and `right` functions. You can also
set the margin to one value on all sides using the `margin` function with one parameter. 
The below snippet aligns left with 10 margin.

```javascript
    table.add(myItem).margin(10).left();
```

You can also set individual margins. Valid margin sides are "left", "right", "top" and "bottom".

```javascript
    table.add(myItem).margin("left", 10);
```

The `row` function completes the current row and starts a new one. The height of a row is
is the height of the highest item including margins. If the current row is epty, the `row`
function returns it.

```javascript
    table.row();
```

The `row` function also returns a row object. You can set the margins on rows just like cells.
You can also add cells to rows after advancing to the next row. To do this, you need to pass in a
cell object, not just your item. If the item does not fit, it will ignore your overflowPolicy setting
and do something similar to to SQUASH policy. For example, in this snippet, we add an item to a
row that is already completed.

```javascript
    var row = table.row();
    table.add(myItem1);
    row.add(new TablePacker.Cell(table, myItem2);
```


###Laying out items

Once you've added everything to the table, call `layout`. It updates the position of each element.

```javascript
    table.layout();
```

###Setting default values

The TablePacker.defaults object describes default settings. As well as default margins and alignments,
it contains accessor functions that are used to get and set the x, y, height and width values. You can
change them to suit your own data structures.

```javascript
    TablePacker.defaults.align = "center";
    TablePacker.defaults.margin = 0;
    TablePacker.defaults.rowMargin = 10
    TablePacker.defaults.getX = function (o) { return o.position.x; };
    TablePacker.defaults.getY = function (o) { return o.position.y; };
    TablePacker.defaults.setX = function (o, x) { o.position.x = x; };
    TablePacker.defaults.setY = function (o, y) { o.position.y = y; };
    TablePacker.defaults.getWidth = function (o)  { return o.width; };
    TablePacker.defaults.getHeight = function (o) { return o.height;};
    TablePacker.defaults.overflowPolicy = TablePacker.OVERFLOW_POLICY.NEW_ROW;
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





