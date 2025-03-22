const express = require('express');
const app = express();

function logRequestData(req,res,next) {
    console.log("URL: " + req.url);
    console.log("HTTP Method: " + req.method);
    next();
}

app.use(logRequestData);

app.get("/sum", function(req, res) {
    const a = parseInt(req.query.a);
    const b = parseInt(req.query.b);

    res.json({
        ans: a + b
    })
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});