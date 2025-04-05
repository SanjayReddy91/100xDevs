const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Admin = new Schema({
    email: {type: String, unique: true},
    password: String,
    name: String
})

//course will be linked with admin byusing admin objectId in ownerId
const Course = new Schema({
    title: String,
    ownerId: ObjectId
})

//courseContent is linked to course by objectId in courseId
const CourseContent = new Schema({
    content: String,
    courseId: ObjectId
})

//User will have list of courses in array stored by courseIds
const User = new Schema({
    email: {type: String, unique: true},
    password: String,
    name: String,
    courses: [String]
})

const AdminModel = mongoose.model('admins', Admin);
const CourseModel = mongoose.model('courses', Course);
const CourseContentModel = mongoose.model('coursecontent', CourseContent);
const UserModel = mongoose.model('users', User);

module.exports = {
    AdminModel: AdminModel,
    CourseModel: CourseModel,
    CourseContentModel: CourseContentModel,
    UserModel: UserModel
}