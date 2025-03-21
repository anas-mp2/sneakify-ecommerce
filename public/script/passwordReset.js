document.addEventListener('DOMContentLoaded', function () {
    const error1 = document.getElementById('error1'); // Make sure the ID is correct
    const error2 = document.getElementById('error2');
    const forgotpasswordform = document.getElementById('forgotpasswordform');

    function passValidateChecking() {
        const password = document.getElementById('password').value.trim();
        const cpassword = document.getElementById('cpassword').value.trim();
        const alpha = /[A-Za-z]/;
        const digit = /\d/;
        let isValid = true; // Flag to track validation status

        // Reset errors
        error1.style.display = "none";
        error1.innerHTML = "";
        error2.style.display = "none";
        error2.innerHTML = "";

        if (password.length < 8) {
            error1.style.display = "block";
            error1.innerHTML = "Password should contain at least 8 characters";
            isValid = false;
        } else if (!alpha.test(password) || !digit.test(password)) {
            error1.style.display = "block";
            error1.innerHTML = "Password should contain both letters and numbers";
            isValid = false;
        }

        if (cpassword.length < 8) {
            error2.style.display = "block";
            error2.innerHTML = "Confirm Password should contain at least 8 characters";
            isValid = false;
        } else if (!alpha.test(cpassword) || !digit.test(cpassword)) {
            error2.style.display = "block";
            error2.innerHTML = "Confirm Password should contain both letters and numbers";
            isValid = false;
        }

        // const hashedPassword = await bcrypt.hash(newPassword, 10);
        // user.password = hashedPassword;
        // await user.save();


        if (password !== cpassword) {
            error2.style.display = "block";
            error2.innerHTML = "Passwords do not match";
            isValid = false;
        }

        return isValid;
    }

    forgotpasswordform.addEventListener("submit", function (e) {
        if (!passValidateChecking()) {
            e.preventDefault(); // Prevent form submission if validation fails
        }
    });
});
