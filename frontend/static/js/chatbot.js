// chatbot.js

// ----- KNOWLEDGE BASE & CONFIGURATION -----

// Knowledge base about Nir
const knowledgeBase = {
  skills: [
    "Python", "JavaScript", "React(Familiar)", "SQL","MongoDB", "SQLite","PostgreSQL",
    "Docker", "Jenkins", "Java", "C", "C++","Django","Flask","FastApi", "HTML", "CSS"
  ],
  certifications: [
    "Information Security Specialization", "Data Science Specialization"
  ],
  education: "Graduated from SCE - B.Sc. in Computer Science, GPA: 88.",
  projects: [
    {
      name: "WWII Interactive Map",
      description: "A Django-based multilingual platform featuring an interactive map of Jewish soldiers who fought in WWII, integrated with a PostgreSQL database, timeline navigation, and AI-powered search capabilities."
    },
    {
      name: "Shemaython",
      description: "A custom programming language interpreter supporting logic, loops, strings, and arithmetic."
    },
    {
      name: "Portfolio with AI Chatbot",
      description: "An interactive portfolio website featuring a custom AI-powered terminal chatbot."
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
    "Global Operations Specialist, ICL, Unilog since 2023: Includes Python automation with Selenium.",
    "Combat Medic 2016-2019: Medical clinic management and training."
  ],
  languages: ["Hebrew - Native", "English - Fluent"],
  about: "Motivated backend developer and Computer Science graduate with strong expertise in Python, Django, Flask, and FastAPI. Skilled in building clean, efficient, and scalable APIs and backend systems. Brings a proactive mindset, quick learning ability, and strong attention to detail—delivering solutions that are both robust and maintainable. Always eager to take on new challenges and contribute to impactful development teams.",
  contact: "Phone: 054-6269965 | Email: nir41415511@gmail.com | LinkedIn: https://linkedin.com/in/python-fighter | GitHub: https://github.com/Nir41415533"
};

// Project knowledge - detailed information about portfolio projects
const projectKnowledge = {
  "portfolio": {
    "name": "Portfolio with AI Chatbot",
    "description": "Interactive portfolio website featuring a custom AI-powered terminal chatbot. Built with HTML, CSS, and JavaScript, it includes responsive design, dark mode, animated sections, and an integrated AI assistant.",
    "technologies": ["HTML", "CSS", "JavaScript", "FastAPI", "Responsive Design", "OpenAI API", "Dark Mode", "Animated Sections", "Interactive Terminal", "AI Chatbot"],
    "features": ["AI-powered terminal chatbot", "Dark mode toggle", "Responsive design for all devices", "Animated sections", "Projects showcase", "Skills visualization",],
    "challenges": "Implementing a responsive terminal interface that works well on all devices and creating a natural language chatbot experience.",
    "learned": "Advanced CSS techniques, JavaScript DOM manipulation, responsive design patterns, and interactive UI elements, FastAPI, OpenAI API, AI APIs"
  }
};

// ----- GLOBAL VARIABLES -----

// Terminal state variables
let currentDirectory = '/home/nir';
let conversationHistory = [];
let terminalInitialized = false;
let isAIThinking = false; // Track if AI is currently processing

// DOM elements (will be initialized later)
let chatMessages;
let userInput;
let sendButton;
let chatbotToggle;
let chatbotContainer;
let closeChatbot;

// API endpoint for the backend
const API_URL = (() => {
  // Check if we're in development (localhost)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const localUrl = 'http://localhost:8001/api/chat';
    console.log(`Debug: Development mode - Using AI server URL: ${localUrl}`);
    return localUrl;
  }
  
  // Production mode - use relative path
  const productionUrl = '/api/chat';
  console.log(`Debug: Production mode - Using API URL: ${productionUrl}`);
  return productionUrl;
})();

// ----- VIRTUAL FILE SYSTEM -----

