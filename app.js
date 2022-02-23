const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const { process_params } = require("express/lib/router");
const { postAdminRegister, postAdminLogin, postSchoolRegister } = require("./src/controller/admin/adminController");
const { logoutUser } = require("./src/controller/common/common");
const { isAuth } = require("./src/controller/common/auth");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const pass = process.env.dbPassword;

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(`mongodb+srv://admin-aces:${pass}@cluster0.buvru.mongodb.net/managementDB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((res)=>{
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


app.get('/', (req, res)=>{
    res.send('Server is Running Copyright @sourashispaul @siddhantsrivastava');
});


// Admin End Points Are Here----------------------------------->
app.post('/admin/login', postAdminLogin);
app.post('/logout', logoutUser);
app.post('/admin/register', postAdminRegister);
app.post('/admin/schoolregister', isAuth, postSchoolRegister);

// Listen Port Starts-----Here
app.listen(PORT, ()=>{
    console.log(`Server is Running on port ${PORT}`);
});




































































// app.post('/school', auth.isAuth, async (req,res)=>{
//     const schoolData = {
//         username:"1234",
//         password:"1234",
//         schoolId:"1234",
//         schoolName: req.body.schoolname,
//         emailId: req.body.email,
//         phone: req.body.phone,
//         address: req.body.address,
//         district: req.body.district,
//         schoolType: req.body.type
//     }

//     const username = req.session.username;
//     let user = await User.findOne({username});

//     if(!user){
//         res.send("User not found, something went wrong");
//     }else{       
//         //autogenerate school username, password and school ID is still pending... 
//         const newSchool = new School({
//             schoolName : req.body.schoolname,
//             emailId: req.body.email,
//             phone: req.body.phone,
//             address: req.body.address,
//             district: req.body.district,
//             schoolType: req.body.type
//         });
//         await newSchool.save(function(err){
//             if(err){
//                 res.send("some error occured");
//             }else{
//                 res.send(`New school added with details - ${username}`);
//             }
//         });
//         user.Schools.push(schoolData);
//         user.save();



// });
// const schoolSchema = new mongoose.Schema({
//     username: String,
//     password: String,
//     schoolId: String,
//     schoolName : String,
//     emailId: String,
//     phone: String,
//     address: String,
//     district: String,
//     schoolType: String,
//     registeredTeacher : [
//         {
//             username : String,
//             password : String,
//             name : String,
//             email : String,
//             phone : String
//         }
//     ],
//     class1:[
//         {
//             name: String,
//             standard: String,
//             sec: String,
//             UID: String,          //${SchoolID}+${class}+${studenData.length}
//             dob: String,
//             email: String,
//             image: String,
//             address: String,
//             phone: String,
//             guardianName: String,
//             // Attendance: [
                
//             // ]
//         }
//     ],    

// });
  