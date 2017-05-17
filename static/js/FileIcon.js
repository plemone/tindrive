'use strict';

// FileIcon class inherits from Icon class 
class FileIcon extends Icon {

	constructor(filename, x, y) {
		// base class initializer syntax/super constructor
		super(filename, x, y);
		this.background = "url(static/imgs/file-3.png)";
	}

}