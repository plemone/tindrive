'use strict'; // to avoid JavaScript weirdness

/*
	Responsible for managing the #dnd div which is basically the drop box zone
	should contain some sort of data structure which allows it to keep a track
	of how the file system actually looks like, x and y axis value to place a 
	file, should be the main communicator with the user, and should have a 
	composition relationship with FileIcon and FolderIcon classes.

	Main Algorithm - The list of files and folders received from the server is just a mirage of what its actually like in the server, they
					 contain no information, just the names, with tags like if the element is a file or not, if it is a folder we simply
					 extend our path with the name of the folder and send the path back to the server. Then the server looks at the path
					 makes the system call "ls -l" and sends back the new ls -l to the client side. The client side with the information
				 	 of ls -l again removes all the files and folder its viewing currently in the dropzone and populates with new files
				 	 and folders. Each time you press back the path gets shortened and the server sends ls -l informations and each time
					 you click or enter a folder the path gets extended again with the folder name.

					 NOTE** - For viewing files/folders a bunch of personalized client data like icon size, icon image etc is made
					 		  in this class which isn't necessarily important.
*/


class FileSystemLayout {

	constructor() {
		this.x = 15; // x-axis of the component

		this.y = 7; // y-axis of the component

		this.dropZoneId = "#dnd"; // main focus variable

		this.table = new Table(8); // datastructure that structures the icon in a table like manner, 8 indicates how many elements each row array will have

		this.path = new Path("./filesystems/user-fs/" + $("#username").text() + "/"); // composition relationsip with Path

		this.selections = []; // will contain the DOM element currently selected either by click or key navigations

		this.globalClick = false; // this keeps track of whether the drop zone click should make all the files blue or not, if it is true then then the counter will be incremented
		
		this.counter = 0; // only if the counter is greater than 0 the click event handler will loop through everything and unselect and selected file and turn the color of the file from red to blue
		
		this.keyStack = []; // a stack of event keys for creating a new folder
		
		this.route = "/" + $("#username").text() + "/"; // default route options, strings get added on top of this depending on the situation to make ajax requests

		this.ctrl = false; // keeps track of whether control button is pressed or not

		this.navCoordinates = {r: -1, i: -1, init: true}; // dictionary contains 3 key value pairs, x coordinate, y coordinate and init which indicates if this is the first movement or not

		this.downloadComponent = new Download(this.route); // composition relationship with the download button component

		this.deleteComponent = new Delete(this.route); // composition releationship with the delete button component

		this.trashComponent = new Trash(this.trashDirSize()); // composition relationship with the trash button component, calls the trashDir's size function which returns the size of the trash directory for the current user, the returned value gets passed inside the constructor of Trash

		this.trashDirEntry = {"entry": false, "dir": new Path("./trash/")}; // an object indicating whether we entered the trashed and dir is the path or path of the folders we visited from the current trash directory
																			// each folder you click will get added to Path like this path + "folder/", this path gets shorter when we press backspace or go out of the folder
	
		this.recoverComponent = new Recover(this.route); // composition relationship with the recover button component
	}

	// basic create() method that comes in with every component
	create() {
		this.generateInitialFS();
		this.attachGlobalClickEH();
		this.attachWindowEH();
		this.downloadComponent.create();
		this.deleteComponent.create();
		this.recoverComponent.create();
		this.trashComponent.create();
		this.trashButtonClick();
	}


	trashDirSize() {
		// variable made where size gets stored
		var size = 0;
		var self = this; // the keyword this has different meaning in different scopes
		$.ajax({
			url: self.route + "trashDirSize",
			type: "GET",
			async: false, // We turn the flag false as we want our ajax request to not be synchronous and we want this function to return 
						 // the data on callback as the return value will be assigned to a variable which exists inside the function body
						 // which gets returned. Remember an async function even inside the actual function body which has a return statement
						 // will still return after the enclosing function has eneded.
			success: function(data) {
				size = data.size;
			}
		})
		return size;
	}


	// on initial page load this function gets invoked, so that the contents in the root directory can be displayed
	generateInitialFS() {
		var self = this;
		// on creation of the file system layout we must make an ajax request to get the list
		// of files there is initially on the root folder, so that we can display the users
		var requestObj = {}
		requestObj.path = this.path.get;

		$.ajax({
			url: self.route + "init",
			type: "POST",
			data: requestObj,
			success: function(data) {
				for (var i = 0; i < data.ls.length; ++i) {
					if (data.ls[i].type === "file") {
						// if the content is a file then add file to DOM
						self.addFileToDOM(data.ls[i].name);
					} else {
						// if the content is a folder then add the folder to DOM
						self.addFolderToDOM(data.ls[i].name);
					}
				}
			}
		})
	}

