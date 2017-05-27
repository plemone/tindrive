'use strict';

// FileIcon class inherits from Icon class 
class FileIcon extends Icon {

	constructor(filename, x, y, path) {
		// base class initializer syntax/super constructor
		super(filename, x, y, path);
		this.unselect = "url(public/images/file-3.png)";
		this.select = "url(public/images/file-4.png)";
		this.type = "file";
	}
}