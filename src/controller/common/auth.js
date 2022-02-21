exports.isAuth = (req, res, next)=>{
    if(req.session.isAuth){
        next();
    }else{
        res.status(404).json({
            detail: {
                title: "Error !",
                message: "User is not Active in Session, Login to Access this."
            }
        });
    }
}