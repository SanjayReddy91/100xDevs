const express = require("express");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const {AdminModel, CourseModel, CourseContentModel, UserModel} = require("./db");
const {auth} = require("./auth")

require('dotenv').config();

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
mongoose.connect(process.env.MONGODB_URI)




/*=============< ADMIN ENDPOINTS >=============*/
app.post("/admin/signup", async function(req,res) {
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
        await AdminModel.create({
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
})

app.post("/admin/signin", async function(req,res) {
    const email = req.body.email;
    const password = req.body.password;

    const foundUser = await AdminModel.findOne({
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
})

app.post("/admin/createCourse", auth, async function(req,res) {
    const ownerId = req.userId;
    const title = req.body.title;
    
    try{
        await CourseModel.create({
            title: title,
            ownerId: ownerId
        })
    } catch(error) {
        console.log("Error occurred in creating course: " + error);
        res.status(400).json({
            message: "Error occurred in creating course",
            error: error
        });
        return
    }

    res.status(201).json({
        message: "Create course successfully"
    })
})

//delete course if found and owned by admin alsong with all the course contents
app.delete("/admin/deleteCourse/:courseId", auth, async function(req,res) {
    const courseId = req.params.courseId;
    const userId = req.userId;

    try{
        const foundCourse = await CourseModel.findById(courseId);
        if(foundCourse && foundCourse.ownerId == userId) {
            await CourseContentModel.deleteMany({courseId: courseId})
            await CourseModel.findByIdAndDelete(courseId)
        } else if(foundCourse.ownerId != userId){
            res.status(404).json({
                message: "Course not owned by you"
            })
            return
        }
        else {
            res.status(404).json({
                message: "Course already deleted or not found"
            })
            return
        }
    } catch(error) {
        console.log("Error occurred in deleting course/contents: " + error);
        res.status(400).json({
            message: "Error occurred in deleting course/contents",
            error: error
        });
        return
    }

    res.status(200).json({
        message: "Deleted course successfully"
    })
    //TODO: Remove courseId in all the users courses list
})

//add course content to a course if it exists and owned by the admin
app.post("/admin/addCourseContent/:courseId", auth, async function(req,res) {
    const userId = req.userId;
    const courseId = req.params.courseId;
    const content = req.body.content;
    try{
        const foundCourse = await CourseModel.findById(courseId);
        if(foundCourse && foundCourse.ownerId == userId) {
            await CourseContentModel.create({
                content: content,
                courseId: courseId
            })
        } else {
            res.status(404).json({
                message: "Course not found or not owned by you"
            })
            return
        }
    } catch(error) {
        console.log("Error occurred in adding course content: " + error);
        res.status(400).json({
            message: "Error occurred in adding course content",
            error: error
        });
        return
    }

    res.status(201).json({
        message: "Created course content successfully"
    })
})




/*=============< USER ENDPOINTS >=============*/
//Signup for user
app.post("/user/signup", async function(req,res) {
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
            name: name,
            courses: []
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
})

//Signin returns authentication token for user
app.post("/user/signin", async function(req,res) {
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
})

//User can list all courses
app.get("/listCourses", auth, async function(req,res) {
    try{
        const courseList = await CourseModel.find({});
        res.status(200).json({
            courses: courseList
        })
    } catch(error) {
        console.log("Error occurred in listing courses: " + error);
        res.status(500).json({
            message: "Error occurred in listing courses",
            error: error
        });
        return
    }
}) 

//User can purchase a course if it exists and hasn't been purchased by them already
app.post("/user/purchaseCourse/:courseId", auth, async function(req,res) {
    const courseId = req.params.courseId;
    const userId = req.userId;
    try{
        const foundCourse = await CourseModel.findById(courseId);
        console.log(foundCourse);
        
        const foundUser = await UserModel.findById(userId);
        const updatedCourseList = foundUser.courses;
        if(updatedCourseList.includes(courseId)){
            res.status(400).json({
                message: "Already purchased this course"
            })
            return
        }
        updatedCourseList.push(courseId);
        console.log(updatedCourseList);
        if(foundCourse) {
            await UserModel.findByIdAndUpdate(userId, {
                courses: updatedCourseList
            })
        } else {
            res.status(404).json({
                message: "Course not found"
            })
            return
        }
    } catch(error) {
        console.log("Error occurred in purchasing course: " + error);
        res.status(400).json({
            message: "Error occurred in purchasing course",
            error: error
        });
        return
    }

    res.status(201).json({
        message: "Purchased course successfully"
    })
})

//coursecontents listed if user purchased the course and course exists
app.get("/user/viewCourseContent/:courseId", auth, async function(req,res) {
//Check if user has purchased the course
    const userId = req.userId;
    const courseId = req.params.courseId;

    try{
        const foundUser = await UserModel.findById(userId);
        const foundCourse = await CourseModel.findById(courseId);
        if(foundUser && foundCourse && foundUser.courses.includes(courseId)) {
            const courseContents = await CourseContentModel.find({
                courseId: courseId
            })

            res.status(200).json({
                courseContents: courseContents
            })
        } else {
            res.status(400).json({
                message: "Course not found or you dont own the course"
            })
        }
    } catch(error) {
        console.log("Error occurred in listing course contents: " + error);
        res.status(400).json({
            message: "Error occurred in listing course contents",
            error: error
        });
        return
    }
})

app.listen(3000);