	// adds a file to the document object model
	addFileToDOM(fileName) {

		// never name variables file, JavaScript confuses it with some built in keyword
		var fileIcon = new FileIcon(fileName, this.x, this.y, this.path.get); // name of the file, x and y coordinate and path the icon belongs to

		if (this.table.contains(fileIcon, function(x, y) { // an anonymous function being passed which gets called inside table, and table passed on the parameters to the functions inside tables function
			if (x.name === y.name && x.path === y.path) return true;
			else return false;
		})) { // checks if the file that got created already exists in the table, this if statement actually calls a function which returns true or false
			alert("File with that name already exists!");
			return;
		}

		fileIcon.create(); // create the file icon components, after the check as this draws the file icon in the browser
	
		this.attachIconEH(fileIcon); // attach the event handler of the file
	
		// update the table with the new file
		this.table.add(fileIcon); 

		// extract the row and index value of the row
		var {r, i} = this.table.at();

		// add the table coordinates for the individual folder
		fileIcon.tableCoordinates.push(r);
		fileIcon.tableCoordinates.push(i);

	}

	// adds a folder to the document object model
	addFolderToDOM(folderName) {

		var folder = new FolderIcon(folderName, this.x, this.y, this.path.get); // name of the folder, x and y coordinate and path the icon belongs to

		if (this.table.contains(folder, function(x, y) { // an anonymous function being passed which gets called inside table, and table passed on the parameters to the functions inside tables function
			if (x.name === y.name && x.path === y.path) return true;
			else return false;
		})) { // this if statement actually calls a function which returns true or false
			alert("Folder with that name already exists!");
			return;
		}

		folder.create(); // create the file icon components, after the check as this draws the file icon in the browser

		this.attachIconEH(folder); // attach the event handler of the folder

		// update the table with the new folder
		this.table.add(folder);

		// extract the row and index value of the row
		var {r, i} = this.table.at();

		// add the table coordinates for the individual folder
		folder.tableCoordinates.push(r);
		folder.tableCoordinates.push(i);

	}

	// adds a file icon to the DOM and uploads the folder to the server
	addFile(fObj) {
		this.addFileToDOM(fObj.name);
		// makes asynchronous request to the server to upload the file
		this.uploadFile(fObj);
	}

	// adds a folder icon to the DOM and uploads the folder to the server
	addFolder(folderName) {
		this.addFolderToDOM(folderName);
		this.uploadFolder(folderName);
	}

	/*
		the data is being manipulated as a string and will be sent to the server using a string
		the data can also be sent to the server using an ArrayBuffer object but I chose string for simplicity
		as different languages all have strings in common but not the JavaScript object ArrayBuffer
		http://stackoverflow.com/questions/31581254/how-to-write-a-file-from-an-arraybuffer-in-js
		link above shows how to write to a file using an array buffer

		Represents a raw buffer of binary data, which is used to store data for the different typed arrays. 
		ArrayBuffers cannot be read from or written to directly, but can be passed to a typed array or DataView 
		Object to interpret the raw buffer as needed. 
	*/

	// uploads a file to the server
	uploadFile(file) { // requests the server to upload the file
		var self = this;
		var reader = new FileReader();
		// call back function, which means it is the last thing to get executed
		reader.onload = function(event) {
			var data = reader.result; // returns the result of the callback, on ready state 4 of the reader async function

			/*
				when you console.log data it will appear to look like something like this
				data:application/msword;base64,0M8R4KGxGuEAAAAAAAAAAAAAAAAA........
				obviously it depends from file to file, but you will get the file type and then
				comma the actual data, now to extract the data you split and make it into an array
				by the comma, and now you have the type of data and the contents of the data in an 
				JavaScript array containing two elements.
				We don't really care about the first index so we take the second indext and now we 
				have our array of contents to be stored in the server side!

				readAsDataUrl automatically converts it to base64 we just need to extract the actual
				part from the gigantic string

			*/
	
			// convert the data to base64
			var base64 = data.split(",")[1];

			// p element with the id, "#username" contains the user name
			var u = "/" + $("#username").text() + "/" + "uploadFiles";
			var requestObj = {}	
			// fill in the contents of the object with file informations		
			requestObj.name = file.name;
			requestObj.lastModified = file.lastModified;
			requestObj.size = file.size;
			requestObj.type = file.type;
			requestObj.contents = base64;
			requestObj.path = self.path.get;

			// make the ajax request
			requestObj = JSON.stringify(requestObj);
			$.ajax({
				url: u,
				type: "POST",
				data: requestObj
			})
		}
		reader.readAsDataURL(file); // calls the reader.onload function
	}

	// uploads a folder to the server
	uploadFolder(folderName) {
		var self = this;
		var folderObj = {};
		folderObj.name = folderName;
		// folderObj.path contains the path to the current working directory that the folder object will exist in
		folderObj.path = this.path.get;
		$.ajax({
			url:  self.route + "uploadFolders",
			type: "POST",
			data: folderObj
		})
	}


