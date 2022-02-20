const {User}=require("../../model/adminModel.js");
const md5= require("md5");
//const {isAuth}= require("../../auth.js");

exports.postAdminRegister=async(req,res)=>{
    const {username, password} = req.body;

    let user = await User.findOne({username});

    if(user){
        res.status(400).json({
            message: "User Already Exists"
        });
    }else{
        const newUser = new User({
            username: req.body.username,
            password: md5(req.body.password),
        });

        await newUser.save(function(err){
            if(err){
                console.log(err);
            }else{
                res.status(200).json({
                    message: `Successfully Registered ${username}`
                });
            }
        });
    }
}

exports.postAdminLogin=async (req,res)=>{
    const {username, password} = req.body;
    const user = await User.findOne({username});
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
        req.session.username = user.username;
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
