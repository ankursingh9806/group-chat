const form = document.getElementById("login-form");
const error = document.getElementById("error");

form.addEventListener("submit", login);

async function login(e) {
    try {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const loginDetails = {
            email: email,
            password: password
        };
        if (!loginDetails.email) {
            error.textContent = "Please enter your email";
            return;
        }
        if (!loginDetails.password) {
            error.textContent = "Please enter your password";
            return;
        }
        const res = await axios.post("http://localhost:3000/user/login", loginDetails);
        if (res.status === 200) {
            localStorage.setItem("token", res.data.token);
            window.location.href = "../html/home.html";
        } else {
            error.textContent = "Login failed. Please try again later.";
        }
    } catch (err) {
        if (err.response && err.response.status === 404) {
            error.textContent = "Email not found. Please Sign up.";
        } else if (err.response && err.response.status === 401) {
            error.textContent = "Incorrect password. Please try again.";
        } else {
            error.textContent = "An error occurred during Login. Please try again later.";
        }
    }
}