	// attaches all the event handlers that the document window will utilize
	attachWindowEH() {
		/*
			on keydown push the keycodde 16 to the stack
			on keyup if the key is 78 then push it to the stack and then the next
			instruction is to check if the first and second index is either 16 and 78 or 78 and 16
			then inside the if statement prompt the user, after the prompt in next instruction
			simply loop over the array and clear the array
			the array will get cleared no matter what key up you make, but remember only the
			right combination will trigger the prompt 
		*/
		var self = this;
		// checks if the keycode is 16 which is shift on keydown
		// also checks if the keycode is 78 which is n on key up

		$(window).on("keydown", function(event) {
			// 16 for shift button
			if (event.which === 16) {
				self.keyStack.push(16);
			}

			self.backSpace(event, self);
			self.arrowKeys(event, self);
			self.returnKey(event, self);

			// 17 for ctrl button
			if (event.which === 17) {
				self.ctrl = true; // upon control key down we set the boolean indicating this event to true
			}

		});
		/*
			when a key is released we need to make sure that it is the n key, therefore
			on release we push key number 78 to the stack of keys
			after it gets pushed we immedietly check if the combo 16 and 78 is the first and second index
			or 78 and 16 is the first and second index then we ask the prompt
		*/
		$(window).on("keyup", function(event) {
			if (event.which === 78) {
				self.keyStack.push(78);
			}
			/*
				if the first index of the stack of keys is 78 and the second index of the stack of keys is 16 we know we have pressed shift and n consequetively
				this might look confusing as we might want 78 first and then 16, but in our case, its a keyup, which means
				key 16 will get released first, and as it gets released it becomes the first index
				and then 78 gets released therefore n gets released first and then 78
				same thing might happen the opposite way where you may release the shift key first and then the n key, which is also valid
			*/
			if (self.keyStack[0] === 16 && self.keyStack[1] === 78 || self.keyStack[0] == 78 && self.keyStack[1] === 16) {
				var folderName = prompt("Please enter the folder name");
				self.addFolder(folderName);
			}
			/*
				always pop the array by at the end if length becomes greater than 2 as we want to hold a maximum of 2 digits
				for loop will not work while popping because self.keyStack.length is checked everytime you pop

				for example you have length of 2, if you go over the loop and pop once your i becomes 1
				now the self.keyStack.length is also checked and it turns out to be 1 now, and i = 1 and i < 1 is false therefore
				loop is broken out and we don't end up with all elements being popped
			*/
			var keyStackSize = self.keyStack.length;
			for (var i = 0; i < keyStackSize; ++i) {
				self.keyStack.pop();
			}

			// 17 for ctrl button
			if (event.which == 17) {
				self.ctrl = false; // upon control key up we set the boolean indicating this event to false
			}


		})
	}

	// return key event handler for the window
	returnKey(event, self) {

		// return key code is 13
		if (event.which === 13 && self.selections.length !== 0 && self.selections.length < 2) { // all these statement need to be true for the entire statement to be evaluated to true
			// enter key has a default behaviour equal to the left click, so we prevent the mixups as
			// out left click is special
			event.preventDefault();

			/*
				return key does essentially what double click event handler does
				so if we can use similar instructions that doubleClick uses
			
				we need to check one very important thing, which is to make sure we don't cd into a
				file that is currently selected!
			*/
			if (self.selections[0].constructor === FileIcon) return; // ends the function here
		
			// otherwise the path needs to be extended as we are now visiting a new folder	
			self.path.extend(self.selections[0].name);

			// if we are inside the trashedDirEntry environment the self.trashDirEntry.entry will turn true
			if (self.trashDirEntry.entry) {
				// if it is true we simply extend the dir attribute which is a path object itself
				self.trashDirEntry.dir.extend(self.selections[0].name);
			}

			/*
				now we need to remove all the current contents from the drop zone
				and get the conents inside the folder that we just double clicked

				make request object which encapsulates the path for the server to query

				you need to change the arrow key to an empty string when you enter a folder, or else
				you will get a momentum error

			*/
			var requestObj = {};

			requestObj.path = self.path.get;

			$.ajax({
				url: self.route + "expandDir", // same route as doubleClick
				type: "POST",
				data: requestObj,
				success: function(data) {
					self.populateDropZone(data.ls);
				}
			})
		}
	}


