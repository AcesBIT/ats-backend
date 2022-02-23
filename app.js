const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const { process_params } = require("express/lib/router");
const { postAdminRegister, postAdminLogin, postSchoolRegister } = require("./src/controller/admin/adminController");
const { logoutUser } = require("./src/controller/common/common");
const { isAuth } = require("./src/controller/common/auth");
const { postCameraLogin, postCameraAttendance } = require("./src/controller/camera/cameraController");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const pass = process.env.dbPassword;

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(`mongodb+srv://admin-aces:${pass}@cluster0.buvru.mongodb.net/managementDB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((res) => {
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


app.get('/', (req, res) => {
    res.send('Server is Running Copyright @sourashispaul @siddhantsrivastava');
});


// Admin End Points Are Here----------------------------------->
app.post('/admin/login', postAdminLogin);
app.post('/admin/register', postAdminRegister);
app.post('/admin/schoolregister', isAuth, postSchoolRegister);


// Camera End Points Are Here---------------------------------->
app.post('/camera/login', postCameraLogin);
app.post('/camera/attendance', isAuth, postCameraAttendance);

// Common End Points Are Here
app.post('/logout', logoutUser);
// Listen Port Starts-----Here
app.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT}`);
});