// Check if typed is already defined
if (typeof typed === 'undefined') {
    // Initialize Typed.js
    const typed = new Typed("#typed-title", {
        strings: [
            "Nir Ohayon",
        // שילוב הטייטל הנוכחי שלך עם השאיפות
        // הדגשת הסטאק החזק ביותר שלך (מה שיש לך ניסיון מוכח בו)
        "Mobile and Full Stack Developer",
        // הדגשת הניסיון המיוחד שלך באינטגרציות AI
        // התואר וההישגים
        "Computer Science Graduate",
        "Strong Problem Solving Abilities",
        


        
    
        // במקום "לומד מהר", משהו שמעיד על תשוקה לטכנולוגיה ופתרון בעיות

    
        ],
        typeSpeed: 50,
        backSpeed: 30,
        loop: true,
        backDelay: 2000,
        showCursor: true,
        cursorChar: "|"
    });
}

// Initialize Particles.js with responsive settings
if (typeof particlesJS === 'function') {
    const isMobile = window.innerWidth <= 768;
    
    particlesJS("particles-js", {
        particles: {
            number: { 
                value: isMobile ? 40 : 80, // Less particles on mobile for better performance
                density: { enable: true, value_area: 800 } 
            },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: isMobile ? 0.3 : 0.5, random: true },
            size: { value: isMobile ? 2 : 3, random: true },
            line_linked: {
                enable: true,
                distance: isMobile ? 100 : 150,
                color: "#ffffff",
                opacity: isMobile ? 0.2 : 0.4,
                width: 1,
            },
            move: { 
                enable: true, 
                speed: isMobile ? 1 : 2, 
                direction: "none", 
                random: false 
            },
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: !isMobile, mode: "repulse" }, // Disable hover on mobile
                onclick: { enable: true, mode: "push" },
                resize: true,
            },
            modes: {
                repulse: { distance: 100, duration: 0.4 },
                push: { particles_nb: isMobile ? 2 : 4 },
            },
        },
        retina_detect: true,
    });
}

// Theme toggle functionality
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector(".theme-toggle");
    const isDark = body.classList.toggle("dark-mode");
    
    // Update theme attribute for CSS variables
    body.setAttribute("data-theme", isDark ? "dark" : "light");
    
    // Update theme toggle icon
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    
    // Save theme preference
    localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Initialize theme from localStorage
function initializeTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        document.body.setAttribute("data-theme", "dark");
        document.querySelector(".theme-toggle").textContent = "☀️";
    }
}

// Mobile menu toggle
function toggleMenu() {
    const navLinks = document.getElementById("nav-links");
    navLinks.classList.toggle("open");
}

// Close mobile menu when clicking a link
document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        document.getElementById("nav-links").classList.remove("open");
    });
});

// Enhanced Intersection Observer for scroll animations
const scrollObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Optional: unobserve after animation to improve performance
                // scrollObserver.unobserve(entry.target);
            }
        });
    },
    { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger animation slightly before element is fully visible
    }
);

// Add staggered animation delays to children
function addStaggeredAnimation(parentSelector, childSelector, baseDelay = 0.1) {
    const parents = document.querySelectorAll(parentSelector);
    parents.forEach(parent => {
        const children = parent.querySelectorAll(childSelector);
        children.forEach((child, index) => {
            child.style.transitionDelay = `${index * baseDelay}s`;
        });
    });
}

