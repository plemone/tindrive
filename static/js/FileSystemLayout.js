'use strict'; // to avoid JavaScript weirdness

// responsible for managing the #dnd div which is basically the drop box zone
// should contain some sort of data structure which allows it to keep a track
// of how the file system actually looks like, x and y axis value to place a 
// file, should be the main communicator with the user, and should have a 
// composition relationship with FileIcon and FolderIcon classes
class FileSystemLayout {

	constructor() {
		// should have x and y coordinates
		this.x = 15;
		this.y = 7;

	}

	addFile(filename) {
		var file = new FileIcon(filename, this.x, this.y);
		file.create();
	}

}