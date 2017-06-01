'use strict'

var FSContentInfo = require("./FSContentInfo.js");

class FolderInfo extends FSContentInfo {

	constructor(n, p, tr) {
		super(n, p, tr); // base class intializer syntax
		this.directory = [];
		this.type = "folder";
	}

}

module.exports = FolderInfo;