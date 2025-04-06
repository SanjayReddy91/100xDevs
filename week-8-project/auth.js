const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
mongoose.connect(process.env.MONGODB_URI)

function auth(req,res,next) {
    const decodedData = jwt.verify(req.headers.token,JWT_SECRET)

    if(decodedData) {
        req.userId = decodedData.id;
        next();
    } else {
        res.status(400).json ({
            message: "Wrong token"
        })
    }
}

module.exports = {
    auth: auth
}