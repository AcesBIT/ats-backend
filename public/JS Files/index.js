// The list appears on clicking on the hamburger icon
$(document).ready(function () {
  $("#hamburger").click(function () {
    $("ul.nav-menu").toggleClass("show");
  });
});

// Returning to the home page
function homePage() {
  // window.open("../index.html", "_self");
  document.getElementById("logoutForm").submit();
}

// Going to the Admin sign-in page
function adminSignIn() {
  // window.open("./Sign-In-Pages/admin-sign-in.html", "_self");
  document.getElementById("adminform").submit();
}

// Going to the School sign-in page
function schoolSignIn() {
  // window.open("./Sign-In-Pages/school-sign-in.html", "_self");
  document.getElementById("schoolform").submit();
}

// Going to the Teacher sign-in page
function teacherSignIn() {
  // window.open("./Sign-In-Pages/teacher-sign-in.html", "_self");
  document.getElementById("teacherform").submit();
}

// Going to the Student sign-in page
function studentSignIn() {
  // window.open("./Sign-In-Pages/student-sign-in.html", "_self");
  document.getElementById("studentform").submit();
}

function schoolReg(){
  document.getElementById("schoolreg").submit();
}

function attendanceList(){
  document.getElementById("attendancelist").submit();
}

function send(){
  document.getElementById("send").submit();
}

function back(){
  document.getElementById("back").submit();
}