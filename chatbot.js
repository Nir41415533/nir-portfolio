// chatbot.js

// Knowledge base about Nir
const knowledgeBase = {
  skills: [
    "Python", "Django", "JavaScript", "React", "SQL", "MS SQL", "SQLite",
    "Docker", "Jenkins", "Java", "C", "C++", "Flask", "HTML", "CSS"
  ],
  certifications: [
    "Information Security Specialization", "Data Science Specialization"
  ],
  education: "Third-year Computer Science student at SCE College, GPA: 88.",
  projects: [
    {
      name: "Shemaython",
      description: "A custom programming language interpreter supporting logic, loops, strings, and arithmetic."
    },
    {
      name: "Client-Server System",
      description: "A multi-threaded client-server system in C++ with concurrent connections and TCP/IP communication."
    },
    {
      name: "DevOps Blog",
      description: "A Flask-based blog with admin permissions for the first registered user."
    },
    {
      name: "Django Blog Platform",
      description: "A blog platform with bookmarking features and content management."
    },
    {
      name: "Password Manager",
      description: "A secure password management tool built with Python."
    }
  ],
  experience: [
    "Supply Chain Manager at Unilog since 2023: Includes Python automation.",
    "Combat Medic 2016-2019: Medical clinic management and training."
  ],
  languages: ["Hebrew - Native", "English - Fluent"],
  about: "Third-year Computer Science student passionate about developing real solutions, with strong experience in Python, Django, DevOps, and more.",
  contact: "Phone: 054-6269965 | Email: nir41415511@gmail.com | LinkedIn: https://linkedin.com/in/python-fighter | GitHub: https://github.com/Nir41415533"
};

// Predefined responses for common questions
const responses = {
  greeting: "Hi! I'm Nir's AI assistant. You can ask me about his skills, projects, experience, or how to contact him.",
  about: knowledgeBase.about,
  skills: `Nir is proficient in: ${knowledgeBase.skills.join(", ")}.`,
  certifications: `Nir specializes in: ${knowledgeBase.certifications.join(", ")}.`,
  education: knowledgeBase.education,
  experience: knowledgeBase.experience.join(" "),
  projects: "Here are some of Nir's projects: " + knowledgeBase.projects.map(p => `${p.name} – ${p.description}`).join(". "),
  contact: knowledgeBase.contact,
  military: knowledgeBase.experience.find(e => e.includes("Medic")),
  languages: knowledgeBase.languages.join(", "),
  default: "I didn't understand. You can ask me about Nir's skills, projects, or education."
};

// Global variables for DOM elements
let chatMessages;
let userInput;
let sendButton;
let chatbotToggle;
let chatbotContainer;
let closeChatbot;

// Initialize conversation history
let conversationHistory = [];

// API endpoint for the backend
// Try different options for API URLs
const API_URL = (() => {
    // First try: Current host with /api/chat
    const defaultUrl = `${window.location.protocol}//${window.location.host}/api/chat`;
    
    // Second try: If we're on a development server, try localhost:5000
    const localUrl = 'http://localhost:5000/api/chat';
    
    console.log(`Debug: Setting API URL to ${defaultUrl}`);
    console.log(`Debug: Alternative URL is ${localUrl}`);
    
    // If we're on localhost with a dev port (like 5173), use the backend URL
    if (window.location.port === '5173' || window.location.port === '3000') {
        console.log('Debug: Development environment detected, using localhost:5000');
        return localUrl;
    }
    
    return defaultUrl;
})();

