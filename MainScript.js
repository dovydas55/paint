var el = document.getElementById("myCanvas");
var ctx = el.getContext("2d");

var drawing = {
	shapes: [],
	cache: [],
	lineWidth: 5,
	isDrawing: false,
	currentTool: "pen",
	penColor: "000000",
	eraserColor: "ffffff",
	undoRedo: "NULL",
	fontSize: 11,
	fontName: "Verdana",
	fontType: "",
	inputText: "",
	moveMe: null,
	isMoving: false,
	//spliceIndex: -1,
	drawAllShapes: function drawAll() {
		for (var i = 0; i < drawing.shapes.length; i++) {
			drawing.shapes[i].draw();
		}
	},
	currectObject: function(){
		return drawing.shapes[drawing.shapes.length - 1];
	},
	getShapeForMovement: function(x, y){
		var end = drawing.shapes.length - 1; //move layers of objects in correct order
		for(var i = end; i >= 0 ; i--){
			if(drawing.shapes[i].containsMouse(x, y)){
				//drawing.spliceIndex = i;
				return drawing.shapes[i];
			}
		}
		return null; //not found
	}

}

/**********************************************************/
/*font settings*/
$("#fontSize").change( function(){
	drawing.fontSize = $("#fontSize").val();
	console.log("your font size is " + drawing.fontSize);
});

$("#selectFont").change( function(){
	drawing.fontName = $("#selectFont").val();
	console.log("your font is " + drawing.fontName);
});

$(".fontSettings").click( function(){
	drawing.fontType = $(this).data("tool");
	console.log("The font type is " + drawing.fontType); 
});

/*color settings*/
$(".colorLink").click( function(){
	drawing.penColor = $(this).data("colorvalue");
	console.log("The tool color is " + drawing.penColor); 
});

$('#colorSelector').ColorPicker({
    color: '#7d3d7d',
    onSubmit: function(hsb, hex, rgb) {
      drawing.penColor = hex;
      console.log("The tool color according to color picker is " + drawing.penColor);      
    }
});

/*current tool*/
$(".toolLink").click(function(){
	drawing.currentTool = $(this).data("tool");
	console.log("You are drawing with " + drawing.currentTool); 
});

/*Select line width*/
$('#lineThickness').change( function(){
	drawing.lineWidth = $('#lineThickness').val();
	console.log("your line width is " + drawing.lineWidth);
});

/*start a new picture!*/
$("#newFile").click(function(){
	if(confirm("Are you sure you want to start a new painting?")){
		location.reload();	
	}
});

/*redo / undo operations*/
$(".testLink").click(function(){
	drawing.undoRedo = $(this).data("undochoice");
	console.log($(this).data("undochoice"));

	if(drawing.undoRedo === "undo" && drawing.shapes.length !== 0){
		var undo_me = drawing.shapes.pop();
		drawing.cache.push(undo_me); 
	} else if (drawing.undoRedo === "redo" && drawing.cache.length !== 0){
		var redo_me = drawing.cache.pop();
		drawing.shapes.push(redo_me);
	}

	ctx.clearRect(0, 0, el.width, el.height);
	drawing.drawAllShapes(); 
});

/*Upload image*/
$("#fileURL").change( function(e){
	var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            ctx.drawImage(img,10,10); //always spawn new images at 10,10
        }
        var getUrl = event.target.result;
        drawing.shapes.push(new uploadImage(10, 10, "null", "null"));
        drawing.currectObject().updateMe(getUrl, img);
        img.src = getUrl;
    }
    reader.readAsDataURL(e.target.files[0]);   
});

/**********************************************************/
/*mouse operations*/

$("#myCanvas").mousedown(function(e) {
	var x = e.pageX - this.offsetLeft;
	var y = e.pageY - this.offsetTop;

	if(drawing.currentTool !== 'select'){
		drawing.isDrawing = true;
		var newShape = shapeFactory(x, y); 
		drawing.shapes.push(newShape);
	} else {
		drawing.isMoving = true;
		drawing.moveMe = drawing.getShapeForMovement(x, y);
		//advanced undoo
		//var clone = $.extend(true, {}, drawing.moveMe);
		//drawing.shapes.splice(drawing.spliceIndex, 0, clone);
		//console.log(">>>>>>>>>>>>>>>>." +drawing.shapes.length);
	}

});

