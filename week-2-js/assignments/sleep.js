function sleep(milliseconds) {
    return new Promise((resolve) => {
        let startTime = new Date().getTime();
        while (new Date().getTime() < startTime + milliseconds);
        resolve();
    });
}

let promise = sleep(5000);
console.log("printed");
promise.then(callback)

function callback() {
    console.log("callback")
}