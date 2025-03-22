const express = require('express');
const app = express();

totalRequestsCount = 0;

function logRequestData(req,res,next) {
    totalRequestsCount++;
    next();
}

app.use(logRequestData);

app.get("/count", function(req, res) {
    res.send("Total count: " + totalRequestsCount);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});