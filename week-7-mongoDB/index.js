const express = require("express");
const bcrypt = require("bcrypt");
const {UserModel, TodoModel} = require("./db");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const { z } = require("zod");
require('dotenv').config();

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
mongoose.connect(process.env.MONGODB_URI)

//SignUp endpoint has input validation and error handling. Also puts hash of user creds in DB
app.post("/signup",async function(req,res) {
    const requestBody = z.object({
        email: z.string().min(5).max(50).email(),
        name: z.string().min(1).max(50),
        password: z.string().min(5).max(50)
          .refine(
            (password) => /[A-Z]/.test(password),
            { message: "Password must contain at least one uppercase letter" }
          )
          .refine(
            (password) => /[a-z]/.test(password),
            { message: "Password must contain at least one lowercase letter" }
          )
          .refine(
            (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
            { message: "Password must contain at least one special character" }
          )
    })

    const parsedDataWithSuccess = await requestBody.safeParseAsync(req.body);
    if(!parsedDataWithSuccess.success) {
        res.json({
            message: "Incorrect format",
            error: parsedDataWithSuccess.error
        })
        return
    }
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    const hashedPassword = await bcrypt.hash(password, 5);

    try{
        await UserModel.create({
            email: email,
            password: hashedPassword,
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

//SignIn: user should sign in and will recieve a token with userId user to access todo APIs 
app.post("/signin",async function(req,res) {
    const email = req.body.email;
    const password = req.body.password;

    const foundUser = await UserModel.findOne({
        email: email
    })

    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (foundUser && passwordMatch) {
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

//Authentication for all the todo endpoints
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

//insert a todo of a user
app.post("/todo", auth,async function(req,res) {
    const title = req.body.title;
    const done = req.body.done;
    const userId = req.userId;

    try{
        await TodoModel.create({
            title: title,
            done: done,
            userId: userId
        })
    } catch(error) {
        console.log("Error occurred in creating todo: " + error);
        res.status(400).json({
            message: "Error occurred in creating todo",
            error: error
        });
        return
    }

    res.status(201).json({
        message: "Added TO-DO successfully"
    })
});

//list todos of a user
app.get("/todos",auth, async function(req,res) {
    const userId = req.userId;

    const todos = await TodoModel.find({
        userId,
    });

    res.json({
        todos
    })
});

//Update the todo
app.put("/todo", auth, async function (req,res) {
    const reqUserId = req.userId;
    const title = req.body.title;

    const foundTodo = await TodoModel.findOne({
        userId: reqUserId,
        title: req.body.title
    })

    if(foundTodo) {
        await TodoModel.updateOne(foundTodo, {
            title: req.body.title,
            done: req.body.done
        })
        res.json({
            message: "Updated successfully"
        })
    } else {
        res.json({
            message: "Todo not found for given title"
        })
    }
})

app.listen(3000);