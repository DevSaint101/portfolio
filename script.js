/**
 * Devsaint Portfolio - Main JavaScript
 * Professional, Performant, Accessible
 */

'use strict';

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    theme: {
        storageKey: 'devsaint-theme',
        default: 'light'
    },
    animation: {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    },
    terminal: {
        typingSpeed: 15,
        maxHistory: 50
    }
};

// ============================================
// UTILITIES
// ============================================

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait = 100) {
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

/**
 * Throttle function for scroll events
 */
function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Safe query selector with error handling
 */
function $(selector, context = document) {
    return context.querySelector(selector);
}

function $$(selector, context = document) {
    return [...context.querySelectorAll(selector)];
}

// ============================================
// THEME MANAGEMENT
// ============================================
const ThemeManager = {
    init() {
        this.toggle = $('#theme-toggle');
        this.moonIcon = $('#theme-icon-moon');
        this.sunIcon = $('#theme-icon-sun');
        
        // Get saved theme or system preference
        const savedTheme = localStorage.getItem(CONFIG.theme.storageKey);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        
        this.setTheme(theme, false);
        this.bindEvents();
    },
    
    setTheme(theme, save = true) {
        document.documentElement.setAttribute('data-theme', theme);
        
        if (save) {
            localStorage.setItem(CONFIG.theme.storageKey, theme);
        }
        
        this.updateIcons(theme);
        this.currentTheme = theme;
    },
    
    updateIcons(theme) {
        if (!this.moonIcon || !this.sunIcon) return;
        
        if (theme === 'dark') {
            this.moonIcon.classList.add('hidden');
            this.sunIcon.classList.remove('hidden');
    } else {
            this.moonIcon.classList.remove('hidden');
            this.sunIcon.classList.add('hidden');
        }
    },
    
    toggle() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    },
    
    bindEvents() {
        if (this.toggle) {
            this.toggle.addEventListener('click', () => {
                const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
                this.setTheme(newTheme);
            });
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(CONFIG.theme.storageKey)) {
                this.setTheme(e.matches ? 'dark' : 'light', false);
            }
        });
    }
};

// ============================================
// NAVIGATION
// ============================================
const Navigation = {
    init() {
        this.navbar = $('.navbar');
        this.navToggle = $('#nav-toggle');
        this.navMenu = $('#nav-menu');
        this.navLinks = $$('.nav-link');
        this.quickActionLinks = $$('.action-btn');
        this.sections = $$('section[id]');
        
        this.bindEvents();
        this.setupSectionObserver();
    },
    
    setActiveSection(sectionId) {
        // Update nav links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
            
            const href = link.getAttribute('href');
            if (href === `#${sectionId}`) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
        
        // Update quick action links
        this.quickActionLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    },
    
    setupSectionObserver() {
const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
                    this.setActiveSection(entry.target.id);
        }
    });
}, observerOptions);

        this.sections.forEach(section => {
            observer.observe(section);
        });
    },
    
    toggleMobileMenu() {
        const isOpen = this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        this.navToggle.setAttribute('aria-expanded', isOpen);
        
        // Trap focus when menu is open
        if (isOpen) {
            this.navMenu.querySelector('.nav-link')?.focus();
        }
    },
    
    closeMobileMenu() {
        this.navMenu?.classList.remove('active');
        this.navToggle?.classList.remove('active');
        this.navToggle?.setAttribute('aria-expanded', 'false');
    },
    
    handleScroll: throttle(function() {
        if (!this.navbar) return;
        
        const scrolled = window.scrollY > 50;
        this.navbar.classList.toggle('scrolled', scrolled);
    }, 100),
    
    smoothScrollTo(target) {
        const element = $(target);
        if (element) {
            const navHeight = this.navbar?.offsetHeight || 72;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - navHeight;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    },
    
    bindEvents() {
        // Mobile menu toggle
        this.navToggle?.addEventListener('click', () => this.toggleMobileMenu());
        
        // Nav link clicks with smooth scroll
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.smoothScrollTo(href);
                    this.closeMobileMenu();
                }
            });
        });
        
        // Quick action link clicks
        this.quickActionLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.smoothScrollTo(href);
                }
    });
});

        // Scroll effects
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        
        // Escape key closes menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.navMenu?.classList.contains('active') && 
                !this.navMenu.contains(e.target) && 
                !this.navToggle?.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }
};

// ============================================
// SCROLL ANIMATIONS
// ============================================
const ScrollAnimations = {
    init() {
        if (prefersReducedMotion()) return;
        
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: CONFIG.animation.threshold,
                rootMargin: CONFIG.animation.rootMargin
            }
        );
        
        this.observeElements();
    },
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Unobserve after animation (performance)
                this.observer.unobserve(entry.target);
            }
        });
    },
    
    observeElements() {
        const animatedElements = $$('.skill-category, .project-card, .about-text, .contact-item, .detail-card, .fade-in');
        
        animatedElements.forEach(el => {
            if (!el.classList.contains('fade-in')) {
                el.classList.add('fade-in');
            }
            this.observer.observe(el);
        });
    }
};

