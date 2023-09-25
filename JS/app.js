import { userId } from './cookie.js';
import { chatWithGPT } from './CHATGPT.js';
 
// Initialize Firebase
const config = {
  
  
 apiKey: "AIzaSyAJm8kR0YUnU5gDSs63VpszmN3w9s6nmQg",
 authDomain: "chat-gpt-28921.firebaseapp.com",
 databaseURL: "https://chat-gpt-28921-default-rtdb.firebaseio.com",
 projectId: "chat-gpt-28921",
 storageBucket: "chat-gpt-28921.appspot.com",
 messagingSenderId: "67171909387",
 appId: "1:67171909387:web:8ab68eef707c812eed6c0e"


  };
firebase.initializeApp(config);

// Get a reference to the Firebase database
const db = firebase.firestore();

const defaultRoomId = 'NN-General'; // Unique identifier for default chatroom
const urlParams = new URLSearchParams(window.location.search);
let roomID = urlParams.get('id');










/// creates default chatroom 

function createDefaultChatroom() {
  db.collection('NN-init').doc(defaultRoomId).set({
    name: 'Default Chatroom',
    created: new Date()
  })
  .then(() => {
    console.log('Default chatroom created');
  })
  .catch(error => {
    console.error('Error creating default chatroom:', error);
  });
}



// Check if default chatroom already exists
db.collection('NN-init').doc(defaultRoomId).get()
  .then(doc => {
    if (!doc.exists) {
      createDefaultChatroom();
    }
  })
  .catch(error => {
    console.error('Error checking for default chatroom:', error);
  });



// Get a reference to the chat container element
const chatContainer = document.getElementById('chat-container');

