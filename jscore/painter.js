const BANNER_FADE_TIME_MS = 200;
const BANNER_SLOW_FADE_TIME_MS = 3000;
const BANNER_PERSIST_TIME_MS = 5000;
const LOADING_SCREEN_DELAY = 100;
const LOADING_SCREEN_FADE = 100;

const W3_SVGXMLNS = "http://www.w3.org/2000/svg";

const Localization = {
    color: "Color",
    custom_color: "Custom Color",
    red: "Red",
    red_short: "R",
    green: "Green",
    green_short: "G",
    blue: "Blue",
    blue_short: "B",
    alpha: "Alpha",
    alpha_short: "A",
    ok: "OK",
}

const Localization_en_gb = {
    color: "Colour",
    custom_color: "Custom Colour",
    __proto__: Localization
}

var lang = Localization_en_gb;

// State tracking.
const PaintState = {
	NONE: 0,
	MOVE: 1,
    SELECT: 2,
	DRAW: 3
};

var SelectableStates = [PaintState.MOVE, PaintState.SELECT];

const BannerTemplate = function(style, message) {
    return "<div class='banner "+style+"'><div class='bannerInner'>"+message+"</div><button type='button' class='bannerDismiss' href='#'><span class='bdread screenReaderText'>Dismiss</span><span class='bdinner visualOnlyText' aria-hidden>&times;</span></button></div>";
}

const DialogTemplate = function(style, title, message) {
    return "<div class='dialog "+style+"'><div class='dialogInner' role='dialog'><div class='title'><h1 class='text'>"+title+"</h1><button class='dismiss'><span class='screenReaderText'>Dismiss</span><span class='disinner visualOnlyText' aria-hidden>&times;</span></button></div><div class='content'>"+message+"</div></div></div>";
}



const ColorTemplateList = `
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#800'>Maroon</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#840'>Brown</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#880'>Coffee</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#480'>Leaf</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#080'>Green</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#084'>Jade</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#088'>Teal</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#048'>Sea</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#008'>Navy</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#408'>Violet</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#808'>Purple</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#804'>Scarlet</button></li>

    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#F00'>Red</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#F80'>Orange</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#FF0'>Yellow</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#8F0'>Lime</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#0F0'>Bright Green</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#0F8'>Algae</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#0FF'>Cyan</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#08F'>Aqua</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#00F'>Blue</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#80F'>Bright Violet</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#F0F'>Magenta</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#F08'>Pink</button></li>

    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#F88'>Bright Red</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#FB8'>Bright Orange</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#FF8'>Bright Yellow</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#BF8'>Bright Lime</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#8F8'>Emerald</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#8FB'>Bright Algae</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#8FF'>Bright Cyan</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#8BF'>Sky</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#88F'>Bright Blue</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#B8F'>Azure</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#F8F'>Bright Magenta</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#F8B'>Hot Pink</button></li>

    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#000'>Black</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#202020'>Very Dark Grey</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#404040'>Dark Grey</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#606060'>Darker Grey</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#808080'>Grey</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#A0A0A0'>Lighter Grey</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#C0C0C0'>Light Grey</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#E0E0E0'>Very Light Grey</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint' color-data='#FFF'>White</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaint transparent' color-data='transparent'>Transparent</button></li>
    <li class=''><button type='button' class='btnPainterAction actionPaintCustom'>Custom</button></li>
`;

// Handle names are not case sensitive.
const ShapeHandle = {
    nodeName: "null",
    resize: function(sel, aX, aY, dirx, diry, sf, square = false) {
        
    },
    move: function(sel, dirx, diry, sf) {
        
    },
    create: function(x, y, width, height) {
        
    }
};

