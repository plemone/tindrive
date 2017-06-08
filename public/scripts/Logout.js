class Logout {
	create() {
		$("body").append("<div id = logout><h3 id = l-name>logout</h3></div>");
		this.generateCSS();
		this.attachEventHandler();
	}
	attachEventHandler() {
		var requestObj = {};
		requestObj.name = $("#username").text(); // val() is used in input text boxes, text() is used to get text in between tags
		$("#logout").on("click", function() {
			$.ajax({
				url: "/logout",
				type: "POST",
				data: requestObj,
				success: function() {
					window.location.href = "/";
				}
			});
		});
	}
	generateCSS() {
		var t = "#logout";
		$(t).css("position", "relative");
		$(t).css("background-image", "url(public/images/cloud-4.png)");
		$(t).css("background-repeat", "no-repeat");
		$(t).css("background-size", "contain");
		$(t).css("cursor", "pointer");
		$(t).css("width", "100px");
		$(t).css("height", "100px");
		$(t).css("left", "92%");
		$(t).css("bottom", "53px");
		$("#l-name").css("position", "relative");
		$("#l-name").css("top", "48px");		
		$("#l-name").css("left", "20px");
		$("#l-name").css("text-shadow", "1px 0 white, 0 0px black, 0px 0 black, 0 1px white");
		$("#l-name").on("mouseover", function() {
			$("#l-name").css("color", "white");
			$("#l-name").css("text-shadow", "1px 0 black, 0 0px black, 0px 0 black, 0 1px black");
		});
		$("#l-name").on("mouseout", function() {
			$("#l-name").css("color", "black");
			$("#l-name").css("text-shadow", "1px 0 white, 0 0px black, 0px 0 black, 0 1px white");
	
		});	
	}
}
