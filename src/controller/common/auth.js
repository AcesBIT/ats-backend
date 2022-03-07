exports.isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    } else {
        res.status(404).json({
            detail: {
                title: "Error !",
                message: "User is not Active in Session, Login to Access this."
            }
        });
    }
}

exports.isValidSchool = (req, res, next) => {
    if (req.session.isValidSchool) {
        next();
    } else {
        res.status(404).json({
            detail: {
                title: "Error!",
                message: "School is not active in Session, Login to Access this."
            }
        });
    }
}

exports.isTeacher = (req, res, next) => {
    if (req.session.isTeacher) {
        next();
    } else {
        res.status(404).json({
            detail: {
                title: "Error !",
                message: "User is not Active in Session, Login to Access this."
            }
        });
    }
}

exports.isStudent = (req, res, next) => {
    if (req.session.isStudent) {
        next();
    } else {
        res.status(404).json({
            detail: {
                title: "Error !",
                message: "User is not Active in Session, Login to Access this."
            }
        });
    }
}
