const mongoose =require("mongoose");

const Schema=mongoose.Schema;

const adminUserSchema=new Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

exports.User=mongoose.model("User", adminUserSchema);

const schoolSchema=new Schema({
    schoolName: {
        type: String,
        required: true
    },
    schoolId: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    camDetails: {
        userName: {
            required: true,
            type: String
        },
        password: {
            type: String,
            required: true
        }
    }
});

exports.School=mongoose.model("School",schoolSchema);