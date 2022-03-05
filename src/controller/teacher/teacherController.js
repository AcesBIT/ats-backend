const md5 = require("md5");
const { Teacher } = require("../../model/teacherModel");


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