// Apply animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add scroll animation classes to elements with zoom effect
    document.querySelectorAll('.project').forEach((el, index) => {
        el.classList.add('scroll-bounce'); // אפקט הקפצה דרמטי
        el.style.transitionDelay = `${index * 0.15}s`;
        scrollObserver.observe(el);
    });
    
    document.querySelectorAll('.skill').forEach((el, index) => {
        el.classList.add('scroll-scale'); // אפקט זום
        el.style.transitionDelay = `${index * 0.05}s`;
        scrollObserver.observe(el);
    });
    
    document.querySelectorAll('.contact-card').forEach((el, index) => {
        el.classList.add('scroll-bounce'); // אפקט הקפצה
        el.style.transitionDelay = `${index * 0.2}s`;
        scrollObserver.observe(el);
    });

    document.querySelectorAll('.section-title').forEach((el) => {
        el.classList.add('scroll-scale'); // כותרות עם זום
        scrollObserver.observe(el);
    });
    
    // Observe about section elements
    const aboutContainer = document.querySelector('.about-container');
    if (aboutContainer) {
        aboutContainer.classList.add('scroll-animate');
        scrollObserver.observe(aboutContainer);
    }
    
    // Profile photo with special zoom
    const profilePhoto = document.querySelector('.profile-photo');
    if (profilePhoto) {
        profilePhoto.classList.add('scroll-bounce');
        scrollObserver.observe(profilePhoto);
    }
});

// Navbar scroll effect and active section highlighting
let lastScroll = 0;
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    const currentScroll = window.pageYOffset;
    
    // Add shadow effect when scrolled
    if (currentScroll > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    // Highlight active section in navbar
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        // Check if we're in this section (with offset for navbar)
        if (currentScroll >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });
    
    // Remove active class from all links and add to current
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    lastScroll = currentScroll;
});

// Smooth scroll with offset for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // 80px offset for navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Project Modal Functionality
const projectsData = {
  'wwii-map': {
    title: 'Interactive WWII Map & Timeline',
    image: 'images/WW2_image.png',
    tags: ['Django', 'JavaScript', 'PostgreSQL', 'MapLibre', 'MapTiler', 'Gemini API'],
    description: `
      <p><strong>🏆 Awarded Dean's Honor Project</strong></p>
      <p>Developed a comprehensive full-stack bilingual web platform for the Jewish Soldier Museum, designed to honor and preserve the history of Jewish soldiers who served in World War II.</p>
      
      <h3 style="color: var(--primary-color); margin-top: 20px;">Key Features:</h3>
      <ul style="line-height: 2;">
        <li><strong>Massive Dataset Management:</strong> Managing over 34,000 structured historical records with optimized multilingual search capabilities (Hebrew & English)</li>
        <li><strong>Interactive Mapping:</strong> Designed dynamic map layers using MapLibre and MapTiler with real-time rendering and smooth transitions</li>
        <li><strong>AI Integration:</strong> Integrated Gemini API to enrich historical records with AI-generated insights and contextual information</li>
        <li><strong>Advanced Features:</strong> Timeline navigation, country-based soldier grouping, spatial data filtering, and advanced search algorithms</li>
        <li><strong>Performance:</strong> Optimized database queries and implemented caching strategies for fast multilingual search across 34k+ records</li>
      </ul>
      
      <h3 style="color: var(--primary-color); margin-top: 20px;">Technical Stack:</h3>
      <ul style="line-height: 2;">
        <li><strong>Backend:</strong> Django (Python) with PostgreSQL database</li>
        <li><strong>Frontend:</strong> JavaScript, HTML5, CSS3</li>
        <li><strong>Mapping:</strong> MapLibre GL JS, MapTiler, GeoJSON</li>
        <li><strong>AI:</strong> Google Gemini API for content enrichment</li>
        <li><strong>Deployment:</strong> Docker, AWS</li>
      </ul>
      
      <p style="margin-top: 20px;"><strong>Current Status:</strong> Currently displayed at the Jewish Soldier Museum, serving as an educational tool for visitors.</p>
    `,
    link: 'https://drive.google.com/file/d/1OMX0xA1SwPvKojZ7UCjImVCnOtqHMref/view?usp=sharing'
  },
  'smart-chef-ai': {
    title: '👨‍🍳 Smart Chef AI',
    image: 'images/Smart-chef.jpeg',
    tags: ['React Native', 'Expo', 'JavaScript', 'Gemini API', 'Node.js', 'Computer Vision'],
    description: `
      <p><strong>Smart Chef AI is an innovative React Native application designed to solve the daily dilemma of "What should I eat?" by leveraging the power of Generative AI.</strong></p>
      
      <h3 style="color: var(--primary-color); margin-top: 20px;">🚀 Project Overview</h3>
      <p>The app serves as a smart kitchen assistant. Users simply take a picture of their available ingredients, and the system uses computer vision and AI (Gemini) to identify the items. After verifying the ingredients and selecting a desired culinary "vibe" (e.g., Healthy, Romantic, Comfort Food), the app generates custom-tailored recipes instantly.</p>
      
      <h3 style="color: var(--primary-color); margin-top: 20px;">✨ Key Features:</h3>
      <ul style="line-height: 2;">
        <li><strong>📸 AI Ingredient Recognition:</strong> Users can upload a photo or snap a picture of their fridge. The app analyzes the image to automatically detect and list available ingredients.</li>
        <li><strong>✅ Interactive Pantry Manager:</strong> A sleek, checklist-style interface (RTL supported) allows users to easily confirm, add, or remove ingredients before cooking.</li>
        <li><strong>🎨 Vibe-Based Cooking:</strong> Instead of generic filters, users select a cooking style based on their mood (e.g., Quick & Easy, Gourmet, Late Night Munchies).</li>
        <li><strong>🤖 Generative Recipe Engine:</strong> Utilizing advanced AI, the app creates unique, step-by-step recipes based only on the ingredients the user actually has.</li>
        <li><strong>📱 "Hype" UI/UX Design:</strong> Modern, high-energy aesthetic targeting Gen Z, utilizing Dark Mode with Vibrant Orange (#FF5500) accents, Glassmorphism effects, and smooth animations.</li>
      </ul>
      
      <h3 style="color: var(--primary-color); margin-top: 20px;">🛠️ Tech Stack:</h3>
      <ul style="line-height: 2;">
        <li><strong>Frontend:</strong> React Native (Expo)</li>
        <li><strong>Language:</strong> JavaScript</li>
        <li><strong>AI Integration:</strong> Google Gemini API (image recognition and recipe generation)</li>
        <li><strong>Styling:</strong> Custom StyleSheet with centralized Theme System</li>
        <li><strong>Animations:</strong> React Native Animated API for fluid transitions</li>
        <li><strong>Backend:</strong> Node.js proxy server for API security</li>
      </ul>
      
      <p style="margin-top: 20px;"><strong>🎯 Current Status:</strong> In active development. Recent updates include complete UI overhaul to "Hype" design language, asset optimization (PNG to JPG conversion), and smart checklist interaction for ingredient management.</p>
    `,
    link: 'https://drive.google.com/file/d/10G79xATkujdk2TPTTZAsN0fDHp9X-Ys-/view?usp=sharing'
  }
};

