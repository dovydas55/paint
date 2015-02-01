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