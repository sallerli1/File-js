const FileJs = require('./index1')
const css = require('../button.css')

window.onload = () => {
    var encrypt = document.getElementById("encrypt"),
        decrypt = document.getElementById("decrypt"),
        enTrigger = document.getElementById("encrypt_trigger"),
        deTrigger = document.getElementById("decrypt_trigger")

    encrypt.onchange = function () {
        var files = this.files,
            len = files.length,
            url = [],
            file = null,
            str = ''

        for (let i = 0; i < len; i++) {
            FileJs.readChucksProm(files[i], {
                type: 'text',
                chuckSize: 0.3,
                encoding: 'utf-8'
            }, (data, loaded, progress) => {
                str +=data
                console.log(progress)
            }).then(() => {
                document.getElementById('text').innerHTML = str
            })
        }
    }

    console.log(Object.prototype.toString.call(document))
    enTrigger.onclick = function () {
        encrypt.click()
    }
}