// Simulated file system for terminal navigation
const fileSystem = {
  // Root directory
  '/': {
    type: 'dir',
    contents: ['home']
  },
  // Home directory
  '/home': {
    type: 'dir',
    contents: ['nir']
  },
  '/home/nir': {
    type: 'dir',
    contents: ['about.txt', 'projects', 'skills']
  },
  '/home/nir/about.txt': {
    type: 'file',
    content: `Hi, I'm Nir , a passionate Computer Science graduate with a focus on backend development, software engineering, and real-world problem-solving. I love turning ideas into scalable systems, and I enjoy building clean, efficient, and impactful web platforms using tools like Python, JavaScript , Java, Django, FastAPI, and PostgreSQL.

Over the past few years, I've gained hands-on experience through academic and independent projects—most notably, leading the development of an interactive WWII map for a museum, where I worked with real data, AI integrations, and modern web technologies to create an engaging educational experience.

Alongside my technical work, my background includes leadership and teamwork from my service as a combat medic commander in the IDF reserves. I bring this discipline and responsibility into every project I take on, whether I'm working independently or as part of a team.

Outside of development, I enjoy watching football, diving, snowboarding, and staying active. These hobbies keep me grounded, focused, and always ready for the next challenge.`
  },
  '/home/nir/projects': {
    type: 'dir',
    contents: knowledgeBase.projects.map(p => p.name.toLowerCase().replace(/\s+/g, '-'))
  },
  '/home/nir/skills': {
    type: 'dir',
    contents: knowledgeBase.skills.map(s => s.toLowerCase())
  }
};

// Add project files dynamically
knowledgeBase.projects.forEach(project => {
  const sanitizedName = project.name.toLowerCase().replace(/\s+/g, '-');
  // Add project directory
  const dirPath = '/home/nir/projects/' + sanitizedName;
  fileSystem[dirPath] = {
    type: 'dir', // Make it a directory instead of a file
    contents: ['readme.md', 'description.txt'],
    projectData: project // Store the project data for easy access
  };
  
  // Add project files
  fileSystem[dirPath + '/readme.md'] = {
    type: 'file',
    content: `# ${project.name}\n\n${project.description}`
  };
  
  fileSystem[dirPath + '/description.txt'] = {
    type: 'file',
    content: project.description
  };
});

// Add skill files dynamically (but they won't be accessible via cat)
knowledgeBase.skills.forEach(skill => {
  const skillName = skill.toLowerCase();
  const filename = '/home/nir/skills/' + skillName;
  fileSystem[filename] = {
    type: 'file',
    content: `Skill: ${skill}\nLevel: Advanced\nYears: ${Math.floor(Math.random() * 5) + 1}`,
    hidden: true // Mark as hidden so cat won't work on it
  };
});

// ----- HELPER FUNCTIONS -----

