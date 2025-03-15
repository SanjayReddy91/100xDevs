var fs = require('fs');

// function settimeoutPromisified (time){
//     return new Promise(solve => setTimeout(solve,time))
// }

// function callBack() {
//     console.log("3 seconds done")
// }

// let p = settimeoutPromisified(3000)
// console.log(p)

// p.then(callBack)

function callbackFuncWrite(data) {
    if(data) {

        console.log("called from promise.then")
    }
    else {
        console.log("writing file done");
    }
}

function callFuncWrite(callback) {
    console.log("reading file done");
    fs.writeFile("c.txt","data to write",callback);
}

function readFile(callWrite) {
    return fs.readFile("a.txt","utf-8",function(err,data) {
        console.log("logging in readFile function: " , data);
        callWrite(data);
    }) 
}

function readFilePromisified () {
    return new Promise(readFile)
}

let fsPromise = readFilePromisified();
fsPromise.then(callbackFuncWrite)