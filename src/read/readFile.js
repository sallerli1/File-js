
const { READ_AS_TEXT, READ_AS_BINARY_STRING, READ_AS_ARRAY_BUFFER } = require('../constants/constants.js')
const { DEFAULT } = require('../constants/constants.js')
const { createView } = require('../util/util.js')

/*
* read a whole File or Blob into string or arrayBuffer
* options is 
*   {
*       type: 'text', 'buffer' or 'binaryString'
*       encoding: encoding of the text, required if type is 'text'
*       bufferType: type of the typedArray of the ArrayBuffer, required if type is 'arrayBuffer'
*   }
*/

function readFile(file, options, callback) {
    const reader = new FileReader();

    let type = options.type || DEFAULT.type

    reader.onload = (e) => {
        const view = type === READ_AS_ARRAY_BUFFER ?
            createView(e.target.result, options.bufferType) :
            e.target.result

        callback(reader.error, view)
    }

    if (type === READ_AS_TEXT) {
        reader.readAsText(file, options.encoding || DEFAULT.encoding)
    } else if (type === READ_AS_BINARY_STRING) {
        reader.readAsBinaryString(file)
    } else if (type === READ_AS_ARRAY_BUFFER) {
        reader.readAsArrayBuffer(file)
    }
}


module.exports = readFile