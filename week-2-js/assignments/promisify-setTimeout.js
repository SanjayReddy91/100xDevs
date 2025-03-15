function callback() {
    console.log("resolved promise");
}

function setTimeoutPromisofied(n) {
    return new Promise(resolve => setTimeout(resolve,n*1000));
}

let promise = setTimeoutPromisofied(8);
promise.then(callback)

// function settimeoutPromisified (time){
//     return new Promise(solve => setTimeout(solve,time))
// }

// function callBack() {
//     console.log("3 seconds done")
// }

// let p = settimeoutPromisified(3000)
// console.log(p)

// p.then(callBack)