$("#myCanvas").mouseup(function(){
	drawing.isDrawing = false;
	drawing.isMoving = false; 	
});

$("#myCanvas").mousemove(function(e){
	var x = e.pageX - this.offsetLeft;
	var y = e.pageY - this.offsetTop;
	$("#status").html( x +", "+ y );
	
	/*Styling mouse cursor*/
	if(drawing.currentTool === "eraser"){
		$(this).css( 'cursor', 'url(gfx/erase.png), auto' );
	} else {
		$(this).css( 'cursor', 'url(gfx/mouseIcon.png), auto' );	
	}

	if(drawing.isDrawing){
		if(!(drawing.currectObject() instanceof Pen)) ctx.clearRect(0, 0, el.width, el.height);
		if(!(drawing.currectObject() instanceof Text_Area)) drawing.currectObject().updateMe(x, y); 
		if(!(drawing.currectObject() instanceof Pen)) drawing.drawAllShapes();
	} else if (drawing.isMoving){
		if(drawing.moveMe !== null){
			ctx.clearRect(0, 0, el.width, el.height);
			drawing.moveMe.dragMe(x, y, drawing.lineWidth, drawing.penColor);
			drawing.drawAllShapes();
		}
	}

});


/**********************************************************/
/*classes...*/
var Shape = Base.extend({
	constructor: function(x, y, color, width){
		this.x = x; 
		this.y = y; 
		this.color = color;
		this.lineWidth = width;
	},
	draw: function(context){
		// The base version shouldn’t really do anything...
		// intentionally empty
	}
});

var Square = Shape.extend({
	width: 0,
	height: 0,
 	draw: function(){
		 ctx.beginPath();
		 ctx.lineWidth = this.lineWidth;
		 ctx.strokeStyle = "#" + this.color;
		 ctx.strokeRect(this.x, this.y, this.width, this.height);
		 ctx.closePath();
	},
	updateMe: function(x, y){
		this.width = x - this.x;
		this.height = y - this.y;

		this.draw();
	},
	containsMouse: function(x, y){ //boolean
		 //TODO: implement 
		 //http://www.emanueleferonato.com/2012/03/09/algorithm-to-determine-if-a-point-is-inside-a-square-with-mathematics-no-hit-test-involved/
		 return false; 
	},
	dragMe: function(x, y, w, c){
		//TODO: implement
	}
});

var Eraser = Shape.extend({
	width: 0,
	height: 0,
	draw: function(){
		 ctx.beginPath();
		 ctx.fillStyle = "#" + this.color;
		 ctx.fillRect(this.x, this.y, this.width, this.height);
		 ctx.closePath();
	},
	updateMe: function(x, y){
		this.width = x - this.x;
		this.height = y - this.y;
		this.draw();
	},
	containsMouse: function(x, y){ //you are not allowed to move an Eraser! 
		 return false; 
	},
	dragMe: function(x, y, w, c){
		//intentionally empty
	}
});

var Circle = Shape.extend({
	radius: 0,
	draw: function(){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false ); 
		ctx.lineWidth = this.lineWidth; 
		ctx.strokeStyle = "#" + this.color;
		ctx.stroke( );
		ctx.closePath();
	},
	updateMe: function(x, y){
		var xLength = 	x - this.x;
		var yLength = y - this.y;
		this.radius = Math.sqrt( Math.pow(Math.abs(xLength), 2) + Math.pow(Math.abs(yLength), 2) );
		this.draw();
	},
	containsMouse: function(x, y){ //works!
		var dist = Math.sqrt( Math.pow(Math.abs(this.x - x), 2) + Math.pow(Math.abs(this.y - y), 2) );
		if(dist <= this.radius) return true;
		else return false; 
	},
	dragMe: function(x, y, w, c){
		this.x = x; 
		this.y = y;
		updateColorAndLineWidth(this, c, w);   
		this.draw(); 
	}	
});


