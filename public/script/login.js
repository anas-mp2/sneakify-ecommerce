const emailid = document.getElementById('email');
const passwordid = document.getElementById('password');
const error1 = document.getElementById('error1');
const error2 = document.getElementById('error2');
const loginform = document.getElementById('loginform');

function emailValidateChecking() {
    const emailval = emailid.value.trim();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailPattern.test(emailval)) {
        error1.style.display = "block";
        error1.innerHTML = "Invalid email format";
        return false;
    } else {
        error1.style.display = "none";
        error1.innerHTML = "";
        return true;
    }
}

function passValidateChecking() {
    const passval = passwordid.value.trim();

    if (passval.length < 8) {
        error2.style.display = "block";
        error2.innerHTML = "Password should contain at least 8 characters";
        return false;
    } else {
        error2.style.display = "none";
        error2.innerHTML = "";
        return true;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loginform.addEventListener("submit", function (e) {
        const isEmailValid = emailValidateChecking();
        const isPasswordValid = passValidateChecking();

        if (!isEmailValid || !isPasswordValid) {
            e.preventDefault();
        }
    });
});

document.getElementById("googleAuthBtn").addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "/auth/google";
});