// Function to get detailed project information
function getProjectDetails(project) {
  let detailedInfo = '';
  
  if (project.name.includes('Portfolio with AI Chatbot')) {
    detailedInfo = `Interactive portfolio website featuring a custom AI-powered using OpenAI API ,terminal chatbot. Features include:
• Modern and responsive design with dark/light mode
• Interactive terminal-style AI assistant
• Animated sections and transitions
• Projects showcase with hover effects
• Skills visualization organized by categories
• Mobile-first approach for all screen sizes

Technologies used: HTML, CSS, JavaScript, FastAPI, OpenAI API, Responsive Design, AI Integration`;

 
} else if (project.name.includes('WWII Interactive Map')) {
  detailedInfo = `A multilingual interactive web platform commemorating Jewish soldiers who served in World War II , built for the Musuem of the Jewish Soldiers in World War II.
Features include:
• Interactive Map with MapLibre and GeoJSON
• MapTiler for map tiles
• 30,000+ soldiers data
• Timeline-based navigation and historical event visualization
• Bilingual UI (Hebrew and English) with flag-based filtering
• Soldier profiles, event details, and country-based search
• AI enrichment (Gemini API) features for text and metadata
• Built with Django, PostgreSQL, JavaScript, HTML/CSS

Technologies: Django, PostgreSQL, MapLibre, MapTiler, JavaScript, HTML/CSS, Gemini API, GeoJSON`;
  } else if (project.name.includes('Django Blog')) {
    detailedInfo = `A feature-rich blog platform developed with Django framework. Features include:
• User authentication and role-based permissions
• Content management with rich text editing
• Bookmark functionality for saving favorite posts
• Comment system with moderation tools
• Responsive design for mobile and desktop views

Technologies used: Django, Python, SQLite, HTML/CSS`;
  } else if (project.name.includes('DevOps Blog')) {
    detailedInfo = `A Flask-based blog platform with administrator privileges. Features include:
• First registered user automatically gains admin permissions
• Full CRUD operations for content management
• User authentication and session handling
• Comment system with threading support
• Mobile-responsive design

Technologies used: Flask, Python, SQLite, Bootstrap`;
  } else if (project.name.includes('Client-Server')) {
    detailedInfo = `A multi-threaded network system implemented in C++. Features include:
• Concurrent connection handling with thread pooling
• TCP/IP socket communication
• Multi-threading
• BFS algorithm for pathfinding
• Request caching for improved performance
• Efficient graph pathfinding algorithm implementation

Technologies used: C++, Socket Programming, BFS Algorithm, Caching, Multi-threading`;
  } else if (project.name.includes('Shemaython')) {
    detailedInfo = `A custom programming language interpreter built from scratch. Features include:
• Lexical analysis and parsing of custom syntax
• Syntactic analysis and semantic analysis
• Support for variables, loops, conditionals, and functions
• String manipulation and arithmetic operations
• Error handling with informative messages
• Interactive command-line environment



Technologies used: Python, Abstract Syntax Trees, Interpreter Design Patterns, Parsing, Lexical Analysis, Syntactic Analysis, Testing, Debugging`;


} else if (project.name.includes('Password Manager')) {
  detailedInfo = `A secure password management application built with Python. Features include:
• AES-256 encryption for storing sensitive credentials
• Random secure password generation with customizable parameters
• Local storage with encrypted backup functionality
• Command-line interface with intuitive navigation
• Protection against brute force attacks

Technologies used: Python, Cryptography libraries, SQLite for local storage`;
}
  else {
    // Generic detailed description for other projects
    detailedInfo = `${project.description}\n\nThis project demonstrates Nir's skills in software development and problem-solving.`;
  }
  
  return detailedInfo;
}

// ----- TERMINAL COMMANDS -----

