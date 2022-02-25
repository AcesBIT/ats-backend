const mongoose = require("mongoose");

const Schema=mongoose.Schema;

const studentSchema=new Schema({
    schoolId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    yOA: {
        type: String,
        required: true
    },
    uID: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    guardianName: {
        type: String,
        required: true
    },
});

exports.Student=mongoose.model("Student", studentSchema);