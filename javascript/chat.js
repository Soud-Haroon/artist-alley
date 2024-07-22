import { loggedInUser, includeHeaderFooter, gotoMyAccount, logoutUser } from "./utilities.js";
import { getUserDataById, saveUserDataInDb, getChatData, saveChatItem, updateChatItem, listenForChatUpdates } from './firestore.js';
import { USER_TYPE_ARTIST } from './app-constants.js';

const params = new URLSearchParams(window.location.search);
const artist_id = params.get('artist_id');

const chatListDiv = document.getElementById('chat-list');
const chatScreenDiv = document.getElementById('chat-view');
const headerElement = document.querySelector('header');
const footerElement = document.querySelector('footer');

setupHeaderFooter();
// Load the previous chat on the left panel, if exist
await initUI();

// If the user is coming from the artists profile then create a chatId, compare it with existing chats for the loggedInUser
// if found, open the chat box of that particular id
// else add that id to myChat and also to the artist's myChat and then open the chat box
if (artist_id) {
    const chatId = `${loggedInUser.uid}_${artist_id}`;
    let chatExists = false;
    if (loggedInUser.myChat) {
        console.log('myChat exists for the loggedin user');
        loggedInUser.myChat.forEach(chat => {
            if (chat.id === chatId) {
                chatExists = true
            }
        });
        if (chatExists) {
            loadConversation(chatId);
            // TODO: highlight the selected chat on the left panel
        } else {
            console.log('The key is there, but no data is inside the myChat array!');
            await startANewChat(chatId, artist_id);
        }
    } else {
        console.log('No chat found. Go ahead create a new one with this id: ' + chatId);
        await startANewChat(chatId, artist_id);
    }

} else {
    
}

async function initUI() {
    if (loggedInUser.myChat) {
        loggedInUser.myChat.forEach(chat => {
            const otherUser = document.createElement('p');
            // TODO: make this chat type as key value and find out who is on the other side of the chat and replace the below name with it.
            otherUser.textContent = chat.chatName;
            otherUser.addEventListener('click', () => {
                loadConversation(chat.id);
            })
            chatListDiv.appendChild(otherUser);
        });
    } else {
        console.log("No prev chat for you!");
    }
}

async function startANewChat(chatId, artist_id) {
    // TODO: change the below updateUserData in such way that it updates both the users with a single query
    let prevChat;
    if (loggedInUser.myChat) {
        prevChat = loggedInUser.myChat;
    } else {
        prevChat = [];
    }
    const newChat = {
        id: chatId,
        chatName: 'Static Name'
    }
    prevChat.push(newChat);
    loggedInUser.myChat = prevChat;
    // Update chat data for Organiser User
    await updateUserData(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));


    // Update the same for the Artist User
    let artistAllChat;
    let artist_data = await getArtistData(artist_id, USER_TYPE_ARTIST);
    if (artist_data.myChat) {
        artistAllChat = artist_data.myChat;
    } else {
        artistAllChat = [];
    }
    artistAllChat.push(newChat);
    artist_data.myChat = artistAllChat;
    await updateUserData(artist_data);

    const newChatWrapper = document.createElement('p');
    // TODO: make this chat type as key value and find out who is on the other side of the chat and replace the below name with it.
    newChatWrapper.textContent = newChat.chatName;
    newChatWrapper.addEventListener('click', () => {
        console.log('Chat is clicked: ' + chatId);
        loadConversation(chatId);
    })
    chatListDiv.appendChild(newChatWrapper);
}

async function updateUserData(user) {
    await saveUserDataInDb(user);
}

async function getArtistData(userId, userType) {
    return await getUserDataById(userId, userType);
}

async function loadConversation(chatId) {
    chatScreenDiv.innerHTML = '';

    let isNewChat = true;

    // LOAD THE CHAT TEMPLATE
    const response = await fetch('../templates/chat-template.html');
    const html = await response.text();

    // Create a temporary element to hold the HTML content
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Extract the template content
    const chatTemplate = temp.querySelector('#chatTemplate');
    const clone = document.importNode(chatTemplate.content, true);

    const chatScreen = clone.querySelector('#chat-screen');
    const messageInput = clone.querySelector('#message-input');
    const sendButton = clone.querySelector('#send-button');

    let messages = await getChatData(chatId);
    console.log("I've got some data: " + messages);
    if (messages) {
        isNewChat = false;
        showMessagesOnUI(messages, chatScreen);
    }

    listenForChatUpdates(chatId, (updatedMessages) => {
        showMessagesOnUI(updatedMessages, chatScreen)
    });

    sendButton.addEventListener('click', () => {
        console.log('event listener added')

        let msg = messageInput.value.trim();
        if (msg !== '') {
            let chatItem = {
                id: chatId,
                senderId: loggedInUser.uid,
                receiverId: artist_id,
                text: msg
            }
            if (isNewChat) {
                saveNewConversation(chatItem, chatId);
            } else {
                updateConversation(chatItem, chatId);
            }
            messageInput.value = '';
        }
    });

    chatScreenDiv.appendChild(clone);
}

async function saveNewConversation(chatItem, chatId) {
    await saveChatItem(chatItem, chatId);
    loadConversation(chatId);

    console.log('message sent successfully!');
}

async function updateConversation(chatItem, chatId) {
    await updateChatItem(chatItem, chatId);
    loadConversation(chatId);

    console.log('message sent successfully!');
}

function showMessagesOnUI(messages, chatScreen) {
    chatScreen.innerHTML = '';
    messages.forEach(item => {
        const messageItem = document.createElement('p');
        messageItem.textContent = item.text;
        if (item.senderId === loggedInUser.uid) {
            messageItem.id = 'sender-view';
        } else {
            messageItem.id = 'receiver-view';
        }
        chatScreen.appendChild(messageItem);
    });
}

// HEADER & FOOTER DATA =========================================================================================

function setupHeaderFooter() {
    includeHeaderFooter(setHeader, setFooter);
}

function setHeader(data) {
    if (headerElement) {
        headerElement.innerHTML = data;
        const myProfileBtn = document.getElementById('myProfile');
        const logoutBtn = document.getElementById('logoutBtn');

        myProfileBtn.addEventListener('click', (event) => {
            event.preventDefault();
            gotoMyAccount();
        })

        logoutBtn.addEventListener('click', (event) => {
            event.preventDefault();
            logoutUser();
        })
    }
}

function setFooter(data) {
    if (footerElement) {
        footerElement.innerHTML = data;
    }
}