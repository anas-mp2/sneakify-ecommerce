const inputs = document.querySelectorAll('.otp');
const timerDisplay = document.getElementById('timer');
const resendButton = document.getElementById('resendButton');
let timeLeft = 180; // 3 minutes
let timerId;

function startTimer() {
    timerId = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerDisplay.textContent = "Code expired";
            resendButton.disabled = false;
            inputs.forEach(input => input.disabled = true);
        } else {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `Time remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            timeLeft--;
        }
    }, 1000);
}


function validateOTPForm() {
    const otp = Array.from(inputs).map(input => input.value).join('');

    fetch('/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: "success",
                title: "OTP Verified successfully",
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.href = data.redirectUrl;
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: data.message
            });
        }
    })
    .catch(() => {
        Swal.fire({
            icon: "error",
            title: "Invalid OTP",
            text: "Please try again"
        });
    });

    return false; // Prevent form from submitting the traditional way
}

function resendOTP(event) {
    event.preventDefault();

    $.ajax({
        type: "POST",
        url: "/resend-otp",
        success: function(response) {
            if (response.success) {
                // Show the OTP input form and the success message
                document.getElementById("otpContainer").style.display = "block"; // Show the OTP form
                document.getElementById("successMessage").textContent = response.message; // Display success message
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.message
                });
            }
        },
        error: function() {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "An error occurred. Please try again."
            });
        }
    });
}



startTimer();
