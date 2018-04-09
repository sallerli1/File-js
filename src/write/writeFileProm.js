
const writeFile = require('./writeFile.js')

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

module.exports = writeFileProm