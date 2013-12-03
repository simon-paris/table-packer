
(function () {
    "use strict";
    
    
    
    /**
     * Class: TablePacker
     * 
     * A dead simple library for laying out objects in pure JS It makes no use
     * of any browser APIs. This library is intended for use in HTML5 canvas UIs
     * and in non-browser based JavaScript applications.
     */

    /**
     * Constructor: TablePacker
     * 
     * Create a new TablePacker. Takes the position and size of the usable
	 * area.
     * 
     * Parameters:
     *      x - left bound.
     *      y - top bound.
     *      w - width.
     *      h - height.
     */
    function TablePacker(x, y, w, h) {
        
        this.interface = {};
        for (var prop in TablePacker.defaults) {
            if (TablePacker.defaults.hasOwnProperty(prop)) {
                this.interface[prop] = TablePacker.defaults[prop];
            }
        }
        
        this.setBounds(x, y, w, h);
        this.rows = [new Row(this)];
        
    }
    TablePacker.prototype = Object.create(Object.prototype);
    
    
        
    
    
    /**
     * Function: add
     * 
     * Adds a new item. Follows the overflowPolicy if there is no room
     * in the row.
     * 
     * Parameters:
     *      item - the item to add.
     * 
     * Returns:
     * A cell containg the item.
     */
    TablePacker.prototype.add = function (item) {
        var cell = new Cell(item, this),
            row = this.rows[this.rows.length - 1];
        if (!row.fits(cell)) {
            
            //work out what to do if the element doesn't fit into the row
            var policy = this.interface.overflowPolicy;
            if (policy === TablePacker.OVERFLOW_POLICY.EXCEPTION) {
                throw new Error("Cell does not fit in table");
            } else if (policy === TablePacker.OVERFLOW_POLICY.DISCARD) {
                return cell;
            } else if (policy === TablePacker.OVERFLOW_POLICY.NEW_ROW) {
                this.row(this);
            } else if (policy === TablePacker.OVERFLOW_POLICY.SQUISH) {
                //do nothing;
            }
            
        }
        
        //add the element to the row and return the new cell.
        this.rows[this.rows.length - 1].add(cell);
        return cell;
        
    };
    
    
    
    
    
    /**
     * Function: row
     * 
     * Move to a new line. All calls to add will now add objects to the
	 * new row. Returns the current row if it is empty.
	 * 
	 * Returns:
	 * The created row or the current row if it's empty.
     */
    TablePacker.prototype.row = function () {
        
        if (this.rows[this.rows.length - 1].numCells() === 0) {
            return this.rows[this.rows.length - 1];
        }
        
        var next = new Row(this);
        this.rows.push(next);
        return next;
        
    };
    
    
    
    
    
    /**
     * Function: setBounds
     * 
     * Resize the table.
	 * 
	 * Parameters:
     *      x - left bound.
     *      y - top bound.
     *      w - width.
     *      h - height.
     * 
     */
    TablePacker.prototype.setBounds = function (x, y, w, h) {
        
        this.bounds = {
            x: x,
            y: y,
            w: w,
            h: h,
        };
        this.position = {x: x, y: y};
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        
    };
    
    
    
    
    /**
     * Function: each
     * 
     * Calls the passed method for each item in the table.
     * 
     * Parameters:
     *      f - The function to call for each item.
     * 
     */
    TablePacker.prototype.each = function (f) {
        for (var i = 0; i < this.rows.length; i++) {
            for (var j = 0; j < this.rows[i].numCells(); j++) {
                f(this.rows[i].get(j).item);
            }
        }
    };
    
    
    
    /**
     * Function: layout
     * 
     * Set the positions of all the objects in the table.
     */
    TablePacker.prototype.layout = function () {
        
        //copy the boulds object because we're going to be modifying it.
        var topBound = this.bounds.y;
        
        for (var i = 0; i < this.rows.length; i++) {
            
            
            var row = this.rows[i],
                leftBound = this.bounds.x + row.getMargin("left"),
                rightBound = this.bounds.x + this.bounds.w - row.getMargin("right"),
                thisSide = [],
                hmargin = 0,
                alignments = {left: row.getAllWithAlign("left"),
                              right: row.getAllWithAlign("right"),
                              center: row.getAllWithAlign("center")};
            
            
            
            //Set the y position for all the elements.
            for (var j = 0; j < row.numCells(); j++) {
                this.interface.setY(row.get(j).item, topBound + row.getMargin("top") + row.get(j).getMargin("top"));
            }
            
            
            
            //Place left aligned cells.
            thisSide = alignments.left;
            for (j = 0; j < thisSide.length; j++) {
                
                this.interface.setX(
                    thisSide[j].item,
                    leftBound + thisSide[j].getMargin("left")
                );
                hmargin = thisSide[j].getMargin("left") + thisSide[j].getMargin("right");
                leftBound += this.interface.getWidth(thisSide[j].item) + hmargin;
                
            }
            
            
            
            //Place right aligned cells.
            thisSide = alignments.right;
            for (j = 0; j < thisSide.length; j++) {
                
                this.interface.setX(
                    thisSide[j].item,
                    rightBound - this.interface.getWidth(thisSide[j].item) - thisSide[j].getMargin("right")
                );
                hmargin = thisSide[j].getMargin("left") + thisSide[j].getMargin("right");
                rightBound -= this.interface.getWidth(thisSide[j].item) + hmargin;
                
            }
            
            
            
            //Place center aligned cells. Center aligned cells are placed equidistant from eachother.
            thisSide = alignments.center;
            if (thisSide.length) {
                
                var totalWidth = 0;
                
				//Work out how much space the cells take up horizontally.
                for (j = 0; j < thisSide.length; j++) {
                    totalWidth += this.interface.getWidth(thisSide[j].item);
                }
                
				//Work out the gap between elemets.
                var gap = rightBound - leftBound - totalWidth;
                gap /= thisSide.length + 1;
                leftBound += gap;
				
				//Assign X positions.
                for (j = 0; j < thisSide.length; j++) {
                    this.interface.setX(thisSide[j].item, leftBound);
                    leftBound += this.interface.getWidth(thisSide[j].item) + gap;
                }

            }
            
            
            topBound += row.getHeight();
                
        }
        
    };
    
    
    
    
    /**
     * Structure: TablePacker.OVERFLOW_POLICY
     * 
     * Affects what happens when a row gets filled.
     */
    TablePacker.OVERFLOW_POLICY = {
        /**
         * Variable: EXCEPTION
         * Throw an exception if a cell doesn't fit.
         */
        EXCEPTION: 1,
        
        /**
         * Variable: SQUISH
         * Just keep adding elements to a row even if it's full. They will overlap
         * and leave the bounds of the table if you aren't careful.
         */
        SQUISH: 2,
        
        /**
         * Variable: NEW_ROW
         * Make a new row when something doesn't fit. There new row will not be
         * accessible but it will inherit the properties of the old row and not the
         * defaults. If you resize the table such that an element does not fit it will
         * not split into multiple rows. If you make a table bigger it will not
         * combine rows.
         */
        NEW_ROW: 3,
        
        /**
         * Variable: DISCARD
         * Don't add elements to the table if they don't fit. The
         * cell will still be returned but it won't be added to the table
         * so you don't have to do a !null check each time you add something
         * to the table.
         */
        DISCARD: 4,
    };
    
    
    
    
    /**
     * Structure: TablePacker.defaults
     * 
     * The default settings for new TablePackers. When tablePackers are created, this object
     * is copied. You can set these variables to something that works with your data structures.
     * 
     * For example - if you use object.position.x instead of object.x for storing position data
     * you should change the get/set X/Y methods.
     */
    TablePacker.defaults = {
        
        /**
         * Variable: getWidth
         * A function to find the width of an item.
         */
        getWidth: function(o) { return o.width; },
        
        /**
         * Variable: getHeight
         * A function to find the height of an item.
         */
        getHeight: function(o) { return o.height; },
        
        /**
         * Variable: getX
         * A function to find the x position of an item.
         */
        getX: function(o) { return o.x; },
        
        /**
         * Variable: getY
         * A function to find the width of an item.
         */
        getY: function(o) { return o.y; },
        
        /**
         * Variable: setX
         * A function to set the x position of the item.
         */
        setX: function(o, x) { o.x = x; },
        
        /**
         * Variable: setY
         * A function to set the y position of the item.
         */
        setY: function(o, y) { o.y = y; },
        
        /**
         * Variable: margin
         * The default margin for new cells.
         */
        margin: 10,
        
        /**
         * Variable: rowMargin
         * The default margin for new rows.
         */
        rowMargin: 10,
        
        /**
         * Variable: align
         * The default alignment for new cells.
         */
        align: "center",
        
        /**
         * Variable: overflowPolicy
         * Describes what to do if there is no room in a row.
         */
        overflowPolicy: TablePacker.OVERFLOW_POLICY.NEW_ROW,
        
        /**
         * Variable: verticalOverflowPolicy
         * Describes what to do if there is no room in the table. NEW_ROW is not
         * a valid value for this.
         */
        verticalOverflowPolicy: TablePacker.OVERFLOW_POLICY.DISCARD,
        
    };
    
    

    
    
    
    
    
    
    
    
    
    
    /**
     * Class: TablePacker.Row
     * 
     * A row in the table.
     */
    
    /**
     * Constructor: Row
     * 
     * Create a new Row object.
     * 
     * Parameters:
     *      parentTable - The table that owns this row.
     */
    function Row(parentTable) {
        this.cells = [];
        this.parentTable = parentTable;
        
        var rowMargin = parentTable.interface.rowMargin;
        this.margins = {
            left: rowMargin,
            right: rowMargin,
            top: rowMargin,
            bottom: rowMargin,
        };
    }
    Row.prototype = Object.create(Object.prototype);
    
    
    
    
    /**
     * Function: add
     * 
     * Add a cell to the row.
     * 
     * Parameters:
     *      cell - The cell to add.
     */
    Row.prototype.add = function (cell) {
        this.cells.push(cell);
    };
    
    
    
    
    /**
     * Function: get
     * 
     * Get an from the row by index.
     * 
     * Parameters:
     *      i - The index to get.
     * 
     * Returns:
     * The cell with index i.
     */
    Row.prototype.get = function (i) {
        return this.cells[i];
    };
    
    
    
    
    /**
     * Function: numCells
     * 
     * Returns the number of cells in the row.
     * 
     * Returns:
     * The number of cells in the row.
     */
    Row.prototype.numCells = function () {
        return this.cells.length;
    };
    
    
    
    
    /**
     * Function: fits
     * 
     * Returns true if the element fits into the row.
     * 
     * Parameters:
     *      cell - Test whether this cell fits into the row.
     * 
     * Returns:
     * True if this cell fits into the row.
     */
    Row.prototype.fits = function (cell) {
        var total = 0;
        var hypothetical = [cell].concat(this.cells);
        for (var i = 0; i < hypothetical.length; i++) {
            total += this.parentTable.interface.getWidth(hypothetical[i].item);
            total += hypothetical[i].getMargin("left");
            total += hypothetical[i].getMargin("right");
        }
        total += this.margins.left + this.margins.right;
        if (total > this.parentTable.width) {
            return false;
        }
        return true;
    };
    
    
    
    
    /**
     * Function: getHeight
     * 
     * Returns the height of the row.
     * 
     * Returns:
     * The height of the row. Includes the margins of both the row and the cells.
     */
    Row.prototype.getHeight = function () {
        var biggest = 0;
        for (var i = 0; i < this.cells.length; i++) {
            var h = this.parentTable.interface.getHeight(this.cells[i].item) +
                        this.cells[i].getMargin("top") +
                        this.cells[i].getMargin("bottom");
            if (h > biggest) {
                biggest = h;
            }
        }
        return biggest + this.margins.top + this.margins.bottom;
    };
    
    
    
    
    
    /**
     * Function: getAllWithAlign
     * 
     * Return a list of all cells with given alignment.
     * 
     * Parameters:
     *      align - the alignment to search for.
     * 
     * Returns:
     * A list of all the cells with the given alignment.
     */
    Row.prototype.getAllWithAlign = function (align) {
        var a = [];
        for (var i = 0; i < this.cells.length; i++) {
            if (this.cells[i].align === align) {
                a.push(this.cells[i]);
            }
        }
        return a;
    };
    
    
    
        
    /**
     * Function: margin
     * 
     * Sets all the margins to m, or if you specify a side, set only that side.
     * 
     * Parameters:
     *      m - the margin.
     *      side - which side the margin goes.
     */
    Row.prototype.margin = function (m, side) {
        if (!side) {
            this.margin(m, "left");
            this.margin(m, "right");
            this.margin(m, "top");
            this.margin(m, "bottom");
        } else {
            this.margins[side] = m;
        }
        return this;
    };
    
    
    
    
    /**
     * Function: getMargin
     * 
     * Get the margin on some side.
     * 
     * Parameters:
     *      side - which side the margin goes.
     */
    Row.prototype.getMargin = function (side) {
        return this.margins[side];
    };
    

    
    
    
    
    
    
    
    
    
    
    
    /**
     * Class: TablePacker.Cell
     * 
     * Contains items in the table. Used for setting alignments and margins. All
     * setter methods return this.
     * 
     */
    
    /**
     * Constructor: Cell
     * 
     * Create a new Cell object.
     * 
     * Parameters:
     *      item - the item to be contained in this cell.
     */
    function Cell(item, parentTable) {
        this.item = item;
        this.align = parentTable.interface.align;
        var defaultMargin = parentTable.interface.margin;
        this.margins = {
            left: defaultMargin,
            right: defaultMargin,
            top: defaultMargin,
            bottom: defaultMargin,
        };
    }
    Cell.prototype = Object.create(Object.prototype);
    
    
    
    /**
     * Function: left
     * 
     * Set this cell alignment to left.
     * 
     * Returns:
     * this cell.
     */
    Cell.prototype.left = function () {
        this.align = "left";
        return this;
    };
    
    
    
    
    /**
     * Function: right
     * 
     * Set this cell alignment to right.
     * 
     * Returns:
     * this cell.
     */
    Cell.prototype.right = function () {
        this.align = "right";
        return this;
    };
    
    
    
    
    /**
     * Function: margin
     * 
     * Sets all the margins to m, or if you specify a side, set only that side.
     * 
     * Parameters:
     *      m - the margin.
     *      side - which side the margin goes.
     * 
     * Returns:
     * this cell.
     */
    Cell.prototype.margin = function (m, side) {
        if (!side) {
            this.margin(m, "left");
            this.margin(m, "right");
            this.margin(m, "top");
            this.margin(m, "bottom");
        } else {
            this.margins[side] = m;
        }
        return this;
    };
    
    
    
    
    /**
     * Function: getMargin
     * 
     * Get the margin on some side.
     * 
     * Parameters:
     *      side - which side the margin goes.
     */
    Cell.prototype.getMargin = function (side) {
        return this.margins[side];
    };
    
    
    
    
    
    
    
    
    
    
    //exports
    TablePacker.Cell = Cell;
    if (typeof module !== "undefined") {
        module.exports = TablePacker;
    } else if (typeof window !== "undefined") {
        window.TablePacker = TablePacker;
    }
    
    
    
    
}());



















