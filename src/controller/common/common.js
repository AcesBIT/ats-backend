exports.logoutUser=(req,res)=>{
    const {userName} = req.body;
    console.log(req.body);
    if(!userName){
        res.status(400).json({
            detail:{
                title: "Invalid Data",
                message: "All required Data is not receving"
            }
        });
        return
    }
    req.session.destroy((err)=>{
        if(err) throw err;
        console.log(`${req.body.userName} Logout Successfully.`);
        // res.status(200).json({
        //     message: "User Logout Successful"
        // });
        res.redirect("/");
    });
}