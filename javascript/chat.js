import { db } from '../app.js';
import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// by soud

var currentUser = "24";
const chatId = "h5Ely2RkaZWInosjDwY9";


class ChatModel {
    constructor(chat_id, person_one_id, person_two_id, time, messages) {
        this.chat_id = chat_id;
        this.person_one_id = person_one_id;
        this.person_two_id = person_two_id;
        this.time = time;
        this.messages = messages;
    }

    addMessage(message) {
        this.messages.push(message);
    }

    getMessages() {
        return this.messages;
    }

    getChatDetails() {
        return {
            chat_id: this.chat_id,
            person_one_id: this.person_one_id,
            person_two_id: this.person_two_id,
            msg_time: this.msg_time,
            messages: this.messages
        };
    }
}

class Message {
    constructor(message, message_id, user_id, msg_time) {
        this.message = message;
        this.message_id = message_id;
        this.msg_time = msg_time;
        this.user_id = user_id;
    }

    getMessageDetails() {
        return {
            message: this.message,
            message_id: this.message_id,
            user_id: this.user_id,
            msg_time: this.msg_time
        };
    }

    // Optional: Format message for display
    formatMessage() {
        return `${this.user_id}: ${this.message} (${this.msg_time.toDate().toLocaleString()})`;
    }
}

// DOM elements
const chatList = document.getElementById('chat-list');
const chatScreen = document.getElementById('chat-screen');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Function to fetch and render chat messages when a chat is selected
async function renderChatView(chat_id) {
    // Clear previous chat messages
    chatScreen.innerHTML = '';

    // Fetch the chat document using chat_id
    const chatDocRef = doc(db, 'chat', chat_id);
    await getDoc(chatDocRef)
        .then(docSnap => {
            if (docSnap.exists()) {
                console.log("Document found!");
                const chatData = docSnap.data();
                console.log("chatData.messages: ", chatData.messages);

                // Check if messages array exists and has items
                if (chatData.messages && chatData.messages.length > 0) {
                    // Render messages in chat view
                    chatData.messages.forEach(msgData => {
                        // Create a Message object
                        const message = new Message(
                            msgData.message,
                            msgData.message_id,
                            msgData.msg_time.toDate(), // Convert Firestore msg_time to Date object
                            msgData.user_id,
                        );

                        // Create message element
                        const messageElement = document.createElement('div');
                        messageElement.className = `message ${msgData.user_id === chatData.person_one_id ? 'sender' : 'receiver'}`;
                        messageElement.textContent = message.message;
                        chatScreen.appendChild(messageElement);
                    });
                } else {
                    console.log('No valid messages found for this chat or messages array is empty.');
                }
            } else {
                console.log('No such document!');
            }
        })
        .catch(error => {
            console.error('Error fetching document:', error);
        });
}

// Event listener for chat list items
document.addEventListener('DOMContentLoaded', () => {
    // Event delegation for chat box click
    chatList.addEventListener('click', event => {
        if (event.target && event.target.matches('.chat-box')) {
            // Remove 'active' class from previously active chat box
            const currentActiveChat = document.querySelector('.chat-box.active');
            if (currentActiveChat) {
                currentActiveChat.classList.remove('active');
            }

            // Add 'active' class to clicked chat box
            event.target.classList.add('active');

            // Get the chat ID of the clicked chat box
            const chat_id = event.target.dataset.chatId;
            renderChatView(chat_id); // Render chat view for the selected chat
        }
    });


    sendButton.addEventListener('click', () => {
        const messageText = messageInput.value.trim();
        if (messageText !== '') {
            const activeChatId = document.querySelector('.chat-box.active')?.dataset.chatId;
            if (activeChatId) {
                sendMessage(activeChatId, messageText); // Ensure activeChatId is defined and valid
                messageInput.value = ''; // Clear the input field
            } else {
                console.log('No active chat selected.');
            }
        }
    });

});
// Example usage: Fetch and render chat list for user with ID
async function fetchChats(userId) {
    try {
        const q1 = query(collection(db, 'chat'), where('person_one_id', '==', userId));
        const querySnapshot1 = await getDocs(q1);
        querySnapshot1.forEach(doc => {
            const chatData = doc.data();
            renderChatList(doc.id, chatData.person_two_id);
        });

        const q2 = query(collection(db, 'chat'), where('person_two_id', '==', userId));
        const querySnapshot2 = await getDocs(q2);
        querySnapshot2.forEach(doc => {
            const chatData = doc.data();
            renderChatList(doc.id, chatData.person_one_id);
        });
    } catch (error) {
        console.log("Error fetching chats:", error);
    }
}

// Function to render chat list in the sidebar
function renderChatList(chat_id, partner_id) {
    console.log(`Rendering chat box for chat_id: ${chat_id}, partner_id: ${partner_id}`);
    const chatBox = document.createElement('div');
    chatBox.className = 'chat-box';
    chatBox.textContent = `Chat with ${partner_id}`;
    chatBox.dataset.chatId = chat_id; // Store chat_id as data attribute
    chatList.appendChild(chatBox);
    // console.log(chatBox);
}

// Function to send a message
async function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();

    if (!message) {
        console.log('Message is empty, cannot send.');
        return;
    }

    const activeChatId = document.querySelector('.chat-box.active')?.dataset.chatId;

    if (!activeChatId) {
        console.log('No active chat selected.');
        return;
    }

    try {
        // Fetch the current chat document
        const chatRef = doc(db, 'chat', activeChatId);
        const chatSnap = await getDoc(chatRef);

        if (!chatSnap.exists()) {
            console.log('Chat document does not exist.');
            return;
        }

        const chatData = chatSnap.data();

        // Prepare message data
        const messageData = {
            message: message,
            message_id: `${Date.now()}`, // Generate your own message ID function
            user_id: currentUser,
            msg_time: new Date(), // Assuming msg_time is now, adjust if needed
        };

        // Update chat document with new message
        await updateDoc(chatRef, {
            messages: [...chatData.messages, messageData], // Append new message to existing messages array
            msg_time: serverTimestamp(), // Update msg_time with server timestamp
        });

        // Clear message input after sending
        messageInput.value = '';

        // Render the new message in the chat view
        renderMessage(messageData);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

// Function to render a single message in the chat view
function renderMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.user_id === currentUser ? 'sender' : 'receiver'}`;
    messageElement.textContent = `${message.message}`;

    // Append the message element to the chat screen
    chatScreen.appendChild(messageElement);
}

// Example usage: Fetch and render all chats for user with ID '24'
fetchChats(currentUser);


