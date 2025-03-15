function printing() {
    console.log("printed")
}

setTimeout(printing,1000) //asynchronous, so the thread wont execute in order, lets the thread wait for time out and execute.

//meanwhile code below gets executed as other thread is waiting for time out to complete
console.log("first")