	// arrow keys icon navigation event handler for the window
	arrowKeys(event, self) {

		// if the table is empty there is no point in navigation 
		if (self.table.size() === 0 && (event.which === 37 || event.which === 39 || event.which === 38 || event.which === 40)) {
			event.preventDefault(); // even if the table is empty and we don't need any keys to function, we still want to prevent default which is moving the scroll bar left right up down with the keys up down left right, this provides a better experience for the users using the program
			return;
		}

		// for whatever arrow selected if it is the initial selection then x, y coordinates will become 0 and init will become false
		// we don't want this behaviour for just any keys but only left, right, up and down
		if (self.navCoordinates.init && (event.which === 37 || event.which === 39 || event.which === 38 || event.which === 40)) {
			event.preventDefault(); // this prevents the default key behaviour, which is moving the scroll bar left, right, up, down
			self.navCoordinates.r = 0;
			self.navCoordinates.i = 0;
			self.select(self.table.getAt(self.navCoordinates.r, self.navCoordinates.i));
			// self.navCoordinates's init attribute also needs to be turned off as we have clicked once already!
			self.navCoordinates.init = false;
			// everytime you press either up, down, left or right you know something will turn red, so you have to unable the neutralizer global click's counter regardless
			++self.counter; // the reason we explicitly do it here is because, the method select always turns it 0, so we have to do it always after calling the method select
			return; // we end the function, this prevents the code below the if statement from executing
		}


		// one of these if statment will be checked one after another in order, this will prevent from weird behaviours from pressing two buttons at once
		if (event.which === 37) { // left
			event.preventDefault(); // this prevents the default key behaviour, which is moving the scroll bar left, right, up, down

			if (self.navCoordinates.r === 0 && self.navCoordinates.i === 0) {
				// this if statement basically just checks if both row and i are at the initial starting position
				// which is the first file in the view, if so then just return without moving back more
				return;
			}

			/*
				Algorithm - Suppose I have a bunch of icons selected as I go right. Now if I press left arrow key
							while holding the ctrl button I am suppose to unselect the current index. (the left arrow key still selects the already selected icon which would be in index - 1 place, but it shouldn't matter as we have a check to prevent any damage done by that)
							This is done by checking whether the index before the current index where our current index is i and the index before that is
							i - 1 is red or not, if it is red then we unselect the current index. If it
							isn't red then we don't unselect the current position! 

							NOTE** - despite all this we will always follow the default behaviour either ctrl is pressed or not

			*/
			if (self.ctrl) {
				var icon = self.table.getAt(self.navCoordinates.r, self.navCoordinates.i);
				
				// one obvious check is before actually doing the substraction from index we have to check if the index
				// is 0 or not as there cannot be a negative index, if it is 0 then we jump up in the y axis and also 
				// turn the i to 7 which would be the last index of an element in a row
				if (self.navCoordinates.i === 0) {
					var row = self.navCoordinates.r - 1; // we don't need to check for the r being 0 as there is a check before already for that!
					var i = 7;
				} else {
					var row = self.navCoordinates.r;
					var i = self.navCoordinates.i - 1;
				}

				if (self.table.getAt(row, i).isRed()) {
					self.unselect(icon);
				}
			}

			if (self.navCoordinates.i !== 0) { // if we are not at 0 then we can just keep moving backwards
				--self.navCoordinates.i;
			} else { // if we are at the first index in the row, then we need to go back up a level
				self.navCoordinates.i = 7; // we set the index to last element of a row, as we change the row we will be now indexing the last element of the row up a step
				--self.navCoordinates.r; // we go up a level by changing the y-axis coordinate when we reach 0
			}

			self.select(self.table.getAt(self.navCoordinates.r, self.navCoordinates.i));

			// if the user is currently pressing the ctrl button then don't unselect the selected icons
			if (!self.ctrl) {
				// we translate the table indexes into a one for loop type ish index, where one for loop can be used to iterate the entire table
				var iterations = self.table.translateIndex(self.navCoordinates.r, self.navCoordinates.i);

				var tableSize = self.table.size(); // alias the size of the table to prevent invoking the function everytime inside the for loop

				// now we have to loop through anything after our current index till the size of all the elements in the table and unselect the elements
				for (var i = iterations + 1; i < tableSize; ++i) { // not including the iteartions though, hence + 1
					self.unselect(self.table.get(i));
				}

			}

			++self.counter; // the reason we explicitly do it here is because, the method select always turns it to 0, so we have to do it always after calling the method select

		
		} else if (event.which === 39) { // right
			event.preventDefault(); // this prevents the default key behaviour, which is moving the scroll bar left, right, up, down

			if (self.navCoordinates.r === self.table.lastRowIndex() && self.navCoordinates.i === self.table.getCurrentIndexInRow()) {
				// this if statement basically says if we have reached the maximum point in the table with our current index then we
				// cannot progress anymore
				return;
			}

			/*
				Algorithm - Suppose I have a bunch of icons selected as I go left. Now if I press the right arrow key
							while holding the ctrl button I am suppose to unselect the current current index. (the right arrow key still selects the already selected icon which would be in the index + 1 place, but it shouldn't matter as we have a check to prevent any damage done by that)
							This is done by checking whether the index after the current index where our current index is i and the index after that is
							i + 1 is red or not, if it is red then we unselect the current index. If it isn't red then we don't unselect the current position.

							NOTE** - despite all this we will always follow the default behaviour either ctrl is pressed or not
			*/

			if (self.ctrl) {
				var icon = self.table.getAt(self.navCoordinates.r, self.navCoordinates.i);
				// one obvious check is before actually doing the addition to the current index is to check whether
				// the index is of the last element in the row or not, if it is then we simply jump down a row and
				// turn the index of the row to 0.
				if (self.navCoordinates.i === 7) {
					var row = self.navCoordinates.r + 1;
					var i = 0;
				} else {
					var row = self.navCoordinates.r;
					var i = self.navCoordinates.i + 1;
				}

				if (self.table.getAt(row, i).isRed()) {
					self.unselect(icon);
				}

			}

			if (self.navCoordinates.i !== 7) { // if we are not at the last index for a row array in a table
				++self.navCoordinates.i; // increment the i of navCoordinates, to move along the x axis
			} else {
				self.navCoordinates.i = 0; // 0 because we want to go back to 0 which is where we left offf
				++self.navCoordinates.r; // we go down the y axis by increasing the row!
			}

			self.select(self.table.getAt(self.navCoordinates.r, self.navCoordinates.i)); // select the icon at that coordinate in the table


			if (!self.ctrl) { // if the user is currently pressing down on the ctrl button we don't want to unselect the selected icons
			
				// we translate the table indexes into a one for loop type ish index, where one for loop can be used to iterate the entire table
				var iterations = self.table.translateIndex(self.navCoordinates.r, self.navCoordinates.i);

				// what this for loop does is it loops over the array till the point of the index that is currently being selected and simply unselects them allx
				for (var i = 0; i < iterations; ++i) {
					self.unselect(self.table.get(i)); // we loop over each index in a table till the selected point and unselect anything before us
				}
			}

			++self.counter; // the reason we explicitly do it here is because, the method select always turns it to 0, so we have to do it always after calling the method select

		} else if (event.which === 38) { // up 
			event.preventDefault(); // this prevents the default key behaviour, which is moving the scroll bar left, right, up, down

			if (self.navCoordinates.r === 0) { // if our current y axis coordinate or row in the table is 0 then we simply don't move up anymore
				return;
			}

			/*
				Algorithm - If the ctrl button is pressed then we have to loop over from our current positon and hit
							hit every single icon starting left till not including our new position which is a row above
							our current index and turn each icon red as we loop.

							We need to translate the new position before to modulo index, to make things easier as we loop
			*/

			var startIter = self.table.translateIndex(self.navCoordinates.r, self.navCoordinates.i) // this is our currrent index
			var endIter = self.table.translateIndex(self.navCoordinates.r - 1, self.navCoordinates.i + 1); // the position that we want to be up a row translated to modulo index to make it easier for us to loop and i + 1 because we will be turning that icon at the ith index already red after this if statement so no need to do it twice opposite to what we do in down as here we are moving left
				
			if (self.ctrl) {
				// NOTE** - When you are at the 0th index at any row, then self.navCoordinates.i - 1 will be -1, so a check needs to be made where if we are at the index 0 then change it to 7 instead and move up a row!	
				if (self.navCoordinates.i === 0) {
					var index = 7; // if index is 0 then make it 7 which would be the last index of any row
					var row = self.navCoordinates.r - 1; // it also means we jump back up a row since we are at the last index of some row
				} else {
					var index = self.navCoordinates.i - 1; // else do our usual business
					var row = self.navCoordinates.r; // else do our usual business
				}

				// similar logic to left and right if the index left to our current index is already red since we move up by going left
				// then we undo the whole process for what down arrow key did
				if (self.table.getAt(row, index).isRed()) { 
					for (var i = startIter; i > endIter - 1; --i) {
						self.unselect(self.table.get(i));
					}

				} else {
					for (var i = startIter; i > endIter - 1; --i) { // we are including the endIter index as well thats why if endIter is like 3 and i becomes 3 ints still not gereater than 2, and our loop is still valid and we include the index 3 but when i becomes 2 and our looping condition is 3 - 1 = 2, we will break out of the loop as 2 is no longer greater than 2, yes thats right 2 is actually now equal to 2 which is not greater than 2
						self.select(self.table.get(i)); // we hit icons at each index and select them as we iterate using the for loop
					}
				}

			}

			--self.navCoordinates.r; // we decrement the row coordinate or in other words we go up the y-axis

			self.select(self.table.getAt(self.navCoordinates.r, self.navCoordinates.i)); // select the icon at the coordinate in the table

			// now neutralize all the other selected icons down the y axis not including the selected icon

			var maxRowSize = self.table.lastRowIndex() + 1; // aliases the row index to prevent invoking the same function everytime in the for loop and + 1 because it returns the index and we will loop over using this variable and we want to loop up till including the index selected, in other words we make it the number of rows not an index keeper

			if (!self.ctrl) { // if the user isn't pressing ctrl button then we unselect anything going up and left

				// we start from the index we were before moving up and go till the very last index in the very last row
				// and as we through, we turn all the red icons blue

				var lastRowIndex = self.table.lastRowIndex(); // the index of the last row in the table

				var lastRow = self.table.getRowAt(lastRowIndex); // we retrieve the last row using the index

				var lastElementInLastRow = lastRow.length - 1; // this is the index of the last element in the last row

				// with all these information we can now translate
				var moduloEndIter = self.table.translateIndex(lastRowIndex, lastElementInLastRow);

				// so whats basically happening here is when we go up by one in the y axis, starting from the
				// icon right next to our icon we start looping till the end of the table by going right
				// and as we go right we turn each icon blue
				// so everytime we go up anything right of the current index after going up will turn blue!
				for (var i = endIter; i < moduloEndIter + 1; ++i) { 
		
					self.unselect(self.table.get(i));
			
				}

			}

			++self.counter; // the reason we explicitly do it here is because, the method select always turns it to 0, so we have to do it always after calling the method select

		} else if (event.which === 40) { // down
			event.preventDefault(); // this prevents the default key behaviour, which is moving the scroll bar left, right, up, down

			// either of these statement need to be true in order for the entire statement to be true, and self.navCoordinates.i > self.table.rowSize(self.navCoordinates.r + 1) - 1 means that if our index in the current row is greater the last index of the bottom row then we can't go down as the bottom row doesn't even have that index to visit!
			if (self.navCoordinates.r === self.table.lastRowIndex() || self.navCoordinates.i > self.table.rowSize(self.navCoordinates.r + 1) - 1) { // if our current coordinate matches the last entry in the table's row
				// this if statement basically says that if we reached the maximum point in the y axis or
				// in other words if we are at the last row in the table then we should not increment anymore
				return;
			}

			/*
				Algorithm - If the ctrl button is pressed then we have to loop from the current position
							and hit every single icon starting right till not including our new position
							which is a row below our current index and turn each icon red as we loop.

							We need to translate the new position before to modulo index, to make things easier
							as we loop

			*/

			// the if statement above this if statement immedietly catches any illegal activity, which is if you are at the last row and you are trying to go down it will be impossible to do so!

			var startIter = self.table.translateIndex(self.navCoordinates.r, self.navCoordinates.i); // current index
			var endIter = self.table.translateIndex(self.navCoordinates.r + 1, self.navCoordinates.i - 1); // getting the position where we want to be and - 1 on the index or x axis is because we include it and change its color later on after this if statement by default


			if (self.ctrl) {

				// similar logic to left and right if the index right to our current index is already red, since we are going down and we move down by going right
				// then we undo the whole process for what down arrow key did
				if (self.table.getAt(self.navCoordinates.r, self.navCoordinates.i + 1).isRed()) { // in the same row we check the very next index right of our current index

					for (var i = startIter; i < endIter + 1; ++i) {

						self.unselect(self.table.get(i)); // we unselect the icon at each index specified

					}


				} else {

					for (var i = startIter; i < endIter + 1; ++i) { // endIter + 1 as we want to include the index endIter as we loop

						self.select(self.table.get(i)); // we select the icon at each index specified

					}

				}

			}


			++self.navCoordinates.r; // we increment the row coordinate or in other words we go down the y-axis

			self.select(self.table.getAt(self.navCoordinates.r, self.navCoordinates.i)); // select the icon at that coordinate in the table

			if (!self.ctrl) { // if the user isn't pressing the ctrl button then we unselect anything going right and down

				// endIter is the icon just before our current position in the same row
				// so we start from that position as we don't want to to include the file we just turned red and we loop from that position
				// all the way to the top and left most icon and we turn each icon as we go up blue

				for (var i = endIter; i > -1; --i) { // endIter + 1 as we want to include the index endIter as we loop
					
					self.unselect(self.table.get(i)); // we unselect the icon at each index specified

				}


			}

			++self.counter; // the reason we explicitly do it here is because, the method select always turns it to 0, so we have to do it always after calling the method select

		}

	}

