(function (root, factory) {
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
        root.FileJS = factory();
    }
})(this, function () {

    const READ_AS_TEXT = 'text'
    const READ_AS_BINARY_STRING = 'binaryString'
    const READ_AS_ARRAY_BUFFER = 'buffer'
    const INT8 = 'Int8'
    const UINT8 = 'Uint8'
    const INT16 = 'Int16'
    const UINT16 = 'Uint16'
    const INT32 = 'Int32'
    const UINT32 = 'Uint32'
    const FLOAT32 = 'Float32'
    const FLOAT64 = 'Float64'

    const DEFAULT = {
        type: READ_AS_ARRAY_BUFFER,
        chuckSize: 100,
        encoding: 'utf-8'
    }

    // silce a Blob or File
    function blobSlice(blob, start, length) {
        if (blob.slice) {
            return blob.slice(start, length);
        } else if (blob.webkitSlice) {
            return blob.webkitSlice(start, length);
        } else if (blob.mozSlice) {
            return blob.mozSlice(start, length);
        } else {
            return null;
        }
    }

    // get a typedArray of the buffer according to type
    function createView(buffer, type) {
        type = type && type.toLowerCase()

        switch (type) {
            case INT8:
                return new Int8Array(buffer)

            case INT16:
                return new Int16Array(buffer)

            case INT32:
                return new Int32Array(buffer)

            case UINT8:
                return new Uint8Array(buffer)

            case UINT16:
                return new Uint16Array(buffer)

            case UINT32:
                return new Uint32Array(buffer)

            case FLOAT32:
                return new Float32Array(buffer)

            case FLOAT64:
                return new Float64Array(buffer)

            default:
                return buffer
        }
    }

    // get type string of a construtor function
    function getType(fn) {
        const match = fn && fn.toString().match(/^\s*function (\w+)/)
        return match ? match[1] : ''
    }

    // get type string of a variable
    function getTypeOf(value) {
        let fn = Object.getPrototypeOf(value).constructor
        return getType(fn)
    }

    // check if a variable's type is the type provided
    function isType(type, value) {
        let fn = Object.getPrototypeOf(value).constructor
        return getType(fn) === getType(type)
    }

    // concat two ArrayBuffers and return a new buffer
    function concatBuffer(buffer1, buffer2) {
        let result = new Int8Array(new ArrayBuffer(buffer1.byteLength + buffer2.byteLength)),
            typedArray1 = new Int8Array(buffer1),
            typedArray2 = new Int8Array(buffer2),
            count = 0

        for (let i = 0; i < typedArray1.length; i++) {
            result[count++] = typedArray1[i]
        }

        for (let i = 0; i < typedArray2.length; i++) {
            result[count++] = typedArray2[i]
        }

        return result.buffer
    }

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

    // promisified readFile operation
    function readFileProm(file, options) {
        return new Promise((resolve, reject) => {
            readFile(file, options, (err, data) => {
                if (err) {
                    // reject if any reader err occured
                    return reject(err)
                } else {
                    // resolve the read contents for a then
                    resolve(data)
                }
            })
        })
    }

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

    // a promisified readChuck
    // the calback function takes three params : data, loaded, progress
    function readChucksProm(file, options, callback) {

        return new Promise((resolve, reject) => {
            var cb = function (err, data, loaded, progress) {
                if (err) {
                    // if any reader err occured
                    reject(err)
                }
                callback(data, loaded, progress)
                if (progress >= 100) {
                    // if the whole has been read, countinue
                    resolve()
                }
            }

            readChucks(file, options, cb)
        })

    }

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
    *       mimeType: mimeType of the written file
    *   }
    */

    // if file is a string, it's taken as the filename of the new file
    // if the file is not provided, create a new file with data
    // if the file is provided, append data to the file
    function writeFile(file, data, options, callback) {
        // if file is not a File object, or not provided
        // take the first param as data
        if (!isType(File, file) && !(isType(String, file) && isType(String, data))) {
            callback = callback || options
            options = data
            data = file
        }

        let fileName = options.name,
            mimeType = options.mimeType || file.type || '',
            content

        if (!fileName) {
            if (isType(File, file)) {
                fileName = file.name
            } else if (isType(String, file) && !isType(data, Object)) {
                fileName = file
            } else {
                fileName = 'file'
            }
        }

        if (!isType(File, file)) {

            if (!isType(String, data) && !isType(ArrayBuffer, data)) {
                console.warn(`${data} is not a String or an ArrayBuffer`)
                callback(new DOMException(`${data} is not a String or an ArrayBuffer`, `TypeError`))
            }
    
            callback(null, new File([data], fileName, {
                type: mimeType
            }))
        } else {
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
                        callback(err, new File([content], fileName, {
                            type: mimeType
                        }))
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
                        callback(err, new File([content], fileName, {
                            type: mimeType
                        }))
                    }
                })
            } else {
    
                //the written data can only be a String or an ArrayBuffer
                console.warn(`${data} is not a String or an ArrayBuffer`)
                callback(new DOMException(`${data} is not a String or an ArrayBuffer`, `TypeError`))
            }
        }
    }

    // a promisified writeFile
    function writeFileProm(file, data, options) {
        return new Promise((resolve, reject) => {
            writeFile(file, data, options, (err, file) => {
                if (err) {
                    return reject(err)
                } else {
                    resolve(file)
                }
            })
        })
    }

    function rename(file, fileName) {
        file.name = fileName
    }

    const FileJS = {
        readFile,
        readFileProm,
        readChucks,
        readChucksProm,
        writeFile,
        writeFileProm,
        rename,
        concatBuffer,
        types: {
            READ_AS_TEXT,
            READ_AS_ARRAY_BUFFER,
            READ_AS_BINARY_STRING
        },
        bufferTypes: {
            INT8,
            INT16,
            INT32,
            UINT8,
            UINT16,
            UINT32,
            FLOAT32,
            FLOAT64
        }
    }

    return FileJS
})