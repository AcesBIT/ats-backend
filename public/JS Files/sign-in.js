// Resetting the sign in form contents
function resetSignIn() {
  document.getElementById("username").value = '';
  document.getElementById("password").value = '';
}

// Login into the admin site
// function adminSite() {
//   window.open("../Site-Pages/admin-site.html", "_self");
// }

// Going to the admin site
async function adminSignInRequest() {
  //document.getElementById("adminPage").classList.add(loader);
  let userName = document.getElementById('username').value;
  let passWord = document.getElementById('password').value;

  // userName = "sourashis20";
  // passWord = "Sour@2002"
  
  if (userName && passWord.length >= 9) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("userName", userName);
    urlencoded.append("password", passWord);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    let responseVal;

    await fetch("https://api-govschool.herokuapp.com/admin/login", requestOptions)
      .then(response => responseVal = response)
      .catch(error => console.log('error', error));

    let decoded = await responseVal.text();
    // console.log(decoded);
    let loginData = JSON.parse(decoded);
    console.log(responseVal.status);
    // console.log(loginData);
    if (responseVal.status == 200) {
      //document.getElementById("adminPage").classList.remove(loader);
      window.open("../Site-Pages/admin-site.html", "_self");
    } else if (responseVal.status == 400 || responseVal.status == 401 || responseVal.status == 402 || responseVal.status == 403 || responseVal.status == 404 || responseVal.status == 409 || responseVal.status == 422 || responseVal.status == 500 || responseVal.status == 503) {
      alert(`Invalid Request Error ${responseVal.status}  ` + loginData.detail.message);
    }
  } else {
    alert("Invalid Username or Password");
  }
}

// Going to the school site
// async function schoolSignInRequest() {
//   //document.getElementById("adminPage").classList.add(loader);
//   let userName = document.getElementById('username').value;
//   let passWord = document.getElementById('password').value;
//   // userName = "sourashis20";
//   // passWord = "Sour@2002"
//   if (userName || passWord.length >= 9) {
//     var myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

//     var urlencoded = new URLSearchParams();
//     urlencoded.append("userName", userName);
//     urlencoded.append("password", passWord);

//     var requestOptions = {
//       method: 'POST',
//       headers: myHeaders,
//       body: urlencoded,
//       redirect: 'follow'
//     };

//     let responseVal;

//     await fetch("https://api-govschool.herokuapp.com/school/official", requestOptions)
//       .then(response => responseVal = response)
//       .catch(error => console.log('error', error));

//     let decoded = await responseVal.text();
//     // console.log(decoded);
//     let loginData = JSON.parse(decoded);
//     console.log(responseVal.status);
//     // console.log(loginData);
//     if (responseVal.status == 200) {
//       //document.getElementById("adminPage").classList.remove(loader);
//       window.open("../Site-Pages/school-site.html", "_self");
//     } else if (responseVal.status == 400 || responseVal.status == 401 || responseVal.status == 402 || responseVal.status == 403 || responseVal.status == 404 || responseVal.status == 409 || responseVal.status == 422 || responseVal.status == 500 || responseVal.status == 503) {
//       alert(`Invalid Request Error ${responseVal.status}  ` + loginData.detail.message);
//     }
//   } else {
//     alert("Invalid Username or Password");
//   }
// }

//Dummy sign in to school site
function schoolSignInRequest() {
  window.open("../Site-Pages/school-site.html", "_self");
}

//Dummy sign in to teacher site
function teacherSignInRequest() {
  window.open("../Site-Pages/teacher-site.html", "_self");
}

//Dummy sign in to student site
function studentSignInRequest() {
  window.open("../Site-Pages/student-site.html", "_self");
}