//Circular Progess Bar animation
let number = document.getElementById("precentage");

let counter = document.getElementById("studentPercentage").value;
setInterval(() => {
    let val = 472 - ((counter / 100) * (472))
    document.getElementById("circle").style.strokeDashoffset = val;
    console.log(val);
    clearInterval(counter);

}, 50);


// setInterval(() => {
//     if(counter == 60){
//         let val = ((60 / 100) * (472))
//         document.getElementById("circle").style.strokeDasharray = val;
//         console.log(val);
//         clearInterval(counter);
//     }
//     else {
//         counter += 1;
//         document.getElementById("percentage").innerHTML = ++counter + "%";
//     }

// }, 50);

// Percentage value and stroke-dashoffset in keyframes will be affected by the data
// If the percentage value is n then

// @keyframes anim {
//     100% {
//         stroke-dashoffset: 472 - (n / 100 * 472);
//     }
// }

// Eg:- n = 80, stroke-dashoffset: 94.4