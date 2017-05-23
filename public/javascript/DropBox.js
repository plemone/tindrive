'use strict'; // to avoid JavaScript weirdness

class DropBox {

	constructor() {
		this.fsComponent = new FileSystemLayout();
	}

	create() {
		$("body").append("<div id = main-div> <div id = dnd ></div></div");
		this.fsComponent.create();
		this.generateCSS();
		this.attachEventHandlers();
	}

	generateCSS() {
		var d = "#dnd";
		var id = "#main-div";
		$(id).css("position", "relative");
		$(id).css("height", "600px");
		$(id).css("width", "1000px");
		$(id).css("left", "280px");
		$(id).css("bottom", "20px");
		$(id).css("border", "1px solid white");
		$(id).css("background", "#e6f9ff");
		$(id).css("border-radius", "2%");
		$(d).css("position", "relative");
		$(d).css("height", "593px");
		$(d).css("width", "820px");
		$(d).css("border", "3px solid #262626");
		$(d).css("border-radius", "2%");
		$(d).css("background", "white");
		$(d).css("overflow-y", "auto"); // this allows the y-axis of the div scrollable
	}

/*
	stopPropagation stops the event from bubbling up the event chain.
	preventDefault prevents the default action the browser makes on that event.

	Automatic opening of the files needed to be prevented, thats why we prevent the default action
	of the broswer.

*/

/*
	drag - Fired when an element or text selection is being dragged.
	dragend - Fired when a drag operation is being ended (for example, by releasing a mouse button or hitting the escape key). (See Finishing a Drag.)
	dragenter - Fired when a dragged element or text selection enters a valid drop target.
	dragexit - Fired when an element is no longer the drag operation's immediate selection target.
	dragleave - Fired when a dragged element or text selection leaves a valid drop target.
	dragover - Fired when an element or text selection is being dragged over a valid drop target (every few hundred milliseconds).
	dragstart - Fired when the user starts dragging an element or text selection. (See Starting a Drag Operation.)
	drop - Fired when an element or text selection is dropped on a valid drop target. (See Performing a Drop.)
*/

	attachEventHandlers() {
		var self = this; // "this" keyword is redefined within each scope and means different from scope to scope

		var d = "#dnd";

		// has no effect on the drag and drop feature
		$(d).on("dragend", function(event) {
			// when mouse button is realeased
			event.preventDefault();
			event.stopPropagation();

			console.log("dragend - Button released");

		});

		// has no effect on the drag and drop feature
		$(d).on("dragexit", function(event) {
			// in or out of the window
			event.preventDefault();
			event.stopPropagation();

			console.log("dragexit - The element to be dropped is either in the window or not");

		});

		// event which is the main culprit here
		$(d).on("dragover", function(event) {
			// dragging motion ends
			// WHEN THE DRAGGING MOTION ENDS THE FILE GETS AUTOMATICALLY OPENED IN THE BROWSER
			// WINDOW BY THE BROWSER
			// TO PREVENT THAT FROM HAPPENING the defaults are prevented!
			event.preventDefault();
			event.stopPropagation();

			console.log("dragover - Dragging motion is over now");

		});

		$(d).on("dragenter", function(event) {
			// when a valid drop target is reached 
			// perfect time to make the div highlighted
			event.preventDefault();
			event.stopPropagation();


			console.log("dragenter - Target acquired!");

			$(d).css("background", "#E6D1E6");
			$(d).css("border", "3px solid white");
		});

		$(d).on("dragleave", function(event) {
			// when a valid drop target is untargeted
			// perfect time to make the div unhighlighted
			event.preventDefault();
			event.stopPropagation();


			console.log("dragleave - Out of target!");
			
			$(d).css("background", "white");
			$(d).css("border", "3px solid #262626");			


		});		

		$(d).on("drop", function(event) {
			// dropping the file
			// background color also needs to be turned to default because this is the last event
			// fired after all the events
			
			// if defaults are not prevented then the browser will simply open the files

			event.preventDefault();
			event.stopPropagation();

			console.log("drop - Event triggered!");

			$(d).css("background", "white");
			$(d).css("border", "3px solid #262626");

			/*
				jQuery doesn't wrap the native browser event with all its APIs like the File API in this example, 
				so to get access to those excluded properties and functions from the jQuery event we must use event.
				originalEvent. Hope that helps someone
			
				It is the native event of the browser which is not covered by jquery, originalEvents is a key of jquery event object
				which contains the browsers original events

			*/

			// event.originalEvent.dataTransfer returns an object which contains detailed information
			// about the file being dropped

			// https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer --> for more info
			
			// returns a list of file objects, usually the list will contain only one item according to my observation
			var files = event.originalEvent.dataTransfer.files;

			// dataTransfer returns an object with several properties, one of attribute is "items"
			// which returns a list of DataTransferItem objects!

			// event.originalEvent.dataTransfer.files[0] // also returns a DataTransferItem object
			// similar to event.originalEvent.dataTransfer.items[0].getAsFile()

			// https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem -- for more info

			// next step is to actually read the file

			// refer to this link for more detauls on the file reader object

			// http://www.javascripture.com/FileReader --> more info

			// look into the upload function for the implementation of reading the data as a buffer
			
			// iterates over the list of files and uploads them using ajax requests to the server

			// if it is a folder that is being dragged and droped then it will not work!, as if it is
			// a folder files will not be an array of files, in my system only files cam be dragged and dropped

			for (var i = 0; i < files.length; ++i) {
				// create file layout

				// adds the file to the server and to the UI
				self.fsComponent.addFile(files[i]);

			}

		});
	}

}
