exports.READ_AS_TEXT = 'text'
exports.READ_AS_BINARY_STRING = 'binaryString'
exports.READ_AS_ARRAY_BUFFER = 'buffer'
exports.INT8 = 'Int8'
exports.UINT8 = 'Uint8'
exports.INT16 = 'Int16'
exports.UINT16 = 'Uint16'
exports.INT32 = 'Int32'
exports.UINT32 = 'Uint32'
exports.FLOAT32 = 'Float32'
exports.FLOAT64 = 'Float64'

exports.DEFAULT = {
    type: exports.READ_AS_ARRAY_BUFFER,
    chuckSize: 100,
    encoding: 'utf-8'
}