let currentProjectLink = ''; // Store current project link globally

function openProjectModal(projectId) {
  const modal = document.getElementById('project-modal');
  const project = projectsData[projectId];
  
  if (!project) return;
  
  // Store project link globally for image click
  currentProjectLink = project.link;
  
  // Update modal content
  document.getElementById('modal-title').textContent = project.title;
  document.getElementById('modal-image').src = project.image;
  document.getElementById('modal-image').alt = project.title;
  document.getElementById('modal-description').innerHTML = project.description;
  document.getElementById('modal-link').href = project.link;
  
  // Update tags
  const tagsContainer = document.getElementById('modal-tags');
  tagsContainer.innerHTML = '';
  project.tags.forEach(tag => {
    const tagElement = document.createElement('span');
    tagElement.className = 'modal-tag';
    tagElement.textContent = tag;
    tagsContainer.appendChild(tagElement);
  });
  
  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function openProjectLink() {
  if (currentProjectLink) {
    window.open(currentProjectLink, '_blank');
  }
}

function closeProjectModal(event) {
  const modal = document.getElementById('project-modal');
  
  // Close only if clicking on backdrop or close button
  if (!event || event.target === modal || event.type === 'click') {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProjectModal();
  }
});

// Initialize theme on page load
document.addEventListener("DOMContentLoaded", initializeTheme); 