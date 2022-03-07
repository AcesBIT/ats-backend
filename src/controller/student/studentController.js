const { Student } = require("../../model/studentModel");
const { Attendance } = require("../../model/attendanceModel");

exports.postStudentLogin = async (req, res) => {
    const { userName, password } = req.body;
    console.log(req.body);
    if (!userName || !password) {
        res.status(400).json({
            detail: {
                title: "Invalid Data",
                message: "All required Data is not receving"
            }
        });
        return
    }
    const user = await Student.findOne({ uID: userName });
    if (!user) {
        res.status(404).json({
            detail: {
                title: "Invalid User",
                message: "User is Not Available"
            }
        });
    } else if (user.dob == password) {
        req.session.isStudent = true;
        req.session.userName = userName;
        let schoolId = "";
        for (let i = 0; i < 8; i++) {
            schoolId += userName.charAt(i);
        }
        console.log(schoolId);
        let schoolData = await Attendance.find({ schoolId: schoolId });
        console.log(schoolData);
        let studentPresentDays = checkNumber(schoolData, userName);
        let schoolDay = schoolData.length;
        let percentage = calculatePercentage(schoolDay, studentPresentDays);
        req.session.studentData = user;
        req.session.percentage = percentage;
        req.session.schoolDay = schoolDay;
        req.session.studentPresentDays = studentPresentDays;
        res.render("studentDashboard", { userName: userName, studentData: user, percentage: percentage, schoolDay: schoolDay, studentPresentDays: studentPresentDays });
    } else {
        res.status(404).json({
            detail: {
                title: "Invalid Username or Password",
                message: "Username or Password is not correct Please try to login again"
            }
        });
    }
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