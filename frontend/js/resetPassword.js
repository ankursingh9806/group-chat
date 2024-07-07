const form = document.getElementById("reset-password-form");
const error = document.getElementById("error");

form.addEventListener("submit", resetPassword);

const resetId = window.location.pathname.split("/").pop();

async function resetPassword(e) {
    try {
        e.preventDefault();
        const password = e.target.password.value;
        const newPasswordDetail = {
            password: password,
        };
        if (!newPasswordDetail.password) {
            error.textContent = "Please enter your new password.";
            return;
        }
        const res = await axios.post(`http://localhost:3000/password/reset-password/${resetId}`, newPasswordDetail);
        if (res.status === 200) {
            error.textContent = "";
            document.querySelector("#password").remove();
            document.querySelector("button[type='submit']").remove();
            document.querySelector("h2").innerHTML = "<h2 style='text-align: center;'>Password changed!</h2>";
            document.querySelector("h3").innerHTML = "<h3 style='text-align: center;'>Your password has been changed successfully!</h3>";
        } else {
            error.textContent = "Password not changed. Please try again later.";
        }
    } catch (err) {
        if (err.response && err.response.status === 404) {
            error.textContent = "Email not found. Please signup.";
        } else if (err.response && err.response.status === 400) {
            error.textContent = "Link expired! Please request a new link.";
        } else {
            error.textContent = "An error occurred in changing password. Please try again later.";
        }
    }
}