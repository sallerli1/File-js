
const readFile = require('./read/readFile')
const readFileProm = require('./read/readFileProm')
const readChucks = require('./read/readChucks')
const readChucksProm = require('./read/readChucksProm')
const writeFile = require('./write/writeFile')
const writeFileProm = require('./write/writeFileProm')


var FileJS = {
	readFile,
	readFileProm,
	readChucks,
	readChucksProm,
	writeFile,
	writeFileProm
}
    
module.exports = FileJS