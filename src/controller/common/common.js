exports.logoutUser=(req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        console.log(`${req.body.username} Logout Successfully.`);
        res.status(200).json({
            message: "User Logout Successful"
        });
    });
}