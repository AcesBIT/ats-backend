const mongoose = require("mongoose");

const Schema=mongoose.Schema;

const teacherSchema=new Schema({
    schoolId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
});

exports.Teacher=mongoose.model("Teacher", teacherSchema);