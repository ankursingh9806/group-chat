const sendButton = document.getElementById("send-button");
const messageInput = document.getElementById("message-input");

const inputContainer = document.querySelector(".input-container");
const messageContainer = document.querySelector(".message-container");

const socket = io("http://localhost:3000");

socket.on("sendMessage", (data) => {
    // console.log("message received:", data);
    showMessage(data);
});

sendButton.addEventListener("click", sendMessage);

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
    messageElement.innerHTML = `
        <span class="message-name">${msg.name}</span><br>
        <span class="message-text">${msg.message}</span>`;
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