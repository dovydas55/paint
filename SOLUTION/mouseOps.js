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