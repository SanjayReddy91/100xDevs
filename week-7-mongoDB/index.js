const express = require("express");
const {UserModel, TodoModel} = require("./db");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const app = express();
app.use(express.json());

const JWT_SECRET = "ilove100xdevsliveclasses";
mongoose.connect("mongodb+srv://sanjayreddykodidela915444:Sanjay2002@cluster0.ucawm0x.mongodb.net/todos_app_database")

app.post("/signup",async function(req,res) {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    try{
        await UserModel.create({
            email: email,
            password: password,
            name: name
        });

        res.json({
            message: "signed up!"
        })
    } catch (error) {
        if(error.code === 11000) {
            console.error("Duplicate Key Error:", error.message);
            res.status(409).json({
                error: error.message
            })
        } else {
            console.error("Error occurred:", error.message);
            res.status(400).json({
                error: error.message
            })
        }
    }
});

app.post("/signin",async function(req,res) {
    const email = req.body.email;
    const password = req.body.password;

    const foundUser = await UserModel.findOne({
        email: email,
        password: password
    })

    if (foundUser) {
        const token = jwt.sign(
            {
                id: foundUser._id.toString()
            },
            JWT_SECRET
        );

        return res.status(200).json({
            message: "You have signed in successfully!",
            token: token,
        });
    } else {
        return res.status(403).json({
            message: "Invalid username or password!",
        });
    }
});

function auth(req,res,next) {
    const decodedData = jwt.verify(req.headers.token,JWT_SECRET)

    if(decodedData) {
        req.userId = decodedData.id;
        next();
    } else {
        res.json ({
            message: "Wrong token"
        })
    }
}

app.post("/todo", auth,async function(req,res) {
    const title = req.body.title;
    const done = req.body.done;
    const userId = req.userId;

    await TodoModel.create({
        title: title,
        done: done,
        userId: userId
    })

    res.json({
        message: "Added TO-DO successfully"
    })
});

app.get("/todos",auth, async function(req,res) {
    const userId = req.userId;

    const todos = await TodoModel.find({
        userId,
    });

    res.json({
        todos
    })
});

app.listen(3000);