	// back space event handler for the window
	backSpace(event, self) {

		// if statement to prevent cding out of the root folder, we don't want to return if we are inside the trash directory hence the inclusion of !self.transhedDirEntry
		if (self.path.get === "./filesystems/user-fs/" + $("#username").text() + "/" && !self.trashDirEntry.entry) return;

		/*
			event that handles backspace, which is basically when you hit backspace you go back to the
			previous working directory by shorting the path and sending an ajax request

			we want to check for another thing besides the keycode 16, hence it is a second check
			if path.get === "./src/user-fs/" + $("#username").text() + "/", then we are at the root directory
			and we cannot go back further then that!
		*/
		if (event.which === 8 && self.path.get !== "./src/user-fs/" + $("#username").text() + "/") {

			// we empty out the selected downloads when we enter another folder environment

			// shorten the path and back up a folder, we also don't want the path to shorten if we are inside the trash directory
			// as the path.get is the same as the home path when we are inside the trash directory
			if (!self.trashDirEntry.entry) { // if we are not inside the trash directory then we shorten the path
				self.path.shorten();
			} else { // else it means that we are inside the trash directory environment, and when we return back to our root folder

				// if the dir is empty it means we are at the root of trash directory and we are heading back that means
				// this backspace will make us go to the root directory of TinDrive, so as we are leaving we set the trashDirEntry's entry attribute to false
				// inidicating that we are leaving the trash directory
				if (self.trashDirEntry.dir.get === "./trash/") {
				
					// we don't want to shorten the path at root of the trashed diretory
					self.trashDirEntry.entry = false;

				} else { // if sel.trashDirEntry.dir.get is not "./trash/" it means we have to shorten that path! as we are backspacing, as we shorten the trash path
						 // we also should shorten the actual path too, because thats how we keep track of what folder we are visiting, not using the trash path but the actual path
				
					self.path.shorten();
				
					self.trashDirEntry.dir.shorten();

					// After we shorten the path, if the self.trashDirEntry.dir.get is "/trash/" it means that
					// the path we are suppose to be is "./trash/" which indicates the root directory and not the
					// path that the self.path.get is telling us to visit. So when we check this and it turns out to be true
					// we just ask the server to send us the contents of the trash directory like we do everytime we click the trash button

					if (self.trashDirEntry.dir.get === "./trash/") {
						$.ajax({
							url: self.route + "cdTrash",
							type: "GET",
							success: function(data) {
								self.populateDropZone(data.ls);
							}
						})

						return;
					}

				}

			}

			// encapulate the path string in a request object
			var requestObj = {};
			requestObj.path = self.path.get;

			// send the path request to the server to get back a folder contents for the specific path
			$.ajax({
				url: self.route + "back",
				type: "POST",
				data: requestObj,
				success: function(data) {
					// on success extract the array of contents from the data and
					// populate the drop zone with new contents
					self.populateDropZone(data.ls);
				}
			})
		}
	}