// Function to add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to handle user input
async function handleUserInput() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, 'user');
    userInput.value = '';

    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot-message typing';
    typingIndicator.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        console.log(`Debug: Sending message to ${API_URL}`);
        console.log("Debug: Sending history:", conversationHistory);
        
        let response;
        try {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    history: conversationHistory
                })
            });
            console.log(`Debug: Response status: ${response.status}`);
        } catch (fetchError) {
            console.error('Fetch Error:', fetchError);
            
            // Try the alternative URL if we're in development
            if (window.location.port === '5173' || window.location.port === '3000') {
                console.log('Debug: Trying alternative URL (localhost:5000)');
                
                try {
                    // Remove typing indicator
                    chatMessages.removeChild(typingIndicator);
                    
                    // Add warning message
                    addMessage("Trying alternative backend URL...", 'error');
                    
                    // Re-add typing indicator
                    chatMessages.appendChild(typingIndicator);
                    
                    response = await fetch('http://localhost:5000/api/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            message: message,
                            history: conversationHistory
                        })
                    });
                    console.log(`Debug: Alternative response status: ${response.status}`);
                } catch (altFetchError) {
                    console.error('Alternative Fetch Error:', altFetchError);
                    throw new Error('Failed to connect to both primary and backup servers');
                }
            } else {
                throw fetchError;
            }
        }

        // Remove typing indicator
        chatMessages.removeChild(typingIndicator);

        // Get the response text and try to parse it
        const responseText = await response.text();
        console.log(`Debug: Raw response: ${responseText.substring(0, 100)}...`);
        
        // Check if response is empty
        if (!responseText || responseText.trim() === '') {
            throw new Error('Empty response from server');
        }
        
        // Try to parse the text as JSON
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.error('Response text:', responseText);
            throw new Error('Invalid JSON response from server');
        }
        
        // Check if this is an error response
        if (data.error === true) {
            console.log(`Debug: Server returned error: ${data.error_type}`);
            
            // Display the error message
            if (data.error_type === 'rate_limit') {
                // This is a rate limit error, show the time remaining
                addMessage(data.response, 'error');
            } else {
                // Other types of errors
                addMessage(data.response, 'error');
            }
            return;
        }
        
        // If we don't have a proper response
        if (!data || typeof data.response !== 'string') {
            console.error('Invalid data format:', data);
            throw new Error('Invalid response format from server');
        }

        // Add bot response to chat
        addMessage(data.response, 'bot');
        
        // Update conversation history - make sure to keep only the last few messages to prevent overflow
        conversationHistory.push(
            { role: 'user', content: message },
            { role: 'assistant', content: data.response }
        );
        
        // Keep only the last 10 messages in history to prevent it from growing too large
        if (conversationHistory.length > 10) {
            conversationHistory = conversationHistory.slice(conversationHistory.length - 10);
        }
        
        console.log("Debug: Updated history:", conversationHistory);

    } catch (error) {
        console.error('Error:', error);
        // Remove typing indicator if it exists
        if (typingIndicator.parentNode) {
            chatMessages.removeChild(typingIndicator);
        }
        
        // Add error message
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            addMessage("שגיאת חיבור: אנא וודא שהשרת פועל (python app.py). נסה לרענן את הדף ולנסות שוב.", 'error');
            addMessage("לפתיחת השרת: פתח cmd, נווט לתיקית הפרוייקט והרץ `python app.py`", 'error');
        } else if (error.message.includes('JSON')) {
            addMessage("שגיאת עיבוד: התשובה מהשרת אינה בפורמט תקין. בדוק את לוג השרת.", 'error');
        } else if (error.message.includes('Daily message limit') || 
                   error.message.includes('Too many messages') || 
                   error.message.includes('token limit') ||
                   error.message.includes('IP blocked')) {
            // Extract the time information from the error message
            const timeInfo = error.message.match(/try again in (.*?)\./);
            if (timeInfo && timeInfo[1]) {
                addMessage(`הגעת למגבלת השימוש. ${timeInfo[1]}`, 'error');
            } else {
                addMessage("הגעת למגבלת השימוש. נסה שוב מאוחר יותר.", 'error');
            }
        } else {
            // Log detailed error information to the console
            console.error('Detailed error info:', error);
            // Show user-friendly error message
            addMessage(`שגיאה: ${error.message}`, 'error');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM Elements
    chatMessages = document.querySelector('.chatbot-messages');
    userInput = document.getElementById('user-input');
    sendButton = document.getElementById('send-button');
    chatbotToggle = document.querySelector('.chatbot-toggle');
    chatbotContainer = document.querySelector('.chatbot-container');
    closeChatbot = document.querySelector('.close-chatbot');

    // Event Listeners
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.toggle('active');
    });

    closeChatbot.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
    });

    sendButton.addEventListener('click', handleUserInput);

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserInput();
        }
    });

    // Add initial greeting only once
    if (chatMessages.children.length === 0) {
        addMessage("Hello! I'm Nir's AI assistant. I can help answer questions about Nir's skills, projects, and experience. What would you like to know?", 'bot');
    }
});
