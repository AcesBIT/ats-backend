// Going to the Admin site page
function adminSite() {
    window.open(".././Site-Pages/admin-site.html", "_self");
}

//Dummy school registration
function schoolRegRequest() {
    let schoolname = document.getElementById("schoolname").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let pincode = document.getElementById("pincode").value;
    let address = document.getElementById("address").value;
    
    if(schoolname && email && phone && pincode && address) {
        alert("New School has been registered!");
        resetSchoolReg();
    }
    else {
        alert("Please fill all the fields!");
    }
}

//Reseting School Registration Form
function resetSchoolReg() {
    document.getElementById("schoolname").value = '';
    document.getElementById("email").value = '';
    document.getElementById("phone").value = '';
    document.getElementById("pincode").value = '';
    document.getElementById("address").value = '';
}
  

///Dummy school registration
function adminRegRequest() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let rePassword = document.getElementById("re-password").value;
    
    if(username && password && rePassword) {
        alert("New Admin has been registered!");
        resetAdminReg();
    }
    else {
        alert("Please fill all the fields!");
    }
    
}

//Reseting Admin Registration Form
function resetAdminReg() {
    document.getElementById("username").value = '';
    document.getElementById("password").value = '';
    document.getElementById("re-password").value = '';
}
  