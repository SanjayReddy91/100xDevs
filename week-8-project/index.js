const express = require("express");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const {AdminModel, CourseModel, CourseContentModel, UserModel} = require("./db");

require('dotenv').config();

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
mongoose.connect(process.env.MONGODB_URI)

//skeleton endpoints
app.post("/admin/signup", async function(req,res) {
    
})

app.post("admin/signin", async function(req,res) {

})

app.post("admin/createCourse", async function(req,res) {

})

app.delete("/admin/deleteCourse/:courseId", async function(req,res) {

})

app.post("/admin/addCourseContent/:courseId", async function(req,res) {

})


app.post("/user/signup", async function(req,res) {

})

app.post("/user/signin", async function(req,res) {

})

app.get("/listCourses", async function(req,res) {

}) 

app.post("/user/purchaseCourse/:courseId", async function(req,res) {

})

app.get("/user/viewCourseContent/:courseId", async function(req,res) {
    
})