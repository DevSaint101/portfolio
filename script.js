// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const contactForm = document.getElementById('contact-form');
const navLinks = document.querySelectorAll('.nav-link');

// Check if elements exist before adding event listeners
if (!navToggle || !navMenu || !themeToggle) {
    console.error('Required navigation elements not found');
}

// Theme Management
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize theme
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon();

// Theme toggle functionality
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        updateThemeIcon();
    });
}

function updateThemeIcon() {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (icon) {
        if (currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

// Mobile Navigation
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.skill-category, .project-card, .about-text, .contact-item');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Skills progress animation
function animateSkills() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

// Trigger skills animation when skills section is visible
const skillsSection = document.querySelector('#skills');
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkills();
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// Typing animation for hero section
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation
document.addEventListener('DOMContentLoaded', () => {
    const typingElement = document.querySelector('.typing');
    if (typingElement) {
        const originalText = typingElement.textContent;
        setTimeout(() => {
            typeWriter(typingElement, originalText, 80);
        }, 2000);
    }
});

// Contact form handling
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            showNotification('Message sent successfully!', 'success');
            contactForm.reset();
            
        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    }
});

// Dark theme navbar scroll effect
if (currentTheme === 'dark') {
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(17, 24, 39, 0.98)';
            } else {
                navbar.style.background = 'rgba(17, 24, 39, 0.95)';
            }
        }
    });
}

// Add hover effects to project cards
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add click effects to buttons
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    // Scroll-based animations and effects
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Lazy loading for images (if added later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Add loading state for the entire page
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Error handling for external resources
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'LINK' || e.target.tagName === 'SCRIPT') {
        console.warn('Failed to load external resource:', e.target.src || e.target.href);
    }
});

// Hero Terminal Functionality
const heroTerminal = document.getElementById('hero-terminal');
const terminalHistory = document.getElementById('terminal-history');
const heroTerminalInput = document.getElementById('hero-terminal-input');

// Check if terminal elements exist
if (!heroTerminal || !terminalHistory || !heroTerminalInput) {
    console.warn('Hero terminal elements not found');
}

let commandHistory = [];
let historyIndex = -1;

// Command processing
const commands = {
    'about': () => {
        scrollToSection('#about');
        return 'Navigating to About section...';
    },
    'skills': () => {
        scrollToSection('#skills');
        return 'Navigating to Skills section...';
    },
    'projects': () => {
        scrollToSection('#projects');
        return 'Navigating to Projects section...';
    },
    'contact': () => {
        scrollToSection('#contact');
        return 'Navigating to Contact section...';
    },
    'home': () => {
        scrollToSection('#home');
        return 'Navigating to Home section...';
    },
    'clear': () => {
        terminalHistory.innerHTML = '';
        return '';
    },
    'help': () => {
        return `Available commands:
  about - Go to About section
  skills - Go to Skills section
  projects - Go to Projects section
  contact - Go to Contact section
  home - Go to Home section
  clear - Clear terminal
  help - Show this help message
  whoami - Show info about Andrew
  ls - List available sections
  pwd - Show current location
  date - Show current date
  echo <text> - Display text`;
    },
    'whoami': () => {
        return `Andrew Kokro (Devsaint)
Software Developer • Mobile App Developer • Cybersecurity Analyst
Specializing in full-stack development, mobile applications, and blue team cybersecurity operations.`;
    },
    'ls': () => {
        return `Available sections:
  home/     - Hero section
  about/    - About me
  skills/   - Technical skills
  projects/ - Featured projects
  contact/ - Get in touch`;
    },
    'pwd': () => {
        return '/devsaint/portfolio';
    },
    'date': () => {
        return new Date().toLocaleString();
    },
    'echo': (args) => {
        return args.join(' ');
    }
};

// Handle terminal input
if (heroTerminalInput) {
    heroTerminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = heroTerminalInput.value.trim();
            heroTerminalInput.value = '';
            
            if (command) {
                addToHistory(command);
                processCommand(command);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                heroTerminalInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                heroTerminalInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                heroTerminalInput.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const currentInput = heroTerminalInput.value.trim();
            const matches = Object.keys(commands).filter(cmd => 
                cmd.startsWith(currentInput.toLowerCase())
            );
            
            if (matches.length === 1) {
                heroTerminalInput.value = matches[0];
            } else if (matches.length > 1) {
                addOutput(`Available commands: ${matches.join(', ')}`);
            }
        }
    });
}

function processCommand(input) {
    const parts = input.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    // Add command to output
    addCommandLine(input);
    
    // Process command
    if (commands[command]) {
        const result = commands[command](args);
        if (result) {
            addOutput(result);
        }
    } else {
        addOutput(`Command not found: ${command}. Type 'help' for available commands.`);
    }
}

function addCommandLine(command) {
    if (!terminalHistory) return;
    const line = document.createElement('div');
    line.className = 'code-line';
    line.innerHTML = `
        <span class="prompt">$</span>
        <span class="command">${command}</span>
    `;
    terminalHistory.appendChild(line);
    scrollToBottom();
}

function addOutput(text) {
    if (!terminalHistory || !text) return;
    const lines = text.split('\n');
    lines.forEach(line => {
        const outputLine = document.createElement('div');
        outputLine.className = 'code-line';
        outputLine.innerHTML = `<span class="output">${line}</span>`;
        terminalHistory.appendChild(outputLine);
    });
    scrollToBottom();
}

function addToHistory(command) {
    commandHistory.push(command);
    historyIndex = commandHistory.length;
    
    // Keep only last 50 commands
    if (commandHistory.length > 50) {
        commandHistory = commandHistory.slice(-50);
        historyIndex = commandHistory.length;
    }
}

function scrollToBottom() {
    if (!heroTerminal) return;
    heroTerminal.scrollTop = heroTerminal.scrollHeight;
}

function scrollToSection(selector) {
    const section = document.querySelector(selector);
    if (section) {
        const offsetTop = section.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Auto-focus terminal input when hero section is visible
const heroSection = document.querySelector('#home');
if (heroSection && heroTerminalInput) {
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && heroTerminalInput) {
                heroTerminalInput.focus();
            }
        });
    }, { threshold: 0.5 });
    
    heroObserver.observe(heroSection);
}

// Console welcome message
console.log(`
%cWelcome to Devsaint's Portfolio! 🚀
%cBuilt with modern web technologies and attention to detail.
%cFeel free to explore the code and reach out if you have any questions!

Contact: andrew.kokro@email.com
GitHub: github.com/devsaint

%c💡 Tip: Try typing commands in the terminal on the homepage!
%cAvailable commands: about, skills, projects, contact, help, whoami, ls, clear
`, 
'color: #0f172a; font-size: 16px; font-weight: bold;',
'color: #475569; font-size: 12px;',
'color: #64748b; font-size: 10px;',
'color: #0ea5e9; font-size: 12px; font-weight: bold;',
'color: #10b981; font-size: 11px;'
);
