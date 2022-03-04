const {Student}=require("../../model/studentModel.js");
const {Teacher}=require("../../model/teacherModel.js");
const {School}=require("../../model/adminModel.js");
const md5= require("md5");
const nodemailer = require('nodemailer');

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
        res.redirect("/official");
        // res.status(200).json({
        //     message: "School Login Sucessful",
        //     session: req.session
        // });
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
                title: "Incomplete Data",
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
    
    if(!req.body.email || !req.body.name || !req.body.phone){
        res.status(400).json({
            detail:{
                title: "Incomplete Data",
                message: "All required Data is not receving"
            }
        });
        return
    }
    
    const {email} = req.body;
    const schoolId = req.session.schoolId;
    let teacher = await Teacher.findOne({email: email});
    const password = getPass();

    if(teacher){
        res.status(409).json({
            message: "Teacher Already Exists"
        });
    }else if(!teacher){
        const newTeacher = new Teacher({
            schoolId: schoolId,
            email: req.body.email,
            name: req.body.name,
            password: md5(password),
            phone: req.body.phone
        });

        await newTeacher.save(function(err){
            if(err){
                console.log(err);
            }else{
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: process.env.websiteMail,
                      pass: process.env.websitePass
                    }
                })
                const mailOptions = {
                    from: process.env.websiteMail,
                    to: req.body.email,
                    subject: `${req.session.schoolId} Login Credentials of ${req.body.name}`,
                    text: `${req.body.email} has been registered to School with id = ${req.session.schoolId}, 
                Your Login credentials are:
                School-ID: ${req.session.schoolId}
                Your-username: ${req.body.email}
                Your-Password: ${password}`
                };
            
                transporter.sendMail(mailOptions, (error, info)=>{
                    if (error) {
                        console.log(error);
                        res.send('error')
                        return
                    } else {
                        console.log('Email sent: ' + info.response);
                        res.status(201).json({
                            message: `${req.body.email} is Registered to the School ${req.session.schoolId}`
                        });
                        return
                    }
                });
            }
        })
    }else{
        res.status(503).json({
            message: "Some error occured"
        });
    }
}

exports.updateStudentClass=async(req, res)=>{
    const data = req.body.id;
    if(!data || !req.body.class){
        res.status(400).json({
            detail:{
                title: "Incomplete Data",
                message: "All required Data is not receving"
            }
        });
        return
    }
    
    data.forEach (async element => {
        try {
            await Student.updateOne({uID: element}, {class: req.body.class});
        } catch (error) {
            res.status(503).json({
                message: "Some error occured"
            })
        }
    });

    res.status(201).json({
        message: `Successfully Updated all students`
    })
    
    
}

function getPass(){
    let password="";
    let charList="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for(var i=0;i<5;i++){
        let randomNumber = Math.trunc(Math.random() * 52);
        password=password+charList.charAt(randomNumber);
    }
    for(var i=0;i<3;i++){
        password=password+Math.trunc(Math.random() * 9)+1;
    }
    return password+'@';
}