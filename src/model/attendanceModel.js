const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const attendanceRecordSchema = new Schema({
    date: {
        type: String,
        required: true
    },
    schoolId: {
        type: String,
        required: true
    },
    studentList: {
        type: [],
        required: true
    }
});

exports.Attendance = mongoose.model("Attendance", attendanceRecordSchema);