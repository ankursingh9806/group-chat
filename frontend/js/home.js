const logoutButton = document.getElementById("logout-button");
const logo = document.getElementById("logo");
const home = document.getElementById("home");
const createGroupButton = document.getElementById("create-group");
const firstContainer = document.querySelector(".first-container");
const inputContainer = document.querySelector(".input-container");
const heading = document.querySelector(".welcome-heading");
const messageContainer = document.getElementById("message-container");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const groupOption = document.querySelector(".group-option-container");
const membersContainer = document.querySelector(".members-container");
const groupName = document.getElementById("group-name");
const deleteGroupButton = document.getElementById("delete-group-button");
const addToGroupButton = document.getElementById("add-to-group-button");
const removeFromGroupButton = document.getElementById("remove-from-group-button");

logo.addEventListener("click", () => window.location.href = "../html/home.html");
home.addEventListener("click", () => window.location.href = "../html/home.html");
logoutButton.addEventListener("click", logout);
document.addEventListener("DOMContentLoaded", getGroups);
createGroupButton.addEventListener("click", createGroup);
sendButton.addEventListener("click", sendMessage);
deleteGroupButton.addEventListener("click", deleteGroup);
addToGroupButton.addEventListener("click", addToGroup);
removeFromGroupButton.addEventListener("click", removeFromGroup);

async function logout() {
    try {
        await axios.post("http://localhost:3000/user/logout");
        localStorage.clear();
        window.location.href = "../html/login.html";
    } catch (err) {
        console.error("failed to logout:", err);
    }
}

async function getGroups() {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/group/get-groups", {
            headers: { Authorization: token }
        });
        res.data.groups.forEach(group => showGroup(group));
    } catch (err) {
        console.error("failed to fetch groups:", err);
    }
}

async function createGroup() {
    try {
        const groupName = window.prompt("Enter group name:");
        if (!groupName) return;
        const token = localStorage.getItem("token");
        const res = await axios.post("http://localhost:3000/group/create-group", { groupName }, {
            headers: { Authorization: token }
        });
        if (res.status === 201) {
            showGroup(res.data.group);
        } else {
            alert("Group not created. Please try again");
        }
    } catch (err) {
        console.error("group not created:", err);
    }
}

function showGroup(group) {
    const newGroup = document.createElement("button");
    newGroup.className = "btn btn-secondary";
    newGroup.textContent = group.name;
    newGroup.dataset.groupId = group.id;
    newGroup.id = `group-${group.id}`;
    newGroup.addEventListener("click", () => {
        inputContainer.style.display = "flex";
        heading.style.display = "none";
        groupOption.style.display = "flex";
        membersContainer.style.display = "flex";
        groupName.textContent = group.name;
        inputContainer.dataset.groupId = group.id;
        getMessage(group.id);
    });
    firstContainer.appendChild(newGroup);
}

async function getMessage(groupId) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/message/get-message/${groupId}`, {
            headers: { Authorization: token }
        });
        messageContainer.innerHTML = "";
        res.data.data.forEach(msg => {
            const messageElement = document.createElement("div");
            messageElement.className = "message";
            messageElement.innerHTML = `<span class="message-name">${msg.name}</span><br><span class="message-text">${msg.message}</span>`;
            messageContainer.appendChild(messageElement);
        });
    } catch (err) {
        console.error("failed to fetch messages:", err);
    }
}

async function sendMessage() {
    try {
        const message = messageInput.value;
        const groupId = inputContainer.dataset.groupId;
        const token = localStorage.getItem("token");
        await axios.post("http://localhost:3000/message/send-message", { message, groupId }, {
            headers: { Authorization: token }
        });
        messageInput.value = "";
        getMessage(groupId);
    } catch (err) {
        console.error("message not sent:", err);
    }
}

async function isAdmin(groupId) {
    const token = localStorage.getItem("token");
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.userId;
    const groupRes = await axios.get(`http://localhost:3000/group/get-groups`, {
        headers: { Authorization: token }
    });
    const group = groupRes.data.groups.find(group => group.id === parseInt(groupId));
    return group && group.admin === parseInt(userId);
}

async function deleteGroup() {
    try {
        const groupId = inputContainer.dataset.groupId;
        const token = localStorage.getItem("token");
        if (!(await isAdmin(groupId))) {
            alert("Only admin can delete this group!");
            return;
        }
        if (window.confirm("Are you sure you want to delete this group?")) {
            const deleteRes = await axios.delete(`http://localhost:3000/group/delete-group/${groupId}`, {
                headers: { Authorization: token }
            });
            if (deleteRes.status === 200) {
                alert("Group deleted!");
                document.getElementById(`group-${groupId}`).remove();
                window.location.href = "../html/home.html";
            } else {
                alert("Group not deleted! Please try again.");
            }
        }
    } catch (err) {
        alert("An error occurred while deleting group!");
    }
}

async function addToGroup() {
    try {
        const groupId = inputContainer.dataset.groupId;
        if (!(await isAdmin(groupId))) {
            alert("Only admin can add people to this group!");
            return;
        }
        const email = window.prompt("Enter the email of the user to add:");
        if (!email) return;
        const token = localStorage.getItem("token");
        const res = await axios.post("http://localhost:3000/group/add-to-group", { email, groupId }, {
            headers: { Authorization: token }
        });
        if (res.status === 200) {
            alert("User added to group!");
        } else {
            alert("Failed to add user to group!");
        }
    } catch (err) {
        if (err.response && err.response.status === 404) {
            alert("User not found!");
        } else if (err.response && err.response.status === 400) {
            alert("User is already in the group!");
        } else {
            alert("An error occurred in adding user. Please try again later.");
        }
    }
}

async function removeFromGroup() {
    try {
        const groupId = inputContainer.dataset.groupId;
        if (!(await isAdmin(groupId))) {
            alert("Only admin can remove people from this group!");
            return;
        }
        const email = window.prompt("Enter the email of the user to remove:");
        if (!email) return;
        const token = localStorage.getItem("token");
        const res = await axios.post("http://localhost:3000/group/remove-from-group", { email, groupId }, {
            headers: { Authorization: token }
        });
        if (res.status === 200) {
            alert("User removed from group!");
        } else {
            alert("Failed to remove user from group!");
        }
    } catch (err) {
        if (err.response && err.response.status === 404) {
            alert("User not found!");
        } else if (err.response && err.response.status === 400) {
            alert("User is not in the group!");
        } else {
            alert("An error occurred in removing user. Please try again later.");
        }
    }
}