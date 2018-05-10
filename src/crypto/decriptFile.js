const { isType } = require('../util/util')
const readChucksProm = require('../read/readChucksProm')
const writeFileProm = require('../write/writeFileProm')
const Crypto = require('crypto-browserify')
const Buffer = require('buffer').Buffer

/*
* decript the given file using a certain algrithm which is dependent on OpenSSL
* the encript operation is based on crypto-borwserify
* this operation is chained, so you could provide chuckSize in options
*
* options is 
*   {
*       chuckSize: size(KB) of chucks read each run
*       name: user defined name of the written file
*   }
* callback takes data, loaded, progress as params
* 
* this function returns promise whose value is the encripted file
*/
function decriptFile(file, algrithm, key, callback, options) {
    
    if (isType(Function, callback)) {
        options = options || {}
    } else if (isType(Object, callback)) {
        options = callback
    }

    let out = [],
        decipher = Crypto.createDecipher(algrithm, key)
        
    return readChucksProm(file, (data, loaded, progress) => {
        if (isType(Function, callback)) {
            callback(data, loaded, progress)
        }

        out.push(decipher.update(Buffer.from(data)))
    }, {
        type: 'buffer',
        chuckSize: options && options.chuckSize
    }).then(() => {

        out.push(decipher.final())
        let outBuffer = Buffer.concat(out)
        return writeFileProm(outBuffer.buffer, {
            name: (options && options.name) || file.name
        }).then(file => {
            return file
        })
    })
}

module.exports = decriptFile