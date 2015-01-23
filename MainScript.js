var el = document.getElementById("myCanvas");
var ctx = el.getContext("2d");

var drawing = {
	shapes: [],
	cache: [],
	lineWidth: 5,
	idDrawing: false,
	currentTool: "pen",
	penColor: "000000",
	eraserColor: "ffffff",
	undoRedo: "NULL",
	drawAllShapes: function drawAll() {
		for (var i = 0; i < drawing.shapes.length; i++) {
			drawing.shapes[i].draw();
		}
	}
}

/*read color*/
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

/*pick tool*/
$(".toolLink").click(function(){
	drawing.currentTool = $(this).data("tool");
	console.log("You are drawing with " + drawing.currentTool); 
});

/*Select line width*/
/*NOTE: Do not forget to inilialize...*/
$('#lineThickness').change( function(){
	drawing.lineWidth = $('#lineThickness').val();
	console.log("your line width is " + drawing.lineWidth);
});



$("#newFile").click(function(){
	if(confirm("Are you sure you want to start a new painting?")){
		location.reload();	
	}
	
});

/*read undo/redo*/
$(".testLink").click(function(){

	/*TODO: think a little better how does the redo work*/
	/*test a currect implementation!!!!!*/
	/*test case: draw 3 objects*/
	/*undo 3 times*/
	/*draw 2 more ubjects*/
	/*then press redo? what should come up? */
	drawing.undoRedo = $(this).data("undochoice");
	console.log($(this).data("undochoice"));

	if(drawing.undoRedo === "undo" && drawing.shapes.length !== 0){
		var undo_me = drawing.shapes.pop();
		drawing.cache.push(undo_me); 
	} else if (drawing.undoRedo === "redo" && drawing.cache.length !== 0){
		var redo_me = drawing.cache.pop();
		console.log(redo_me);
		drawing.shapes.push(redo_me);
	}

	ctx.clearRect(0, 0, el.width, el.height);
	drawing.drawAllShapes(); 
});

/*Mouse movements*/
$("#myCanvas").mousedown(function(e) {
	var x = e.pageX - this.offsetLeft;
	var y = e.pageY - this.offsetTop;

	ctx.beginPath();
	drawing.isDrawing = true; 
	if(drawing.currentTool === "square"){
		drawing.shapes.push(new Square(x, y, drawing.penColor, drawing.lineWidth)); 
	} else if (drawing.currentTool === "pen"){
		ctx.moveTo(x, y);
		drawing.shapes.push(new Pen(x, y, drawing.penColor, drawing.lineWidth));
	} else if (drawing.currentTool === "eraser"){
		drawing.shapes.push(new Eraser(x, y, drawing.eraserColor, drawing.lineWidth));
	}

});

$("#myCanvas").mousemove(function(e){
	var x = e.pageX - this.offsetLeft;
	var y = e.pageY - this.offsetTop;
	$("#status").html( x +", "+ y );
	
	/*Styling mouse cursor*/
	$(this).css( 'cursor', 'url(gfx/mouseIcon.png), auto' );
	


	if(drawing.isDrawing){		
		if(drawing.currentTool === "square"){
			drawing.shapes[drawing.shapes.length - 1].width = x - drawing.shapes[drawing.shapes.length - 1].x;
			drawing.shapes[drawing.shapes.length - 1].height = y - drawing.shapes[drawing.shapes.length - 1].y;
			ctx.clearRect(0, 0, el.width, el.height);
			drawing.shapes[drawing.shapes.length - 1].draw();
			drawing.drawAllShapes();
		} else if (drawing.currentTool === "pen"){ /*TODO: debug pen class is acting strangeee*/
			drawing.shapes[drawing.shapes.length - 1].cords.push(new Point(x, y));
			drawing.shapes[drawing.shapes.length - 1].pointX = x;
			drawing.shapes[drawing.shapes.length - 1].pointY = y; 
			drawing.shapes[drawing.shapes.length - 1].penDraw();
		} else if (drawing.currentTool === "eraser"){
			drawing.shapes[drawing.shapes.length - 1].width = x - drawing.shapes[drawing.shapes.length - 1].x;
			drawing.shapes[drawing.shapes.length - 1].height = y - drawing.shapes[drawing.shapes.length - 1].y;
			ctx.clearRect(0, 0, el.width, el.height);
			drawing.shapes[drawing.shapes.length - 1].draw();
			drawing.drawAllShapes();
		}

	}

});


$("#myCanvas").mouseup(function(){
	drawing.isDrawing = false;
	ctx.closePath(); /*not sure about this*/	
});


/*****************/

var Shape = Base.extend({
	constructor: function(x, y, color, width){
		this.x = x; // Each instance of derived classes
		this.y = y; // will have their own copies of x and y
		this.color = color;
		this.lineWidth = width;

	},
	draw: function(context){
		// The base version shouldn’t really do anything...
	}
});

var Square = Shape.extend({
	width: 0,
	height: 0,
	draw: function(){
		 ctx.lineWidth = this.lineWidth;
		 ctx.strokeStyle = "#" + this.color;
		 ctx.strokeRect(this.x, this.y, this.width, this.height);
	}
});

var Eraser = Shape.extend({
	width: 0,
	height: 0,
	draw: function(){
		 //ctx.lineWidth = this.lineWidth;
		 ctx.fillStyle = "#" + this.color;
		 ctx.fillRect(this.x, this.y, this.width, this.height);
	}
});

/*WAAAAAYYY TOOOO SLOOOOOWWW */
var Pen = Shape.extend({
	cords: [],
	pointX: 0,
	pointY: 0,
	penDraw: function(){
		ctx.lineJoin = ctx.lineCap = "round";
		ctx.lineTo(this.pointX, this.pointY);

		ctx.lineWidth = this.lineWidth;
		ctx.strokeStyle = "#" + this.color; 
		ctx.stroke();
		 
	},
	draw: function(){
		ctx.moveTo(this.x, this.y);
		for(var i = 0; i < this.cords.length; i++){
			ctx.lineJoin = ctx.lineCap = "round";
			ctx.lineTo(this.cords[i].x, this.cords[i].y);

			ctx.lineWidth = this.lineWidth;
			ctx.strokeStyle = "#" + this.color; 
			ctx.stroke();	
		}
	}
});


/*Utility point*/
function Point(x, y){
	this.x = x || 0;
	this.y = y || 0; 
}






