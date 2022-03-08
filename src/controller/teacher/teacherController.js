const md5 = require("md5");
const { Teacher } = require("../../model/teacherModel");
const { Student } = require("../../model/studentModel");
const { Attendance } = require("../../model/attendanceModel");


// Teacher Login
exports.postTeacherLogin = async (req, res) => {
    const { emailId, password } = req.body;
    console.log(req.body);
    if (!emailId || !password) {
        res.status(400).json({
            detail: {
                title: "Invalid Data",
                message: "All required Data is not receving"
            }
        });
        return
    }
    
    const teacher = await Teacher.findOne({email: emailId});
    if(!teacher){
        res.status(404).json({
            detail: {
                title: "Invalid User",
                message: "User is Not Available"
            }
        });
    }else if(teacher.password == md5(password)){
        req.session.isTeacher = true;
        req.session.userName = emailId;
        req.session.schoolId = teacher.schoolId;
        res.redirect("/teacher");
    }else{
        res.status(404).json({
            detail: {
                title: "Invalid Username or Password",
                message: "Username or Password is not correct Please try to login again"
            }
        });
    }
}

exports.postStudentUID = async (req, res) => {
    const {uid} = req.body;
    let student = await Student.findOne({uID: uid});
    let schoolId = "";
    for (let i = 0; i < 8; i++) {
        schoolId += uid.charAt(i);
    }
    console.log(schoolId);
    let schoolData = await Attendance.find({ schoolId: schoolId });
    // console.log(schoolData);
    let studentPresentDays = checkNumber(schoolData, uid);
    let schoolDay = schoolData.length;
    let percentage = calculatePercentage(schoolDay, studentPresentDays);
    res.render("studentDashboard", { userName: req.session.userName, studentData: student, percentage: percentage, schoolDay: schoolDay, studentPresentDays: studentPresentDays });

}

function checkNumber(schoolData, uID) {
    //console.log(schoolData);
    let noOfDays = 0;
    let i, n = schoolData.length;
    for (i = 0; i < n; i++) {
        let sList = schoolData[i].studentList;
        for (let j = 0; j < sList.length; j++) {
            if (sList[j].uID == uID) {
                noOfDays++;
            }
        }
    }
    return noOfDays;
}

function calculatePercentage(schoolDay, studentPresentDays) {
    return ((studentPresentDays / schoolDay) * 100).toFixed(2);
}