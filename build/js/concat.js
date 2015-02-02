var el = document.getElementById("myCanvas");
var ctx = el.getContext("2d");

//classes
var Shape = Base.extend({
	prevX: 0,
	prevY: 0,
	constructor: function(x, y, color, width, name){
		this.x = x; 
		this.y = y; 
		this.color = color;
		this.lineWidth = width;
		this.name = name;
	},
	draw: function(context){
		// The base version shouldn’t really do anything...
		// intentionally empty
	}
});

var Square = Shape.extend({
	width: 0,
	height: 0,
	fillColor: "init",
 	draw: function(){
		 ctx.beginPath();
		 ctx.lineWidth = this.lineWidth;
		 ctx.strokeStyle = "#" + this.color;

		 if(this.fillColor !== "init"){
		 	ctx.fillStyle = "#" + this.fillColor;
		 	ctx.fillRect(this.x, this.y, this.width, this.height);	
		 }
		 ctx.strokeRect(this.x, this.y, this.width, this.height);
		 ctx.closePath();
	},
	updateMe: function(x, y){
		this.width = x - this.x;
		this.height = y - this.y;
		this.draw();
	},
	containsMouse: function(clickX, clickY){ //boolean
		return containPointSquareObject(this, clickX, clickY); 
	},
	dragMe: function(x, y){
		updateXandYcoordinatesForShape(this, x, y); 
		this.draw(); 
	},
	updateFillColor: function(color){
		console.log("square"); 
		this.fillColor = color;
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
	dragMe: function(x, y){
		//intentionally empty
	}
});

var Circle = Shape.extend({
	radius: 0,
	fillColor: "init",
	draw: function(){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false ); 
		ctx.lineWidth = this.lineWidth; 
		ctx.strokeStyle = "#" + this.color;
		if(this.fillColor !== "init"){
			ctx.fillStyle = "#" + this.fillColor;
			ctx.fill();
		}
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
	dragMe: function(x, y){
		updateXandYcoordinatesForShape(this, x, y); 
		this.draw(); 
	},
	updateFillColor: function(color){
		this.fillColor = color;
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
	dragMe: function(x, y){
		updateXandYcoordinatesForShape(this, x, y);   
		this.draw();
	}

});

var Arrow = Shape.extend({
	endX: 0,
	endY: 0,
	draw: function(){
		ctx.beginPath();
		ctx.strokeStyle = "#" + this.color; 
		ctx.lineWidth = this.lineWidth; 
		ctx.fillStyle = "#" + this.color;

		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.endX, this.endY);
		ctx.lineTo(this.endX-25, this.endY-25);
		ctx.arcTo(this.endX, this.endY, this.endX-25, this.endY+25, 35);
		ctx.lineTo(this.endX, this.endY);
		ctx.fill();
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
	dragMe: function(x, y){
		updateXandYcoordinatesForShape(this, x, y);   
		this.draw(); 
	}

});

var Arrow2 = Shape.extend({
	endX: 0,
	endY: 0,
	draw: function(){
		ctx.beginPath();
		ctx.strokeStyle = "#" + this.color; 
		ctx.lineWidth = this.lineWidth; 
		ctx.fillStyle = "#" + this.color;

		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.endX, this.endY);
		ctx.lineTo(this.endX+25, this.endY+25);
		ctx.arcTo(this.endX, this.endY, this.endX+25, this.endY-25, 35);
		ctx.lineTo(this.endX, this.endY);
		ctx.fill();
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
	dragMe: function(x, y){
		updateXandYcoordinatesForShape(this, x, y);  
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
	containsMouse: function(x, y){ 
		 var flag = false;
		 for(var i = 0; i < this.cords.length; i++){ //range search so it would be easier for users to select the pixel 
		 	if(this.cords[i].x > x - 15 && this.cords[i].x < x + 15 && this.cords[i].y > y - 15 && this.cords[i].y < y + 15){ 
		 		flag = true;								
		 	}
		 }
		 return flag; 
	},
	dragMe: function(x, y){
		
		var tmpX = x - this.prevX; 
		var tmpY = y - this.prevY;
		this.prevX = x;
		this.prevY = y;

		this.x += tmpX;
		this.y += tmpY; 
		for(var i = 0; i < this.cords.length; i++){
			this.cords[i].x += tmpX;
			this.cords[i].y += tmpY;
		}

		this.draw(); 
	}

});

var Text_Area = Shape.extend({
	//fontSize: 11,
	//fontName: "Verdana",
	//fontType: "",
	//inputText: "",
	width: 0,
	height: 0,
	constructor: function(x, y, color, width, name){
		this.base(x, y, color, width);
		this.fontSize = drawing.fontSize;
		this.fontName = drawing.fontName;
		this.fontType = drawing.fontType;
		this.inputText = drawing.inputText;
		this.name = "text_area"; 

	},
	draw: function(){
		ctx.fillStyle = "#" + this.color;
		ctx.font = this.fontType+ " " + this.fontSize + "pt " + this.fontName;
  		ctx.fillText(this.inputText, this.x, this.y);
	},
	containsMouse: function(x, y){ //boolean
		 this.width = this.inputText.length * this.fontSize;
		 this.height = -this.fontSize;
		 return containPointSquareObject(this, x, y);
	},
	dragMe: function(x, y){
		updateXandYcoordinatesForShape(this, x, y);
		this.draw();
	},
	updateText: function(text){
		this.inputText = text;
		this.draw();
	}
});

var uploadImage = Shape.extend({
	url: "",
	img: null,
	width: 0,
	height: 0,
	draw: function(){
		this.img.src = this.url;
		ctx.drawImage(this.img, this.x, this.y);    
	},
	updateMe: function(link, pic){
		this.url = link;
		this.img = pic;
	},
	containsMouse: function(x, y){ //boolean
		return containPointSquareObject(this, x, y);
	},
	dragMe: function(x, y){
		updateXandYcoordinatesForShape(this, x, y);
		this.draw();
	}
});




/*mouse operations*/
$("#myCanvas").mousedown(function(e) {
	var x = e.pageX - this.offsetLeft;
	var y = e.pageY - this.offsetTop;

	if (drawing.currentTool === 'fill'){
		var upateLineWAndC = drawing.getShape(x, y);
		if(upateLineWAndC !== null){
			if(upateLineWAndC instanceof Square || upateLineWAndC instanceof Circle) {
				upateLineWAndC.updateFillColor(drawing.penColor);
				cleanCanvas();
			}
		}
	}else if (drawing.currentTool === 'edit'){
		var obj = drawing.getShape(x,y);
		if(obj !== null){
			updateTextProperties(obj, drawing.fontSize, drawing.fontName, drawing.fontType); 
			cleanCanvas();	
		}
	} else if (drawing.currentTool === 'border'){
		var upateLineWAndC = drawing.getShape(x, y);
		if(upateLineWAndC !== null){
			updateColorAndLineWidth(upateLineWAndC, drawing.penColor, drawing.lineWidth);
			cleanCanvas();
		}
	}else if(drawing.currentTool !== 'select'){

		drawing.textBoxX = e.pageX;
		drawing.textBoxY = e.pageY;
		drawing.isDrawing = true;
		var newShape = shapeFactory(x, y); 
		drawing.shapes.push(newShape);		

	} else {
		drawing.isMoving = true;
		drawing.moveMe = drawing.getShape(x, y);
		if(drawing.moveMe !== null)  drawing.moveMe.prevX = x; 
		if(drawing.moveMe !== null) drawing.moveMe.prevY = y;
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
	} else if (drawing.currentTool === "pen"){
		$(this).css( 'cursor', 'url(gfx/mouseIcon.png), auto' );	
	}else if (drawing.currentTool === "fill"){
		$(this).css( 'cursor', 'url(gfx/Actions-fill-color-icon2.png), auto');

	} else {
		this.style.cursor = 'pointer';
	}

	if(drawing.isDrawing){
		if(!(drawing.currectObject() instanceof Pen)) ctx.clearRect(0, 0, el.width, el.height);
		if(!(drawing.currectObject() instanceof Text_Area)) drawing.currectObject().updateMe(x, y); 
		if(!(drawing.currectObject() instanceof Pen)) drawing.drawAllShapes();
	} else if (drawing.isMoving){
		if(drawing.moveMe !== null){
			ctx.clearRect(0, 0, el.width, el.height);
			drawing.moveMe.dragMe(x, y);
			drawing.drawAllShapes();
		}
	}

});

var cleanCanvas = function(){
	ctx.clearRect(0, 0, el.width, el.height); 
	drawing.drawAllShapes();
}
var drawing = {
	shapes: [],
	cache: [],
	lineWidth: 5,
	isDrawing: false,
	currentTool: "pen",
	penColor: "000000",
	eraserColor: "ffffff",
	fillColor: "ffffff",
	undoRedo: "NULL",
	fontSize: 11,
	fontName: "Verdana",
	fontType: "",
	inputText: "",
	moveMe: null,
	isMoving: false,
	textBoxX: 0,
	textBoxY: 0,
	drawAllShapes: function drawAll() {
		for (var i = 0; i < drawing.shapes.length; i++) {
			drawing.shapes[i].draw();
		}
	},
	currectObject: function(){
		return drawing.shapes[drawing.shapes.length - 1];
	},
	getShape: function(x, y){
		var end = drawing.shapes.length - 1; //move layers of objects in correct order
		for(var i = end; i >= 0 ; i--){
			if(drawing.shapes[i].containsMouse(x, y)){
				return drawing.shapes[i];
			}
		}
		return null; //not found
	}

}

//font settings
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

//color settings
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

//current tool
$(".toolLink").click(function(){
	drawing.currentTool = $(this).data("tool");
	console.log("You are drawing with " + drawing.currentTool); 
});

//Select line width
$('#lineThickness').change( function(){
	drawing.lineWidth = $('#lineThickness').val();
	console.log("your line width is " + drawing.lineWidth);
});

//start a new picture!
$("#newFile").click(function(){
	if(confirm("Are you sure you want to start a new painting?")){
		location.reload();	
	}
});

//redo / undo operations
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

	cleanCanvas();
});

//Upload image
$("#fileURL").change( function(e){
	var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            ctx.drawImage(img,10,10); //always spawn new images at 10,10
            drawing.shapes.push(new uploadImage(10, 10, "null", "null")); 
       		drawing.currectObject().width = img.width;
        	drawing.currectObject().height = img.height;
        	drawing.currectObject().updateMe(getUrl, img);
        }
        var getUrl = event.target.result;
        img.src = getUrl;
    }
    reader.readAsDataURL(e.target.files[0]);   
});

