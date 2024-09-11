const logoutButton = document.getElementById("logout-button");
const logo = document.getElementById("logo");
const home = document.getElementById("home");

logo.addEventListener("click", function () {
    window.location.href = "../html/home.html";
});
home.addEventListener("click", function () {
    window.location.href = "../html/home.html";
});
logoutButton.addEventListener("click", logout);

async function logout() {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.post("http://localhost:3000/user/logout", {}, {
            headers: {
                Authorization: token
            }
        });
        if (res.status === 200) {
            localStorage.removeItem("token");
            window.location.href = "../html/login.html";
        } else {
            console.error("failed to logout");
        }
    } catch (err) {
        console.error("error in logout:", err);
    }
}