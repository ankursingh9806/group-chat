const form = document.getElementById("signup-form");
const error = document.getElementById("error");

form.addEventListener("submit", signup);

async function signup(e) {
    try {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const signupDetails = {
            name: name,
            email: email,
            password: password
        };
        if (!signupDetails.name) {
            error.textContent = "Please enter your name";
            return;
        }
        if (!signupDetails.email) {
            error.textContent = "Please enter your email";
            return;
        }
        if (!signupDetails.password) {
            error.textContent = "Please enter your password";
            return;
        }
        const res = await axios.post("http://localhost:3000/user/signup", signupDetails);
        if (res.status === 201) {
            alert("Signup successfull! Please login to continue.")
            window.location.href = "../html/login.html";
        } else {
            error.textContent = "Signup failed. Please try again later.";
        }
    } catch (err) {
        if (err.response && err.response.status === 409) {
            error.textContent = "Email already exists. Please Login.";
        } else {
            error.textContent = "An error occurred during Signup. Please try again later.";
        }
    }
}