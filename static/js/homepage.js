/*
Author: Md. Tanvir Islam
*/
$(document).ready(function() {
	main();
});

function main() {
	var componentOne = new LoginRegistration();
	componentOne.createMainDiv();
}

class LoginRegistration {

	constructor() {
		this.expanded = false;
		this.clicks = 0;
	}

	createMainDiv() {
		var self = this;
		$("body").append("<div class = movable id = login></div>");
		$("body").append("<div class = movable id = register></div>");
		$("#login").append("<h2 id = l style = 'color: white; text-shadow: 1px 0 black, 0 0px black, 0px 0 black, 0 1px black;'>Login</h2>")
		$("#register").append("<h2 id = r style = 'color: white; text-shadow: 1px 0 black, 0 0px black, 0px 0 black, 0 1px black;'>Register</h2>")
		this.cssMainDiv();
		// attaches event handler
		$("#register").on("click", function() {
			++self.clicks;
			self.extend("#register");
		});
		// attaches event handler
		$("#login").on("click", function() {
			++self.clicks;
			self.extend("#login");
		});
	}

	extend(divId) {
		// if expanded is false it means we have not clicked on the div yet so expand the div and attach the event handler
		// to the cross div that gets dynamically added
		var self = this;
		if (!this.expanded && this.clicks % 2 != 0) {
			if (divId == "#login") $(divId).animate({left: '450px', top: '5px', height: '700px', width: '700px'});
			else $(divId).animate({left: '480px', top: '5px', height: '700px', width: '700px'});
			$(divId).css("z-index", "1"); // z-index specifies the stack order of an element
											// an element with a higher stack order is always on top the other element
			$(divId).append("<img id = close-icon src = 'static/imgs/close.png'></img>");

			this.createTextFields(divId);

			$("#close-icon").css("height", "1.5%").css("width", "1.5%").css("position", "relative").css("top", "240px").css("left", "135px");
			
			if (divId == "#login") {
				$("#l").css("top", "230px").css("right", "100px");
			} else {
				$("#r").css("top", "230px").css("right", "100px");
			}

			// attaches the event handler to the cross icon
			$("#close-icon").on("click", function() {
				self.clicks = 1; // reset clicks to 1 which is an odd number everytime you click on the cross, this prevents it from restarting
								 // as one of the condition is that you only expand if and only if it is even so the next time you click
								// has to be the time when it is actually even as 1 + 1 = 2, and when you lick again it will be 3 allowing this
								// function to be executed
				self.collapse(divId, self);
			}); // attaching event handler
			this.expanded = true;
		}
	}

	collapse(divId, self) {
		if (divId == "#login") {
			$(divId).animate({left: "600px", top: "250px", height: "200px", width: "200px"});
			$(divId).css("z-index", "0"); // z-index specifies the stack order of an element
										// an element with a higher stack order is always on top the other element
			$("#l").css("top", "80px").css("right", "0px");								
		} else {
			$(divId).animate({left: "800px", top: "250px", height: "200px", width: "200px"});
			$(divId).css("z-index", "0"); // z-index specifies the stack order of an element
			$("#r").css("top", "80px").css("right", "0px");	
		}
		$("input").remove();
		// $("button").remove();
		$("#close-icon").remove(); // the close icon should be also responsible for deleting itself and should be inside the body
								   // of the close event handler
		self.expanded = false;								   
	}

	createTextFields(divId) {
		$(divId).append("<div><input class = box id = name type = text placeholder = '              username'></input><div>");
		$(divId).append("<div><input class = box id = password type = password placeholder = '              password'></input><div>");
		// $(divId).append("<button id = submit>submit</button>");
		this.cssText();
		//this.cssButtonSubmit();
		this.submitForm(divId);
		this.nameCheck(divId);
	}

	submitForm(divId) {
		var self = this;
		$(divId).on("keypress", function(event) {
			if (event.keyCode === 13) {
				var dataToSend = {};
				dataToSend.username = $("#name").val();
				dataToSend.password = $("#password").val();
				dataToSend.which = divId;
				$.ajax({
					url: "/authenticate",
					dataType: "text",
					type: "POST",
					data: dataToSend,
					success: function(data) {
						if (data === "login-name-error") {
							$("#name").css("border-bottom", "1px solid #ff3333");
						} else if (data === "login-password-error") {
							$("#password").css("border-bottom", "1px solid #ff3333");																				
						} else if (data === "registration-success") {
							self.collapse(divId, self); // collapse the div which is extended
						} else if (data === "registration-failure") {
							$("#name").css("border-bottom", "1px solid #ff3333");
						} else { // when an object is sent! during login
							self.collapse(divId, self); // collapse the div which is extended
							setTimeout(function() { // this set time out allows collapse funciton to finish and waits for it
								var	parsedObj = JSON.parse(data);
								$("h2").remove();							
								$(".movable").animate({height: "0px", width: "0px"});
								setTimeout(function() { // this setTimeout function waits for the animation of the divs to be completed before the divs can be removed
									$(".movable").remove();
									// call the function that generates a div which contains a string here

																/* Used to display the user id, but plans changed  */

									// $("body").append("<div id = feedback><h2 id = userId>" + "Id: " + parsedObj.id + "<h2></div>");
									// $("#userId").css("text-shadow", "1px 0 black, 0 0px black, 0px 0 black, 0 1px black");
									// $("#feedback").css("position", "relative").css("width", "100px").css("left", "550px").css("top", "300px");

									var requestObj = {};
									requestObj.name = dataToSend.username;
									$.ajax({
										url: "/redirect",
										type: "POST",
										data: requestObj,
										success: function() {





										}
									})
								}, 1000);
							}, 500);
						}
					}
				})
			}
		})
	}

