# Course Management API

A RESTful API for a course management system built with Express.js, MongoDB, and JWT authentication. Allows administrators to create and manage courses while users can purchase and access course content.

## Setup Instructions

1. Clone the repository
```bash
git clone <repository-url>
cd course-management-api
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
   - Create a `.env` file with:
```
MONGODB_URI=mongodb://localhost:27017/course-management
JWT_SECRET=your_secret_key_here
```

4. Start the server
```bash
node index.js
```

The API runs on `http://localhost:3000`

## API Endpoints

### Admin Endpoints
- POST `/admin/signup` - Register a new admin
- POST `/admin/signin` - Admin authentication
- POST `/admin/createCourse` - Create a new course
- DELETE `/admin/deleteCourse/:courseId` - Delete course and all content
- POST `/admin/addCourseContent/:courseId` - Add content to a course

### User Endpoints
- POST `/user/signup` - Register a new user
- POST `/user/signin` - User authentication
- GET `/listCourses` - List all available courses
- POST `/user/purchaseCourse/:courseId` - Purchase a course
- GET `/user/viewCourseContent/:courseId` - View content of purchased course

## Data Models

### Admin
- email: String (unique)
- password: String (hashed)
- name: String

### Course
- title: String
- ownerId: ObjectId (reference to Admin)

### CourseContent
- content: String
- courseId: ObjectId (reference to Course)

### User
- email: String (unique)
- password: String (hashed)
- name: String
- courses: Array of courseIds (purchased courses)
