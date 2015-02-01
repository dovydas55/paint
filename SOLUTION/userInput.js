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
	//spliceIndex: -1,
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
				//drawing.spliceIndex = i;
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

var button = document.getElementById('download');
button.addEventListener('click', function (e) {
    var dataURL = el.toDataURL('image/png');
    button.href = dataURL;
});
