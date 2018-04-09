
const readFile = require('./read/readFile')
const readFileProm = require('./read/readFileProm')
const readChucks = require('./read/readChucks')
const readChucksProm = require('./read/readChucksProm')
const writeFile = require('./write/writeFile')
const writeFileProm = require('./write/writeFileProm')

/* (function (global, factory) {
    if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory();
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define([], factory);
	}
	else {
		// Global (browser)
		global.FileJs = factory();
    }
    
})(this, function() {
    console.log(this);
    var FileJs = {}
    FileJs.readFile = readFile
    
    return FileJs
})() */

var FileJs = {
	readFile,
	readFileProm,
	readChucks,
	readChucksProm,
	writeFile,
	writeFileProm
}
    
module.exports = FileJs