var Line = Shape.extend({
	endX: 0,
	endY: 0,
	draw: function(){
		 ctx.beginPath();
		 ctx.strokeStyle = "#" + this.color;
		 ctx.lineWidth = this.lineWidth; 
		 ctx.moveTo(this.x, this.y);
		 ctx.lineTo(this.endX, this.endY);
		 ctx.stroke();
		 ctx.closePath();
	},
	updateMe: function(x, y){
		this.endX = x;
		this.endY = y;
		this.draw();
	},
	containsMouse: function(x, y){ //boolean
		return checkIfLineContainsMouse(x, y, this.x, this.y, this.endX, this.endY); 
	},
	dragMe: function(x, y, w, c){
		//TODO: implement
		updateColorAndLineWidth(this, c, w);   
		this.draw(); 
	}

});

var Arrow = Shape.extend({
	pointX: 0,
	pointY: 0,
	draw: function(){
		ctx.beginPath();
		ctx.strokeStyle = "#" + this.color; 
		ctx.lineWidth = this.lineWidth; 
		ctx.fillStyle = "#" + this.color;

		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.pointX, this.pointY);
		ctx.lineTo(this.pointX-25, this.pointY-25);
		ctx.arcTo(this.pointX, this.pointY, this.pointX-25, this.pointY+25, 35);
		ctx.lineTo(this.pointX, this.pointY);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();	
	},
	updateMe: function(x, y){
		this.pointX = x;
		this.pointY = y;
		this.draw();
	},
	containsMouse: function(x, y){ //boolean
		return checkIfLineContainsMouse(x, y, this.x, this.y, this.pointX, this.pointY); 
	},
	dragMe: function(x, y, w, c){
		//TODO: implement
		updateColorAndLineWidth(this, c, w);   
		this.draw(); 
	}

});

var Arrow2 = Shape.extend({
	pointX: 0,
	pointY: 0,
	draw: function(){
		ctx.beginPath();
		ctx.strokeStyle = "#" + this.color; 
		ctx.lineWidth = this.lineWidth; 
		ctx.fillStyle = "#" + this.color;

		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.pointX, this.pointY);
		ctx.lineTo(this.pointX+25, this.pointY+25);
		ctx.arcTo(this.pointX, this.pointY, this.pointX+25, this.pointY-25, 35);
		ctx.lineTo(this.pointX, this.pointY);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	},
	updateMe: function(x, y){
		this.pointX = x;
		this.pointY = y;
		this.draw();
	},
	containsMouse: function(x, y){ //boolean 
		return checkIfLineContainsMouse(x, y, this.x, this.y, this.pointX, this.pointY);
	},
	dragMe: function(x, y, w, c){
		//TODO: implement
		updateColorAndLineWidth(this, c, w);  
		this.draw(); 
	}
});

var Pen = Shape.extend({
	pointX: 0,
	pointY: 0,
	constructor: function(x, y, color, width){
		ctx.moveTo(x, y);
		this.base(x, y, color, width);
		this.cords = [];
	},
	penDraw: function(){
		ctx.lineJoin = ctx.lineCap = "round";
		ctx.lineTo(this.pointX, this.pointY);
		ctx.lineWidth = this.lineWidth;
		ctx.strokeStyle = "#" + this.color; 
		ctx.stroke();
		ctx.clearRect(0, 0, el.width, el.height); 
		drawing.drawAllShapes();			      
	},
	draw: function(){
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineJoin = ctx.lineCap = "round";
		ctx.lineWidth = this.lineWidth;
		ctx.strokeStyle = "#" + this.color; 
		for(var i = 0; i < this.cords.length; i++){
			ctx.lineTo(this.cords[i].x, this.cords[i].y);
			ctx.stroke();	
		}
		ctx.closePath();
	},
	updateMe: function(x, y){
		this.cords.push(new Point(x, y)); 
		this.pointX = x;
		this.pointY = y;
		this.penDraw();
	},
	containsMouse: function(x, y){ /*Not sure if this works properly!! TODO: debug*/
		 var flag = false;
		 for(var i = 0; i < this.cords.length; i++){
		 	if(this.cords[i].x === x && this.cords[i].y === y){
		 		flag = true;
		 	}
		 }
		 return flag; 
	},
	dragMe: function(x, y, w, c){
		//TODO: implement
		updateColorAndLineWidth(this, c, w);   
		this.draw(); 
	}

});

