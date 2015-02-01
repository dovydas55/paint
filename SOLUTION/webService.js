var name = "";
var stringifiedArray = "";

$("#save").click(function(){


	stringifiedArray = JSON.stringify(drawing.shapes);

	console.log(drawing.shapes);
	
	name = prompt("Name file");
	

	var param = { "user": "dovydas13", // You should use your own username!
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

	var param1 = { "user": "dovydas13",
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
	var param2 = { "user": "dovydas13",
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
							drawing.currectObject().fillColor = tester[i].fillColor;
						}else if(tester[i].name === "circle"){
							drawing.shapes.push(new Circle(tester[i].x, tester[i].y, tester[i].color, tester[i].lineWidth, "circle"));
							drawing.currectObject().radius = tester[i].radius;
							drawing.currectObject().fillColor = tester[i].fillColor;
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
						}/*else if(tester[i].cords !== null ){
							drawing.shapes.push(new Pen(tester[i].x, tester[i].y, tester[i].color, tester[i].lineWidth));
							drawing.currectObject().endX = tester[i].endX;
							drawing.currectObject().endY = tester[i].endY;
							drawing.currectObject().cords = tester[i].cords;

						}*/else if(tester[i].name === "text_area"){
							drawing.shapes.push(new Text_Area(tester[i].x, tester[i].y, tester[i].color, tester[i].lineWidth, "text_area"));
							drawing.currectObject().fontSize = tester[i].fontSize;
							drawing.currectObject().fontName = tester[i].fontName;
							drawing.currectObject().fontType = tester[i].fontType;
							drawing.currectObject().inputText = tester[i].inputText;
							
						}else if(tester[i].name === "eraser"){
							drawing.shapes.push(new Eraser(tester[i].x, tester[i].y, tester[i].color, tester[i].lineWidth, "eraser"));
							drawing.currectObject().width = tester[i].width;
							drawing.currectObject().height = tester[i].height;
						
							
						}else if(tester[i].name === "image"){
							drawing.shapes.push(new Image(10, 10, null, null));
							drawing.currectObject().url = tester[i].url;
							drawing.currectObject().img = tester[i].img;
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
