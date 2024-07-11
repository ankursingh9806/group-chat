const form = document.getElementById("forgot-password-form");
const error = document.getElementById("error");

form.addEventListener("submit", forgotPassword);

async function forgotPassword(e) {
    try {
        e.preventDefault();
        const email = e.target.email.value;
        const forgotPasswordDetail = {
            email: email,
        };
        if (!forgotPasswordDetail.email) {
            error.innerHTML = "Please enter your email.";
            return;
        }
        const res = await axios.post("http://3.104.119.209:3000/password/forgot-password", forgotPasswordDetail);
        if (res.status === 200) {
            error.textContent = "";
            document.querySelector("#email").remove();
            document.querySelector("button[type='submit']").remove();
            document.querySelector("h3").innerHTML = `<h3 style='text-align: center;'>We have sent you an email. Please check your email <span style='color: #0d6efd;'>${email}</span> to reset your password</h3>`
        } else {
            error.textContent = "Email not sent. Please try again later."
        }
    } catch (err) {
        if (err.response && err.response.status === 404) {
            error.textContent = "Email not found. Please signup.";
        } else {
            error.textContent = "An error occurred in sending email. Please try again later.";
        }
    }
}