const {User,School}=require("../../model/adminModel.js");
const md5= require("md5");
const nodemailer = require('nodemailer');

// Admin Registration
exports.postAdminRegister=async(req,res)=>{
    const {userName, password} = req.body;
    if(!userName || !password){
        res.status(400).json({
            detail:{
                title: "Invalid Data",
                message: "All required Data is not receving"
            }
        });
        return
    }
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

// Admin Login
exports.postAdminLogin=async (req,res)=>{
    const {userName, password} = req.body;
    console.log(req.body);
    if(!userName || !password){
        res.status(400).json({
            detail:{
                title: "Invalid Data",
                message: "All required Data is not receving"
            }
        });
        return
    }
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
        res.redirect("/admin");
        // res.send("User found, logged in");
        // console.log(req.headers.cookie);
        // res.status(200).json({
        //     message: "Admin Login Successful",
        //     session: req.session,
        //     cookie: req.headers.cookie
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
// School Registration for Admin
exports.postSchoolRegister= async (req,res)=>{
    let missingVal="";
    const {schoolName,phone,emailId,address,pincode} = req.body;
    if(!schoolName || !phone || !emailId || !address || !pincode){
        if(!schoolName){
            missingVal+="School Name";
        }
        if(!phone){
            missingVal+=" Phone";
        }
        if(!emailId){
            missingVal+=" Email Id";
        }
        if(!address){
            missingVal+=" Address";
        }
        if(!pincode){
            missingVal+=" Pincode";
        }
        res.status(400).json({
            detail:{
                title: "Invaild Data",
                message: `All required Data is not receving, Missing Values are ${missingVal}`
            }
        });
        return
    }
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
        let password=getPass();
        let camUserName='CAM'+schoolId;
        let campassword=getPass();
        const newSchool=new School({
            schoolName: schoolName,
            schoolId: schoolId,
            emailId: emailId,
            phone: phone,
            address: address,
            pincode: pincode,
            password: md5(password),
            camDetails: {
                userName: camUserName,
                password: md5(campassword)
            }
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
                    School-UserName: ${emailId}
                    School-Password: ${password}
                    School-CameraUserName: ${camUserName}
                    School-CameraPassword: ${campassword}`
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
                        
                    }
                });
            } 
               
        });
    }
}
// req.headers.cookie

// Random Password Generation
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
