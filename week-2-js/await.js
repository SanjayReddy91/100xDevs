function setTimeoutPromisified(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function solve() {
      await setTimeoutPromisified(1000);
      console.log("hi");
      await setTimeoutPromisified(3000);
      console.log("hello");
      await setTimeoutPromisified(10000);
      console.log("hi there");
  }
  
  solve();