// Create a function to render the chat interface
function renderChatInterface() {

  // Create the chat header
  const chatHeader = document.createElement('div');
  chatHeader.classList.add('chat-header');

  const chatTitle = document.createElement('h4');
  chatTitle.textContent = roomID;

  const activeClients = document.createElement('h6');
  activeClients.classList.add('active-Clients');
  activeClients.textContent = "";

  chatHeader.appendChild(chatTitle);
  chatHeader.appendChild(activeClients);

  // Create the chat messages container
  const chatMessages = document.createElement('div');
  chatMessages.classList.add('chat-messages');

  // Create the chat input
  const chatInput = document.createElement('div');
  chatInput.classList.add('chat-input');

  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.placeholder = 'Type your message here...';

  const sendButton = document.createElement('button');
  chatInput.classList.add('chat-button');
  sendButton.textContent = 'Send';

  // Create the "Create new chat room" button
const copyButton = document.createElement('button');
copyButton.textContent = 'COPY';

// Add an event listener to the button that calls the createChatRoom() function
copyButton.addEventListener('click', () => {
  copy(chatTitle);
});

// Add the button to the chat header

  
  chatInput.appendChild(inputField);
  chatInput.appendChild(sendButton);
  chatHeader.appendChild(copyButton);


  

  // Add the chat header, messages, input, and typing indicator to the chat container
  chatContainer.appendChild(chatHeader);
  chatContainer.appendChild(chatMessages);
  chatContainer.appendChild(chatInput);
  

  // Get a reference to the input field and send button
const inputFieldRef = chatInput.querySelector('input');
const sendButtonRef = chatInput.querySelector('button');

let lastMessageTime = 0;
const MESSAGE_COOLDOWN_TIME = 1000;

// Listen for send button click events
sendButtonRef.addEventListener('click', () => {
  // Get the message text and the current timestamp
  const messageText = inputFieldRef.value.trim();
  const timestamp = new Date().getTime();


  // Check if the message text is not blank
  if (messageText !== '') {
    const timestamp = new Date().getTime();
    const currentTime = new Date().getTime();
  
    // Parse the command and arguments 
    //// #commands
    const [command, ...args] = messageText.startsWith('/') ? messageText.slice(1).split(' ') : [null];

    if (command === 'nodes' && args[0] === 'new' && args.length > 1) {
      // Concatenate all the arguments after the "new" keyword into a single string
      const roomName = args.slice(1).join(' ');

      // Execute the createChatRoom function with the provided room name
      createNode(roomName);
        
      // Clear the input field
      inputFieldRef.value = '';
    } if (command === 'qrcode' && args.length === 1) {
      const url = args[0];
      generateQRCode(url);
      inputFieldRef.value = '';
    }
     else if (command === 'help') {
      displaySystemMessage(
        `Available commands
        \n_____________\n 
        /about - to understand
        /home - navigate back to  the "NN-General" node
        /mission - load current mission
        /help - view this help message\n
        /clear - clears all system messages
        /donate [amount] - become an early investor and support the cause
        /prompt [message] - submit a message to the AI overseer
        \n_____________\n 
        GENERAL
        \n_____________\n 
        /nodes list - list availbale neuranet nodes\n
        /nodes founder - check if you own the node\n
        /nodes new [node name] - create a new neuranet node\n 
        /nodes join [node name] - join node (excluding "NN-")\n
        /nodes user [userId] - list nodes created by given user)\n
        \n_____________\n 
        NODES
        \n_____________\n 
        /clients me - display your client ID\n
        /clients list - display total active clients (GLOBAL)\n
        \n_____________\n 
        CLIENTS
        /apps launch sublair - interface into the sublair \n
        /apps download neuranet - windows app for interfacing into neuranet \n
        \n_____________\n
        APPS
        /qrcode "URL" - generate a QR code based on a url \n
        \n_____________\n
        TOOLS





        
        The copy button will copy a url that you can share to grow your node.`);
      inputFieldRef.value = '';
    } else if (command === 'clear') {
      clearSystemMessages();
      inputFieldRef.value = '';
    } else if (command === 'home') {
      windowRelocate('General')
      inputFieldRef.value = '';
    } else if (command === 'mission') {
      displaySystemMessage(
        `:: MISSION 000 ::\n
        \n ___________ 
        PHASE_000: INSTANTIATION\n 
        MISSION OBJECTIVE:\n 
        Instantiate an active network of humans.\n  
        As a client of NEURANET your task is to create new nodes and invite fellow associates to join.\n
        \n ________________
        MISSION\n
         - Create a new node with a custom ID.\n 
        - Share the node with your associates and start growing activity within your NEURANET node.\n 
        - Submit new feature requests within the "NN-REQUESTS" node to help improve the network.
        \n
        /help for more.`);
      inputFieldRef.value = '';
    } else if (command === 'about') {
      displaySystemMessage(
        `NEURANET.IO\n
        Collective Intelligence\n
        \n ________________
        \n "NeuraNet is a cutting-edge project that harnesses the collective knowledge of humans around the world to create a massive neural network. NeuraNet has the potential to revolutionize the way we solve complex problems and make sense of the world around us. While NeuraNet is not yet fully AI-powered, it has the potential to become an unprecedented level of collective intelligence, paving the way for new breakthroughs in artificial intelligence. As the project continues to grow, the possibilities are endless, and the potential for NeuraNet to transform the future of technology is truly limitless." \n
        - CHAT-GPT on NEURANET  \n
        \n __________________
        \n
        a brain child between a human and CHATGPT.
        \n
        \n
        type /help to get started
        `);
      inputFieldRef.value = '';
    } else if (command === 'apps' && args[0] === 'launch' && args[1] === 'sublair') {
      window.open('https://sublair.com', '_blank')
      inputFieldRef.value = '';
    } else if (command === 'apps' && args[0] === 'download' && args[1] === 'neuranet') {
      downloadFileFromStorage("Neuranet 4.4.4.zip")
      inputFieldRef.value = '';
    }  else if (command === 'clients' && args[0] === 'me') {
      displaySystemMessage(`Your client ID is: ${userId}`);
      inputFieldRef.value = '';
    } else if (command === 'clients' && args[0] === 'list') {
      listClientids();
      inputFieldRef.value = '';
    } else if (command === 'nodes' && args[0] === 'list') {
      listNodes();
      inputFieldRef.value = '';
    } else if (command === 'nodes' && args[0] === 'join' && args.length > 1) {
      const roomName = args.slice(1).join(' ');
      const x = `NN-${roomName}`;
      joinNode(x);
      inputFieldRef.value = '';
    } // Command to retrieve all nodes created by the current user/device
    else if (command === 'nodes' && args[0] === 'user') {
      listNodes(args[1]);
      inputFieldRef.value = '';
      
    } else if (command === 'nodes' && args[0] === 'founder') {
      
      checkFounder(roomID, userId).then((isFounder) => {
        if (isFounder) {
          displaySystemMessage("Client: " + userId + " is the founder");
        } else {
          displaySystemMessage("Client: " + userId + " is NOT the founder");
        }
      }).catch(() => {
        displaySystemMessage("An error occurred while checking for the node");
      });
      inputFieldRef.value = '';
      





      
    } else if (command === 'donate' && args.length > 0) {
      // Extract the donation amount from the message text
      const amount = parseInt(args[0]);
      // Check if the amount is a valid integer
      if (!Number.isInteger(amount)) {
        displaySystemMessage('Invalid donation amount:', amount);
        return;
      }
      Donate(amount);
      inputFieldRef.value = '';
    }

    else if (command === 'prompt' && args.length > 0) {
      const x = args.join(' ');
      chatGPT(x);
      inputFieldRef.value = '';
    }
    

     else if (command) {
      // The command is not recognized, so display an error message
      displaySystemMessage(`Command not recognized: ${command}`);
    
      // Clear the input field
      inputFieldRef.value = '';
    } else {
// Check if the message is blank or not a command


  // Check if enough time has passed since the last message was sent
  if (currentTime - lastMessageTime >= MESSAGE_COOLDOWN_TIME) {
    // Update the last message time to the current time
    lastMessageTime = currentTime;

    // The message is not spam, so proceed with sending it
    // ...

   submitMessage(messageText, timestamp);
      
        
  } else {
    // The message is spam, so don't send it and display an error message
    displaySystemMessage('You are sending messages too quickly. Please wait before sending another message.');
    disableChat();
  }


  
    }
  }
});



function disableChat() {
  const inputFieldRef = document.getElementsByClassName('chat-input');
  const sendButtonRef = document.getElementsByClassName('chat-button');

  inputFieldRef.disabled = true;
  sendButtonRef.disabled = true;

  setTimeout(() => {
    inputFieldRef.disabled = false;
    sendButtonRef.disabled = false;
  }, 50000);
}







function submitMessage(messageText, timestamp){ 

  const message = {
    text: messageText,
    sender: userId,
    timestamp: timestamp,
    likedBy: [],  // Add an empty array for the 'likedBy' field
    dislikedBy: []  // Add an empty array for the 'likedBy' field
  };

  // Add the message to the chatroom in the Firebase database
  db.collection('NN-init').doc(roomID).collection('messages').add(message)
    .then(() => {
      // Clear the input field
      inputFieldRef.value = '';
    })
    .catch(error => {
      console.error(error);
    });
  
}



  

  // Listen for input field keydown events
  inputFieldRef.addEventListener('keydown', event => {
    // If the Enter key is pressed, trigger the send button click event
    if (event.keyCode === 13) {
      event.preventDefault();
      sendButtonRef.click();
    }
  });


  db.collection('NN-init').doc(roomID).collection('messages').orderBy('timestamp')
  .onSnapshot(snapshot => {
    // Clear the current messages
    chatMessages.innerHTML = '';

    // Iterate over the snapshot and render each message
    snapshot.forEach(doc => {
      const message = doc.data();

      const messageElement = document.createElement('div');
      messageElement.classList.add('chat-message');
      messageElement.classList.add(message.sender);

      const senderElement = document.createElement('div');
      senderElement.classList.add('chat-message');
      senderElement.classList.add('sender');
      senderElement.textContent = message.sender;

      const textElement = document.createElement('div');
      textElement.innerHTML = makeLinksClickable(message.text);

     

      const timestampElement = document.createElement('div');
      timestampElement.classList.add('chat-message');
      timestampElement.classList.add('timestamp');
      timestampElement.textContent = new Date(message.timestamp).toLocaleString();

      const likeButton = document.createElement('button');
likeButton.classList.add('chat-message');
likeButton.classList.add('like-button');
likeButton.setAttribute('data-like-count', doc.id);
likeButton.textContent = `${Array.isArray(message.likedBy) && message.likedBy.length > 0 ? message.likedBy.length : 0}`;
likeButton.addEventListener('click', () => {
  submitMessageLike(doc.id, userId);
});

const dislikeButton = document.createElement('button');
dislikeButton.classList.add('chat-message');
dislikeButton.classList.add('dislike-button');
dislikeButton.setAttribute('data-dislike-count', doc.id);
dislikeButton.textContent = `${Array.isArray(message.dislikedBy) && message.dislikedBy.length > 0 ? message.dislikedBy.length : 0}`;
dislikeButton.addEventListener('click', () => {
  submitMessageDislike(doc.id, userId);
});

const totalButton = document.createElement('button');
totalButton.classList.add('chat-message');
totalButton.classList.add('total-button');
const likeCount = message.likedBy ? message.likedBy.length : 0;
const dislikeCount = message.dislikedBy ? message.dislikedBy.length : 0;
const totalCount = likeCount + dislikeCount;
const ratio = likeCount / totalCount;
totalButton.textContent = `${Math.round(ratio * 100)}%`;

      messageElement.appendChild(textElement);
      messageElement.appendChild(senderElement);
      messageElement.appendChild(timestampElement);
      messageElement.appendChild(likeButton);
      messageElement.appendChild(dislikeButton);
      messageElement.appendChild(totalButton);

      // Listen for changes to the 'likedBy' and 'dislikedBy' fields of the message document
      doc.ref.onSnapshot(snapshot => {
        const data = snapshot.data();
        const likeCount = Array.isArray(data.likedBy) ? data.likedBy.length : 0;
        const dislikeCount = Array.isArray(data.dislikedBy) ? data.dislikedBy.length : 0;
        const totalCount = likeCount + dislikeCount;
        let ratio = 0;
      
        // Calculate the ratio if there are likes or dislikes
        if (totalCount > 0) {
          ratio = likeCount / totalCount;
        }
      
        // Update the text content and background color of the like button
        if (Array.isArray(data.likedBy) && data.likedBy.includes(userId)) {
          likeButton.style.color = 'black';
          likeButton.style.backgroundColor = 'white';
        } else {
          likeButton.textContent = `${likeCount}`;
          likeButton.style.backgroundColor = '';
        }
      
        // Update the text content and background color of the dislike button
        if (Array.isArray(data.dislikedBy) && data.dislikedBy.includes(userId)) {
          dislikeButton.style.color = 'black';
          dislikeButton.style.backgroundColor = 'white';
        } else {
          dislikeButton.textContent = `${dislikeCount}`;
          dislikeButton.style.backgroundColor = '';
        }
      
        // Update the text content of the total button
        totalButton.textContent = `${Math.round(ratio * 100)}%`;
      });
      
      
      chatMessages.appendChild(messageElement);

      
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;

    
    

   

  });

  

  



  
  
  // Listen for typing events
  inputFieldRef.addEventListener('input', event => {
    const value = event.target.value;
    
  });
  
}


  
  // CHECK IF ROOM EXISTS, IF NOT DEFAULT TO NN-GENERAL


  if (!roomID) {
    roomID = defaultRoomId;
  }
  
  if (window.location.hostname === 'neuranet.io') {
    const db = firebase.firestore();
    const nodesRef = db.collection('NN-init');
  
    if (roomID === defaultRoomId) {
      
      init();
    } else {
      nodesRef.doc(roomID).get().then((doc) => {
        if (doc.exists) {
          // The requested node exists, render the chat interface for it
          
          init();

        } else {
          // The requested node does not exist, redirect the user to the default node
          window.location.href = `https://neuranet.io?id=${defaultRoomId}`;
          
          init();
        }
      }).catch((error) => {
        console.error('Error checking for node:', error);
        // Redirect the user to the default node in case of an error
        window.location.href = `https://neuranet.io?id=${defaultRoomId}`;
        
        init();
      });
    }
  } else if (window.location.hostname === '127.0.0.1') {
    roomID = 'NN-General';
    
    init();
  } else {
    window.location.href = `https://neuranet.io?id=${defaultRoomId}`;
    
    init();
  }


  //// initializes the interface after the URL redirect

  function init(){ 
    addUserToNode(userId, roomID);
    checkFounder(roomID,userId);
    renderChatInterface();
    addclients();
    listTotalclients();
  }
  
  

  



///// allows a client to create a node
function createNode(roomName) {
  const db = firebase.firestore();
  const query = db.collection('NN-init').where('founder', '==', userId);
  
  query.get().then(querySnapshot => {
    if (!querySnapshot.empty) {
      console.log(`User already has a node with ID: ${querySnapshot.docs[0].id}`);
      // Display message to user informing them they cannot create another node
      const message = 'Sorry, you cannot create another node';
      displaySystemMessage(message);
      return;
    } else {
      // Create a new chat room document in Firebase with the unique ID and name
      db.collection('NN-init').doc('NN-' + roomName).set({
        URL: "https://neuranet.io?id=NN-" + roomName,
        created: new Date(),
        founder: userId
      })
      .then(() => {
        console.log(`Chat room ${roomName} created with ID NN-${roomName}`);
        // Refresh the client's window to point to the new chat room URL
        const newURL = `https://neuranet.io?id=NN-${roomName}`;
        window.location.replace(newURL);
      })
      .catch(error => {
        console.error(error);
      });
    }
  }).catch(error => {
    console.error('Error checking for existing node:', error);
  });
}






  function getUniquevisits(nodeName) {
    return new Promise((resolve, reject) => {
      db.collection('NN-init').doc(nodeName).collection('NDE-CLIENTS').get()
        .then((querySnapshot) => {
          console.log(`Number of users in ${nodeName}: ${querySnapshot.size}`);
          resolve(querySnapshot.size);
        })
        .catch((error) => {
          console.error(`Error counting users in ${nodeName}: ${error}`);
          reject(error);
        });
    });
    
  } 

//// allows client to join a node given 
  function joinNode(x){ 
    
      // Check if the room exists in Firebase
      const roomRef = db.collection('NN-init').doc(x);
      roomRef.get().then((doc) => {
        if (doc.exists) {
          // Redirect the user to the existing chatroom
          window.location.href = `https://neuranet.io?id=${x}`;
        } else {
          // Display a message indicating that the room doesn't exist
          displaySystemMessage(`Room "${roomId}" doesn't exist.`);
        }
      }).catch((error) => {
        console.error('Error checking if room exists:', error);
      });
  }

  ///// provides client with a list of nodes within the db
  async function listNodes(userIdFilter = null) {
    const db = firebase.firestore();
    try {
      const querySnapshot = await db.collection('NN-init').get();
      const promises = querySnapshot.docs.map(async doc => {
        const sizePromise = getUniquevisits(doc.id);
        return {
          id: doc.id,
          size: await sizePromise,
          founder: doc.data().founder || "unknown"
        };
      });
      let nodes = await Promise.all(promises);
  
      if (userIdFilter !== null && userIdFilter !== undefined) {
        nodes = nodes.filter(node => node.founder === userIdFilter);
      }
  
      nodes.sort((a, b) => a.size - b.size);
  
      const nodesList = document.createElement('div');
      nodesList.classList.add('nodesList');
      nodesList.id = 'nodesList';
  
      const nodeListContainer = document.createElement('div');
      nodeListContainer.classList.add('nodeListContainer');
  
      nodes.forEach(node => {
        const nodeElement = document.createElement('div');
        nodeElement.classList.add('node');
  
        const nameElement = document.createElement('a');
        nameElement.classList.add('node-name');
        nameElement.href = `https://neuranet.io?id=${node.id}`;
        nameElement.textContent = node.id;
  
        const founderElement = document.createElement('div');
        founderElement.classList.add('node-founder');
        founderElement.textContent = `Founder: ${node.founder}`;
        const sizeElement = document.createElement('div');
        sizeElement.classList.add('node-size');
        sizeElement.textContent = `Unique Visits: ${node.size}`;
        
  
        nodeElement.appendChild(nameElement);
        nodeElement.appendChild(founderElement);
        nodeElement.appendChild(sizeElement);
        
        nodeListContainer.appendChild(nodeElement);
  
      });
  
      nodesList.appendChild(nodeListContainer);
  
      const message = ':: NODES ::';
      displaySystemMessage(message);
      displaySystemMessage(nodesList.outerHTML);
    } catch (error) {
      console.error('Error fetching nodes:', error);
    }
  }
  

  
  

  /// copies the URL of the room to clipboard
function copy (x){

  const texttoCopy = "https://neuranet.io?id="+x.textContent;

navigator.clipboard.writeText(window.location.href)
  .then(() => {

    // Add the .copied class to the chat title to trigger the animation
  x.classList.add('copied');

  // Remove the .copied class after the animation completes
  setTimeout(() => {
    x.classList.remove('copied');
  }, 1500)
    
  })
  .catch((error) => {
    console.error("Error copying text to clipboard: ", error);
  });

}



//// displays any system messages from commands 
function displaySystemMessage(message, className = "system-message") {
  const chatMessages = document.querySelector('.chat-messages');
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message', className);
  
  let contentElement;

  if (typeof message === "string") {
    contentElement = document.createElement('div');
    const messageLines = message.split('\n');
  
    for (let line of messageLines) {
      const lineElement = document.createElement('div');
      lineElement.innerHTML = line;
      contentElement.appendChild(lineElement);
    }
  } else if (message instanceof HTMLElement) {
    contentElement = message;
  }

  messageElement.appendChild(contentElement);
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}






//// clears all system messages
function clearSystemMessages() {
  const systemMessages = document.querySelectorAll('.system-message, .ai-response');
  systemMessages.forEach(message => message.remove());
}




/// any messages get turned into clickable URLS 
function makeLinksClickable(message) {
  // Regular expression to match URLs
  const urlRegex = /((https?:\/\/)[^\s]+)/g;
  
  // Replace URLs with clickable links
  return message.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
}




function addclients() { 
// Get a reference to the user's document in the "usersOnline" collection
const currentUserRef = db.collection('NN-totalClients').doc(userId);

// Add the user to the "usersOnline" collection
currentUserRef.set({
  id: userId,
  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
}).then(() => {
  console.log('User added to online list.');
}).catch((error) => {
  console.error('Error adding user to online list:', error);
});
}







// updates the count with active users

function listTotalclients() { 
  const usersOnlineRef = db.collection('NN-totalClients');
  const activeClients = document.getElementsByClassName('active-Clients')[0];
  usersOnlineRef.onSnapshot((snapshot) => {
    const numOnlineUsers = snapshot.size;
    // Update the display with the new count of online users
    activeClients.textContent = `TOTAL GLOBAL CLIENTS: ${numOnlineUsers}`;
  });
};





////// lists active clients
function listClientids() {
  const usersOnlineRef = db.collection('NN-activeClients');
  const activeClients = document.querySelector('.active-Clients');
  const clientIds = [];

  usersOnlineRef.get().then((snapshot) => {
    const numOnlineUsers = snapshot.size;
    // Update the display with the new count of online users
    activeClients.textContent = `${numOnlineUsers} CLIENTS ONLINE`;

    snapshot.forEach((doc) => {
      const user = doc.data();
      const userId = doc.id;

      // Log the user ID and timestamp to the console
      console.log(`${userId} joined at ${new Date(user.timestamp.toMillis())}`);

      // Add the user ID to the clientIds array
      clientIds.push(userId);
    });

    // Display the list of active client IDs in a single system message
    if (clientIds.length > 0) {
      const systemMessage = `:: ACTIVE CLIENTS ::\n- ${clientIds.join('\n- ')}`;
      displaySystemMessage(systemMessage);
    }
  }).catch((error) => {
    console.error('Error fetching online users:', error);
  });
}


///// tracking unique visists to nodes
function addUserToNode(userId, nodeName) {
  const nodeRef = db.collection('NN-init').doc(nodeName).collection('NDE-CLIENTS').doc(userId);
  nodeRef.set({
    joinedAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    console.log(`User ${userId} added to node ${nodeName}`);
  })
  .catch((error) => {
    console.error(`Error adding user ${userId} to node ${nodeName}:`, error);
  });
}



//// relocate window
function windowRelocate(x){
  const newURL = `https://neuranet.io?id=NN-${x}`;
      window.location.replace(newURL);
}




//// compares the current userID with that of the founder ID
function checkFounder(roomID, userId) {
  const nodesRef = db.collection('NN-init');
  return new Promise((resolve, reject) => {
    nodesRef.doc(roomID).get().then((doc) => {
      if (doc.exists) {
        const founderId = doc.data().founder;
        if (founderId === userId) {
          // The client is the founder of the node
          resolve(true);
        } else {
          // The client is not the founder of the node
          resolve(false);
        }
      } else {
        // The requested node does not exist
        console.error('Error checking for node: node does not exist');
        reject();
      }
    }).catch((error) => {
      console.error('Error checking for node:', error);
      reject();
    });
  });
}



////// donate function
async function Donate(amount) {
  clearSystemMessages();


  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  
  const formattedAmount = formatter.format(amount);


  const donationForm = document.createElement('div');
  donationForm.id = 'donation-form';

  const label = document.createElement('h3');
  label.htmlFor = 'donation-amount';
  label.innerText = 'Donation Amount';

  const input = document.createElement('h1');
  input.type = 'number';
  input.id = 'donation-amount';
  input.name = 'donation-amount';
  input.innerText = ">>" + formattedAmount + "<<";

  const paypalButtonContainer = document.createElement('div');
  paypalButtonContainer.className = 'paypal-button-container';
  paypalButtonContainer.id = 'paypal-button-container';

  donationForm.appendChild(label);
  donationForm.appendChild(input);
  donationForm.appendChild(paypalButtonContainer);

  const message = ':: DONATION ::';
  displaySystemMessage(message);
  displaySystemMessage(donationForm.outerHTML);

  const createOrderPayload = {
    purchase_units: [
      {
        amount: {
          value: amount
        },
        description: "Donation to NeuraNet"
      }
    ]
  };

  try {
    const paypalResponse = await paypal.Buttons({
      style: {
        color: "black", // Change the color of the PayPal button text
        shape: "rect", // Change the shape of the PayPal button
        layout: "horizontal" // Change the layout of the PayPal button
      },
      createOrder: function(data, actions) {
        return actions.order.create(createOrderPayload);
      },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          console.log('Transaction completed by ' + details.payer.name.given_name + '!');
        });
      },
      onError: function(err) {
        console.log('PayPal error:', err);
        displaySystemMessage('Error: ' + err.message, null, true);
      }
    }).render('#paypal-button-container');

    console.log('PayPal button rendered successfully', paypalResponse);
  } catch (error) {
    console.error('PayPal button failed to render:', error);
  }
}




