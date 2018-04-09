const readFile = require('../read/readFile.js')
const { getType, getTypeOf, isType, concatBuffer } = require('../util/util.js')
const { READ_AS_TEXT, READ_AS_ARRAY_BUFFER, READ_AS_BINARY_STRING } = require('../constants/constants.js')
const { DEFAULT } = require('../constants/constants.js')

/*
* write data into a File
* this operation doesn't alter the original file, but create a new File
* the callback function takes two params:
*      err: a DOMException (if any err occured)
*      file: the written file
*
* options is 
*   {
*       encoding: encoding of the text, required if type is 'text'
*       name: user defined name of the written file
*   }
*/

// if file is a string, it's taken as the filename of the new file
// if the file is not provided, create a new file with data
// if the file is provided, append data to the file
function writeFile(file, data, options, callback) {
    let fileName = options.name || typeof file === 'string' ? file : isType(File, file) ? file.name : 'file',
        content

    // if file is not a File object, or not provided
    // take the first param as data
    if (!isType(File, file) && !isType(String, file)) {
        callback = options
        options = data
        data = file
    }

    // check if the data is a String of an ArrayBuffer
    if (isType(String, data)) {
        let encoding = options.encoding || DEFAULT.encoding
        readFile(file, {
            encoding,
            type: READ_AS_TEXT
        }, (err, text) => {
            if (err) {
                callback(err)
            } else {
                content = text + data
                callback(err, new File([content], fileName))
            }
        })
    } else if (isType(ArrayBuffer, data)) {
        readFile(file, {
            type: READ_AS_ARRAY_BUFFER
        }, (err, buffer) => {
            if (err) {
                callback(err)
            } else {
                content = concatBuffer(buffer, data)
                callback(err, new File([content], fileName))
            }
        })
    } else {

        //the written data can only be a String or an ArrayBuffer
        console.warn(`${data} is not a String or an ArrayBuffer`)
        callback(new DOMException(`${data} is not a String or an ArrayBuffer`, `TypeError`))
    }
}

module.exports = writeFile