// Terminal commands and responses
const responses = {
  greeting: "Welcome to Nir's Terminal'\n$ Type 'help' to see available commands.",
  about: `$ cat about.txt\n${knowledgeBase.about}\n\nTip: You can ask me any question about Nir's experience or projects in natural language!`,
  skills: `Nir's technical skills:\n\n${knowledgeBase.skills.map(skill => `• ${skill}`).join('\n')}`,
  certifications: `Nir's certifications:\n\n${knowledgeBase.certifications.map(cert => `• ${cert}`).join('\n')}`,
  education: `Education:\n\n${knowledgeBase.education}`,
  experience: `Work Experience:\n\n${knowledgeBase.experience.map(exp => `• ${exp}`).join('\n')}`,
  projects: `Nir's portfolio projects:\n\n${knowledgeBase.projects.map(p => `• ${p.name} - ${p.description}`).join('\n')}\n\nTip: Use "cd projects" then "cd [project-name]" to see project details.`,
  contact: `Contact Information:\n\n${knowledgeBase.contact}`,
  military: `Military Service:\n\n${knowledgeBase.experience.find(e => e.includes("Medic"))}`,
  languages: `Languages:\n\n${knowledgeBase.languages.map(lang => `• ${lang}`).join('\n')}`,
  clear: "Terminal cleared. Ready for new commands.",
  
  // ls command
  ls: function(args = '') {
    if (args.includes('-la') || args.includes('-l')) {
      if (fileSystem[currentDirectory] && fileSystem[currentDirectory].type === 'dir') {
        const files = fileSystem[currentDirectory].contents;
        if (files.length === 0) return "total 0";
        
        return `total ${files.length}\ndrwxr-xr-x  2 nir  nir  4096 Jun 15 10:30 .\ndrwxr-xr-x  5 nir  nir  4096 Jun 15 10:30 ..\n` + 
          files.map(f => {
            const path = currentDirectory + '/' + f;
            const isDir = fileSystem[path] && fileSystem[path].type === 'dir';
            return `${isDir ? 'd' : '-'}rwxr-xr-x  1 nir  nir  ${Math.floor(Math.random() * 10000)}  Jun 15 10:30 ${f}`;
          }).join('\n');
      }
      return "ls: cannot access '" + currentDirectory + "': No such file or directory";
    } else {
      if (fileSystem[currentDirectory] && fileSystem[currentDirectory].type === 'dir') {
        // Special formatting for skills directory
        if (currentDirectory === '/home/nir/skills') {
          return fileSystem[currentDirectory].contents.map((f, index) => {
            return `• ${f}`;
          }).join('\n');
        }
        
        // Special formatting for home directory
        if (currentDirectory === '/home/nir') {
          const contents = fileSystem[currentDirectory].contents.map(f => {
            const path = currentDirectory + '/' + f;
            const isDir = fileSystem[path] && fileSystem[path].type === 'dir';
            return isDir ? f + '/' : f;
          }).join('  ');
          
          return `${contents}\n\n📁 Available directories:\n• projects/ - View my portfolio projects\n• skills/ - See my technical skills\n• about.txt - Read about me\n\n Tip: Try: cd projects or cd skills or cat about.txt`;
        }
        
        // Format display to show directories with trailing slash
        return fileSystem[currentDirectory].contents.map(f => {
          const path = currentDirectory + '/' + f;
          const isDir = fileSystem[path] && fileSystem[path].type === 'dir';
          return isDir ? f + '/' : f;
        }).join('  ');
      }
      return "ls: cannot access '" + currentDirectory + "': No such file or directory";
    }
  },
  
  // cd command
  cd: function(args = '') {
    if (!args) {
      currentDirectory = '/home/nir';
      return `Changed to: ${currentDirectory}`; // Give feedback about the new directory
    }
    
    // Handle 'cd all' command to show all projects
    if (args === 'all') {
      if (currentDirectory === '/home/nir/projects') {
        let allProjectsInfo = 'All Projects:\n\n';
        
        knowledgeBase.projects.forEach((project, index) => {
          const detailedInfo = getProjectDetails(project);
          allProjectsInfo += `=== ${index + 1}. ${project.name} ===\n`;
          allProjectsInfo += `${detailedInfo}\n\n`;
        });
        
        return allProjectsInfo;
      } else {
        return 'cd all: Command only works in /home/nir/projects directory. Use "cd projects" first.';
      }
    }
    
    // Handle relative paths
    let targetPath = args;
    if (args.startsWith('/')) {
      // Absolute path
      targetPath = args;
    } else if (args === '..') {
      // Move up one directory
      const parts = currentDirectory.split('/').filter(p => p); // Remove empty parts
      if (parts.length > 0) {
        parts.pop(); // Remove last part
        targetPath = '/' + parts.join('/'); // Join remaining parts
        if (targetPath === '') targetPath = '/'; // Handle root case
      } else {
        targetPath = '/';
      }
    } else if (args === '.') {
      // Stay in current directory
      return `Current directory: ${currentDirectory}`;
    } else if (args === '~' || args === '~/') {
      // Home directory
      targetPath = '/home/nir';
    } else if (args.startsWith('~/')) {
      // Path relative to home
      targetPath = '/home/nir/' + args.substring(2);
    } else {
      // Path relative to current
      targetPath = (currentDirectory === '/' ? '' : currentDirectory) + '/' + args;
    }
    
    // Normalize path (remove double slashes)
    targetPath = targetPath.replace(/\/+/g, '/');
    
    // Check if the target exists and is a directory
    if (fileSystem[targetPath] && fileSystem[targetPath].type === 'dir') {
      currentDirectory = targetPath;
      
      // Check if this is a project directory and display project info
      if (targetPath.includes('/projects/') && fileSystem[targetPath].projectData) {
        const project = fileSystem[targetPath].projectData;
        
        // Create a more detailed description based on the project type
        let detailedInfo = getProjectDetails(project);
        
        return `Project: ${project.name}\n\n${detailedInfo}\n\nCurrent directory: ${currentDirectory}`;
      }
      
      // Add helpful instructions when entering projects directory
      if (targetPath === '/home/nir/projects') {
        return `Changed to: ${currentDirectory}\n\n📁 Available commands:\n• ls - List all projects\n• cd all - Show all projects with details\n• cd [project-name] - View specific project\n\n💡 Tip: Try "cd all" to see all projects at once!`;
      }
      
      // Add helpful instructions when entering skills directory
      if (targetPath === '/home/nir/skills') {
        return `Changed to: ${currentDirectory}\n\n💻 Available commands:\n• ls - List all skills\n• cd .. - Return to home directory\n\n💡 Tip: Try "ls" to see all available skills!`;
      }
      
      return `Changed to: ${currentDirectory}`; // Give feedback about the new directory
    }
    
    // Check if user is trying to cd into a project file (without proper path)
    if (currentDirectory === '/home/nir/projects') {
      // Check if they're trying to access a .md file directly
      const projectName = args.replace(/\.md$/, ''); // Remove .md extension if present
      const dirPath = currentDirectory + '/' + projectName;
      
      if (fileSystem[dirPath] && fileSystem[dirPath].type === 'dir') {
        currentDirectory = dirPath;
        const project = fileSystem[dirPath].projectData;
        
        // Create a more detailed description based on the project type
        let detailedInfo = getProjectDetails(project);
        
        return `Project: ${project.name}\n\n${detailedInfo}\n\nCurrent directory: ${currentDirectory}`;
      }
    }
    
    return `cd: ${args}: No such file or directory`;
  },
  
  // Other terminal commands
  pwd: function() {
    return currentDirectory;
  },
  cat: function(args = '') {
    if (!args) {
      return "cat: missing file operand";
    }
    
    // Handle absolute and relative paths
    let filePath;
    if (args.startsWith('/')) {
      filePath = args;
    } else if (args.startsWith('~/')) {
      filePath = '/home/nir/' + args.substring(2);
    } else {
      filePath = currentDirectory + '/' + args;
    }
    
    // Normalize path
    filePath = filePath.replace(/\/+/g, '/');
    
    // Check if file exists and is not hidden
    if (fileSystem[filePath] && fileSystem[filePath].type === 'file' && !fileSystem[filePath].hidden) {
      return fileSystem[filePath].content;
    }
    
    return `cat: ${args}: No such file or directory`;
  },
  date: () => `Current time: ${new Date().toLocaleString()}`,
  whoami: "nir",
  
  // Help command
  help: `Available commands:
------------------
skills       View Nir's technical skills
projects     View Nir's portfolio projects 
experience   View Nir's work experience
education    View Nir's academic background
about        Learn about Nir
contact      Get contact information
certifications  View Nir's certifications
languages    View languages Nir speaks

Terminal commands:
------------------
ls           List files in current directory (try ls -la for more details)
pwd          Print working directory
cd [dir]     Change directory (try cd projects)
cat [file]   Display file contents (try cat about.txt)
date         Display current date and time
clear        Clear terminal screen
whoami       Display current user

Project navigation:
------------------
cd projects                   Go to projects directory (then use commands below)
cd all                        Show all projects with detailed information
cd [project-name]             View specific project (e.g., cd portfolio-with-ai-chatbot)
ls                            List available projects
cd ..                         Return to previous directory

💡 Quick start: cd projects → cd all (to see everything!)

Free questions:
------------------
You can also ask me any question in natural language, for example:
"Tell me about your python experience"
"What projects have you worked on?"
"Tell me about this portfolio project"
"Do you have experience with Docker?"
"What are your strongest skills?"`,

  // Fallback response
  default: "Command not recognized. Type 'help' to see available commands."
};

