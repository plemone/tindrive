'use strict'

var FSContentInfo = require("./FSContentInfo.js");

class FolderInfo extends FSContentInfo {

	constructor(n, p, tr) {
		super(n, p, tr); // base class intializer syntax
		this.directory = [];
	}

}

module.exports = FolderInfo;