	// attaches a click event handler to the drop zone window, where upon clicking the dropzone if any item gets selected, it automatically gets deselected
	attachGlobalClickEH() {
		var self = this;
		// target the drop zone for clicks only
		$(this.dropZoneId).on("click", function() {
			if (self.counter > 0) { // first check, makes sure that the self counter is active, if it is not then we go on to the second check
				var tableSize = self.table.size(); // for more optimized performance, this prevents the for loop from calculating the size each iteration
				for (var i = 0; i < tableSize; ++i) {
					self.unselect(self.table.get(i));	
				}

				// global click should also reset the navCoordinates, so that key movement will allow it to start from the beginning
				// NOTE** - we have to make sure that we reset the navCoordinates only on the global click which is when the self.counter will be greater than 0
				// 			as a single click enables globalClick to true and then self.counter gets incremented automatically from 0 and also
				//			whenver we press any key self.counter gets incremented from 0 automatically
				self.navCoordinates.r = -1;
				self.navCoordinates.i = -1;
				self.navCoordinates.init = true;				
			} 		
			else if (self.globalClick) { // this check, checks only if first check is not fulfilled, if globalClick gets turned on
				++self.counter; // then we simply increment the counter so that if another drop zone click is made we can loop through the
								// entire contents and unselect them!
			} 
		});
	}