var Text_Area = Shape.extend({
	fontSize: 11,
	fontName: "Verdana",
	fontType: "",
	inputText: "",
	constructor: function(x, y, color, width){
		this.fontSize = drawing.fontSize;
		this.fontName = drawing.fontName;
		this.fontType = drawing.fontType;
		this.inputText = drawing.inputText;
		this.base(x, y, color, width);
		this.draw(); 

	},
	draw: function(){
		ctx.fillStyle = "#" + this.color;
		ctx.font = this.fontType+ " " + this.fontSize + "pt " + this.fontName;
  		ctx.fillText(this.inputText, this.x, this.y);
	},
	containsMouse: function(x, y){ //boolean
		 //TODO: implement 
		 return false;
	},
	dragMe: function(x, y){
		//TODO: implement
	}
});

var uploadImage = Shape.extend({
	url: "",
	img: null,
	draw: function(){
		console.log("drawing imageeee");
		this.img.src = this.url;
		ctx.drawImage(this.img, this.x, this.y);    
	},
	updateMe: function(link, pic){
		this.url = link;
		this.img = pic;
	},
	containsMouse: function(x, y){ //boolean
		//should add img.width and img.height and then use same method as with square
		//TODO: implement
		return false; 
	},
	dragMe: function(x, y){
		//TODO: implement
	}
});

/**********************************************************/
/*utility functions*/
var shapeFactory = function(x, y){
	if(drawing.currentTool === "square"){
		return new Square(x, y, drawing.penColor, drawing.lineWidth);
	} else if (drawing.currentTool === "pen"){
		return new Pen(x, y, drawing.penColor, drawing.lineWidth);
	} else if (drawing.currentTool === "eraser"){
		return new Eraser(x, y, drawing.eraserColor, drawing.lineWidth);
	} else if (drawing.currentTool === "text_area"){
		drawing.inputText = prompt("Enter your text: ");
		if(drawing.inputText !== null){
			return new Text_Area(x, y, drawing.penColor, drawing.lineWidth);
		} 
	}else if(drawing.currentTool === "line"){
		return new Line(x, y, drawing.penColor, drawing.lineWidth);
	}else if(drawing.currentTool === "circle"){
		return new Circle(x, y, drawing.penColor, drawing.lineWidth);
	}else if(drawing.currentTool === "arrow2"){
		return new Arrow2(x, y, drawing.penColor, drawing.lineWidth);
	}else if(drawing.currentTool === "arrow"){
		return new Arrow(x, y, drawing.penColor, drawing.lineWidth);
	}
}

function Point(x, y){
	this.x = x || 0;
	this.y = y || 0; 
}

var distance = function(x1, y1, x2, y2){
	var xDiff = x2 - x1;
	var yDiff = y2 - y1;
	return Math.sqrt(xDiff*xDiff + yDiff*yDiff);
}

var checkIfLineContainsMouse = function(x,y, startX, startY, endX, endY){
	var t1 = distance(startX, startY, x, y) + distance(endX, endY, x, y); 
	var t2 = distance(startX, startY, endX, endY);
	t2 = t2.toFixed(1); //add more tolerance by lowering precision. Maybe add to 0 for better user experience
	t1 = t1.toFixed(1); //add more tolerance by lowering precision.
	if(t1 === t2) return true; 
	else return false; 
}

var updateColorAndLineWidth = function(obj, c, w){
	obj.lineWidth = w;
	obj.color = c; 
}
