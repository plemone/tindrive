'use strict';

// FolderIcon class inherits from Icon class
class FolderIcon extends Icon {

	constructor(filename, x, y, path) {
		// base class initializer syntax/super constructor
		super(filename, x, y, path);
		this.unselect = "url(public/images/folder.png)";
		this.select = "url(public/images/folder-2.png)";
		this.type = "folder";
	}

}