	// all the event handlers that can be associated with files in the file system layout in the drop zone
	attachIconEH(icon) {
		this.singleClick(icon);
		this.doubleClick(icon);
	}

	// single click event handler
	singleClick(icon) {
		var self = this; // this in each scope is different in JavaScript
		/* Single click on the icon, deals with both file icons and folder icons */
		// on click the color of the highlight changes
		$("#" + icon.id).on("click", function() {		
			/*
				each file icon has an event handler which loops through the all the file icons
				then checks if the click is on the current icon and if the icon is not
				selected then go ahead and select it
				else unselect all other icons by making them blue and unselecting it
				each iteration will either be the fileIcon clicked or all other icons
			*/
			var tableSize = self.table.size(); // storing the size of the table in a variable for faster and optimized performance, as the for loop calculates the length each iteration over and over again

			for (var i = 0; i < tableSize; ++i) {
				/*
					both these statement need to be true in order for the entire entire statement to be true
					which makes sense as we want the current element in the array to be the icon we clicked
					AND we have to make sure that the element in the array is not selected, because if it is not selected
					only then can we select it, we can't select something that is unselected
				*/
				if (self.table.get(i) === icon && !self.table.get(i).isRed()) { // red - selected
					
					self.select(icon);
					self.navCoordinates.r = icon.tableCoordinates[0]; // first index returned from the tableCoordinates is the y-axis coordinate in the table
					self.navCoordinates.i = icon.tableCoordinates[1]; // second index returned from the tableCoordinates is the x-axis coordinate in the table
					self.navCoordinates.init = false; // we turn the init to false indicating that an item has been selected and navigation can start from the point of current coordinates and not form the start

				} else { // blue - unselected
					/*
						ctrl algorithm - When keydown event and the event.which happens to be the ctrl key then
										 we simply set the boolean attribute this.ctrl to true, we alsokeep an array of icons
										 called this.selections, which is also an attribute and keeps track of what is being selected, 
										 if ctrl is not pressed then a normal global click will turn all the icon blue in the table 
										 automatically as it always does it regardless of ctrl or not and is the default behaviour for the global click.
										 The line below if (!self.ctrl) { self.unselect(self.table.get(i)) }, it prevents
										 another single click from unselecting what was last selected, default behaviiour
										 would be to unselect any item currently selected, but when ctrl is pressed we don't
										 unselect! only unselect is done on a global click. Remember upon unselect, the
										 this.selections array element will get popped off, as that array keeps track of selections.

					*/


					// unselect only when control button is not pressed
					if (!self.ctrl) {
						self.unselect(self.table.get(i));
					}

				}
			}
		});
	}

