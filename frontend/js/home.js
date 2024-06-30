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
const groupName = document.getElementById("group-name");
const deleteGroupButton = document.getElementById("delete-group-button");

logo.addEventListener("click", function () {
    window.location.href = "../html/home.html";
});
home.addEventListener("click", function () {
    window.location.href = "../html/home.html";
});
logoutButton.addEventListener("click", logout);
document.addEventListener("DOMContentLoaded", getGroups);
createGroupButton.addEventListener("click", createGroup);
sendButton.addEventListener("click", sendMessage);
deleteGroupButton.addEventListener("click", deleteGroup);

async function logout() {
    try {
        const res = await axios.post("http://localhost:3000/user/logout");
        localStorage.removeItem("token");
        window.location.href = "../html/login.html";
    } catch (err) {
        console.error("failed to logout:", err);
    }
}

async function getGroups() {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/group/get-groups", {
            headers: {
                Authorization: token
            }
        });
        res.data.groups.forEach(group => {
            showGroup(group);
        });
    } catch (err) {
        console.error("failed to fetch groups:", err);
    }
}

async function createGroup() {
    try {
        const group = window.prompt("Enter group name:");
        if (!group) return;
        const groupData = {
            groupName: group,
        };
        const token = localStorage.getItem("token");
        const res = await axios.post("http://localhost:3000/group/create-group", groupData, {
            headers: {
                Authorization: token
            }
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
    newGroup.addEventListener("click", function () {
        inputContainer.style.display = "flex";
        heading.style.display = "none";
        groupOption.style.display = "flex";
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
            headers: {
                Authorization: token,
            },
        });
        messageContainer.innerHTML = "";
        res.data.data.forEach((msg) => {
            const messageElement = document.createElement("div");
            messageElement.className = "message";
            messageElement.innerHTML = `
                <span class="message-name">${msg.name}</span><br>
                <span class="message-text">${msg.message}</span>`;
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
        const messageData = {
            message: message,
            groupId: groupId
        };
        const token = localStorage.getItem("token");
        const res = await axios.post("http://localhost:3000/message/send-message", messageData, {
            headers: {
                Authorization: token
            }
        });
        messageInput.value = "";
        getMessage(groupId);
    } catch (err) {
        console.error("message not sent:", err);
    }
}


async function deleteGroup() {
    try {
        const groupId = inputContainer.dataset.groupId;
        const token = localStorage.getItem("token");
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;
        const groupRes = await axios.get(`http://localhost:3000/group/get-groups`, {
            headers: {
                Authorization: token
            }
        });
        let group = null;
        for (let i = 0; i < groupRes.data.groups.length; i++) {
            if (groupRes.data.groups[i].id === parseInt(groupId)) {
                group = groupRes.data.groups[i];
                break;
            }
        }
        if (group.admin !== parseInt(userId)) {
            alert("Only admin can delete this group!");
            return;
        }
        const confirmDelete = window.confirm("Are you sure you want to delete this group?");
        if (confirmDelete) {
            const deleteRes = await axios.delete(`http://localhost:3000/group/delete-group/${groupId}`, {
                headers: {
                    Authorization: token
                }
            });
            if (deleteRes.status === 200) {
                alert("Group deleted!");
                const groupButton = document.getElementById(`group-${groupId}`);
                if (groupButton) {
                    groupButton.remove();
                }
                window.location.href = "../html/home.html";
            } else {
                alert("Group not deleted! Please try again.");
            }
        }
    } catch (err) {
        alert("An error occurred while deleting group!");
    }
}