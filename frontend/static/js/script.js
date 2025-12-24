// Check if typed is already defined
if (typeof typed === 'undefined') {
    // Initialize Typed.js
    const typed = new Typed("#typed-title", {
        strings: [
            "Nir Ohayon",
        // שילוב הטייטל הנוכחי שלך עם השאיפות
        "Full Stack & Mobile Developer",
        // הדגשת הסטאק החזק ביותר שלך (מה שיש לך ניסיון מוכח בו)
        "React Native • Python • Django",
        // הדגשת הניסיון המיוחד שלך באינטגרציות AI
        "Building AI-Powered Applications",
        // התואר וההישגים
        "B.Sc. Computer Science Graduate (GPA 88)",
        // כלי ה-DevOps שציינת בקו"ח
        "Linux • Docker • Git • CI/CD",
        // במקום "לומד מהר", משהו שמעיד על תשוקה לטכנולוגיה ופתרון בעיות
        "Turning Coffee into Clean Code ☕",
        ],
        typeSpeed: 50,
        backSpeed: 30,
        loop: true,
        backDelay: 2000,
        showCursor: true,
        cursorChar: "|"
    });
}

// Initialize Particles.js
if (typeof particlesJS === 'function') {
    particlesJS("particles-js", {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.4,
                width: 1,
            },
            move: { enable: true, speed: 2, direction: "none", random: false },
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" },
                resize: true,
            },
            modes: {
                repulse: { distance: 100, duration: 0.4 },
                push: { particles_nb: 4 },
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

// Intersection Observer for fade-in animations
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
            }
        });
    },
    { threshold: 0.1 }
);

// Apply observer to elements
document.querySelectorAll(".project, .skill, .section-title").forEach((el) => {
    observer.observe(el);
});

// Initialize theme on page load
document.addEventListener("DOMContentLoaded", initializeTheme); 