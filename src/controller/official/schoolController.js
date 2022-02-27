const {Student}=require("../../model/studentModel.js");
const {Teacher}=require("../../model/teacherModel.js");
const {School}=require("../../model/adminModel.js");
const md5= require("md5");

exports.postOfficialLogin=async (req,res)=>{
    const {userName, password} = req.body;
    const school = await School.findOne({emailId: userName});
    if(!school){
        res.status(404).json({
            detail: {
                title: "Invalid Credentials",
                message: "School is not Available"
            }
        });
    }else if(school.password === md5(req.body.password)){
        req.session.isValidSchool = true;
        req.session.userName = req.body.userName;
        req.session.schoolId = school.schoolId;

        res.status(200).json({
            message: "School Login Sucessful",
            session: req.session
        });
    }else{
        res.status(404).json({
            detail: {
                title: "Invalid Username or Password",
                message: "Username or Password is not correct Please try to login again"
            }
        });
    }
}

exports.postStudentRegister=async(req, res)=>{
    
    if(!req.body.name || !req.body.class || !req.body.year || !req.body.dob || !req.body.email || !req.body.image || !req.body.address || !req.body.phone || !req.body.guardianName){
        res.status(400).json({
            detail:{
                title: "Invalid Data",
                message: "All required Data is not receving"
            }
        });
        return
    }
    
    const {email} = req.body;
    
    let student = await Student.findOne({email: email});

    if(student){
        res.status(409).json({
            message: "Student Already Exists"
        });
    }else if(!student){
        //logic for UID generation
        //--------------------------------->
        let totalStudent = await Student.find({yOA: req.body.year});
        totalLength = totalStudent.length;
        totalLength++;
        const totalSize = (totalLength < 10) ? "00" + (totalLength) : (totalLength < 100 && totalLength > 9) ? "0" + totalLength: totalLength;
        const userId = req.session.schoolId + req.body.year[2] + req.body.year[3] + totalSize;
        //--------------------------------->

        const newStudent = new Student({
            schoolId: req.session.schoolId,
            name: req.body.name,
            class: req.body.class,
            yOA: req.body.year,
            uID: userId,
            dob: req.body.dob,
            email: req.body.email,
            image: req.body.image, 
            address: req.body.address,
            phone: req.body.phone,
            guardianName: req.body.guardianName
        });

        await newStudent.save(function(err){
            if(err){
                console.log(err);
                res.status(503).json({
                    message: `Some error occured with ${req.body.name}`
                })
            }else{
                res.status(201).json({
                    message: `Successfully Registered ${req.body.name}`
                });
            }
        })

    }else{
        res.status(503).json({
            message: "Some error occured"
        });
    }
}

exports.postTeacherRegister=async(req, res)=>{
    const {userName} = req.body;
    const schoolId = req.session.schoolId;
    let teacher = await Teacher.findOne({userName: userName, schoolId: schoolId});

    if(teacher){
        res.status(409).json({
            message: "Teacher Already Exists"
        });
    }else if(!teacher){
        const newTeacher = new Teacher({
            schoolId: schoolId,
            userName: req.body.userName,
            password: md5(req.body.password),
            phone: req.body.phone
        });

        await newTeacher.save(function(err){
            if(err){
                console.log(err);
            }else{
                res.status(201).json({
                    message: `Successfully Registered ${userName}`
                })
            }
        })
    }else{
        res.status(503).json({
            message: "Some error occured"
        });
    }
}