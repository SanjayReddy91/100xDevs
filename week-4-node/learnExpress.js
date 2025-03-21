const fs = require("fs");
const express = require('express');
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Path to the todos.json file
const todosFilePath = path.join(__dirname, "todos.json");

// function getUsername(req,res,next) {
//     const username = req.query
// }

function isOldEnoughMiddleWare(req,res,next) {
    const age = req.headers['age'];
    if(age >= 18) {
        next();
    } else {
        res.json({message: 'You are underage'});
    }
}
app.use(isOldEnoughMiddleWare)

function readTodos() {
    if (!fs.existsSync(todosFilePath)) {
        return [];
    }
    const data = fs.readFileSync(todosFilePath, "utf-8");
    return JSON.parse(data || "[]");
}

// Helper function to write todos to the file
function writeTodos(todos) {
    fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2), "utf-8");
}

app.post('/add', (req, res) => {
    // Access the request body using req.body
    const todoTitle = req.body.title;
    const todoTime = req.body.time;
  
    console.log('Received data:', todoTitle, todoTime);

    // Add to todos.json
    const todos = readTodos();

    const newTodo = {
        Title: todoTitle,
        Deadline: todoTime,
        Done: false,
    };

    todos.push(newTodo);
    writeTodos(todos);
    console.log("Todo added successfully!");
  
    // Send a response to the client
    res.json({ message: 'Todo added successfully!'});
  });

app.get('/list', (req,res,next) => {
    const todos = readTodos();
    res.send(todos);
    next();
}, (req,res,next) => {
    const todos = readTodos();
    console.log("second middleware");
    console.log(todos);
})

app.delete('/remove', (req,res) => {
    let todos = readTodos();
    const todoTitle = req.body.title;
    const updatedTodos = todos.filter((todo) => todo.Title !== todoTitle);

    if (todos.length === updatedTodos.length) {
        console.log("Todo not found!");
        res.send("Todo not found :(");
    } else {
        writeTodos(updatedTodos);
        console.log("Todo removed successfully!");
        res.send("Todo removes successfully ;)")
    }
})

app.put('/mark', (req,res) => {
    const todoTitle = req.body.title;

    let todos = readTodos();
    let todoFound = false;

    todos = todos.map((todo) => {
        if (todo.Title === todoTitle) {
            todo.Done = true;
            todoFound = true;
        }
        return todo;
    });

    if (todoFound) {
        writeTodos(todos);
        console.log("Todo marked as done!");
        res.send("Todo marked as done ;)");
    } else {
        console.log("Todo not found!");
        res.send("Todo not found :(");
    }    
})

app.listen(3000); 