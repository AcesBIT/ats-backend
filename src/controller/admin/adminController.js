const {User,School}=require("../../model/adminModel.js");
const md5= require("md5");
const nodemailer = require('nodemailer');

exports.postAdminRegister=async(req,res)=>{
    const {userName, password} = req.body;

    let user = await User.findOne({userName});

    if(user){
        res.status(409).json({
            message: "User Already Exists"
        });
    }else{
        const newUser = new User({
            userName: req.body.userName,
            password: md5(req.body.password),
        });

        await newUser.save(function(err){
            if(err){
                console.log(err);
            }else{
                res.status(201).json({
                    message: `Successfully Registered ${userName}`
                });
            }
        });
    }
}

exports.postAdminLogin=async (req,res)=>{
    const {userName, password} = req.body;
    const user = await User.findOne({userName});
    if(!user){
        res.status(404).json({
            detail: {
                title: "Invalid User",
                message: "User is Not Available"
            }
        });
    }
    else if(user.password === md5(req.body.password)){
        req.session.isAuth = true;
        req.session.userName = user.userName;
        // res.send("User found, logged in");
        res.status(200).json({
            message: "Admin Login Successful",
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

exports.postSchoolRegister= async (req,res)=>{
    const {schoolName,phone,emailId,address,pincode} = req.body;
    const schoolData= await School.findOne({schoolName: schoolName, emailId: emailId});
    if(schoolData){
        res.status(409).json({
            detail: {
                title: "School Already Exists",
                message: "Enter the Correct School to Register"
            }
        });
    }else{
        const samePincodeSchoolList= await School.find({pincode: pincode});
        let samePinListLength=String(samePincodeSchoolList.length);
        let schoolId=pincode;
        if(samePinListLength.length<2){
            schoolId=pincode+"0"+Number(samePincodeSchoolList.length+1);
        }else{
            schoolId=pincode+Number(samePincodeSchoolList.length+1);
        }
        const newSchool=new School({
            schoolName: schoolName,
            schoolId: schoolId,
            emailId: emailId,
            phone: phone,
            address: address,
            pincode: pincode
        });
        await newSchool.save((err)=>{
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
                    to: emailId,
                    subject: `${schoolName} Login Credentials`,
                    text: `${schoolName} has been registered to our Website, 
                    School Login credentials are:
                    School-ID: ${schoolId}
                    School-Username: ${emailId}
                    School-Password: sj,dh,nfbkd,nfj`
                };
            
                transporter.sendMail(mailOptions, (error, info)=>{
                    if (error) {
                        console.log(error);
                        res.send('error')
                        return
                    } else {
                        console.log('Email sent: ' + info.response);
                        res.status(201).json({
                            message: `${schoolName} is Registered to the State Database`
                        });
                        return
                    }
                });
            }    
        });
    }
}
