const { Attendance } = require("../../model/attendanceModel");
const { School } = require("../../model/adminModel");
const { Student } =require("../../model/studentModel");
const md5 = require("md5");


// Camera Login Section
exports.postCameraLogin = async (req, res) => {
    const { userName, password } = req.body;
    if (!userName || !password) {
        res.status(400).json({
            detail: {
                title: "Invalid Data",
                message: "All required Data is not receving"
            }
        });
        return
    }
    const user = await School.findOne({ "camDetails.userName" : userName  });
    if (!user) {
        res.status(404).json({
            detail: {
                title: "Invalid User",
                message: "User is Not Available"
            }
        });
    } else if ((user.camDetails.password) == md5(password)) {
        req.session.isAuth = true;
        req.session.userName = userName;
        const studentList= await Student.find({schoolId: user.schoolId});
        let today=new Date();
        let cDate,cMonth,cYear;
        cDate=today.getDate();
        cMonth=String(Number(today.getMonth()+1));
        if(cMonth.length<2){
            cMonth="0"+cMonth;
        }
        cYear=today.getFullYear();
        today=cYear+"-"+cMonth+"-"+cDate;
        const dateAlreadyRegistered= await Attendance.findOne({date: today, schoolId: user.schoolId});
        if(!dateAlreadyRegistered){
            const newDateAttendance= new Attendance({
                date: today,
                schoolId: user.schoolId,
                studentList: []
            });
            await newDateAttendance.save();
        }
        res.status(200).json({
            message: "Camera Login Successful",
            session: req.session,
            studentList: studentList
        });
    } else {
        res.status(404).json({
            detail: {
                title: "Invalid Username or Password",
                message: "Username or Password is not correct Please try to login again"
            }
        });
    }
}

exports.postCameraAttendance = async (req, res) => {
    let misingVal = "";
    const { date, schoolId, studentData } = req.body;
    if (!date || !schoolId || !studentData) {
        if (!date)
            misingVal += "date";
        if (!schoolId)
            misingVal += "schoolId";
        if (!studentData)
            misingVal += "studentData";
        res.status(400).json({
            detail: {
                title: "Invalid Data",
                message: `All required Data is not receving, Missing Values are ${misingVal}`
            }
        });
        return
    } else {
        const studentAttendance = await Attendance.findOne({ date: date, schoolId: schoolId });
        let sList = studentAttendance.studentList;
        const isPresent = isStudentAlreadyPresent(sList, studentData);
        if (isPresent) {
            res.status(409).json({
                message: `Student is Already Present in ${date}`
            });
        } else {
            sList.push(studentData);
            try {
                await Attendance.updateOne({ _id: studentAttendance._id }, { studentList: sList });
                res.status(201).json({
                    message: `Attendance Given--Student ID ${studentData.uID}`
                });
            } catch (e) {
                console.log(e);
                res.status(503).json({
                    detail: {
                        title: "Server is Not Responding",
                        message: "New Attendance Record Store Failed"
                    }
                });
            }
        }
    }
}

function isStudentAlreadyPresent(studentList, currentStudent) {
    for (let i = 0; i < studentList.length; i++) {
        if (studentList[i].uID == currentStudent.uID) {
            return true;
        }
    }
    return false;
}