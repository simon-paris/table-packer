/**
 * Class: TablePacker
 * 
 * A dead simple library for laying out objects in pure JS It makes no use
 * of any browser APIs. This library is intended for use in HTML5 canvas UIs
 * and in non-browser based JavaScript applications.
 */

(function () {
    "use strict";
    
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
        this.items = [[]];
        
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
        
    }
    
    
    
    /**
     * Function: add
     * 
     * Adds a new item.
     * 
     * Parameters:
     *      item - the item to add.
     * 
     * Returns:
     * A cell containg the item.
     */
    TablePacker.prototype.add = function (item) {
        var cell = new Cell(item);
        this.items[this.items.length - 1].push(cell);
        return cell;
    };
    
    
    
    /**
     * Function: row
     * 
     * Move to a new line. All calls to add will now add objects to the
	 * new row.
     */
    TablePacker.prototype.row = function () {
        var next = [];
        this.items.push(next);
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
        for (var i = 0; i < this.items.length; i++) {
            for (var j = 0; j < this.items[i].length; j++) {
                f(this.items[i][j].item);
            }
        }
    };
    
    
    
    /**
     * Function: layout
     * 
     * Set the positions of all the objects in the table.
     */
    TablePacker.prototype.layout = function () {
        
        var b = {
            x: this.bounds.x,
            y: this.bounds.y,
            w: this.bounds.w,
            h: this.bounds.h,
        };
        
        for (var i = 0; i < this.items.length; i++) {
            
            var row = this.items[i],
                y = b.y,
                biggestHeight = 0,
                alignments = {left: [], right: [], center: [],};
            
            //This first loop assigns y positions and also calculates the height
			//of the whole row, which affects the y position of the next row. It also
			//sorts all the cells by their alignment.
            for (var j = 0; j < row.length; j++) {
                
				//Put the cell in the alignment array.
                var align = row[j].align;
                alignments[align].push(row[j]);
                
                //Set the y position for all the elements.
                row[j].item.position.y = y + row[j].getMargin("top");
                
				//Work out the height of the whole row.
                var vmargin = row[j].getMargin("top") + row[j].getMargin("bottom");
                if (row[j].item.height + vmargin > biggestHeight) {
                    biggestHeight = row[j].item.height + vmargin;
                }
            }
            
            var leftBound = b.x,
                rightBound = b.x + b.w,
                thisSide = [],
                hmargin;
            
            
            //Place left aligned cells.
            thisSide = alignments.left;
            for (j = 0; j < thisSide.length; j++) {
                
                thisSide[j].item.position.x = leftBound + thisSide[j].getMargin("left");
                hmargin =  + thisSide[j].getMargin("left") + thisSide[j].getMargin("right");
                leftBound += thisSide[j].item.width + hmargin;
                
            }
            
            //Place right aligned cells.
            thisSide = alignments.right;
            for (j = 0; j < thisSide.length; j++) {
                
                thisSide[j].item.position.x =
                    rightBound - thisSide[j].item.width - thisSide[j].getMargin("right");
                hmargin = thisSide[j].getMargin("left") + thisSide[j].getMargin("right");
                rightBound -= thisSide[j].item.width + hmargin;
                
            }
            
            //Place center aligned cells. Center aligned cells are placed equidistant from eachother.
            thisSide = alignments.center;
            if (thisSide.length) {
                
                var totalWidth = 0;
                
				//Work out how much space the cells take up horizontally.
                for (j = 0; j < thisSide.length; j++) {
                    totalWidth += thisSide[j].item.width;
                }
                
				//Work out the gap between elemets.
                var gap = rightBound - leftBound - totalWidth;
                gap /= thisSide.length + 1;
                leftBound += gap;
				
				//Assign X positions.
                for (j = 0; j < thisSide.length; j++) {
                    thisSide[j].item.position.x = leftBound;
                    leftBound += thisSide[j].item.width + gap;
                }

            }
            
            b.y += biggestHeight;
                
        }
        
    };
    
    
    
    
    
    
    /**
     * Class: Cell
     * 
     * Contains items in the table. Used for setting alignments and margins. All
     * setter methods return this.
     * 
     * Parameters:
     *      item - the item to be contained in this cell.
     */
    function Cell(item) {
        this.item = item;
        this.align = "center";
        this.margins = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        };
    }
    
    
    
    /**
     * Function: left
     * 
     * Set this cell alignment to left.
     */
    Cell.prototype.left = function () {
        this.align = "left";
        return this;
    };
    
    
    
    
    /**
     * Function: right
     * 
     * Set this cell alignment to right.
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
    
    
    TablePacker.Cell = Cell;
    if (typeof module !== "undefined") {
        module.exports = TablePacker;
    } else if (typeof window !== "undefined") {
        window.TablePacker = TablePacker;
    }
    
    
    
    
}());



