// ----- UI FUNCTIONS -----

// Function to add message to chat
function addMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}-message`;
  messageDiv.textContent = text;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to add a typewriter effect for terminal-like output
function addTypewriterMessage(text, sender, speed = 15) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}-message`;
  chatMessages.appendChild(messageDiv);
  
  let i = 0;
  const typeWriter = () => {
    if (i < text.length) {
      messageDiv.textContent += text.charAt(i);
      i++;
      chatMessages.scrollTop = chatMessages.scrollHeight;
      setTimeout(typeWriter, speed);
    }
  };
  
  typeWriter();
}

// Function to show typing indicator
function showTypingIndicator() {
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'message bot-message typing';
  typingIndicator.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
  chatMessages.appendChild(typingIndicator);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return typingIndicator;
}

// Function to disable input during AI thinking
function disableInput() {
  isAIThinking = true;
  userInput.disabled = true;
  sendButton.disabled = true;
  userInput.placeholder = 'AI is thinking...';
  userInput.style.opacity = '0.6';
  sendButton.style.opacity = '0.6';
}

// Function to enable input after AI response
function enableInput() {
  isAIThinking = false;
  userInput.disabled = false;
  sendButton.disabled = false;
  userInput.placeholder = 'Type your message...';
  userInput.style.opacity = '1';
  sendButton.style.opacity = '1';
}