// ============================================
// SKILLS ANIMATION
// ============================================
const SkillsAnimation = {
    init() {
        this.section = $('#skills');
        if (!this.section) return;
        
        this.animated = false;
        
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            { threshold: 0.2 }
        );
        
        this.observer.observe(this.section);
    },
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !this.animated) {
                this.animateSkills();
                this.animated = true;
                this.observer.unobserve(entry.target);
            }
        });
    },
    
    animateSkills() {
        const skillBars = $$('.skill-progress');
        const delay = prefersReducedMotion() ? 0 : 100;
        
        skillBars.forEach((bar, index) => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width;
            }, index * delay);
        });
    }
};

// ============================================
// HERO TERMINAL
// ============================================
const HeroTerminal = {
    commands: {
        about: () => {
        window.location.href = 'about.html';
        return 'Navigating to About page...';
    },
        skills: () => {
        window.location.href = 'skills.html';
        return 'Navigating to Skills page...';
    },
        projects: () => {
        window.location.href = 'projects.html';
        return 'Navigating to Projects page...';
    },
        contact: () => {
        window.location.href = 'contact.html';
        return 'Navigating to Contact page...';
    },
        home: () => {
        window.location.href = 'index.html';
        return 'Navigating to Home page...';
    },
        clear: function() {
            HeroTerminal.clearTerminal();
        return '';
    },
        help: () => `Available commands:
  about    - Go to About page
  skills   - Go to Skills page
  projects - Go to Projects page
  contact  - Go to Contact page
  home     - Go to Home page
  clear    - Clear terminal
  help     - Show this help message
  whoami   - Show info about Andrew
  ls       - List available pages
  pwd      - Show current location
  date     - Show current date
  theme    - Toggle dark/light mode`,
        whoami: () => `Andrew Kokro (Devsaint)
Software Developer • Mobile App Developer • Cybersecurity Analyst
Specializing in full-stack development, mobile applications, and blue team cybersecurity operations.`,
        ls: () => `Available pages:
  index.html    - Home page
  about.html    - About me
  skills.html   - Technical skills
  projects.html - Featured projects
  contact.html  - Contact information`,
        pwd: () => '/devsaint/portfolio',
        date: () => new Date().toLocaleString(),
        echo: (args) => args.join(' '),
        theme: () => {
            ThemeManager.toggle();
            return `Theme switched to ${ThemeManager.currentTheme} mode.`;
        }
    },
    
    init() {
        this.terminal = $('#hero-terminal');
        this.history = $('#terminal-history');
        this.input = $('#hero-terminal-input');
        
        if (!this.terminal || !this.history || !this.input) return;
        
        this.commandHistory = [];
        this.historyIndex = -1;
        
        this.bindEvents();
    },
    
    clearTerminal() {
        if (this.history) {
            this.history.innerHTML = '';
        }
    },
    
    processCommand(input) {
        const parts = input.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    
        // Add command to display
        this.addCommandLine(input);
    
    // Process command
        if (this.commands[command]) {
            const result = this.commands[command](args);
        if (result) {
                this.addOutput(result);
        }
    } else {
            this.addOutput(`Command not found: ${command}. Type 'help' for available commands.`);
    }
    },

    addCommandLine(command) {
    const line = document.createElement('div');
    line.className = 'code-line';
    line.innerHTML = `
        <span class="prompt">$</span>
            <span class="command">${this.escapeHtml(command)}</span>
        `;
        this.history.appendChild(line);
        this.scrollToBottom();
    },
    
    addOutput(text) {
        if (!text) return;
        
    const lines = text.split('\n');
        const useTyping = !prefersReducedMotion();
    
    lines.forEach((line, lineIndex) => {
        const outputLine = document.createElement('div');
        outputLine.className = 'code-line';
        const outputSpan = document.createElement('span');
        outputSpan.className = 'output';
        outputLine.appendChild(outputSpan);
            this.history.appendChild(outputLine);
            
            if (useTyping && line.length > 0) {
                this.typeText(outputSpan, line, lineIndex * 30);
            } else {
                outputSpan.textContent = line;
            }
        });
        
        this.scrollToBottom();
    },
    
    typeText(element, text, delay = 0) {
            let i = 0;
        const speed = CONFIG.terminal.typingSpeed;
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
            } else {
                this.scrollToBottom();
            }
        };
        
        setTimeout(type, delay);
    },
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    scrollToBottom() {
        const codeContent = this.terminal.closest('.code-content');
        if (codeContent) {
            codeContent.scrollTop = codeContent.scrollHeight;
        }
    },
    
    addToHistory(command) {
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
        
        // Limit history size
        if (this.commandHistory.length > CONFIG.terminal.maxHistory) {
            this.commandHistory = this.commandHistory.slice(-CONFIG.terminal.maxHistory);
            this.historyIndex = this.commandHistory.length;
        }
    },
    
    handleKeyDown(e) {
        switch (e.key) {
            case 'Enter':
                const command = this.input.value.trim();
                this.input.value = '';
                
                if (command) {
                    this.addToHistory(command);
                    this.processCommand(command);
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.input.value = this.commandHistory[this.historyIndex];
                }
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                if (this.historyIndex < this.commandHistory.length - 1) {
                    this.historyIndex++;
                    this.input.value = this.commandHistory[this.historyIndex];
                } else {
                    this.historyIndex = this.commandHistory.length;
                    this.input.value = '';
                }
                break;
                
            case 'Tab':
                e.preventDefault();
                this.autoComplete();
                break;
        }
    },
    
    autoComplete() {
        const currentInput = this.input.value.trim().toLowerCase();
        if (!currentInput) return;
        
        const matches = Object.keys(this.commands).filter(cmd => 
            cmd.startsWith(currentInput)
        );
        
        if (matches.length === 1) {
            this.input.value = matches[0];
        } else if (matches.length > 1) {
            this.addOutput(`Suggestions: ${matches.join(', ')}`);
        }
    },
    
    bindEvents() {
        this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Focus input when clicking on terminal
        this.terminal.addEventListener('click', () => {
            this.input.focus();
        });
    }
};