const RectangleHandle = {
    nodeName: "rect",
    resize: function(sel, aX, aY, dirx, diry, sf, square = false) {
        if (square) {
            $(sel).attr("width", Math.max(parseFloat($(sel).attr("width")) + aX * dirx * sf.x, 1));
            $(sel).attr("height", Math.max(parseFloat($(sel).attr("height")) + aY * diry * sf.y, 1));

            var avg = (parseFloat($(sel).attr("width")) + parseFloat($(sel).attr("height"))) / 2;
            $(sel).attr("width", avg);
            $(sel).attr("height", avg);
        } else {
            $(sel).attr("x", parseFloat($(sel).attr("x")) + Math.abs(dirx) * (1 - dirx) / 2 * aX * sf.x);
            $(sel).attr("y", parseFloat($(sel).attr("y")) + Math.abs(diry) * (1 - diry) / 2 * aY * sf.y);

            $(sel).attr("width", Math.max(parseFloat($(sel).attr("width")) + aX * dirx * sf.x, 1));
            $(sel).attr("height", Math.max(parseFloat($(sel).attr("height")) + aY * diry * sf.y, 1));
        }
    },
    move: function(sel, dirx, diry, sf) {
        $(sel).attr("x", parseFloat($(sel).attr("x")) + dirx * sf.x);
        $(sel).attr("y", parseFloat($(sel).attr("y")) + diry * sf.y);
    },
    create: function(x, y, width, height) {
        var elT = document.createElementNS(W3_SVGXMLNS, "rect");
        elT.setAttribute("x", x);
        elT.setAttribute("y", y);
        elT.setAttribute("width", width);
        elT.setAttribute("height", height);
        
        return elT;
    },
    __proto__: ShapeHandle
}

const EllipseHandle = {
    nodeName: "ellipse",
    resize: function(sel, aX, aY, dirx, diry, sf, square = false) {
        if (square) {
            $(sel).attr("rx", Math.max(parseFloat($(sel).attr("rx")) + aX * dirx * sf.x, 1));
            $(sel).attr("ry", Math.max(parseFloat($(sel).attr("ry")) + aY * diry * sf.y, 1));

            var avg = (parseFloat($(sel).attr("rx")) + parseFloat($(sel).attr("ry"))) / 2;
            $(sel).attr("rx", avg);
            $(sel).attr("ry", avg);

        } else {
            $(sel).attr("rx", Math.max(parseFloat($(sel).attr("rx")) + 0.5 * aX * dirx * sf.x, 1));
            $(sel).attr("ry", Math.max(parseFloat($(sel).attr("ry")) + 0.5 * aY * diry * sf.y, 1));

            $(sel).attr("cx", parseFloat($(sel).attr("cx")) + 0.5 * Math.abs(dirx) * aX * sf.x);
            $(sel).attr("cy", parseFloat($(sel).attr("cy")) + 0.5 * Math.abs(diry) * aY * sf.y);
        }
    },
    move: function(sel, dirx, diry, sf) {
        $(sel).attr("cx", parseFloat($(sel).attr("cx")) + dirx * sf.x);
        $(sel).attr("cy", parseFloat($(sel).attr("cy")) + diry * sf.y);
    },
    create: function(x, y, width, height) {
        var elT = document.createElementNS(W3_SVGXMLNS, "ellipse");
        elT.setAttribute("cx", (x + width / 2.0));
        elT.setAttribute("cy", (y + height / 2.0));
        elT.setAttribute("rx", width);
        elT.setAttribute("ry", height);
        
        return elT;
    }
};

var DefinedHandles = [RectangleHandle, EllipseHandle];