// ----- MESSAGE HANDLING -----

// Function to handle user input
async function handleUserInput() {
  const message = userInput.value.trim();
  if (!message) return;

  // Check if AI is already thinking
  if (isAIThinking) {
    return; // Don't allow new messages while AI is thinking
  }

  // Add user message to chat
  addMessage(message, 'user');
  userInput.value = '';

  // Handle simple terminal commands locally for faster response
  const lowerMessage = message.toLowerCase();
  let localResponse = null;

  // Check for terminal commands
  if (lowerMessage === 'clear') {
    // Clear the chat
    while (chatMessages.firstChild) {
      chatMessages.removeChild(chatMessages.firstChild);
    }
    addMessage(responses.clear, 'bot');
    return;
  } else if (lowerMessage === 'help') {
    localResponse = responses.help;
  } else if (lowerMessage === 'ls') {
    localResponse = responses.ls('');
  } else if (lowerMessage.startsWith('ls ')) {
    const args = message.substring(3);
    localResponse = responses.ls(args);
  } else if (lowerMessage === 'pwd') {
    localResponse = responses.pwd();
  } else if (lowerMessage === 'whoami') {
    localResponse = responses.whoami;
  } else if (lowerMessage === 'date') {
    localResponse = responses.date();
  } else if (lowerMessage === 'cd') {
    localResponse = responses.cd('');
  } else if (lowerMessage === 'cd ..') {
    localResponse = responses.cd('..');
  } else if (lowerMessage.startsWith('cd ')) {
    const args = message.substring(3);
    localResponse = responses.cd(args);
  } else if (lowerMessage === 'skills') {
    localResponse = responses.skills;
  } else if (lowerMessage === 'projects') {
    localResponse = responses.projects;
  } else if (lowerMessage === 'experience') {
    localResponse = responses.experience;
  } else if (lowerMessage === 'education') {
    localResponse = responses.education;
  } else if (lowerMessage === 'about') {
    localResponse = responses.about;
  } else if (lowerMessage === 'contact') {
    localResponse = responses.contact;
  } else if (lowerMessage === 'certifications') {
    localResponse = responses.certifications;
  } else if (lowerMessage === 'languages') {
    localResponse = responses.languages;
  } else if (lowerMessage === 'military') {
    localResponse = responses.military;
  } else if (lowerMessage === 'cat ') {
    const args = message.substring(4);
    localResponse = responses.cat(args);
  } else if (lowerMessage.startsWith('cat ')) {
    const args = message.substring(4);
    localResponse = responses.cat(args);
  } else if (lowerMessage.includes("portfolio project") || 
             lowerMessage.includes("this website") ||
             lowerMessage.includes("this project") ||
             (lowerMessage.includes("portfolio") && lowerMessage.includes("chatbot")) ||
             lowerMessage.includes("portfolio with ai")) {
    
    const info = projectKnowledge.portfolio;
    localResponse = `Project: ${info.name}
    
Description: ${info.description}

Technologies: ${info.technologies.join(", ")}

Features:
- ${info.features.join("\n- ")}

Challenges: ${info.challenges}

What I learned: ${info.learned}`;
  }

  // If we have a local response, display it and return
  if (localResponse) {
    addMessage(localResponse, 'bot');
    
    // Update conversation history
    conversationHistory.push(
      { role: 'user', content: message },
      { role: 'assistant', content: localResponse }
    );
    
    // Keep only the last 10 messages in history
    if (conversationHistory.length > 10) {
      conversationHistory = conversationHistory.slice(conversationHistory.length - 10);
    }
    
    // Focus input field after response
    userInput.focus();
    return;
  }

  // Disable input before making API call
  disableInput();

  // Always try to connect to the AI server - no local mode check

  // Show typing indicator for API responses
  const typingIndicator = showTypingIndicator();

  try {
    console.log(`Debug: Sending message to ${API_URL}`);
    console.log("Debug: Sending history:", conversationHistory);
    
    // Add a small delay to show the typing animation
    await new Promise(resolve => setTimeout(resolve, 300));
    
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
          
          response = await fetch('http://localhost:8001/api/chat', {
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
      
      // Enable input after error
      enableInput();
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
    
    // Enable input after successful response
    enableInput();

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
    
    // Enable input after error
    enableInput();
  } finally {
    // Always focus the input field after a message is sent
    userInput.focus();
    
    // For mobile: scroll to the terminal if it's not visible
    if (window.innerWidth <= 768) {
      const terminalSection = document.getElementById('terminal');
      if (terminalSection) {
        terminalSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}

// ----- INITIALIZATION -----

// Lazy load terminal when it comes into view
function initializeLazyLoading() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !terminalInitialized) {
        const terminalSection = document.getElementById('terminal');
        if (terminalSection) {
          console.log('Terminal in view, initializing...');
          initializeTerminalElements(); // Setup elements
          setTimeout(() => {
            initializeTerminal(); // Start boot sequence
          }, 300);
          terminalInitialized = true;
          observer.unobserve(entry.target);
        }
      }
    });
  }, {
    rootMargin: '0px 0px 100px 0px',
    threshold: 0.1
  });

  const terminalSection = document.getElementById('terminal');
  if (terminalSection) {
    observer.observe(terminalSection);
  }
}

