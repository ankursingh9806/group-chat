const sendButton = document.getElementById("send-button");
const messageInput = document.getElementById("message-input");
const inputContainer = document.querySelector(".input-container");
const messageContainer = document.querySelector(".message-container");
const fileInput = document.getElementById('file-input');
const attachFileButton = document.getElementById('attach-file-button');

const socket = io("http://localhost:3000");

socket.on("sendMessage", (data) => {
    // console.log("message received:", data);
    showMessage(data);
});

sendButton.addEventListener("click", sendMessage);
attachFileButton.addEventListener("click", () => {
    fileInput.click();
});
fileInput.addEventListener("change", uploadFile);

async function getMessage(groupId) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/message/get-message/${groupId}`, {
            headers: { Authorization: token }
        });
        messageContainer.innerHTML = "";
        res.data.data.forEach((msg) => {
            showMessage(msg);
        });
    } catch (err) {
        console.error("error in fetching message:", err);
    }
}

function showMessage(msg) {
    const messageElement = document.createElement("div");
    messageElement.className = "message";
    if (msg.fileUrl) {
        messageElement.innerHTML = `
            <span class="message-name">${msg.name}</span><br>
            <a href="${msg.fileUrl}" target="_blank" class="message-image">View file</a>`;
    } else {
        messageElement.innerHTML = `
            <span class="message-name">${msg.name}</span><br>
            <span class="message-text">${msg.message}</span>`;
    }
    messageContainer.appendChild(messageElement);
    scrollToBottom();
}

async function sendMessage() {
    try {
        const message = messageInput.value;
        const groupId = inputContainer.dataset.groupId;
        if (!message || !groupId) {
            console.error("message or groupId is missing");
            return;
        }
        const messageData = {
            message: message,
            groupId: groupId
        };
        const token = localStorage.getItem("token");
        const response = await axios.post(`http://localhost:3000/message/send-message`, messageData, {
            headers: { Authorization: token }
        });
        if (response.status === 201) {
            const newMessage = response.data.newMessage;
            socket.emit("receiveMessage", {
                message: newMessage.message,
                groupId: newMessage.groupId,
                name: newMessage.name,
                userId: newMessage.userId,
                timestamp: newMessage.createdAt
            });
            messageInput.value = "";
        }
    } catch (err) {
        console.error("error in sending message:", err);
    }
}

function scrollToBottom() {
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

async function uploadFile(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    try {
        const groupId = inputContainer.dataset.groupId;
        const token = localStorage.getItem("token");
        const res = await axios.post(`http://localhost:3000/message/upload-file/${groupId}`, formData, {
            headers: {
                Authorization: token,
                "Content-Type": "multipart/form-data"
            }
        });
        const newMessage = res.data.data;
        socket.emit("receiveMessage", newMessage);
        messageInput.value = "";
    } catch (err) {
        console.error("file not uploaded:", err);
    }
}