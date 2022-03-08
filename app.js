const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require("cors");
const ejs = require("ejs");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const { process_params } = require("express/lib/router");
const { postAdminRegister, postAdminLogin, postSchoolRegister } = require("./src/controller/admin/adminController");
const { postOfficialLogin, postStudentRegister, postTeacherRegister, updateStudentClass } = require("./src/controller/official/schoolController.js");
const { logoutUser } = require("./src/controller/common/common");
const { isAuth, isValidSchool, isTeacher, isStudent } = require("./src/controller/common/auth");
const { postCameraLogin, postCameraAttendance } = require("./src/controller/camera/cameraController");
const { postStudentLogin} = require("./src/controller/student/studentController");
const { postTeacherLogin, postStudentUID } = require("./src/controller/teacher/teacherController");
const { Student } = require("./src/model/studentModel");
const { Attendance } = require("./src/model/attendanceModel");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const pass = process.env.dbPassword;

const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine', 'ejs');

mongoose.connect(`mongodb+srv://admin-aces:${pass}@cluster0.buvru.mongodb.net/managementDB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((res) => {
    console.log("MongoDB connected");
});

const store = new MongoDBSession({
    uri: `mongodb+srv://admin-aces:${pass}@cluster0.buvru.mongodb.net/managementDB`,
    collection: 'mySessions'
});

app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    store: store
}));




//home page
app.get('/', (req, res) => {
    res.render("index");
});
app.get('/adminlogin', (req, res) => {
    if (req.session.isAuth) {
        res.redirect("/admin");
    } else {
        res.render("adminLogin");
    }
});
app.get('/schoollogin', (req, res) => {
    if (req.session.isValidSchool) {
        res.redirect("/official");
    } else {
        res.render("schoolLogin");
    }
});
app.get('/teacherlogin', (req, res) => {
    if (req.session.isTeacher) {
        res.redirect("/teacher");
    } else {
        res.render("teacherLogin");
    }
});
app.get('/studentlogin', (req, res) => {
    if (req.session.isStudent) {
        res.render("studentDashboard", { userName: req.session.userName, studentData: req.session.studentData, percentage: req.session.percentage, schoolDay: req.session.schoolDay, studentPresentDays: req.session.studentPresentDays });
    } else {
        res.render("studentLogin");
    }
});




//admin-site
app.get('/admin', isAuth, (req, res) => {
    res.render("admin", { userName: req.session.userName });
});
app.get('/admin/schoolregister', isAuth, (req, res) => {
    res.render("schoolRegister");
});
app.get('/admin/adminregister', isAuth, (req, res) => {
    res.render("adminRegister");
});



//school-site
app.get('/official', isValidSchool, (req, res) => {
    res.render("school", { userName: req.session.userName });
});
app.get('/official/studentRegister', isValidSchool, (req, res) => {
    res.render("studentRegister");
});
app.get('/official/teacherRegister', isValidSchool, (req, res) => {
    res.render("teacherRegister");
});


//teacher-site
app.get('/teacher', isTeacher, (req, res) => {
    res.render("teacher", { userName: req.session.userName });
});
app.get('/teacher/attendancelist', isTeacher, (req, res) => {
    const studentList = [];
    res.render("attendanceList", { userName: req.session.userName, list: studentList });
});
app.get('/teacher/attendanceByUid', isTeacher, (req, res)=>{
    res.render("attendanceByUID", {userName: req.session.userName});
});
app.post('/teacher/attendance/filter', isTeacher, async (req, res) => {

    const studentList = await Attendance.findOne({ date: req.body.date, schoolId: req.session.schoolId });

    if (!studentList) {
        res.redirect("/teacher/attendancelist");
    }

    const currentClassList = studentList.studentList;
    let list = [];

    // res.send("running");
    console.log(req.body.class);
    for (var i = 0; i < currentClassList.length; i++) { 
        if (currentClassList[i].class == req.body.class) {
            list.push(currentClassList[i]);
        }
    }

    console.log(list);
    res.render("attendanceList", { userName: req.session.userName, date: req.body.date, list: list });
});
app.post('/teacher/attendanceByUid/uID', isTeacher, postStudentUID);


// Admin End Points Are Here----------------------------------->
app.post('/admin/login', postAdminLogin);
app.post('/admin/register', postAdminRegister);
app.post('/admin/schoolregister', isAuth, postSchoolRegister);

//School Officials End Points Are Here----------------------------------->
app.post('/official/login', postOfficialLogin);
app.post('/official/studentRegister', isValidSchool, postStudentRegister);
app.post('/official/teacherRegister', isValidSchool, postTeacherRegister);
app.put('/official/updateStudent', isValidSchool, updateStudentClass);

// Camera End Points Are Here---------------------------------->
app.post('/camera/login', postCameraLogin);
app.post('/camera/attendance', isAuth, postCameraAttendance);

// Student End Points Are Here--------------------------------->
app.post('/student/login', postStudentLogin);
app.get('/student', isStudent, (req, res) => {
    res.render("studentDashboard");
});


// Teacher End Points Are Here--------------------------------->
app.post('/teacher/login', postTeacherLogin);

// Common End Points Are Here---------------------------------->
app.post('/logout', logoutUser);


// Listen Port Starts-----Here
app.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT}`);
});
