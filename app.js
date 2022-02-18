const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');
// const encrypt = require("mongoose-encryption");
const md5 = require("md5");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
// const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");
const { process_params } = require("express/lib/router");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const pass = process.env.dbPassword;

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// app.use(passport.initialize());
// app.use(passport.session());

mongoose.connect(`mongodb+srv://admin-aces:${pass}@cluster0.buvru.mongodb.net/managementDB`, {
    useNewUrlParser: true,
    // useCreateIndex: true,
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

const isAuth = (req, res, next)=>{
    if(req.session.isAuth){
        next();
    }else{
        res.send('login required');
    }
}

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    Schools: [
        {
            schoolName : String,
            emailId: String,
            phone: String,
            address: String,
            district: String,
            schoolType: String
        }
    ]
});
const schoolSchema = new mongoose.Schema({
    username: String,
    password: String,
    schoolId: String,
    schoolName : String,
    emailId: String,
    phone: String,
    address: String,
    district: String,
    schoolType: String,
    registeredTeacher : [
        {
            username : String,
            password : String,
            name : String,
            email : String,
            phone : String
        }
    ],
    class1:[
        {
            name: String,
            standard: String,
            sec: String,
            UID: String,          //${SchoolID}+${class}+${studenData.length}
            dob: String,
            email: String,
            image: String,
            address: String,
            phone: String,
            guardianName: String,
            // Attendance: [
                
            // ]
        }
    ],    

});
  
// const Person = mongoose.model("Person", personSchema);
const School = new mongoose.model("School", schoolSchema);
const User = new mongoose.model("User", userSchema);



// userSchema.plugin(encrypt, {secret: process.env.secret, encryptedFields: ['password']});
// userSchema.plugin(passportLocalMongoose);

// passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());



app.get('/', (req, res)=>{
    res.send('server is running fine');
});

app.get('/dashboard', isAuth, (req, res)=>{
    console.log(req.session.username);
    res.send(req.session);
});


app.post('/login', async (req, res)=>{
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if(!user){
        res.send('User not found');
    }
    else if(user.password === md5(req.body.password)){
        req.session.isAuth = true;
        req.session.username = user.username;
        // res.send("User found, logged in");
        res.redirect('/dashboard');
    }else{
        res.send('Invalid username or password');
    }
    
});


app.post('/register', async (req, res)=>{
    const {username, password} = req.body;

    let user = await User.findOne({username});

    if(user){
        res.send('User already exists');
    }else{
        const newUser = new User({
            username: req.body.username,
            password: md5(req.body.password),
        });

        await newUser.save(function(err){
            if(err){
                console.log(err);
            }else{
                res.send(`Registered new user ${req.body.username}`)
            }
        });
    }
});

app.post('/school', isAuth, async (req,res)=>{
    const schoolData = {
        username:"1234",
        password:"1234",
        schoolId:"1234",
        schoolName: req.body.schoolname,
        emailId: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        district: req.body.district,
        schoolType: req.body.type
    }

    const username = req.session.username;
    let user = await User.findOne({username});

    if(!user){
        res.send("User not found, something went wrong");
    }else{       
        //autogenerate school username, password and school ID is still pending... 
        const newSchool = new School({
            schoolName : req.body.schoolname,
            emailId: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            district: req.body.district,
            schoolType: req.body.type
        });
        await newSchool.save(function(err){
            if(err){
                res.send("some error occured");
            }else{
                res.send(`New school added with details - ${username}`);
            }
        });
        user.Schools.push(schoolData);
        user.save();
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
            subject: `Your school login credentials`,
            text: `Your school has been registered to our website, 
            Your Login credentials are:
            School-ID: ${req.body.phone}
            School-Username: 1234
            School-Password: sj,dh,nfbkd,nfj`
        };
    
        transporter.sendMail(mailOptions, (error, info)=>{
            if (error) {
                console.log(error);
                res.send('error')
                return
            } else {
                console.log('Email sent: ' + info.response);
                res.send('success')
                return
            }
        });
    }


});

app.post('/logout', (req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        res.send('logged out');
    });
});




// app.post('/register', (req, res)=>{

//     User.register({username: req.body.username}, req.body.password, function(err, newuser){
//         if(err){
//             res.send('Error while registration');
//         }else{
//             passport.authenticate("local")(req,res, function(){
//                 res.send('Registered sucessfully');
//             })
//         }
//     });

// });

// app.post('/login', function(req,res){
    
//     const newuser = new User({
//         username: req.body.username,
//         password: req.body.password
//     });

//     req.login(newuser, function(err){
//         if(err){
//             res.send("Error encountered");
//         }else{
//             passport.authenticate("local")(req,res, function(){
//                 res.send("Logged In");
//             }); 
//         }
//     });

// })

// app.get("/logout", (req,res)=>{
//     req.logout();
//     res.send("Logged Out");
// })


// app.post('/register', (req, res)=>{
//     const newUser = new User({
//         username: req.body.username,
//         password: md5(req.body.password),
//     });

//     newUser.save(function(err){
//         if(err){
//             console.log(err);
//         }else{
//             res.send(`Registered use ${req.body.username}`)
//         }
//     });
// });

// app.post('/login', (req, res)=>{
//     User.findOne({username: req.body.username}, function(err, found){
//         if(err){
//             res.send("Some error occured");
//         }else if(found){
//             if(found.password === md5(req.body.password)){
//                 res.send("User found, logged in");
//             }else{
//                 res.send('Invalid username or password');
//             }
//         }else{
//             res.send('User is not registered');
//         }
//     })
// });




app.listen(PORT, ()=>{
    console.log(`Server is Running on port ${PORT}`);
});