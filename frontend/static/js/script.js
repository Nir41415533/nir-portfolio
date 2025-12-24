// Check if typed is already defined
if (typeof typed === 'undefined') {
    // Initialize Typed.js
    const typed = new Typed("#typed-title", {
        strings: [
            "Nir Ohayon",
        // שילוב הטייטל הנוכחי שלך עם השאיפות
        // הדגשת הסטאק החזק ביותר שלך (מה שיש לך ניסיון מוכח בו)
        "React Native ,JavaScript ,Python",
        // הדגשת הניסיון המיוחד שלך באינטגרציות AI
        // התואר וההישגים
        "B.Sc. Computer Science Graduate ",
        "Full Stack and a Mobile Developer",
    
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

// Initialize theme on page load
document.addEventListener("DOMContentLoaded", initializeTheme); 