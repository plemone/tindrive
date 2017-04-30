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
        this.cssMainDiv();
        $("#login").append("<h2 id = l style = 'color: white; text-shadow: 1px 0 black, 0 0px black, 0px 0 black, 0 1px black;'>Login</h2>")
        $("#register").append("<h2 id = r style = 'color: white; text-shadow: 1px 0 black, 0 0px black, 0px 0 black, 0 1px black;'>Register</h2>")

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
        console.log(this.clicks);
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
                if (divId == "#login") {
                    $(divId).animate({left: '600px', top: '250px', height: '70px', width: '150'});
                    $(divId).css("z-index", "0"); // z-index specifies the stack order of an element
                                                // an element with a higher stack order is always on top the other element
                } else {
                    $(divId).animate({left: '800px', top: '250px', height: '70px', width: '150'});
                    $(divId).css("z-index", "0"); // z-index specifies the stack order of an element
                }
                $("input").remove();
                $("button").remove();
                $("#close-icon").remove(); // the close icon should be also responsible for deleting itself and should be inside the body
                                           // of the close event handler
                self.expanded = false;
            }); // attaching event handler
            this.expanded = true;
        }
    }

    createTextFields(divId) {
        $(divId).append("<div><input class = box id = name type = text placeholder = '              username'></input><div>");
        $(divId).append("<div><input class = box id = password type = password placeholder = '              password'></input><div>");
        $(divId).append("<button id = submit>submit</button>");
        this.cssText();
        this.cssButtonSubmit();
    }

    cssText() {
        $(".box").css("border-radius", "0%");
        $(".box").css("position", "relative");
        $(".box").css("height", "30px").css("width", "50%").css("font-size", "18px");
        $(".box").css("background", "transparent");
        $(".box").css("color", "white").css("border", "none");
        $(".box").css("border-bottom", "1px solid white");
        $(".box").focusin(function() { $(this).attr("placeholder", "");});
        $("#name").focusout(function() { $(this).attr("placeholder", "              username"); });
        $("#password").focusout(function() { $(this).attr("placeholder", "              password");});
        $("#name").css("top", "20px");
        $("#password").css("top", "50px");
    }

    cssButtonSubmit() {
        $("#submit").css("position", "relative");
        $("#submit").css("top", "110px");
        $("#submit").css("border-radius", "0px");
        $("#submit").css("height", "45px");
        $("#submit").css("width", "200px");
        $("#submit").css("background", "white");
        $("#submit").css("box-shadow", "rgba(255,255,255,0.4) 0 0px 0, inset rgba(255,255,255,0.4) 0 0px 0");
        $("#submit").css("text-shadow", "#545759 0 1px 0");
        $("#submit").css("color", "#548db3");
        $("#submit").css("font-size", "23px");
        $("#submit").css("font-family", "helvetica, serif");
        $("#submit").css("text-decoration", "none");
        $("#submit").css("vertical-align", "middle");
        $("#submit").css("cursor", "pointer");

        $("#submit").on("mouseover", function() {
            $("#submit").css("border", "0px solid #4e565e");
            $("#submit").css("text-shadow", "#8c9aa3 0 1px 0");
            $("#submit").css("background", "#3e779d");
            $("#submit").css("border", "0px solid #4e565e");
            $("#submit").css("color", "#ebebeb");
        });

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
        $(cls).css("text-align", "center");
        $(cls).css("border", "1px black solid");
        $(cls).css("position", "fixed");
        $(cls).css("background", "#333333");
        $(cls).css("box-shadow", "2px 0px 4px grey");
        $(cls).css("height", "70px");
        $(cls).css("width", "150px");
        $(cls).css("border-radius", "2%");
        $(cls).css("cursor", "pointer"); // changes the cursor on hover
        $(login).css("left", "600px");
        $(login).css("top", "250px");
        $(register).css("left", "800px");
        $(register).css("top", "250px");
    }

}
