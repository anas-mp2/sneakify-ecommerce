// document.getElementById("otpForm").addEventListener("submit", async function(event) {
//     event.preventDefault();

//     const otp = document.getElementById("otpInput").value;

//     const response = await fetch("/verify-forgot-password-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ otp }),
//     });

//     const result = await response.json();

//     if (result.success) {
//         Swal.fire({
//             title: "Success!",
//             text: "OTP Verified Successfully!",
//             icon: "success",
//             confirmButtonText: "OK"
//         }).then(() => {
//             window.location.href = result.redirectUrl;
//         });
//     } else {
//         Swal.fire({
//             title: "Error!",
//             text: result.message,
//             icon: "error",
//             confirmButtonText: "Try Again"
//         });
//     }
// });