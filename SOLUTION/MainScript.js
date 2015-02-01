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