var painterBare = {
    // Mode of the painter
	mode: PaintState.MOVE,
    
    // Selected element
	selected: null,
    
    // SVG element context
	svgE: null,
	svgDoc: null,
	svgMaster: null,
    
    // Dragbox for moving and resizing.
	dragbox: null,
    
    // Paint area context outside SVG layer
    context: null,

	dragboxResizeHandle: null,
	dragboxMoveHandle: false,
    
    // Keyboard option toggles
    keyboardOptionToggles: {
        shift: false,
        ctrl: false,
        alt: false,
    },
    
	dragboxShiftMode: function() {
        return this.keyboardOptionToggles.shift;
    },
    
    // Action button set
    actionSelectButton: null,
    actionMoveButton: null,
    actionDrawMetaButton: null,
    actionDrawShape: "rect",
    
    actionDrawShapeButtons: null,
    
    // Custom color rememberances
    customColorRememberances: [0, 0, 0, 255],
    
    // Get handles convenience
    getShapeHandle: function(name) {
        var handle = null;
        DefinedHandles.forEach(function(e) {
            if(e.nodeName.toLowerCase() === name.toLowerCase()) handle = e;
        });
        
        return handle;
    },

	getSVGScaleFactor: function () {
		// Check the ratio between the declared width and the actual width.
		var scaleX = this.svgDoc.attr("width") / this.svgDoc.width();
		var scaleY = this.svgDoc.attr("height") / this.svgDoc.height();
	
		return {x: scaleX, y: scaleY};
	},


	assignResizeHandle: function (element) {
		var dirx = $(element).hasClass("right") ? 1 : ($(element).hasClass("left") ? -1 : 0);
		var diry = $(element).hasClass("bottom") ? 1 : ($(element).hasClass("top") ? -1 : 0);
	
		this.dragboxResizeHandle = {x: dirx, y: diry};
	},

	removeResizeHandle: function () {
		this.dragboxResizeHandle = null;
	},


	resizeSelected: function (aX, aY) {
        var dir = this.dragboxResizeHandle;
		var sf = this.getSVGScaleFactor();
        var sel = this.selected;
        var handle = this.getShapeHandle(sel.nodeName);
        
        if(handle !== null) {
            handle.resize(sel, aX, aY, dir.x, dir.y, sf, this.dragboxShiftMode());
        }
        else {
            console.log("No handle found for "+sel.nodeName);
        }
	
		this.adjustDragbox();
	},

	assignMoveHandle: function () {
		this.dragboxMoveHandle = true;
	},
	
	removeMoveHandle: function () {
		this.dragboxMoveHandle = false;
	},

	moveSelected: function (dirx, diry) {
		var sf = this.getSVGScaleFactor();
		var sel = this.selected;
        var handle = this.getShapeHandle(sel.nodeName);
        
        if(handle !== null) {
            handle.move(sel, dirx, diry, sf);
        }
        else {
            console.log("No handle found for "+sel.nodeName);
        }
	
		this.adjustDragbox();
	},
	
	
	elementBounds: function (element) {
		var eb = element.getBoundingClientRect();
	
		var svb = this.svgE.getBoundingClientRect();
	
		return {left: eb.left - svb.left, top: eb.top - svb.top, width: eb.width, height: eb.height};
	},
	
	adjustDragbox: function () {
		// Adjust position of dragbox based on element
		var bound = this.elementBounds(this.selected);
	
		this.dragbox.css("top", bound.top);
		this.dragbox.css("left", bound.left);
		this.dragbox.css("width", bound.width);
		this.dragbox.css("height", bound.height);
	},
	
	
	updateSelection: function (element) {
		this.selected = element;
	
		if (element === null) {
			this.dragbox.hide();
		} else {
			this.dragbox.show();
			this.adjustDragbox();
		}
        
        // Consequently highlight selected only items.
        if(element === null) {
            $(".actionSelectedOnly").hide();
        }
        else {
            $(".actionSelectedOnly").show();
        }
        
        // If selected, update required fields.
        if(element !== null) {
            this.updateActionBarSelectionFields();
        }
	},
    
    updateActionBarSelectionFields: function() {
        var strWidth = parseFloat($(this.selected).attr("stroke-width"));
        
        $(".actionStrokeWidthInput").val(strWidth);
    },

	runResizerHandle: function (event) {
        if(this.mode === PaintState.MOVE) {
            if (this.dragboxResizeHandle !== null) {
                var ime = event.originalEvent;
                this.resizeSelected(ime.movementX, ime.movementY);
            }
        }
	},
	
	runMoverHandle: function (event) {
        if(this.mode == PaintState.MOVE) {
            if (this.dragboxMoveHandle) {
                var ime = event.originalEvent;
                this.moveSelected(ime.movementX, ime.movementY);
            }
        }
	},

	createShape: function (shape, x, y, width, height) {
		var elT = null;
        var handle = this.getShapeHandle(shape);

        if(handle !== null) {
            elT = handle.create(x, y, width, height);
        }
        
		if(elT !== null) {
            elT.setAttribute("fill", "white");
            elT.setAttribute("stroke-width", "3");
            elT.setAttribute("stroke", "black");

            // Append natively since jQuery does not support SVG properly.
            this.svgDoc.find("g.master")[0].appendChild(elT);
		}
        
        return elT;
	},

	changeMode: function (mode) {
		this.mode = mode;

		if(mode != PaintState.MOVE) {
			this.updateSelection(null);
		}
        
        this.highlightModeButtons();
	},
    
    changeDrawShape: function(shape) {
        this.actionDrawShape = shape;
        
        this.highlightModeButtons();
    },
    
    highlightModeButtons: function() {
        if(this.mode === PaintState.MOVE) {
            this.actionMoveButton.addClass("selected");
            this.context.addClass("move");
        }
        else {
            this.actionMoveButton.removeClass("selected");
            this.context.removeClass("move");
        }
        
        if(this.mode === PaintState.SELECT) {
            this.actionSelectButton.addClass("selected");
            this.context.addClass("select");
        }
        else {
            this.actionSelectButton.removeClass("selected");
            this.context.removeClass("select");
        }
        
        // Reset state for us and all of our children.
        this.actionDrawMetaButton.parent().find("a, button").removeClass("selected");
        
        if(this.mode === PaintState.DRAW) {
            this.actionDrawMetaButton.addClass("selected");
            this.context.addClass("draw");
        }
        else {
            this.context.removeClass("draw");
        }
    },
    
    createColorChooser(callback, cts) {
        var myself = this;
        
        var colorToString = function(r, g, b, a) {
            return "rgba(" +
                parseInt(r) + "," +
                parseInt(g) + "," +
                parseInt(b) + "," +
                (parseFloat(a)/255.0) +
                ")";
        }
        
        var template = $("<div class='colorChooser'></div>");

        var chooserForm = $("<form class='innerForm' action='javascript:void(0);'></form>");

        // Append the form element to the template
        chooserForm.appendTo(template);

        // Use jQuery to build the chooser.
        var sliderInputTemplate = "<input type='range' class='colorSlider' min='0' max='255' value='0' step='1' />";
        var directInputTemplate = "<input type='number' class='colorDirect' min='0' max='255' value='0' step='1' />";

        var submitBtn = $("<input type='submit' class='colorConfirm' value='"+lang.ok+"'/>");

        var colorPreview = $("<div class='colorPreview'></div>");

        // Append the preview to the form.
        colorPreview.appendTo(chooserForm);

        // Generate three sliders for each color value, and one for alpha.
        var redSlider = $(sliderInputTemplate).addClass("red");
        var greenSlider = $(sliderInputTemplate).addClass("green");
        var blueSlider = $(sliderInputTemplate).addClass("blue");
        var alphaSlider = $(sliderInputTemplate).addClass("alpha");

        // Generate IDs
        redSlider.attr("id", "colorChooserRed");
        greenSlider.attr("id", "colorChooserGreen");
        blueSlider.attr("id", "colorChooserBlue");
        alphaSlider.attr("id", "colorChooserAlpha");

        // Generate container boxes
        var redContainer = $("<div class='colorSliderField red'></div>");
        var greenContainer = $("<div class='colorSliderField green'></div>");
        var blueContainer = $("<div class='colorSliderField blue'></div>");
        var alphaContainer = $("<div class='colorSliderField alpha'></div>");

        // Append to container, then to form.
        redContainer.append(redSlider).appendTo(chooserForm);
        greenContainer.append(greenSlider).appendTo(chooserForm);
        blueContainer.append(blueSlider).appendTo(chooserForm);
        alphaContainer.append(alphaSlider).appendTo(chooserForm);

        // Generate labels
        redSlider.before(
            "<label class='colorSliderPre red' for='colorChooserRed'><span class='screenReaderText'>"+lang.red+"</span><span aria-hidden>"+lang.red_short+"</span></label>"
        );
        greenSlider.before(
            "<label class='colorSliderPre green' for='colorChooserGreen'><span class='screenReaderText'>"+lang.green+"</span><span aria-hidden>"+lang.green_short+"</span></label>"
        );
        blueSlider.before(
            "<label class='colorSliderPre blue' for='colorChooserBlue'><span class='screenReaderText'>"+lang.blue+"</span><span aria-hidden>"+lang.blue_short+"</span></label>"
        );
        alphaSlider.before(
            "<label class='colorSliderPre alpha' for='colorChooserAlpha'><span class='screenReaderText'>"+lang.alpha+"</span><span aria-hidden>"+lang.alpha_short+"</span></label>"
        );

        // Generate direct number change fields.
        var redDirect = $(directInputTemplate).addClass("red");
        var greenDirect = $(directInputTemplate).addClass("green");
        var blueDirect = $(directInputTemplate).addClass("blue");
        var alphaDirect = $(directInputTemplate).addClass("alpha");

        var esyncFunction = function(copy, paste) {
            return function(event) {
                paste.val(copy.val());
            }
        }

        // Link them directly to the sliders.
        redSlider.on("input", esyncFunction(redSlider, redDirect));
        greenSlider.on("input", esyncFunction(greenSlider, greenDirect));
        blueSlider.on("input", esyncFunction(blueSlider, blueDirect));
        alphaSlider.on("input", esyncFunction(alphaSlider, alphaDirect));

        redDirect.on("input", esyncFunction(redDirect, redSlider));
        greenDirect.on("input", esyncFunction(greenDirect, greenSlider));
        blueDirect.on("input", esyncFunction(blueDirect, blueSlider));
        alphaDirect.on("input", esyncFunction(alphaDirect, alphaSlider));

        redSlider.before(redDirect);
        greenSlider.before(greenDirect);
        blueSlider.before(blueDirect);
        alphaSlider.before(alphaDirect);

        // Append submit button to form.
        submitBtn.appendTo(chooserForm);

        // Update preview function.
        var updatePreview = function() {
            var rv = redSlider.val();
            var gv = greenSlider.val();
            var bv = blueSlider.val();
            var av = alphaSlider.val();

            // Set attribute based on values.
            colorPreview.attr("style", "background-color:" + colorToString(rv, gv, bv, av) + ";");
        }

        var inputtables = chooserForm.find("input.colorSlider, input.colorDirect");

        // Now, we assign action events to the sliders.
        // Here, we assign both input and change for maximum feedback
        inputtables.on("input", function(event) {
            updatePreview();
        });

        inputtables.change(function(event) {
            updatePreview();
        });

        // Generate default values.
        var defr = myself.customColorRememberances[0];
        var defg = myself.customColorRememberances[1];
        var defb = myself.customColorRememberances[2];
        var defa = myself.customColorRememberances[3];

        redSlider.val(defr);
        greenSlider.val(defg);
        blueSlider.val(defb);
        alphaSlider.val(defa);

        redDirect.val(defr);
        greenDirect.val(defg);
        blueDirect.val(defb);
        alphaDirect.val(defa);

        // Update the preview to give the user a glimpse of the color.
        updatePreview();

        // When the form is submitted...
        chooserForm.submit(function(){
            // Apply the color chosen.
            var rv = redSlider.val();
            var gv = greenSlider.val();
            var bv = blueSlider.val();
            var av = alphaSlider.val();

            // Apply to color chooser rememberances, shared across all choosers
            myself.customColorRememberances = [parseInt(rv), parseInt(gv), parseInt(bv), parseInt(av)];

            // Call the callback function to help deal with the dialog and its closure.
            callback(cts(rv, gv, bv, av));
        });

        return template;
    },
    
    launchCustomColorChooser: function(property) {
        // Display a dialog that allows for color customisation
        var contextDialog = this.showDialog(lang.custom_color, "<div class='injectColorChooser'></div>");
        
        var myself = this;
        
        var colorToString = function(r, g, b, a) {
            return "rgba(" +
                parseInt(r) + "," +
                parseInt(g) + "," +
                parseInt(b) + "," +
                (parseFloat(a)/255.0) +
                ")";
        }
        
        var applyColorAndClose = function(colstr) {
            // Apply the color chosen to the property.
            myself.changeSelectedShapeProperty(property, colstr);
            
            // Then close our dialog, after a delay to complete form submission.
            window.setTimeout(function() {
                contextDialog.remove();
            }, 10)
        };
        
        this.createColorChooser(applyColorAndClose, colorToString).appendTo($(".injectColorChooser"));
    },
    
    launchCustomColorChooserEx: function(callback, cts) {
        // Display a dialog that allows for color customisation
        var contextDialog = this.showDialog(lang.custom_color, "<div class='injectColorChooser'></div>");
        
        var myself = this;
        
        this.createColorChooser(callback, cts).appendTo($(".injectColorChooser"));
    },
    
    eventLaunchCustomColorChooser: function(property) {
        var myself = this;
        return function(event) {
            myself.launchCustomColorChooser(property);
        }
    },
    
    eventChooseColor: function(property) {
        var myself = this;
        return function(event) {
            // Get and set color
            var cval = $(event.target).attr("color-data");
            myself.changeSelectedShapeProperty(property, cval);
        }
    },
    
    // Note that X and Y are raw positions.
    runShapeCreateProcedure: function(x, y) {
        
        if(this.mode === PaintState.DRAW) {
            var newShape = this.createShape(this.actionDrawShape, x, y, 10, 10);
            
            // Immediately go into resize mode.
            this.changeMode(PaintState.MOVE);
            
            if(newShape !== null) {
                var myself = this;
                
                // Time out to apply changes to the DOM.
                window.setTimeout(function() {
                    // Coerce the context
                    myself.updateSelection(newShape);

                    // Bottom right point
                    myself.assignResizeHandle($(".paControls .dragbox .point.bottom.right")[0]);

                }, 1);
            }
        }
    },
    
    // Delete the selected element
    deleteSelectedElement: function() {
        if(this.selected !== null) {
            this.selected.remove();

            // Selected now becomes null
            this.updateSelection(null);
        }
    },
    
    changeSelectedShapeProperty: function(prop, value) {
        if(this.selected !== null) {
            this.selected.setAttribute(prop, value);
        }
    },
    
    // Arranging shapes. (Up for towards top, down for towards bottom.)
    arrangeSelectedUp: function() {
        var parent = this.selected.parentNode;
        var nodeUp = this.selected.nextSibling;
        
        // Don't move further if we are at the top.
        if(nodeUp === null) return;
        
        // Move the up node to before the selected element, effectively moving that node down.
        parent.insertBefore(nodeUp, this.selected);
    },
    
    arrangeSelectedDown: function() {
        var parent = this.selected.parentNode;
        var nodeDown = this.selected.previousSibling;
        
        // Don't move further if we are at the bottom.
        if(nodeDown === null) return;
        
        // Move the selected node to before the down node, effectively moving the selected node down.
        parent.insertBefore(this.selected, nodeDown);
    },
    
    // To the very back, or the very front.
    arrangeSelectedBack: function() {
        var parent = this.selected.parentNode;
        
        var removedShape = this.selected;
        this.selected.remove();
        parent.prepend(removedShape);
    },
    
    arrangeSelectedFront: function() {
        var parent = this.selected.parentNode;
        
        var removedShape = this.selected;
        this.selected.remove();
        parent.append(removedShape);
    },
    
    registerActionButtons: function() {
	    this.actionSelectButton = $("#actionSelect");
	    this.actionMoveButton = $("#actionMove");
        
        this.actionDrawMetaButton = $("#actionDrawMeta");
        
        var myself = this;
        
        this.actionSelectButton.click(function(){myself.changeMode(PaintState.SELECT);});
        this.actionMoveButton.click(function(){myself.changeMode(PaintState.MOVE);});
        
        // Any child of our dropdown meta.
        this.actionDrawMetaButton.parent().find("a, button").click(function() {
            myself.changeMode(PaintState.DRAW);
        });
        
        this.actionDrawShapeButtons = $("#actionDrawShapes > li").children("a, button");
        
        this.actionDrawShapeButtons.click(function() {
            // Change shape to whatever was clicked
            myself.changeDrawShape($(this).attr("shape-data"));
        });
        
        $("#actionDelete, .actionDelete").click(function() {
            // Delete the selected element, if it exists (handled inside function)
            myself.deleteSelectedElement();
        });
        
        // Fill color
        var fillColorActs = $(".actionFillColor > li");
        fillColorActs.children("a, button").filter(".actionPaint").click(myself.eventChooseColor("fill"));
        fillColorActs.children("a, button").filter(".actionPaintCustom").click(myself.eventLaunchCustomColorChooser("fill"));
        
        // Stroke color
        var strokeColorActs = $(".actionStrokeColor > li");
        strokeColorActs.children("a, button").filter(".actionPaint").click(myself.eventChooseColor("stroke"));
        strokeColorActs.children("a, button").filter(".actionPaintCustom").click(myself.eventLaunchCustomColorChooser("stroke"));
        
        // Stroke width
        $(".actionStrokeWidthInput").change(function() {
            myself.changeSelectedShapeProperty("stroke-width", parseFloat($(".actionStrokeWidthInput").val()));
        });
        
        // Arranging
        $(".actionArrangeUp").click(function(event) {myself.arrangeSelectedUp()});
        $(".actionArrangeDown").click(function(event) {myself.arrangeSelectedDown()});
        $(".actionArrangeFront").click(function(event) {myself.arrangeSelectedFront()});
        $(".actionArrangeBack").click(function(event) {myself.arrangeSelectedBack()});
    },

	// When the SVG doc is ready
	svgReady: function () {
		// this.svgDoc = $(this.svgE);
		// this.svgMaster = this.svgDoc.find(".master");
	},
    
    registerWindowEvents: function() {
        var myself = this;
        
        // The entire window gets these events to respond to drag events.
        $(window).mousemove(function(event){
            myself.runResizerHandle(event);
            myself.runMoverHandle(event);
        });

        $(window).mouseup(function(event){
            // Remove on mouse release.
            myself.removeResizeHandle();
            myself.removeMoveHandle();
        });
        
        var keytog = function(toggle) {
            return function(event) {
                switch(String(event.key)) {
                    case "Shift":
                        myself.keyboardOptionToggles.shift = toggle;
                        break; 
                    case "Ctrl":
                        myself.keyboardOptionToggles.ctrl = toggle;
                        break; 
                    case "Alt":
                        myself.keyboardOptionToggles.alt = toggle;
                        break; 
                    default:
                        break;
                }
            }
        }

        // Key events
        $(window).keydown(keytog(true));
        $(window).keyup(keytog(false));

        // Selection events (on svg document onky)
        $(this.svgDoc).mousedown(function(event) {
            var tar = event.target;

            if(SelectableStates.includes(myself.mode)) {
                // If a handle exists for this shape, then we can select it.
                if(myself.getShapeHandle(tar.nodeName)) {
                    myself.updateSelection(tar);
                }
                // Check if our controls are not selected.
                else if($(tar).parents(".paControls").length == 0) {
                    myself.updateSelection(null);
                }
            }
            
            // Start drawing if we meet our draw criteria.
            if(myself.mode === PaintState.DRAW) {
                var offXY = myself.svgDoc.offset();
                var scale = myself.getSVGScaleFactor();
                myself.runShapeCreateProcedure(
                    (event.pageX - offXY.left) * scale.x, 
                    (event.pageY - offXY.top) * scale.y
                );
            }
        });
    },
    
    setupDragbox: function() {
        var myself = this;
        
        // Dragbox controls.
        this.dragbox = $(".paControls .dragbox");

        // Hide the dragbox when loading
        this.dragbox.hide();	
        
        // Drag events for dragbox points
        var dragboxPoints = this.dragbox.find(".point.resize");
        dragboxPoints.mousedown(function(){
            myself.assignResizeHandle(this);
        });

        // Drag events for the entire dragbox.
        this.dragbox.mousedown(function(event) {
            if(this === event.target) {
                // Move handle
                myself.assignMoveHandle();
            }
        });
    },
    
    setupNavbar: function() {
        // Use jQuery to add color buttons
        $(".actionColorDrop > ul").append(ColorTemplateList);
        
        // Use jQuery to code for the color buttons.
        var painters = $(".actionColorDrop > ul > li").children("a.actionPaint, button.actionPaint");
        
        painters.each(function(i, pe) {
            var peq = $(pe);
            peq.attr("style", "background-color:"+peq.attr("color-data")+";");
        });
    },
    
    setupModal: function() {
        var myself = this;
    },
    
    showBannerBox: function(message, style, persistent=false) {
        var myself = this;
        
        if(style === undefined) {
            // Set style
            style = "message";
        }
        
        // Add the following element.
        var lastAddedBanner = $(BannerTemplate(style, message));
        lastAddedBanner.appendTo("main > .modals > .banners");
        
        // Last two only when non-persistent
        if(!persistent) {
            // Then show through a timer and destruct after some seconds.
            lastAddedBanner.fadeIn(BANNER_FADE_TIME_MS);
            
            // 5 seconds in
            window.setTimeout(function() {
                myself.deleteBannerBox(lastAddedBanner)
            }, BANNER_PERSIST_TIME_MS);
        }
        
        // Also register a dismiss click
        lastAddedBanner.find(".bannerDismiss").click(function(event) {
            // Delete banner boxes when the close button is pressed.
            myself.deleteBannerBox(lastAddedBanner);
        });
        
        return lastAddedBanner;
    },
    
    showDialog: function(title, message, style) {
        var myself = this;
        
        if(style === undefined) {
            // Set style
            style = "message";
        }
        
        // Add the following element.
        var newDialog = $(DialogTemplate(style, title, message));
        newDialog.appendTo("main > .modals > .dialogs");
        
        // Then create an event for the user to dismiss the dialog.
        newDialog.find(".dismiss").click(function(event) {
            // Delete dialogs when the close button is pressed.
            newDialog.remove();
        });
        
        return newDialog;
    },
    
    deleteBannerBox: function(banner) {
        banner.fadeOut(BANNER_FADE_TIME_MS, function() {
            banner.remove();
        });
    },
    
    fadeBannerBox: function(banner) {
        banner.fadeOut(BANNER_SLOW_FADE_TIME_MS, function() {
            banner.remove();
        });
    },
    
    getSize() {
        // Size:
        return [this.svgDoc.attr('width'), this.svgDoc.attr('height')];
    },

	start: function () {
		var myself = this;
        
		// This section starts immediately on loading.
		myself.svgE = document.getElementById("paintMain");
		
		// Wait for SVG loading
		myself.svgE.addEventListener("load", function() {
			myself.svgReady();
		});

		// JQuery syntax
		$(document).ready(function() {	
            // Pre-init svg section.
            myself.svgDoc = $(myself.svgE);
		    myself.svgMaster = myself.svgDoc.find(".master");
            
            myself.context = $(".paintarea");
            
			// Dragbox controls.
			myself.setupDragbox();
	
            // Navbar events
            myself.setupNavbar();
            
            // Modal events
            myself.setupModal();
            
            // Window events
			myself.registerWindowEvents();
            
            // Register action buttons.
            myself.registerActionButtons();
            
			// Prevent right click context menu on paint area, except with alt.
			$(".paintarea").contextmenu(function() {
                if(!myself.keyboardOptionToggles.alt) {
                    
                }
				return myself.keyboardOptionToggles.alt;
			});
            
            // Initial states and painting setup.
            myself.updateSelection(null);
            myself.highlightModeButtons();
            
            // After everything is ready, hide the loading screen.
            $(".loadScreen").delay(LOADING_SCREEN_DELAY).fadeOut(LOADING_SCREEN_FADE, function(event) {
                $(this).remove();
            });
		});
	},
	
};

function Painter() {
    
}

Object.assign(Painter.prototype, painterBare);

var painter = new Painter();
painter.start();

