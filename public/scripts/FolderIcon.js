'use strict';

// FolderIcon class inherits from Icon class
class FolderIcon extends Icon {

	constructor(filename, x, y) {
		// base class initializer syntax/super constructor
		super(filename, x, y);
		this.background = "url(public/images/folder.png)"
	}

}