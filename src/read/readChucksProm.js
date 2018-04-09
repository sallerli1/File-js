
const readChucks = require('./readChucks.js')

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

module.exports = readChucksProm