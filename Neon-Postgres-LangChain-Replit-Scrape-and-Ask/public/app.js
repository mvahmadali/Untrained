let chatHistory = [];

document.addEventListener('DOMContentLoaded', function() {
  const chatForm = document.getElementById('chat-form');
  chatForm.addEventListener('submit', function(event) {
    event.preventDefault();
    sendMessage();
  });

  const inputElement = document.getElementById('user-input');
  inputElement.addEventListener('keypress', function(event) {
    // 13 is the key code for the Enter key
    if (event.keyCode === 13) {
      // Prevent the default Enter key action
      event.preventDefault();
      // Call the sendMessage function
      sendMessage();
    }
  });
});

function showTypingIndicator() {
  const messagelistElement = document.getElementById('message-list');

  // Prevent multiple typing indicators from stacking
  removeTypingIndicator();

  const typingDiv = document.createElement('div');
  typingDiv.classList.add('message', 'typing-indicator'); // Add unique class

  typingDiv.innerHTML = `<em>Agent is typing...</em>`; // Italicize for better visibility
  messagelistElement.appendChild(typingDiv);
  messagelistElement.scrollTop = messagelistElement.scrollHeight;
}


function sendMessage() {
  const inputElement = document.getElementById('user-input');
  const message = inputElement.value;
  inputElement.value = '';
  inputElement.focus();
  if (!message.trim()) return;
  addToMessageList('You', message);

  showTypingIndicator(); // Show the typing indicator

  fetch('/ask', {   // <--- This is where the frontend sends the question to the backend
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ question: message })  // Sending the user input to the backend
  })
  .then(response => response.json())  // <--- Receiving the JSON response from the backend
  .then(data => {
    removeTypingIndicator(); // Remove the typing indicator
    addToMessageList('Bot', data.answer); // <--- Display the received answer in the chat
    chatHistory.push({
        'user': message,
        'bot': data.answer
    });
  })
  .catch(error => {
    console.error('Error:', error);
    removeTypingIndicator(); // Remove the typing indicator in case of an error
  });
}


function removeTypingIndicator() {
  const messagelistElement = document.getElementById('message-list');
  const typingIndicator = document.querySelector('.typing-indicator');
  if (typingIndicator) {
    messagelistElement.removeChild(typingIndicator);
  }
}

function addToMessageList(sender, message) {
  console.log(`Adding message to UI: ${sender}: ${message}`); // Debugging log

  const messagelistElement = document.getElementById('message-list');

  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');

  if (sender === 'You') {
    messageDiv.classList.add('usermessage');
  } else if (sender === 'Bot') {
    messageDiv.classList.add('apimessage');
  }

  // Ensure the message is always visible
  messageDiv.style.display = 'block';  
  messageDiv.style.visibility = 'visible';
  messageDiv.style.opacity = '1';

  const messageContent = document.createElement('div');
  messageContent.classList.add('message-content');
  messageContent.textContent = message;

  messageDiv.appendChild(messageContent);
  messagelistElement.appendChild(messageDiv);
  messagelistElement.scrollTop = messagelistElement.scrollHeight; // Auto-scroll
}