	nameCheck(divId) {
		var reqBody = {};
		if (divId === "#register") {
			$("#name").on("keyup", function() {
				reqBody.val = $("#name").val();
				if (reqBody.val === "") {
					$("#name").css("border-bottom", "1px solid white");
					return;
				}
				$.ajax({
					url: "/nameCheck",
					type: "POST",
					dataType: "text",
					data: reqBody,
					success: function(data) {
						if (data === "0") {
							$("#name").css("border-bottom", "1px solid #ff3333");
						} else {
							$("#name").css("border-bottom", "1px solid #4dff4d");
						}
					}
				})
			});
		}
	}

	cssText() {
		$(".box").css("border-radius", "0%"); // no circular boxes, edgy boxes only
		$(".box").css("position", "relative"); // movable element
		$(".box").css("height", "28px").css("width", "40%").css("right", "5%").css("font-size", "18px");
		$(".box").css("background", "transparent"); // makes the background transparent of the text boxes
		$(".box").css("color", "white").css("border", "none"); // color of the text is white and contains no borders
		$(".box").css("border-bottom", "1px solid white"); // only contains a bottom border which is white
		$(".box").focusin(function() { $(this).attr("placeholder", "");}); // adds a placeholder name when focused in
		$("#name").focusout(function() { $(this).attr("placeholder", "              username"); });
		$("#password").focusout(function() { $(this).attr("placeholder", "              password");});
		$("#name").css("top", "250px"); // changing position
		$("#password").css("top", "280px"); // changing position
	}

	// cssButtonSubmit() {
	// 	// position and dimension change
	// 	$("#submit").css("position", "relative");
	// 	$("#submit").css("top", "350px").css("right", "75px");
	// 	$("#submit").css("border-radius", "0px");
	// 	$("#submit").css("height", "45px");
	// 	$("#submit").css("width", "200px");
	// 	// looks and definition
	// 	$("#submit").css("background", "white");
	// 	$("#submit").css("box-shadow", "rgba(255,255,255,0.4) 0 0px 0, inset rgba(255,255,255,0.4) 0 0px 0");
	// 	$("#submit").css("text-shadow", "#545759 0 1px 0");
	// 	$("#submit").css("color", "#548db3");
	// 	$("#submit").css("font-size", "23px");
	// 	$("#submit").css("font-family", "helvetica, serif");
	// 	$("#submit").css("text-decoration", "none");
	// 	$("#submit").css("vertical-align", "middle");
	// 	$("#submit").css("cursor", "pointer"); // changes the cursor to a pointer

	// 	// on mouse over change properties
	// 	$("#submit").on("mouseover", function() {
	// 		$("#submit").css("border", "0px solid #4e565e");
	// 		$("#submit").css("text-shadow", "#8c9aa3 0 1px 0");
	// 		$("#submit").css("background", "#3e779d");
	// 		$("#submit").css("border", "0px solid #4e565e");
	// 		$("#submit").css("color", "#ebebeb");
	// 	});

	// 	// on mouse out change property back to default
	// 	$("#submit").on("mouseout", function() {
	// 		$("#submit").css("border", "none");
	// 		$("#submit").css("text-shadow", "#545759 0 1px 0");
	// 		$("#submit").css("background", "white");
	// 		$("#submit").css("color", "#548db3");	
	// 	});
	// }

	cssMainDiv() {
		var cls = ".movable";
		var login = "#login";
		var register = "#register";
		var l = "#l";
		var r = "#r";
		$(cls).css("background-image", "url(static/imgs/cloud-3.png)"); // images for the div
		$(cls).css("background-repeat", "no-repeat"); // prevents image from repeating to fill background
		$(cls).css("background-size", "contain"); // allows the background image to be filled around the div
		$(cls).css("text-align", "center");
		$(cls).css("border", "none");
		$(cls).css("position", "fixed");
		$(cls).css("height", "200px");
		$(cls).css("width", "200px");
		$(cls).css("top", "250px");
		$(login).css("left", "600px");
		$(register).css("left", "800px");
		$(cls).css("cursor", "pointer"); // changes the cursor on hover	
		$(l).css("position", "relative");
		$(r).css("position", "relative");
		$(l).css("top", "80px");
		$(r).css("top", "80px");	
	}

}

