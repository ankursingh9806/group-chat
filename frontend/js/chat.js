const createGroupButton = document.getElementById("create-group");
const deleteGroupButton = document.getElementById("delete-group-button");
const addToGroupButton = document.getElementById("add-to-group-button");
const removeFromGroupButton = document.getElementById("remove-from-group-button");
const sendButton = document.getElementById("send-button");

const firstContainer = document.querySelector(".first-container");
const inputContainer = document.querySelector(".input-container");
const messageContainer = document.getElementById("message-container");
const membersContainer = document.querySelector(".members-container");
const membersList = document.getElementById("members-list");
const messageInput = document.getElementById("message-input");
const heading = document.querySelector(".welcome-heading");
const groupOption = document.querySelector(".group-option-container");
const groupName = document.getElementById("group-name");

document.addEventListener("DOMContentLoaded", getGroups);
createGroupButton.addEventListener("click", createGroup);
deleteGroupButton.addEventListener("click", deleteGroup);
addToGroupButton.addEventListener("click", addToGroup);
removeFromGroupButton.addEventListener("click", removeFromGroup);
sendButton.addEventListener("click", sendMessage);

async function getGroups() {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/group/get-groups`, {
            headers: { Authorization: token }
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
        const res = await axios.post(`http://localhost:3000/group/create-group`, groupData, {
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
    newGroup.addEventListener("click", async function () {
        const isMember = await checkMembership(group.id);
        if (isMember) {
            inputContainer.style.display = "flex";
            heading.style.display = "none";
            groupOption.style.display = "flex";
            membersContainer.style.display = "flex";
            groupName.textContent = group.name;
            inputContainer.dataset.groupId = group.id;
            getMessage(group.id);
            showMembers(group.id);
        } else {
            alert("You are not a member of this group! You can join this group when Admin adds you.");
        }
    });
    firstContainer.appendChild(newGroup);
}

async function checkMembership(groupId) {
    const token = localStorage.getItem("token");
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.userId;
    try {
        const res = await axios.get(`http://localhost:3000/group/get-group-members/${groupId}`, {
            headers: { Authorization: token }
        });
        const members = res.data.users;
        for (let i = 0; i < members.length; i++) {
            if (members[i].id === userId) {
                return true;
            }
        }
    } catch (err) {
        console.error("error:", err);
    }
}

async function getMessage(groupId) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/message/get-message/${groupId}`, {
            headers: { Authorization: token }
        });
        messageContainer.innerHTML = "";
        res.data.data.forEach((msg) => {
            const messageElement = document.createElement("div");
            messageElement.className = "message";
            messageElement.innerHTML =
                `<span class="message-name">${msg.name}</span><br>
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
        const res = await axios.post(`http://localhost:3000/message/send-message`, messageData, {
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
    const res = await axios.get(`http://localhost:3000/group/get-groups`, {
        headers: { Authorization: token }
    });
    let group = null;
    for (let i = 0; i < res.data.groups.length; i++) {
        if (res.data.groups[i].id === parseInt(groupId)) {
            group = res.data.groups[i];
            break;
        }
    }
    if (group && group.admin === parseInt(userId)) {
        return true;
    } else {
        return false;
    }
}

async function deleteGroup() {
    try {
        const groupId = inputContainer.dataset.groupId;
        const isAdminUser = await isAdmin(groupId);
        if (!isAdminUser) {
            alert("Only admin can delete this group!");
            return;
        }
        const confirm = window.confirm("Are you sure you want to delete this group?");
        if (confirm) {
            const token = localStorage.getItem("token");
            const res = await axios.delete(`http://localhost:3000/group/delete-group/${groupId}`, {
                headers: { Authorization: token }
            });
            if (res.status === 200) {
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
        const res = await axios.post(`http://localhost:3000/group/add-to-group`, { email, groupId }, {
            headers: { Authorization: token }
        });
        if (res.status === 200) {
            alert("User added to group!");
            showMembers(groupId);
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
        const res = await axios.post(`http://localhost:3000/group/remove-from-group`, { email, groupId }, {
            headers: { Authorization: token }
        });
        if (res.status === 200) {
            alert("User removed from group!");
            showMembers(groupId);
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

async function showMembers(groupId) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/group/get-group-members/${groupId}`, {
            headers: { Authorization: token }
        });
        membersList.innerHTML = "";
        res.data.users.forEach(user => {
            const listItem = document.createElement("li");
            listItem.textContent = `${user.name} (${user.email})${user.isAdmin ? " (Admin)" : ""}`;
            membersList.appendChild(listItem);
        });
        membersContainer.style.display = "block";
    } catch (err) {
        alert("failed to fetch group members. Please try again later.");
    }
}