const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

// Load appstate config
const appState = JSON.parse(fs.readFileSync(path.join(__dirname, 'config', 'appstate.json')));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  res.render('index', { 
    chatbotName: appState.chatbot.name,
    ownerName: appState.owner.name 
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === appState.owner.email && password === appState.owner.password) {
    res.json({
      success: true,
      user: appState.owner,
      welcomeMessage: appState.chatbot.welcomeMessage
    });
  } else {
    res.status(401).json({
      success: false,
      message: `Access denied. Only ${appState.owner.name} can use this system.`
    });
  }
});

app.post('/chat', (req, res) => {
  const { message } = req.body;
  
  // Marina-specific AI responses
  const responses = {
    greetings: [
      `As-salamu alaykum, ${appState.owner.name}! How can I serve you today?`,
      `Welcome back, ${appState.owner.name.split(' ')[0]}! 👑 Your AI is ready.`,
      `MARINA KHAN commands, I obey! What do you need?`
    ],
    pathan: [
      "Pathan proverb: \"A Pathan's word is his bond.\"",
      "Marina Khan, your Pathan heritage makes you unstoppable!",
      "Pathan wisdom: \"The higher the mountain, the stronger the climb.\""
    ],
    default: [
      `${appState.owner.name}, I'm processing your request...`,
      "Your wish is my command, MARINA.",
      "How may I assist you further?"
    ]
  };

  const msg = message.toLowerCase();
  let response;

  if (/hello|hi|salam/.test(msg)) {
    response = responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
  } else if (/pathan|pashtun|khan/.test(msg)) {
    response = responses.pathan[Math.floor(Math.random() * responses.pathan.length)];
  } else {
    response = responses.default[Math.floor(Math.random() * responses.default.length)];
  }

  res.json({ response });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  ${appState.chatbot.name} is running!
  Owner: ${appState.owner.name}
  Access at: http://localhost:${PORT}
  `);
});