// Initialize terminal elements
function initializeTerminalElements() {
  chatMessages = document.querySelector('.chatbot-messages');
  userInput = document.getElementById('user-input');
  sendButton = document.getElementById('send-button');
  closeChatbot = document.querySelector('.close-chatbot');

  closeChatbot.addEventListener('click', () => {
    while (chatMessages.firstChild) {
      chatMessages.removeChild(chatMessages.firstChild);
    }
    conversationHistory = [];
  });

  sendButton.addEventListener('click', handleUserInput);

  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserInput();
    }
  });

  const terminalSection = document.getElementById('terminal');
  if (terminalSection) {
    terminalSection.addEventListener('click', () => {
      setTimeout(() => userInput.focus(), 50);
    });
  }

  if (chatMessages) {
    chatMessages.addEventListener('click', () => {
      setTimeout(() => userInput.focus(), 50);
    });
  }
}

// Function to initialize terminal with boot sequence
function initializeTerminal() {
  // Boot sequence messages
  const bootMessages = [
    "Welcome to Nir's interactive terminal!",
    "Type 'help' for commands or ask me any question about Nir.",
    "Tip: Try: 'ls' to see all available directories"
  ];
  
  // Display boot sequence with delays
  let delay = 0;
  bootMessages.forEach((msg, index) => {
    setTimeout(() => {
      if (index < bootMessages.length - 1) {
        addMessage(msg, 'bot');
      } else {
        // Use typewriter effect for the last message
        addTypewriterMessage(msg, 'bot', 20);
        
        // Focus input when boot sequence is complete
        setTimeout(() => bootMessages[index].length * 20 + 100);
      }
    }, delay);
    
    // Increase delay for each message
    delay += (index === 0) ? 0 : 300;
  });
}

// Function to add "Nir Terminal" to navigation
function addTerminalToNavigation() {
  // Function is now disabled since the link is already in HTML
  // Keeping the function for compatibility but it doesn't add anything new
  console.log('Terminal link already exists in navigation');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize lazy loading without adding terminal link
  initializeLazyLoading();
});
