
const readFile = require('./readFile.js')

// promisified readFile operation
function readFileProm(file, options) {
    return new Promise((resolve, reject) => {
        readFile(file, (err, data) => {
            if (err) {
                // reject if any reader err occured
                return reject(err)
            } else {
                // resolve the read contents for a then
                resolve(data)
            }
        }, options)
    })
}

module.exports = readFileProm