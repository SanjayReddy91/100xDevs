const express = require("express");

const app = express();

app.use(function(req, res, next) {
    console.log("request received");
    next();
})

app.get("/sum", function(req, res) {
    console.log(req);
    const a = parseInt(req.query.a);
    const b = parseInt(req.query.b);

    res.json({
        ans: a + b
    })
});

app.get("/multiply", function(req, res) {
    const a = req.query.a;
    const b = req.query.b;
    res.json({
        ans: a * b
    })
});

app.get("/divide", function(req, res) {
    const a = req.query.a;
    const b = req.query.b;
    if(b != 0) {
        res.json({
            ans: a / b
        })
    } else {
        res.json({message: "Cannot divide by '0'"});
    }

});

app.get("/subtract", function(req, res) {
    const a = req.query.a;
    const b = req.query.b;
    res.json({
        ans: a - b
    })
});

app.listen(3000);