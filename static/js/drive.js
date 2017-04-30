$(document).ready(function() {
    main();
});


function main() {
    var componentOne = new LoginRegistration();
    componentOne.createMainDiv();

}

class LoginRegistration {

    createMainDiv() {
        var self = this;
        $("body").append("<div class = movable id = login></div>");
        $("body").append("<div class = movable id = register></div>");
        this.cssMainDiv();
        $("#login").append("<h2 id = l style = 'color: white; text-shadow: 1px 0 black, 0 0px black, 0px 0 black, 0 1px black;'>Login</h2>")
        $("#register").append("<h2 id = r style = 'color: white; text-shadow: 1px 0 black, 0 0px black, 0px 0 black, 0 1px black;'>Register</h2>")

        $("#register").on("click", function() {
            self.extend("#register");
        });
        $("#login").on("click", function() {
            self.extend("#login");
        });
    }

    extend(divId) {
        var self = this;
        if (divId == "#login") $(divId).animate({right: '300px', top: '200px', height: '420px', width: '400px'});
        else $(divId).animate({left: '580px', top: '200px', height: '420px', width: '400px'});
        $(divId).css("z-index", "1"); // z-index specifies the stack order of an element
                                        // an element with a higher stack order is always on top the other element
        $(divId).append("<img id = close-icon src = 'static/imgs/close.png'></img>");
        $("#close-icon").css("height", "5%").css("width", "5%").css("position", "relative").css("bottom", "50px").css("left", "175px");

        $(divId).off(); // removing event handler

        $("#close-icon").on("click", function() {
            if (divId == "#login") {
                $(divId).animate({left: '600px', top: '250px', height: '70px', width: '150'});
                $(divId).css("z-index", "0"); // z-index specifies the stack order of an element
                                            // an element with a higher stack order is always on top the other element
            } else {
                $(divId).animate({left: '800px', top: '250px', height: '70px', width: '150'});
                $(divId).css("z-index", "0"); // z-index specifies the stack order of an element
            }
            $("#close-icon").remove();
            $(divId).on("click", function() {
                self.extend(divId);
            });
        }); // attaching event handler
    }

    cssMainDiv() {
        var cls = ".movable";
        var login = "#login";
        var register = "#register";
        $(cls).css("text-align", "center");
        $(cls).css("border", "1px black solid");
        $(cls).css("position", "fixed");
        $(cls).css("background", "#333333");
        $(cls).css("box-shadow", "7px 7px 7px grey");
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
