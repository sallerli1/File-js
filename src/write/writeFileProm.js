
const writeFile = require('./writeFile.js')

// a promisified writeFile
function writeFileProm(file, data, options) {
    return new Promise((resolve, reject) => {
        writeFile(file, data, (err, file) => {
            if (err) {
                return reject(err)
            } else {
                resolve(file)
            }
        }, options)
    })
}

module.exports = writeFileProm