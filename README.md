# file-js

an HTML5 File operating tool which could read from a File or Blob, or write data into a File.

### Installation

#### npm
```sh
npm install File-js
```

#### browser
```html
<script type="text/javascript" src="path-to/file-js.js"></script>
```

### Usage

ES6 import
```js
import FileJS from 'file-js'
```
CommonJS
```js
const FileJS = require('file-js') 
```

Without RequireJS
```html
<script type="text/javascript" src="path-to/file-js.js"></script>
<script>
    var file = new File("1")
    FileJs.readFile(file, {
        type: FileJS.types.READ_AS_TEXT
    }, (err, data) => {
        console.log(data)
    })
</script>
```

#### Read

##### readFile(file: File, options: Object, callback: Function)

read a whole File or Blob into String or ArrayBuffer

> file: an HTML5 File object or a Blob

>
> options:
>```
> {
>     type: 'text', 'buffer' or 'binaryString'
>     encoding: encoding of the text, required if type is 'text'
>     bufferType: type of the typedArray of the ArrayBuffer, required if type is 'arrayBuffer', return ArrayBuffer if not provided
> }
>```

> callback: function(err, data)
>  err: an DOMException, null if no err occured
>  data: read Data
```js
var file = new File("1")

FileJs.readFile(file, {
    type: FileJS.types.READ_AS_TEXT
}, (err, data) => {
    console.log(data)
})
```

##### readFileProm(file: File, options: Object)

a promisified readFile function

```js
var file = new File("1")

FileJs.readFileProm(file, {
    type: FileJS.types.READ_AS_TEXT
}).then((data) => {
    console.log(data)
}, (err) => {
    ...
})
```

##### readChucks(file: File, options: Object, callback: Function)

chained reading operation of a File or Blob, each run a user defined size of chuck is read and wait to be processed

> file: an HTML5 File object or a Blob

> options:
>```
> {
>     chuckSize: size(KB) of chucks read each run
>     type: 'text', 'buffer' or 'binaryString'
>     encoding: encoding of the text, required if type is 'text'
>     bufferType: type of the typedArray of the ArrayBuffer, required if
>         type is 'arrayBuffer', return ArrayBuffer if not provided
> }
>```

> callback: function(err, data, loaded, progress)
>  err: an DOMException, null if no err occured
>  data: read Data
>  loaded: currently loaded size(byte)
>  progress: current reading progress(1-100)

```js
var file = new File("1")

FileJs.readChucks(file, {
    type: FileJS.types.READ_AS_TEXT,
    chuckSize: 1
}, (err, data, loaded, progress) => {
    console.log(data)
    console.log(loaded)
    console.log(progress)
})
```

##### readChucksProm(file: File, options: Object, callback: Function)

a promisified readChucks function

> callback: function(err, data, loaded, progress)
>  data: read Data
>  loaded: currently loaded size(byte)
>  progress: current reading progress(1-100)

```js
var file = new File("1")

FileJs.readChucksProm(file, {
    type: FileJS.types.READ_AS_TEXT,
    chuckSize: 1
}, (data, loaded, progress) => {
    console.log(data)
    console.log(loaded)
    console.log(progress)
}).then(() => {
    ...
}, (err) => {
    ...
})
```

##### writeFile(file: File|String, data: String|ArrayBuffer, options: Object, callback: Function)

write data into a File
this operation doesn't alter the original file, but create a new File

if file is a string, it's taken as the filename of the new file
if the file is not provided, create a new file with data
if the file is provided, append data to the file

> file: an HTML5 File object or a Blob | fileName string

> data: data to write into the File object, String or ArrayBuffer

> options:
>```
> {
>     encoding: encoding of the text, required if data is String
>     name: fileName string
>     mimeType: mimeType of the file created, 
>         use the original file's mimeType if not provided,
>         if there is no original file, set to ""
> }
>```

> callback: function(err, data, loaded, progress)
>  err: an DOMException, null if no err occured
>  file: file created

```js
var file = new File("1")

FileJs.writeFile(file, "2" {
    name: "filename"
}, (err, file) => {
    console.log(file)
})

FileJs.writeFile("filename","2" {}, (err, file) => {
    console.log(file)
})

FileJs.writeFile("2" {
    name: "filename"
}, (err, file) => {
    console.log(file)
})
```

##### writeFileProm(file: File|String, data: String|ArrayBuffer, options: Object)

a promisified writeFile

```js
var file = new File("1")

FileJs.writeFile(file, "2" {
    name: "filename"
}).then((file) => {
    console.log(file)
}, (err) => {
    ...
})

FileJs.writeFile("filename","2" {}).then((file) => {
    console.log(file)
}, (err) => {
    ...
})

FileJs.writeFile("2" {
    name: "filename"
}).then((file) => {
    console.log(file)
}, (err) => {
    ...
})
```

##### rename(file: File, filename: String)

change the name of a file