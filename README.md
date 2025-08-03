# Nir Ohayon - Portfolio Website

A modern, interactive portfolio website featuring an AI-powered chatbot terminal. Built with FastAPI, HTML, CSS, and JavaScript.

## 🌟 Features

### **Interactive AI Chatbot**
- **Terminal-style interface** with Linux-like commands
- **Natural language processing** for questions about skills and experience
- **Real-time responses** powered by OpenAI API
- **Command system** including `cd`, `ls`, `cat`, `help`, and more

### **Responsive Design**
- **Mobile-first approach** with touch-friendly interface
- **Dark/Light mode toggle** for better user experience
- **Smooth animations** and transitions
- **Cross-browser compatibility**

### **Project Showcase**
- **Interactive project cards** with hover effects
- **Mobile-optimized** "Read More" buttons for project details
- **Technology tags** for each project
- **Direct links** to live demos and GitHub repositories

### **Skills Visualization**
- **Organized skill categories** (Programming Languages, Web Development, etc.)
- **Interactive skill display** with icons and descriptions
- **Responsive grid layout** for all screen sizes

## 🚀 Live Demo

**Website:** [https://nir-ohayon.onrender.com](https://nir-ohayon.onrender.com)

## 🛠️ Technology Stack

### **Backend**
- **FastAPI** - Modern Python web framework
- **OpenAI API** - AI-powered chatbot responses
- **Uvicorn** - ASGI server
- **Python-dotenv** - Environment variable management

### **Frontend**
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript (ES6+)** - Interactive functionality
- **Typed.js** - Animated typing effects
- **Particles.js** - Background particle animations

### **Deployment**
- **Render** - Cloud hosting platform
- **Git** - Version control
- **GitHub** - Code repository

## 📁 Project Structure

```
nir-portfolio/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   └── main.py          # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── .env                # Environment variables
├── frontend/
│   └── static/
│       ├── index.html      # Main HTML file
│       ├── css/
│       │   └── styles.css  # Main stylesheet
│       ├── js/
│       │   ├── script.js   # Main JavaScript
│       │   └── chatbot.js  # AI chatbot logic
│       └── images/         # Project images
├── start.py               # Render deployment entry point
├── build.sh              # Build script for Render
└── requirements.txt      # Root dependencies
```

## 🚀 Project Overview

### **What This Portfolio Does**

This is a **personal portfolio website** that showcases my skills, projects, and experience in an interactive way. The main feature is an **AI-powered chatbot** that works like a terminal, allowing visitors to explore my background through natural conversation or Linux-like commands.

### **Key Features Explained**

#### **🤖 AI Chatbot Terminal**
- **Interactive Terminal Interface**: Visitors can type commands like `cd projects`, `ls`, or `cat about.txt` to navigate through my information
- **Natural Language Processing**: Users can ask questions like "Tell me about your Python experience" and get intelligent responses
- **Real-time AI Responses**: Powered by OpenAI's GPT model, providing contextual and helpful information about my skills and projects
- **Command System**: Includes familiar terminal commands like `help`, `pwd`, `whoami`, `date`, and `clear`

#### **📱 Mobile-First Design**
- **Responsive Layout**: Works perfectly on phones, tablets, and desktops
- **Touch-Friendly Interface**: Large buttons and easy navigation for mobile users
- **"Read More" Buttons**: On mobile, project cards have expandable descriptions
- **Hamburger Menu**: Collapsible navigation for smaller screens

#### **🎨 Modern UI/UX**
- **Dark/Light Mode**: Toggle between themes for better user experience
- **Smooth Animations**: Typed.js for animated text, particles.js for background effects
- **Interactive Elements**: Hover effects, transitions, and engaging visual feedback
- **Professional Design**: Clean, modern aesthetic that reflects my attention to detail

#### **📊 Project Showcase**
- **Interactive Cards**: Each project has hover effects and detailed descriptions
- **Technology Tags**: Clear display of technologies used in each project
- **Direct Links**: Easy access to live demos and GitHub repositories
- **Mobile Optimization**: Special handling for project details on mobile devices

### **Technical Architecture**

#### **Backend (FastAPI)**
- **Modern Python Framework**: FastAPI provides high performance and automatic API documentation
- **OpenAI Integration**: Seamless connection to GPT models for intelligent responses
- **Static File Serving**: Efficient delivery of HTML, CSS, and JavaScript files
- **CORS Support**: Cross-origin requests enabled for development flexibility
- **Environment Management**: Secure handling of API keys and configuration

#### **Frontend (HTML/CSS/JavaScript)**
- **Semantic HTML5**: Proper structure and accessibility
- **Modern CSS3**: Flexbox, Grid, animations, and responsive design
- **Vanilla JavaScript**: No frameworks - pure, efficient code
- **External Libraries**: Typed.js for animations, particles.js for effects

#### **Deployment (Render)**
- **Cloud Hosting**: Reliable, scalable hosting on Render platform
- **Automatic Deployments**: Git-based deployment with automatic updates
- **Environment Variables**: Secure configuration management
- **Build Process**: Automated setup and dependency installation

### **User Experience Flow**

1. **Landing Page**: Visitors see an animated introduction with my name and background
2. **Navigation**: Easy access to different sections (About, Projects, Skills, Contact)
3. **AI Terminal**: Interactive chatbot where users can explore my information
4. **Project Exploration**: Detailed project cards with technology stacks and links
5. **Skills Display**: Organized skill categories with visual icons
6. **Contact Options**: Multiple ways to get in touch (email, LinkedIn, GitHub)

### **AI Chatbot Capabilities**

#### **Terminal Commands**
- `help` - Shows all available commands and features
- `ls` - Lists files and directories in current location
- `cd projects` - Navigate to projects directory
- `cd all` - View all projects with detailed descriptions
- `cd skills` - Explore technical skills
- `cat about.txt` - Read my personal background
- `pwd` - Show current directory location
- `whoami` - Display user information
- `date` - Show current date and time
- `clear` - Clear terminal screen

#### **Natural Language Queries**
- "Tell me about your Python experience"
- "What projects have you built?"
- "What are your strongest skills?"
- "Tell me about this portfolio project"
- "Do you have experience with Docker?"
- "What's your educational background?"

### **Mobile-Specific Features**

- **Touch-Optimized**: Large buttons and easy-to-tap elements
- **Read More Buttons**: Expandable project descriptions on mobile
- **Responsive Navigation**: Collapsible menu for smaller screens
- **Optimized Layout**: Content adjusts perfectly to any screen size
- **Performance**: Fast loading and smooth interactions

### **Design Philosophy**

- **User-Centric**: Every feature designed with user experience in mind
- **Professional**: Clean, modern design that reflects my work quality
- **Accessible**: Proper contrast, readable fonts, and keyboard navigation
- **Interactive**: Engaging elements that encourage exploration
- **Responsive**: Works perfectly on all devices and screen sizes

## 🤖 AI Chatbot Commands

### **Terminal Commands**
- `help` - Show available commands
- `ls` - List files in current directory
- `pwd` - Print working directory
- `cd [directory]` - Change directory
- `cat [file]` - Display file contents
- `whoami` - Show current user
- `date` - Show current date/time
- `clear` - Clear terminal

### **Navigation Commands**
- `cd projects` - Go to projects directory
- `cd all` - Show all projects with details
- `cd skills` - Go to skills directory
- `cat about.txt` - Read about Nir

### **Natural Language**
Ask questions like:
- "Tell me about your Python experience"
- "What projects have you built?"
- "What are your strongest skills?"
- "Tell me about this portfolio project"

## 📱 Mobile Features

- **Touch-friendly interface** with large buttons
- **"Read More" buttons** for project details on mobile
- **Responsive navigation** with hamburger menu
- **Optimized layout** for all screen sizes

## 🎨 Design Features

- **Dark/Light mode** toggle
- **Smooth animations** and transitions
- **Particle background** effects
- **Typed.js animations** for dynamic text
- **Hover effects** and interactive elements

## 🔧 Configuration

### **Environment Variables**
- `OPENAI_API_KEY`: Required for AI chatbot functionality
- `ADMIN_TOKEN`: For admin access to usage statistics

### **Customization**
- Update project information in `frontend/static/index.html`
- Modify AI responses in `frontend/static/js/chatbot.js`
- Customize styling in `frontend/static/css/styles.css`

## 📊 API Endpoints

- `GET /` - Serve main website
- `POST /api/chat` - AI chatbot endpoint
- `GET /api/usage` - Usage statistics (admin only)

## 👨‍💻 About the Developer

**Nir Ohayon** is a passionate backend developer and Computer Science graduate with expertise in Python, Django, FastAPI, and modern web technologies. This portfolio showcases his skills, projects, and experience in building scalable web applications.

### **Contact**
- **Email:** nir41415511@gmail.com
- **LinkedIn:** [linkedin.com/in/python-fighter](https://linkedin.com/in/python-fighter)
- **GitHub:** [github.com/Nir41415533](https://github.com/Nir41415533)

---

⭐ **Star this repository if you found it helpful!** 