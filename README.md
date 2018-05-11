# html5-file-js

an HTML5 File operating tool which could read from a File or Blob, or write data into a File.

### Installation

#### npm
```sh
npm install html5-file-js
```

#### browser
```html
<script type="text/javascript" src="path-to/html5-file-js.js"></script>
```

### Usage

ES6 import
```js
import FileJS from 'html5-file-js'
```
CommonJS
```js
const FileJS = require('html5-file-js') 
```

Without RequireJS

not supported under current version

#### Read

##### readFile(file: File, callback: Function, options: Object)

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

FileJS.readFile(file, (err, data) => {
    console.log(data)
}, {
    type: FileJS.types.READ_AS_TEXT
})
```

##### readFileProm(file: File, options: Object)

a promisified readFile function

```js
var file = new File("1")

FileJS.readFileProm(file, {
    type: FileJS.types.READ_AS_TEXT
}).then((data) => {
    console.log(data)
}, (err) => {
    ...
})
```

##### readChucks(file: File, callback: Function, options: Object)

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
var file = new File(["1"], '1')

FileJS.readChucks(file, (err, data, loaded, progress) => {
    console.log(data)
    console.log(loaded)
    console.log(progress)
}, {
    type: FileJS.types.READ_AS_TEXT,
    chuckSize: 1
})
```

##### readChucksProm(file: File, callback: Function, options: Object)

a promisified readChucks function

> callback: function(err, data, loaded, progress)
>  data: read Data
>  loaded: currently loaded size(byte)
>  progress: current reading progress(1-100)

```js
var file = new File(["1"], '1')

FileJS.readChucksProm(file, (data, loaded, progress) => {
    console.log(data)
    console.log(loaded)
    console.log(progress)
}, {
    type: FileJS.types.READ_AS_TEXT,
    chuckSize: 1
}).then(() => {
    ...
}, (err) => {
    ...
})
```

#### Write

##### writeFile(file: File|String, data: String|ArrayBuffer, callback: Function, options: Object)

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
var file = new File(["1"], '1')

FileJS.writeFile(file, "2", (err, file) => {
    console.log(file)
}, {
    name: "filename"
})

FileJS.writeFile("filename","2", (err, file) => {
    console.log(file)
})

FileJS.writeFile("2", (err, file) => {
    console.log(file)
}, {
    name: "filename"
})
```

##### writeFileProm(file: File|String, data: String|ArrayBuffer, options: Object)

a promisified writeFile

```js
var file = new File(["1"], '1')

FileJS.writeFile(file, "2" {
    name: "filename"
}).then((file) => {
    console.log(file)
}, (err) => {
    ...
})

FileJS.writeFile("filename","2" {}).then((file) => {
    console.log(file)
}, (err) => {
    ...
})

FileJS.writeFile("2" {
    name: "filename"
}).then((file) => {
    console.log(file)
}, (err) => {
    ...
})
```

##### rename(file: File, filename: String)

change the name of a file

#### Crypto

encription and decription are supported after version 1.1.*
these operations are based on implementations of crypto-browserify

##### encriptFile(file: File, callback: Function, options: Object)


 encript the given file using a certain algrithm which is dependent on OpenSSL
 the encript operation is based on crypto-borwserify
 this operation is chained, so you could provide chuckSize in options

>``` options is 
>   {
>       chuckSize: size(KB) of chucks read each run
>       name: user defined name of the written file
>       algrithm: an string refering to the encription algrithm, fro example: aes256 aes128 aes-128-cbc aes-128-gcm
>       key: 
>       iv:
>   }
> callback takes data, loaded, progress as params
> 
>``` this function returns promise whose value is the encripted file


```js
var file = new File(["1"], '1')
FileJS.encriptFile(file, (data, loaded, progress)=> {
    console.log(progress)
}, {
    name: 'encriptedFile',
    altrithm:  'aes-128-cbc',
    key:  'a secrect',
    iv: 'iv' //must be 16 bit
}).then(encriptedFile => {
    ...
})
```

##### decriptFile(file: File, algrithm: String, key: ArrayBuffer|String, callback: Function, options: Object)


 decript the given file using a certain algrithm which is dependent on OpenSSL
 the decript operation is based on crypto-borwserify
 this operation is chained, so you could provide chuckSize in options

>``` options is 
>   {
>       chuckSize: size(KB) of chucks read each run
>       name: user defined name of the written file
>       algrithm: an string refering to the encription algrithm, fro example: aes256 aes128 aes-128-cbc aes-128-gcm
>       key: 
>       iv:
>   }
> callback takes data, loaded, progress as params
> 
>``` this function returns promise whose value is the encripted file


```js
FileJS.decriptFile(encriptedFile, (data, loaded, progress)=> {
    console.log(progress)
}, {
    name: 'decriptedFile',
    altrithm:  'aes-128-cbc',
    key:  'a secrect',
    iv: 'iv' //must be 16 bit
}).then(decriptedFile => {
    ...
})
```