// ============================================
// CONTACT FORM
// ============================================
const ContactForm = {
    init() {
        this.form = $('#contact-form');
        if (!this.form) return;
        
        this.bindEvents();
    },
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Submit via FormSubmit.co
            const formData = new FormData(this.form);
            
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success
                this.showNotification('Message sent successfully! I\'ll get back to you within 24 hours.', 'success');
                this.form.reset();
            } else {
                throw new Error('Form submission failed');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showNotification('Failed to send message. Please email me directly at andrewkokro10@gmail.com', 'error');
        } finally {
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }
    },
    
    showNotification(message, type = 'info') {
        // Remove existing notifications
        $$('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        notification.textContent = message;
        
        // Styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '16px 24px',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '500',
            fontSize: '0.9375rem',
            zIndex: '10000',
            transform: 'translateX(120%)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            maxWidth: '90vw'
        });
        
        // Type-specific colors
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    },
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
};

// ============================================
// BUTTON EFFECTS
// ============================================
const ButtonEffects = {
    init() {
        if (prefersReducedMotion()) return;
        
        // Add ripple effect to buttons
        $$('.btn').forEach(button => {
            button.addEventListener('click', (e) => this.createRipple(e, button));
        });
    },
    
    createRipple(event, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        Object.assign(ripple.style, {
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            left: `${x}px`,
            top: `${y}px`,
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            transform: 'scale(0)',
            animation: 'ripple 0.6s linear',
            pointerEvents: 'none'
        });
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
};

// ============================================
// LAZY LOADING
// ============================================
const LazyLoader = {
    init() {
        const images = $$('img[data-src]');
        if (!images.length) return;
        
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            { rootMargin: '50px' }
        );
        
        images.forEach(img => this.observer.observe(img));
    },
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.remove('lazy');
                this.observer.unobserve(img);
            }
        });
    }
};

// ============================================
// PERFORMANCE MONITORING
// ============================================
const PerformanceMonitor = {
    init() {
        // Report Web Vitals (if available)
        if ('web-vital' in window) {
            this.reportWebVitals();
        }
        
        // Handle errors gracefully
        window.addEventListener('error', (e) => {
            if (e.target.tagName === 'LINK' || e.target.tagName === 'SCRIPT') {
                console.warn('Failed to load resource:', e.target.src || e.target.href);
            }
        });
    },
    
    reportWebVitals() {
        // Placeholder for web vitals reporting
        // Can be connected to analytics service
    }
};

// ============================================
// INITIALIZATION
// ============================================
function initApp() {
    // Core functionality
    ThemeManager.init();
    Navigation.init();
    
    // Animations
    ScrollAnimations.init();
    SkillsAnimation.init();
    
    // Interactive elements
    HeroTerminal.init();
    ContactForm.init();
    ButtonEffects.init();
    
    // Performance
    LazyLoader.init();
    PerformanceMonitor.init();
    
    // Mark page as loaded
    document.body.classList.add('loaded');
}

// Add ripple animation CSS
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Console branding
console.log(
    `%c
╔══════════════════════════════════════════╗
║                                          ║
║   🚀 Devsaint's Portfolio                ║
║   Built with performance in mind         ║
║                                          ║
║   Try the terminal on the homepage!      ║
║   Commands: about, skills, projects...   ║
║                                          ║
╚══════════════════════════════════════════╝
    `,
    'color: #10b981; font-family: monospace; font-size: 11px;'
);
