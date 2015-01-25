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
	fontSize: 11,
	fontName: "Verdana",
	fontType: "",
	inputText: "",
	drawAllShapes: function drawAll() {
		for (var i = 0; i < drawing.shapes.length; i++) {
			drawing.shapes[i].draw();
		}
	}
}

/*fetching file url*/
$("#fileURL").change( function(e){
	var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            //el.width = img.width; //we can do this if you want to adjust canvas size to the image size!
            //el.height = img.height;
            ctx.drawImage(img,10,10); //always spawn new images at 10,10
        }
        var getUrl = event.target.result;
        drawing.shapes.push(new uploadImage(10, 10, "null", "null"));
        drawing.shapes[drawing.shapes.length - 1].url = getUrl;
        img.src = getUrl;
    }
    reader.readAsDataURL(e.target.files[0]);   
});


/*font manipulation*/
$("#fontSize").change( function(){
	drawing.fontSize = $("#fontSize").val();
	console.log("your font size is " + drawing.fontSize);
});

$("#selectFont").change( function(){
	drawing.fontName = $("#selectFont").val();
	console.log("your font size is " + drawing.fontName);
});

$(".fontSettings").click( function(){
	drawing.fontType = $(this).data("tool");
	console.log("The font type is " + drawing.fontType); 
});

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
	/*draw 2 more objects*/
	/*then press redo? what should come up? */
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
	} else if (drawing.currentTool === "text_area"){
		  /* ASK IN CLASS HOW TO FIX THIS!?
			  var item = $("<textarea/>").addClass("_textArea").attr("rows", "4").attr("cols", "40").attr("placeholder", "enter your text here");
			  $("#canvasContainer").append(item);
			  $("._textArea").blur( function(){
				drawing.inputText = $("._textArea").val();
				$("._textArea").remove();
			  });
		  */
		drawing.inputText = prompt("Enter your text: ");
		if(drawing.inputText !== null){
			drawing.shapes.push(new Text_Area(x, y, drawing.penColor, drawing.lineWidth));
			drawing.shapes[drawing.shapes.length - 1].fontSize = drawing.fontSize;
			drawing.shapes[drawing.shapes.length - 1].fontName = drawing.fontName;
			drawing.shapes[drawing.shapes.length - 1].fontType = drawing.fontType;
			drawing.shapes[drawing.shapes.length - 1].inputText = drawing.inputText;
			drawing.shapes[drawing.shapes.length - 1].draw();
		} 

	}else if(drawing.currentTool === "line"){
		drawing.shapes.push(new Line(x, y, drawing.penColor, drawing.lineWidth));
		console.log(drawing.shapes.length);
	}else if(drawing.currentTool === "circle"){
		drawing.shapes.push(new Circle(x, y, drawing.penColor, drawing.lineWidth));
		
	}/*else if(drawing.currentTool === "triangle"){
		drawing.shapes.push(new Triangle(x, y, drawing.penColor, drawing.lineWidth));
		drawing.shapes[drawing.shapes.length - 1].draw();
		
	}*/else if(drawing.currentTool === "arrow2"){
		drawing.shapes.push(new Arrow2(x, y, drawing.penColor, drawing.lineWidth));
	}else if(drawing.currentTool === "arrow"){
		drawing.shapes.push(new Arrow(x, y, drawing.penColor, drawing.lineWidth));
	}

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
		} else if (drawing.currentTool === "text_area"){
			//drawing.shapes[drawing.shapes.length - 1].draw();
		} else if (drawing.currentTool === "line"){
			drawing.shapes[drawing.shapes.length - 1].pointX = x;
			drawing.shapes[drawing.shapes.length - 1].pointY = y;
			ctx.clearRect(0, 0, el.width, el.height);
			drawing.shapes[drawing.shapes.length - 1].draw();
			drawing.drawAllShapes();
		} else if(drawing.currentTool === "circle"){
			drawing.shapes[drawing.shapes.length - 1].xLength = x - drawing.shapes[drawing.shapes.length - 1].x;
			drawing.shapes[drawing.shapes.length - 1].yLength = y - drawing.shapes[drawing.shapes.length - 1].y;
			drawing.shapes[drawing.shapes.length - 1].draw();
			ctx.clearRect(0, 0, el.width, el.height);
			drawing.drawAllShapes();

		}else if(drawing.currentTool === "arrow2"){
			drawing.shapes[drawing.shapes.length - 1].pointX = x;
			drawing.shapes[drawing.shapes.length - 1].pointY = y;
			ctx.clearRect(0, 0, el.width, el.height);
			drawing.shapes[drawing.shapes.length - 1].draw();
			drawing.drawAllShapes();
			
			

		}else if(drawing.currentTool === "arrow"){
			drawing.shapes[drawing.shapes.length - 1].pointX = x;
			drawing.shapes[drawing.shapes.length - 1].pointY = y;
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



var Circle = Shape.extend({
	xLength: 0,
	yLength: 0,
	

	draw: function(){
		ctx.beginPath();
		console.log( Math.sqrt( Math.pow(Math.abs(this.xLength), 2) + Math.pow(Math.abs(this.yLength), 2) ));
		ctx.arc(this.x, this.y, Math.sqrt( Math.pow(Math.abs(this.xLength), 2) + Math.pow(Math.abs(this.yLength), 2) ), 0, 2 * Math.PI, false ); 
		ctx.lineWidth = this.lineWidth; 
		ctx.strokeStyle = "#" + this.color;
		ctx.stroke( );
	}
});

var Triangle = Shape.extend({
	width: 0,
	hight: 0,
	
	draw: function(){

		ctx.lineWidth = this.lineWidth; 
		ctx.strokeStyle = "#" + this.color; 
		ctx.beginPath();
		ctx.moveTo(300,100);
    	ctx.lineTo(300,300);
    	ctx.lineTo(100,300);
    	ctx.closePath();
    	ctx.stroke();
		
	}
});
var Line = Shape.extend({
	pointX: 0,
	pointY: 0,
	draw: function(){
		 ctx.beginPath();
		 ctx.strokeStyle = "#" + this.color;
		 ctx.lineWidth = this.lineWidth; 
		 ctx.moveTo(this.x, this.y);
		 ctx.lineTo(this.pointX, this.pointY);
		 ctx.stroke();
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

		/*ctx.moveTo(150, 400);
		ctx.lineTo(400,400);
		ctx.lineTo(375,375);
		ctx.arcTo(400,400,375,425,35);
		ctx.lineTo(400,400);*/

		ctx.fill();
		ctx.stroke();
		
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

		/*ctx.moveTo(150, 400);
		ctx.lineTo(400,400);
		ctx.lineTo(375,375);
		ctx.arcTo(400,400,375,425,35);
		ctx.lineTo(400,400);*/

		ctx.fill();
		ctx.stroke();
		
	}
});

var Text_Area = Shape.extend({
	fontSize: 11,
	fontName: "Verdana",
	fontType: "",
	inputText: "",
	draw: function(){
		ctx.fillStyle = "#" + this.color;
		ctx.font = this.fontType+ " " + this.fontSize + "pt " + this.fontName;
  		ctx.fillText(this.inputText, this.x, this.y);
	}
});

var uploadImage = Shape.extend({
	url: "",
	draw: function(){
		var ptr = this;
		var img = new Image();
        img.onload = function(){
            ctx.drawImage(img, ptr.x, ptr.y); /**/
        }
        img.src = this.url;

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
		//ctx.moveTo(this.x, this.y);
		ctx.beginPath();
		ctx.lineJoin = ctx.lineCap = "round";
		ctx.lineWidth = this.lineWidth;
		ctx.strokeStyle = "#" + this.color; 
		for(var i = 0; i < this.cords.length; i++){
			ctx.lineTo(this.cords[i].x, this.cords[i].y);
			ctx.stroke();	
		}
	}
});


/*Utility point*/
function Point(x, y){
	this.x = x || 0;
	this.y = y || 0; 
}






