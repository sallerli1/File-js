const { READ_AS_TEXT, READ_AS_BINARY_STRING, READ_AS_ARRAY_BUFFER } = require('../constants/constants.js')
const { DEFAULT } = require('../constants/constants')
const { createView } = require('../util/util.js')

const blobSlice = require('../util/util.js').blobSlice

/*
* chained reading operation of a File or Blob,
* each run a user defined size of chuck is read and wait to be processed
*
* options is 
*   {
*       type: 'text', 'buffer' or 'binaryString'
*       chuckSize: size(KB) of chucks read each run
*       encoding: encoding of the text, required if type is 'text'
*       bufferType: type of the typedArray of the ArrayBuffer, required if type is 'arrayBuffer'
*   }
*/
function readChucks(file, options, callback) {
    const reader = new FileReader()

    var chuckSize = options.chuckSize || DEFAULT.chuckSize,
        type = options.type || DEFAULT.type,
        start = 0,
        loaded = 0,
        total = file.size,
        progress = 0

    // parameters prepared for readBlob
    var readingOptions = {
        file,
        start,
        chuckSize,
        type,
        reader
    }

    reader.onload = (e) => {

        const view = type === READ_AS_ARRAY_BUFFER ?
            createView(e.target.result, options.bufferType) :
            e.target.result;

        ({ loaded, progress } = resolveProgress(e, chuckSize, total, start))
        //cb function can access the reading progress
        callback(reader.error, view, loaded, progress);

        if (chuckSize === 0) {
            return;
        }

        //if still unfinished, read again
        if (loaded < total) {
            readingOptions.start = ++start
        } else {
            return;
        }

        readBlob(readingOptions, options);
    }

    reader.onprogress = (e) => {
        ({ loaded, progress } = resolveProgress(e, chuckSize, total, start))
    }

    readBlob(readingOptions, options)
}

// read a certain chuck of the file
function readBlob({ file, start, chuckSize, type, reader }, options) {
    var blob = blobSlice(file, start * chuckSize * 1024, (start + 1) * chuckSize * 1024)

    if (type === READ_AS_TEXT) {
        reader.readAsText(blob, options.encoding || DEFAULT.encoding)
    }
    else if (type === READ_AS_BINARY_STRING) {
        reader.readAsBinaryString(blob)
    }
    else if (type === READ_AS_ARRAY_BUFFER) {
        reader.readAsArrayBuffer(blob)
    }
}

// calculate the progress of the current reading operation
function resolveProgress(event, chuckSize, total, start) {
    let loaded = chuckSize * start * 1024 + event.loaded,
        progress = (loaded / total * 100).toFixed(2)

    return {
        loaded,
        progress
    }
}

module.exports = readChucks