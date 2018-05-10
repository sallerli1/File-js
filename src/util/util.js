
const { INT8, INT16, INT32, UINT8, UINT16, UINT32, FLOAT32, FLOAT64 } = require('../constants/constants.js')

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
    if (fn === undefined) {
        return undefined
    }
    const match = fn && fn.toString().match(/^\s*function (\w+)/)
    return match ? match[1] : ''
}

// get type string of a variable
function getTypeOf(value) {
    let fn = value === undefined ? undefined : Object.getPrototypeOf(value).constructor
    return getType(fn)
}

// check if a variable's type is the type provided
function isType(type, value) {
    return getTypeOf(value) === getType(type)
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

    for (let i = 0; i<typedArray2.length;i++) {
        result[count++] = typedArray2[i]
    }

    return result.buffer
}

module.exports = {
    blobSlice,
    createView,
    concatBuffer,
    getType,
    getTypeOf,
    isType
}