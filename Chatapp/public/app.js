//Constents
const messageTypes = { LEFT: 'left', RIGHT: 'right', LOGIN: 'login' };

const chatWindow = document.getElementById('chat');
const messagesList = document.getElementById('messagesList');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const usernameInput = document.getElementById('usernameInput');
const loginBtn = document.getElementById('loginBtn');
const loginWindow = document.getElementById('login');

let username = '';
const messages = [];

// Socket for message handling
var socket = io();
socket.on('message', message => {
    if (message.type !== messageTypes.LOGIN) {
        if (message.author === username) {
            message.type = messageTypes.RIGHT;
        } else {
            message.type = messageTypes.LEFT;
        };
    };
    messages.push(message);
    displayMessages();
    chatWindow.scrollTop = chatWindow.scrollHeight;
});

const createMessageHTML = message => {
    if (message.type === messageTypes.LOGIN) {

        return `<p class="secondary-text text-center mb-2">${message.author} has joined the chat...</p>`;
    }

    return `
        <div class="message ${message.type === messageTypes.LEFT ? 'message-left' : 'message-right'}">
            <div class="message-details flex">
                <p class="flex-grow-1 message-author">${message.type === messageTypes.RIGHT ? '' : message.author}</p>
                <p class="message-date">${message.date}</p>
            </div>
            <p class="message-content">${message.content}</p>
        </div>
    `;
};

const displayMessages = () => {
    const messagesHTML = messages.map(message => createMessageHTML(message)).join('');
    messagesList.innerHTML = messagesHTML;
};
displayMessages();


//sendBtn callback
sendBtn.addEventListener('click', e => {
    e.preventDefault();
    if (!messageInput.value) {
        return console.log('must provide a message');
    }
    const now = new Date().toDateString().split(" ");
    const message = {
        author: username,
        date: now.slice(-3).join(' '),
        content: messageInput.value
    };
    sendMessage(message);
    messageInput.value = '';
});

const sendMessage = message => {
    socket.emit('message', message);
};


//loginBtn callback
loginBtn.addEventListener('click', e => {
    e.preventDefault();
    if (!usernameInput.value) {
        alert('Need a username!');
    }
    username = usernameInput.value;
    sendMessage({
        author: username,
        type: messageTypes.LOGIN
    });
    loginWindow.classList.add('hidden');
    chatWindow.classList.remove('hidden');
});