//Download Canvas as Picture

$("#download").click(function(){
	 var dataURL = el.toDataURL();
	 document.getElementById('download').src = dataURL;

});

//getting user to input a string
$('#textInput').keyup(function(e){
	if(e.which === 13){
		drawing.inputText = $('#textInput').val();
		console.log(drawing.inputText);
		drawing.currectObject().updateText(drawing.inputText);
		$('#textcontainer').hide();
		$('#textInput').val("");
	}
});

var button = document.getElementById('download');
button.addEventListener('click', function (e) {
    var dataURL = el.toDataURL('image/png');
    button.href = dataURL;
});

/*utility functions*/
var shapeFactory = function(x, y){
	if(drawing.currentTool === "square"){
		return new Square(x, y, drawing.penColor, drawing.lineWidth, "square");
	} else if (drawing.currentTool === "pen"){
		return new Pen(x, y, drawing.penColor, drawing.lineWidth, "pen");
	} else if (drawing.currentTool === "eraser"){
		return new Eraser(x, y, drawing.eraserColor, drawing.lineWidth, "eraser");
	} else if (drawing.currentTool === "text_area"){
		
		//drawing.inputText = prompt("Enter your text: ");
		$('#textcontainer').css({"top": drawing.textBoxY, "left": drawing.textBoxX}).show();
		return new Text_Area(x, y, drawing.penColor, drawing.lineWidth, "text_area");
		 
	}else if(drawing.currentTool === "line"){
		return new Line(x, y, drawing.penColor, drawing.lineWidth, "line");
	}else if(drawing.currentTool === "circle"){
		return new Circle(x, y, drawing.penColor, drawing.lineWidth, "circle");
	}else if(drawing.currentTool === "arrow2"){
		return new Arrow2(x, y, drawing.penColor, drawing.lineWidth, "arrow2");
	}else if(drawing.currentTool === "arrow"){
		return new Arrow(x, y, drawing.penColor, drawing.lineWidth, "arrow");
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
	t2 = t2.toFixed(0); //add more tolerance by lowering precision. Maybe add to 0 for better user experience
	t1 = t1.toFixed(0); //add more tolerance by lowering precision.
	if(t1 === t2) return true; 
	else return false; 
}

var updateColorAndLineWidth = function(obj, c, w){
	obj.lineWidth = w;
	obj.color = c; 
}

var updateXandYcoordinatesForShape = function(obj, x, y){
	//for circle, square objects
	var tmpX = x - obj.prevX; 
	var tmpY = y - obj.prevY;
	obj.prevX = x;
	obj.prevY = y;
	obj.x += tmpX; 
	obj.y += tmpY;
	//extension for line, arrow and arrow2
	if(obj instanceof Line || obj instanceof Arrow || obj instanceof Arrow2) obj.endX += tmpX; 
	if(obj instanceof Line || obj instanceof Arrow || obj instanceof Arrow2) obj.endY += tmpY;
}

var containPointSquareObject = function(obj, clickX, clickY){
	var flag = false; 
	var endX = obj.x + obj.width;
	var endY = obj.y + obj.height; 

	if(obj.x < endX && obj.y < endY){ //case 1
		if(obj.x <= clickX && clickX <= endX && obj.y <= clickY && clickY <= endY) {
			flag = true;
		}
	} else if(obj.x < endX && obj.y > endY){ //case 2
		if(obj.x <= clickX && clickX <= endX && obj.y >= clickY && clickY >= endY){
			flag = true; 
		}
	} else if(obj.x > endX && obj.y < endY){ //case 3
		if(obj.x >= clickX && clickX >= endX && obj.y <= clickY && clickY <= endY)
			flag = true;
	} else if(obj.x > endX && obj.y > endY){
		if(obj.x >= clickX && clickX >= endX && obj.y >= clickY && clickY >= endY){
			flag = true;
		}
	}

	return flag;

}

var updateTextProperties = function (obj, newFontSize, newFontName, newFontType){
	obj.fontSize = newFontSize;
	obj.fontName = newFontName;
	obj.fontType = newFontType;
}
var name = "";
var stringifiedArray = "";

$("#save").click(function(){


	stringifiedArray = JSON.stringify(drawing.shapes);

	console.log(drawing.shapes);
	
	name = prompt("Name file");
	

	var param = { "user": "telma13", // You should use your own username!
				"name": name,
				"content": stringifiedArray,
				"template": false
	};

	console.log("ýtti á save");

	$.ajax({
				type: "POST",
				contentType: "application/json; charset=utf-8",
				url: "http://whiteboard.apphb.com/Home/Save",
				data: param,
				dataType: "jsonp",
				crossDomain: true,
				success: function (data) {

					console.log("náði að save-a");
				},
				error: function (xhr, err) {
					// Something went wrong...
				}
	});
});

//Upload template

$("#upload").click(function(){

	var param1 = { "user": "telma13",
				//"content": stringifiedArray,
				"template": false
		};

	$('#listBoxContainer').show();
	console.log("ýtti á upload");

	$.ajax({
				type: "GET",
				contentType: "application/json; charset=utf-8",
				url: "http://whiteboard.apphb.com/Home/GetList",
				data: param1,
				dataType: "jsonp",
				crossDomain: true,
				success: function (data) {
					console.log("success i upload");
					console.log(data);
					console.log(data.length);

					for(var i = 0; i < data.length; i++){
						$('#sltbox').append('<option value="' + data[i].ID + '">'+ data[i].WhiteboardTitle+'</option>'); // adds item 5 at the end
		
					}
					// The save was successful...
				},
				error: function (xhr, err) {
					// Something went wrong...
				}
		});


});

$(document).ready(function(){
	$('#sltbox').on('change', function(){
	var boardID = this.value;
	var param2 = { "user": "telma13",
					"id": boardID,
	};

	$.ajax({
				type: "GET",
				contentType: "application/json; charset=utf-8",
				url: "http://whiteboard.apphb.com/Home/GetWhiteboard",
				data: param2,
				dataType: "jsonp",
				crossDomain: true,
				success: function (data) {
					
					console.log(" í GetWhiteboard");
					console.log(data);
					var tester = JSON.parse(data.WhiteboardContents);
					console.log(tester);

					for(var i = 0; i < tester.length; i++){
						//console.log(tester[0].x);
						if(tester[i].name === "square"){
							drawing.shapes.push(new Square(tester[i].x, tester[i].y, tester[i].color, tester[i].lineWidth, "square"));
							drawing.currectObject().width = tester[i].width;
							drawing.currectObject().height = tester[i].height;
							//drawing.currectObject().fillColor = tester[i].fillColor;
						}else if(tester[i].name === "circle"){
							drawing.shapes.push(new Circle(tester[i].x, tester[i].y, tester[i].color, tester[i].lineWidth, "circle"));
							drawing.currectObject().radius = tester[i].radius;
							//drawing.currectObject().fillColor = tester[i].fillColor;
						}else if(tester[i].name === "line" ){
							drawing.shapes.push(new Line(tester[i].x, tester[i].y, tester[i].color, tester[i].lineWidth, "line"));
							drawing.currectObject().endX = tester[i].endX;
							drawing.currectObject().endY = tester[i].endY;
						}else if(tester[i].name === "arrow" ){
							drawing.shapes.push(new Arrow(tester[i].x, tester[i].y, tester[i].color, tester[i].lineWidth, "arrow"));
							drawing.currectObject().endX = tester[i].endX;
							drawing.currectObject().endY = tester[i].endY;
						}else if(tester[i].name === "arrow2" ){
							drawing.shapes.push(new Arrow2(tester[i].x, tester[i].y, tester[i].color, tester[i].lineWidth, "arrow2"));
							drawing.currectObject().endX = tester[i].endX;
							drawing.currectObject().endY = tester[i].endY;
						}else if(tester[i].name === "text_area"){
							drawing.shapes.push(new Text_Area(tester[i].x, tester[i].y, tester[i].color, tester[i].lineWidth, "text_area"));
							drawing.currectObject().fontSize = tester[i].fontSize;
							drawing.currectObject().fontName = tester[i].fontName;
							drawing.currectObject().fontType = tester[i].fontType;
							drawing.currectObject().inputText = tester[i].inputText;
							
						}else if(tester[i].name === "eraser"){
							drawing.shapes.push(new Eraser(tester[i].x, tester[i].y, tester[i].color, tester[i].lineWidth, "eraser"));
							drawing.currectObject().width = tester[i].width;
							drawing.currectObject().height = tester[i].height;
						
							
						}else if(tester[i].cords !== null ){
							drawing.shapes.push(new Pen(tester[i].x, tester[i].y, tester[i].color, tester[i].lineWidth));
							drawing.currectObject().endX = tester[i].endX;
							drawing.currectObject().endY = tester[i].endY;
							drawing.currectObject().cords = tester[i].cords;

						}
						drawing.drawAllShapes();
					}

				},
				error: function (xhr, err) {
					// Something went wrong...
				}
		});
	$('#listBoxContainer').hide();

	});
});
