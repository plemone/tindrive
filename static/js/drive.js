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
			if (divId == "#login") $(divId).animate({right: '300px', top: '200px', height: '420px', width: '400px'});
			else $(divId).animate({left: '580px', top: '200px', height: '420px', width: '400px'});
			$(divId).css("z-index", "1"); // z-index specifies the stack order of an element
											// an element with a higher stack order is always on top the other element
			$(divId).append("<img id = close-icon src = 'static/imgs/close.png'></img>");

			this.createTextFields(divId);

			$("#close-icon").css("height", "5%").css("width", "5%").css("position", "relative").css("bottom", "50px").css("left", "175px");


			// attaches the event handler to the cross icon
			$("#close-icon").on("click", function() {
				self.clicks = 1; // reset clicks to 1 which is an odd number everytime you click on the cross, this prevents it from restarting
								 // as one of the condition is that you only expand if and only if it is even so the next time you click
								// has to be the time when it is actually even as 1 + 1 = 2, and when you lick again it will be 3 allowing this
								// function to be executed
				self.collapse(divId);
				self.expanded = false;
			}); // attaching event handler
			this.expanded = true;
		}
	}

	collapse(divId) {
		if (divId == "#login") {
			$(divId).animate({left: '600px', top: '250px', height: '200px', width: '200'});
			$(divId).css("z-index", "0"); // z-index specifies the stack order of an element
										// an element with a higher stack order is always on top the other element
		} else {
			$(divId).animate({left: '800px', top: '250px', height: '200px', width: '200'});
			$(divId).css("z-index", "0"); // z-index specifies the stack order of an element
		}
		$("input").remove();
		$("button").remove();
		$("#close-icon").remove(); // the close icon should be also responsible for deleting itself and should be inside the body
								   // of the close event handler
	}



	createTextFields(divId) {
		$(divId).append("<div><input class = box id = name type = text placeholder = '              username'></input><div>");
		$(divId).append("<div><input class = box id = password type = password placeholder = '              password'></input><div>");
		$(divId).append("<button id = submit>submit</button>");
		this.cssText();
		this.cssButtonSubmit();
		this.submitForm(divId);
	}

	submitForm(divId) {
		$("#submit").on("click", function() {
			var dataToSend = {};
			dataToSend.username = $("#name").val();
			dataToSend.password = $("#password").val();
			dataToSend.which = divId;
			$.ajax({
				url: "/authenticate",
				type: "POST",
				data: dataToSend,
			})
		})
	}

	cssText() {
		$(".box").css("border-radius", "0%"); // no circular boxes, edgy boxes only
		$(".box").css("position", "relative"); // movable element
		$(".box").css("height", "30px").css("width", "50%").css("font-size", "18px");
		$(".box").css("background", "transparent"); // makes the background transparent of the text boxes
		$(".box").css("color", "white").css("border", "none"); // color of the text is white and contains no borders
		$(".box").css("border-bottom", "1px solid white"); // only contains a bottom border which is white
		$(".box").focusin(function() { $(this).attr("placeholder", "");}); // adds a placeholder name when focused in
		$("#name").focusout(function() { $(this).attr("placeholder", "              username"); });
		$("#password").focusout(function() { $(this).attr("placeholder", "              password");});
		$("#name").css("top", "20px"); // changing position
		$("#password").css("top", "50px"); // changing position
	}

	cssButtonSubmit() {
		// position and dimension change
		$("#submit").css("position", "relative");
		$("#submit").css("top", "110px");
		$("#submit").css("border-radius", "0px");
		$("#submit").css("height", "45px");
		$("#submit").css("width", "200px");
		// looks and definition
		$("#submit").css("background", "white");
		$("#submit").css("box-shadow", "rgba(255,255,255,0.4) 0 0px 0, inset rgba(255,255,255,0.4) 0 0px 0");
		$("#submit").css("text-shadow", "#545759 0 1px 0");
		$("#submit").css("color", "#548db3");
		$("#submit").css("font-size", "23px");
		$("#submit").css("font-family", "helvetica, serif");
		$("#submit").css("text-decoration", "none");
		$("#submit").css("vertical-align", "middle");
		$("#submit").css("cursor", "pointer"); // changes the cursor to a pointer

		// on mouse over change properties
		$("#submit").on("mouseover", function() {
			$("#submit").css("border", "0px solid #4e565e");
			$("#submit").css("text-shadow", "#8c9aa3 0 1px 0");
			$("#submit").css("background", "#3e779d");
			$("#submit").css("border", "0px solid #4e565e");
			$("#submit").css("color", "#ebebeb");
		});

		// on mouse out change property back to default
		$("#submit").on("mouseout", function() {
			$("#submit").css("border", "none");
			$("#submit").css("text-shadow", "#545759 0 1px 0");
			$("#submit").css("background", "white");
			$("#submit").css("color", "#548db3");
		});
	}

	cssMainDiv() {
		var cls = ".movable";
		var login = "#login";
		var register = "#register";
		var l = "#l";
		var r = "#r";
		$(cls).css("background-image", "url(static/imgs/cloud-3.png)");
		$(cls).css("background-repeat", "no-repeat");
		$(cls).css("background-size", "contain");		
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

