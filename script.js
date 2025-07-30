document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const loginModal = document.getElementById('login-modal');
  const chatbotContainer = document.getElementById('chatbot-container');
  const chatArea = document.getElementById('chat-area');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const loginBtn = document.getElementById('login-btn');

  // State
  let currentUser = null;

  // Login Functionality
  loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        currentUser = data.user;
        loginModal.style.display = 'none';
        chatbotContainer.style.display = 'flex';
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.placeholder = `Message ${data.user.name}...`;
        addBotMessage(data.welcomeMessage);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  });

  // Chat Functionality
  sendBtn.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addUserMessage(message);
    userInput.value = '';

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      addBotMessage(data.response);
    } catch (error) {
      console.error('Chat error:', error);
      addBotMessage("System error. Please try again.");
    }
  }

  // Helper Functions
  function addUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message user-message';
    msgDiv.innerHTML = `
      ${text}
      <span class="timestamp">${new Date().toLocaleTimeString()}</span>
    `;
    chatArea.appendChild(msgDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  function addBotMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message bot-message';
    msgDiv.innerHTML = `
      ${text}
      <span class="timestamp">${new Date().toLocaleTimeString()}</span>
    `;
    chatArea.appendChild(msgDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
  }
});