	// double click event handler
	doubleClick(icon) {
		var self = this;

		/* Double click on the icon, deals with only folder icons */
		if (icon.constructor !== FileIcon) {
			$("#" + icon.id).on("dblclick", function() {

				// the path needs to be extended as we are now visiting a new folder
				self.path.extend(icon.name);
				
				// if we are inside the trashedDirEntry environment the self.trashDirEntry.entry will turn true
				if (self.trashDirEntry.entry) {
					// if it is true we simply extend the dir attribute which is a path object itself
					self.trashDirEntry.dir.extend(icon.name);

				}


				/*
					now we need to remove all the current contents from the drop zone
					and get the conents inside the folder that we just double clicked

					make request object which encapsulates the path for the server to query

					you need to change the arrow key to an empty string when you enter a folder, or else
					you will get a momentum error

				*/

				var requestObj = {};

				requestObj.path = self.path.get;

				$.ajax({
					url: self.route + "expandDir",
					type: "POST",
					data: requestObj,
					success: function(data) {
						self.populateDropZone(data.ls);
					}
				})
			});
		}
	}

	// removes all the contents currently available in the dropzone and populate the contents which are currently there
	populateDropZone(ls) {
		this.downloadComponent.empty(); // we empty out the contents to be downloaded as we discarded our selection
		this.deleteComponent.empty(); //  we empty our contents to be downlownloaded as we discarded our selection
		this.recoverComponent.empty(); // we empty our contents to be recovered as we discarded our selection

		// we reset the navigation coordinates as well, because we are entering a new folder
		this.navCoordinates.r = -1;
		this.navCoordinates.i = -1;
		this.navCoordinates.init = true;

		/*
			needs to be stored in a variable because in a for loop the length
			gets calculated each time, and we don't want that, we want to pop for a fix number
			of times, the value of i gets messed up as i does become greater than this.table.size()
			at one point even the the elements have not been popped off
		*/

		var tableSize = this.table.size(); // length must be the same event if elements are being removed, as the for loop will calculate the length in each iteration we don't want that, we have a fixed number of elements we would like to remove

		// nullifying the folder/file selected
		this.selections = [];


		for (var i = 0; i < tableSize; ++i) {
			// killing two birds with one exression, pop returns the element that is being removed
			// from the array
			$("#wrapper-" + this.table.removeLast().id).remove();
		}

		for (var i = 0; i < ls.length; ++i) {
			if (ls[i].type === "file") { // if element at ith index in list of contents happen to be a file then add file objec to DOM
				this.addFileToDOM(ls[i].name);
			} else { // if element at ith index in the list of contents happen to be a folder the add the folder to DOM
				this.addFolderToDOM(ls[i].name);
			}
		}

	}

	// event handler for when the trash button is clicked
	trashButtonClick() {
		// when trash button is clicked we want to make an ajax request for the directory
		// of files and folders that were trashed to the server

		var self = this; // the keyword "this" has different meaning in different scopes

		// we target the trashComponent div and attach the click event handler to it
		$(this.trashComponent.id).on("click", function() {
			// when we are in the trash directory we have to turn the entry attribute of the this.trashDirEntry to true indicating that we are indeed in trash directory
			self.trashDirEntry.entry = true;

			$.ajax({
				url: self.route + "cdTrash",
				type: "GET",
				success: function(data) {
					self.populateDropZone(data.ls);
				}
			})

		});

	}

	// turns a selected icon blue, its a wrapper function with some underlying functionalities
	unselect(icon) {
		icon.turnBlue();

		// any icon turned blue will be removed from the download contents, delete contents and recover contents
		this.downloadComponent.remove(icon);
		this.deleteComponent.remove(icon);
		this.recoverComponent.remove(icon);


		// remove an item from the selections array, usually one element will be selected and one element will be unselected, so we will be most likely removing from an array which consists of only one element
		// we need to loop over the selections array and remove only the icon in the parameter form the selections array

		for (var i = 0; i < this.selections.length; ++i) {
			if (this.selections[i].name === icon.name) { // if element matches the icon
				this.selections.splice(i, 1);
				return; // exit the function, this also prevets further iteration of the loop
			}
		}

	}

	// turns a selected icon red, its a wrapper function which wraps around a icon method with added functionalities
	select(icon) {

		if (!icon.isRed()) { // if icon is already red then we don't have to repeat these steps, as we don't want duplicates in the database

			icon.turnRed();

			// any red icon selected will be added to the download components contents, delete contents and recover contents
			this.downloadComponent.add(icon);
			this.deleteComponent.add(icon);
			this.recoverComponent.add(icon);


			// add to the selections array the icon currently selected
			this.selections.push(icon);
			
			/*
				prevents an activated global click from deactivating current marked red window
				while switching between two tiles (this is mandatory as the global event is fired immediently after a click
				it happens simultaneously! )
			*/		

		}


		this.globalClick = true; // turns on the drop zone event handlers job to do its thing
		this.counter = 0; // resets the counter, just to prevent large numbers from stacking	
	}


}