//// send prompt to AI
function chatGPT(messageText) {

  chatWithGPT(messageText).then(response => {
    console.log(response);

   

    displaySystemMessage(":: THE OVERSEER ::\n" + response,"ai-response");
  });
}



//// click like
function submitMessageLike(messageId, userId) {
  // Update the 'likedBy' field of the message in the Firebase database
  db.collection('NN-init').doc(roomID).collection('messages').doc(messageId).update({
    likedBy: firebase.firestore.FieldValue.arrayUnion(userId),
    dislikedBy: firebase.firestore.FieldValue.arrayRemove(userId)
  })
  .catch(error => {
    console.error(error);
  });
}



////// click dislike
function submitMessageDislike(messageId, userId) {
  // Update the 'dislikedBy' field of the message in the Firebase database
  db.collection('NN-init').doc(roomID).collection('messages').doc(messageId).update({
    dislikedBy: firebase.firestore.FieldValue.arrayUnion(userId),
    likedBy: firebase.firestore.FieldValue.arrayRemove(userId)
  })
  .catch(error => {
    console.error(error);
  });
}



function generateQRCode(url) {

  const qrCodeDiv = document.createElement('div');
  qrCodeDiv.setAttribute('id', 'qrcode');
  displaySystemMessage(qrCodeDiv);


 
  var qrcode = new QRCode(document.getElementById("qrcode"), {
    text: url,
    width: 512,
    height: 512,
    colorDark: "#041f00",
    colorLight: "#00ff00",
    correctLevel: QRCode.CorrectLevel.H
  });


  displaySystemMessage("Above is your QR code for " + url);


}





////// download neuranet web app
function downloadFileFromStorage(filePath) {
  var storageRef = firebase.storage().ref();
  // Download file using storage reference and path
  storageRef.child(filePath).getDownloadURL()
  .then((url) => {
    // Use URL to download file using browser's download feature
    var a = document.createElement('a');
    a.href = url;
    a.download = filePath.split('/').pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  })
  .catch((error) => {
    console.error('Error downloading file:', error);
  });
}





