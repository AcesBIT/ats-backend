// Going to the Admin site page
function schoolSite() {
    window.open(".././Site-Pages/school-site.html", "_self");
}

// For Dynamically generating date list
let dateDropdown = document.getElementById('year');

let currentYear = new Date().getFullYear();
let earliestYear = currentYear-20;

while (currentYear >= earliestYear) {
    let dateOption = document.createElement('option');
    dateOption.text = currentYear;
    dateOption.value = currentYear;
    dateDropdown.add(dateOption);
    currentYear -= 1;
}

//Dummy teacher registration
function teacherRegRequest() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;

    if(name && email && phone) {
        alert("New Teacher has been registered!");
        resetTeacherReg();
    }
    else {
        alert("Please fill all the fields!");
    }
}

//Reseting School Registration Form
function resetTeacherReg() {
    document.getElementById("name").value = '';
    document.getElementById("email").value = '';
    document.getElementById("phone").value = '';
}
  

///Dummy school registration
function studentRegRequest() {
    let name = document.getElementById("name").value;
    let classVal = document.getElementById("class").value;
    let dob = document.getElementById("dob").value;
    let year = document.getElementById("year").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let guardianName = document.getElementById("guardianName").value;
    let imageFile = document.getElementById("imageFile").value;
    let address = document.getElementById("address").value;

    if(name && classVal && dob && year && email && phone && guardianName && imageFile && address) {
        alert("New Student has been registered!");
        resetStudentReg();
    }
    else {
        alert("Please fill all the fields!");
    }
}

//Reseting Admin Registration Form
function resetStudentReg() {
    document.getElementById("name").value = '';
    document.getElementById("class").value = '';
    document.getElementById("dob").value = '';
    document.getElementById("year").value = '';
    document.getElementById("email").value = '';
    document.getElementById("phone").value = '';
    document.getElementById("guardianName").value = '';
    document.getElementById("imageFile").value = '';
    document.getElementById("address").value = '';
}

