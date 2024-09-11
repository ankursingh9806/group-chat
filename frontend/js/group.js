const createGroupButton = document.getElementById("create-group-button");
const deleteGroupButton = document.getElementById("delete-group-button");
const addPeopleToGroupButton = document.getElementById("add-to-group-button");
const removePeopleFromGroupButton = document.getElementById("remove-from-group-button");

const membersList = document.getElementById("members-list");
const groupOption = document.querySelector(".group-option-container");
const createdGroupName = document.getElementById("created-group-name");
const createdGroupsContainer = document.querySelector(".created-groups-container");
const joinableGroupsContainer = document.querySelector(".joinable-groups-container");
const welcomeHeading = document.getElementById("welcome-heading");
const errorText = document.getElementById("error");

document.addEventListener("DOMContentLoaded", getGroups);
createGroupButton.addEventListener("click", createGroup);
deleteGroupButton.addEventListener("click", deleteGroup);
addPeopleToGroupButton.addEventListener("click", addPeopleToGroup);
removePeopleFromGroupButton.addEventListener("click", removePeopleFromGroup);

async function getGroups() {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/group/get-groups`, {
            headers: { Authorization: token }
        });
        res.data.groups.forEach(group => {
            showGroupOnScreen(group);
        });
    } catch (err) {
        console.error("error in fetching groups:", err);
    }
}

async function createGroup(e) {
    try {
        e.preventDefault();
        const groupNameInput = document.getElementById("group-name").value;
        if (!groupNameInput) {
            errorText.textContent = "Enter group name";
            return;
        }
        const groupData = {
            groupName: groupNameInput,
        };
        const token = localStorage.getItem("token");
        const res = await axios.post(`http://localhost:3000/group/create-group`, groupData, {
            headers: { Authorization: token }
        });
        if (res.status === 201) {
            showGroupOnScreen(res.data.group);
            errorText.textContent = "";
            document.getElementById("group-name").value = "";
        } else {
            alert("Failed to create group!");
        }
    } catch (err) {
        errorText.textContent = "Error in creating group!";
        console.error("error in creating group:", err);
    }
}

async function showGroupOnScreen(group) {
    try {
        const newGroup = document.createElement("button");
        newGroup.className = "btn btn-secondary btn-sm";
        newGroup.textContent = group.name;
        newGroup.dataset.groupId = group.id;
        newGroup.id = `group-${group.id}`;
        newGroup.addEventListener("click", function () {
            clickOnGroup(group);
        });
        if (group.isAdmin) {
            createdGroupsContainer.appendChild(newGroup);
        } else {
            joinableGroupsContainer.appendChild(newGroup);
        }
    } catch (err) {
        console.error("error checking access to group:", err);
    }
}

async function clickOnGroup(group) {
    try {
        if (group.isAdmin) {
            inputContainer.style.display = "flex";
            groupOption.style.display = "flex";
            thirdContainer.style.display = "flex";
            createdGroupName.textContent = group.name;
            inputContainer.dataset.groupId = group.id;
            inputContainer.dataset.isAdmin = group.isAdmin ? "true" : "false";
            welcomeHeading.style.display = "none"
            getGroupMembers(group.id);
        } else {
            alert("You are not a member or admin of this group!");
        }
    } catch (err) {
        console.error("error in opening group:", err);
    }
}

async function deleteGroup() {
    try {
        const groupId = inputContainer.dataset.groupId;
        const isAdmin = inputContainer.dataset.isAdmin;
        if (!isAdmin) {
            alert("Only the admin can add people to this group!");
            return;
        }
        const confirmation = window.confirm("Are you sure you want to delete this group?");
        if (!confirmation) return;
        const token = localStorage.getItem("token");
        const res = await axios.delete(`http://localhost:3000/group/delete-group/${groupId}`, {
            headers: { Authorization: token }
        });
        if (res.status === 200) {
            document.getElementById(`group-${groupId}`).remove();
            window.location.href = "../html/home.html";
        } else {
            alert("Failed to delete this group!");
        }
    } catch (err) {
        if (err.response && err.response.status === 403) {
            alert("Only admin can delete this group!");
        } else {
            console.error("error in deleting group:", err);
        }
    }
}

async function addPeopleToGroup() {
    try {
        const groupId = inputContainer.dataset.groupId;
        const isAdmin = inputContainer.dataset.isAdmin === "true";
        if (!isAdmin) {
            alert("Only the admin can add people to this group!");
            return;
        }
        const email = window.prompt("Enter the email of the user to add:");
        if (!email) return;
        const token = localStorage.getItem("token");
        const res = await axios.post(`http://localhost:3000/group/add-to-group`, { email, groupId }, {
            headers: { Authorization: token }
        });
        if (res.status === 200) {
            await getGroupMembers(groupId);
        } else {
            alert("Failed to add user to this group!");
        }
    } catch (err) {
        if (err.response && err.response.status === 404) {
            alert("User not found!");
        } else if (err.response && err.response.status === 400) {
            alert("User is already in this group!");
        } else {
            console.error("error in adding user:", err);
        }
    }
}

async function removePeopleFromGroup() {
    try {
        const groupId = inputContainer.dataset.groupId;
        const isAdmin = inputContainer.dataset.isAdmin === "true";
        if (!isAdmin) {
            alert("Only the admin can add people to this group!");
            return;
        }
        const email = window.prompt("Enter the email of the user to remove:");
        if (!email) return;
        const token = localStorage.getItem("token");
        const res = await axios.post(`http://localhost:3000/group/remove-from-group`, { email, groupId }, {
            headers: { Authorization: token }
        });
        if (res.status === 200) {
            await getGroupMembers(groupId);
        } else {
            alert("Failed to remove user from this group!");
        }
    } catch (err) {
        if (err.response && err.response.status === 404) {
            alert("User not found!");
        } else if (err.response && err.response.status === 400) {
            alert("User is not in this group!");
        } else {
            console.error("error in removing user:", err);
        }
    }
}

async function getGroupMembers(groupId) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/group/get-group-members/${groupId}`, {
            headers: { Authorization: token }
        });

        if (res.status === 200) {
            membersList.innerHTML = "";
            res.data.users.forEach(user => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `${user.name}<br>${user.email}<br>${user.isAdmin ? "<strong>Admin</strong>" : ""}`;
                membersList.appendChild(listItem);
            });
            thirdContainer.style.display = "block";
        }
    } catch (err) {
        console.error("error in fetching group members:", err);
    }
}