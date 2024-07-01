const logoutButton = document.getElementById("logout-button");
const logo = document.getElementById("logo");
const home = document.getElementById("home");

logo.addEventListener("click", () => window.location.href = "../html/home.html");
home.addEventListener("click", () => window.location.href = "../html/home.html");
logoutButton.addEventListener("click", logout);

async function logout() {
    try {
        await axios.post("http://localhost:3000/user/logout");
        localStorage.clear();
        window.location.href = "../html/login.html";
    } catch (err) {
        console.error("failed to logout:", err);
    }
}