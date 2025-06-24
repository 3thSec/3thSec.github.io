/**
 * 3thSec - Main JavaScript
 * Handles all interactive functionality for the website
 */

// Wait for the DOM to be fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initFaqAccordion();
    initSmoothScroll();
    initContactForm();
    initNavbarScroll();
    initAnimations();
    initParticleEffect();
    initTypewriterEffect();
    initScrollReveal();
    initInteractiveElements();
    initMobileNavigation();
});

/**
 * FAQ Accordion Functionality
 * Handles toggling the FAQ items open and closed
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

/**
 * Smooth Scrolling for Anchor Links
 * Makes navigation to page sections smooth
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerOffset = 80; // Account for fixed header
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Navbar Scroll Effect
 * Adds a class to the navbar when scrolling down
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/**
 * Contact Form Handling
 * Validates and processes form submissions
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;
    
    // Add honeypot field for basic spam protection
    addHoneypotField(form);
    
    // Add input validation handlers
    addInputValidation(form);
    
    form.addEventListener('submit', handleFormSubmit);
}

/**
 * Add honeypot field to the form (spam prevention)
 * Bots will typically fill all fields including this hidden one
 */
function addHoneypotField(form) {
    const honeypotField = document.createElement('div');
    honeypotField.style.opacity = '0';
    honeypotField.style.position = 'absolute';
    honeypotField.style.top = '-9999px';
    honeypotField.style.left = '-9999px';
    honeypotField.style.zIndex = '-1';
    honeypotField.style.height = '0';
    honeypotField.innerHTML = `
        <label for="website">Website</label>
        <input type="text" name="website" id="website" tabindex="-1" autocomplete="off">
    `;
    form.appendChild(honeypotField);
}

/**
 * Add validation to input fields
 */
function addInputValidation(form) {
    // Email validation
    const emailInput = form.querySelector('#email');
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            validateEmail(emailInput);
        });
    }
    
    // Name validation (minimum length)
    const nameInput = form.querySelector('#name');
    if (nameInput) {
        nameInput.addEventListener('blur', () => {
            if (nameInput.value.trim().length < 3) {
                nameInput.setCustomValidity('Please enter your full name (at least 3 characters)');
                addErrorState(nameInput);
            } else {
                nameInput.setCustomValidity('');
                removeErrorState(nameInput);
            }
        });
    }
    
    // Message validation (minimum length)
    const messageInput = form.querySelector('#message');
    if (messageInput) {
        messageInput.addEventListener('blur', () => {
            if (messageInput.value.trim().length < 10) {
                messageInput.setCustomValidity('Please provide more details (at least 10 characters)');
                addErrorState(messageInput);
            } else {
                messageInput.setCustomValidity('');
                removeErrorState(messageInput);
            }
        });
        
        // Add character counter
        const maxChars = 1000;
        const counterDiv = document.createElement('div');
        counterDiv.className = 'char-counter';
        counterDiv.innerHTML = `<span>${messageInput.value.length}</span>/${maxChars} characters`;
        messageInput.parentNode.appendChild(counterDiv);
        
        messageInput.addEventListener('input', () => {
            const count = messageInput.value.length;
            counterDiv.innerHTML = `<span>${count}</span>/${maxChars} characters`;
            
            if (count > maxChars) {
                messageInput.value = messageInput.value.substring(0, maxChars);
                counterDiv.querySelector('span').textContent = maxChars;
                counterDiv.classList.add('char-limit-exceeded');
            } else {
                counterDiv.classList.remove('char-limit-exceeded');
            }
        });
    }
    
    // Clear custom validity on input
    const allInputs = form.querySelectorAll('input, textarea, select');
    allInputs.forEach(input => {
        input.addEventListener('input', () => {
            input.setCustomValidity('');
            removeErrorState(input);
        });
    });
}

/**
 * Email validation function
 */
function validateEmail(input) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        input.setCustomValidity('Please enter a valid email address');
        addErrorState(input);
        return false;
    } else {
        input.setCustomValidity('');
        removeErrorState(input);
        return true;
    }
}

/**
 * Add visual error state to input
 */
function addErrorState(input) {
    input.classList.add('error');
    const parent = input.parentNode;
    
    // Create or update error message
    let errorMsg = parent.querySelector('.error-message');
    if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        parent.appendChild(errorMsg);
    }
    
    errorMsg.textContent = input.validationMessage;
}

/**
 * Remove visual error state from input
 */
function removeErrorState(input) {
    input.classList.remove('error');
    const parent = input.parentNode;
    const errorMsg = parent.querySelector('.error-message');
    
    if (errorMsg) {
        errorMsg.remove();
    }
}

/**
 * Handle form submission
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Check honeypot field
    if (formData.get('website')) {
        console.log('Bot submission detected');
        showFormMessage(form, 'An error occurred. Please try again later.', 'error');
        return;
    }
    
    // Validate all fields manually
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const messageInput = form.querySelector('#message');
    const serviceInput = form.querySelector('#service');
    
    let isValid = true;
    
    if (nameInput && nameInput.value.trim().length < 3) {
        addErrorState(nameInput);
        isValid = false;
    }
    
    if (emailInput && !validateEmail(emailInput)) {
        isValid = false;
    }
    
    if (messageInput && messageInput.value.trim().length < 10) {
        addErrorState(messageInput);
        isValid = false;
    }
    
    if (serviceInput && serviceInput.value === '') {
        addErrorState(serviceInput);
        isValid = false;
    }
    
    if (!isValid) {
        showFormMessage(form, 'Please correct the errors in the form.', 'error');
        return;
    }
    
    sendEmail(e);
}

/**
 * Send email using EmailJS
 */
function sendEmail(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
    
    const templateParams = {
        to_email: 'contact3thsec@proton.me',
        from_name: form.name.value,
        from_email: form.email.value,
        phone: form.phone.value || 'Not provided',
        service: form.service.value,
        message: form.message.value,
    };

    emailjs.send('service_3thsec', 'template_contact', templateParams)
        .then(function(response) {
            showFormMessage(form, 'Your message has been sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            const charCounter = form.querySelector('.char-counter');
            if (charCounter) {
                charCounter.innerHTML = `<span>0</span>/1000 characters`;
            }
        }, function(error) {
            showFormMessage(form, 'Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        });
    
    return false;
}

/**
 * Show form message (success/error)
 */
function showFormMessage(form, message, type) {
    // Remove any existing messages
    const existingMsg = form.querySelector('.form-message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}-message`;
    messageEl.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    // Insert at the top of the form
    form.insertBefore(messageEl, form.firstChild);
    
    // Auto remove after some time if it's a success message
    if (type === 'success') {
        setTimeout(() => {
            messageEl.classList.add('fade-out');
            setTimeout(() => {
                messageEl.remove();
            }, 500);
        }, 5000);
    }
    
    // Scroll to message
    messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Initialize Modern Animations
 * Add entrance animations for elements on page load
 */
function initAnimations() {
    // Add fade-in animation to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            hero.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Animate navbar on load
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.transform = 'translateY(-100%)';
        
        setTimeout(() => {
            navbar.style.transition = 'transform 0.6s ease';
            navbar.style.transform = 'translateY(0)';
        }, 200);
    }
}

/**
 * Initialize Particle Effect for Hero Background
 * Creates floating particles in the hero section
 */
function initParticleEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Create particle container
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
        z-index: 0;
    `;
    
    hero.appendChild(particleContainer);
    
    // Create particles
    for (let i = 0; i < 30; i++) {
        createParticle(particleContainer);
    }
}

/**
 * Create individual particle
 */
function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 4 + 2;
    const startPositionX = Math.random() * 100;
    const startPositionY = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(59, 130, 246, 0.6);
        border-radius: 50%;
        left: ${startPositionX}%;
        top: ${startPositionY}%;
        animation: float ${duration}s linear infinite;
        animation-delay: ${delay}s;
        box-shadow: 0 0 6px rgba(59, 130, 246, 0.3);
    `;
    
    container.appendChild(particle);
}

/**
 * Initialize Typewriter Effect
 * Animates text typing effect on hero subtitle
 */
function initTypewriterEffect() {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (!heroSubtitle) return;
    
    const originalText = heroSubtitle.textContent.trim();
    if (!originalText) return;
    
    // Create a wrapper with cursor for better control
    const wrapper = document.createElement('span');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';
    
    const textSpan = document.createElement('span');
    const cursor = document.createElement('span');
    cursor.textContent = '|';
    cursor.style.color = 'var(--accent-primary)';
    cursor.style.animation = 'blink 1s infinite';
    cursor.style.fontSize = '1em';
    cursor.style.fontWeight = 'normal';
    
    wrapper.appendChild(textSpan);
    wrapper.appendChild(cursor);
    
    // Replace original content
    heroSubtitle.innerHTML = '';
    heroSubtitle.appendChild(wrapper);
    
    // Add CSS for blinking cursor
    if (!document.getElementById('typewriter-css')) {
        const style = document.createElement('style');
        style.id = 'typewriter-css';
        style.textContent = `
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    let i = 0;
    const typeSpeed = 80;
    
    const typeWriter = () => {
        if (i < originalText.length) {
            textSpan.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, typeSpeed);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                cursor.style.display = 'none';
            }, 2000);
        }
    };
    
    // Start typing after hero loads
    setTimeout(typeWriter, 1000);
}

/**
 * Initialize Scroll Reveal Animations
 * Animate elements when they come into view
 */
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service, .feature, .testimonial, .contact-card, .service-card');
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

/**
 * Initialize Interactive Elements
 * Add enhanced hover effects and interactions
 */
function initInteractiveElements() {
    // Enhanced button hover effects
    const buttons = document.querySelectorAll('.cta-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Enhanced service card interactions
    const serviceCards = document.querySelectorAll('.service, .feature, .contact-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
    
    // Add click ripple effect to buttons
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
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
    
    // Add subtle scroll effect to hero badges (optional)
    const heroBadges = document.querySelectorAll('.hero-badge');
    if (heroBadges.length) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = document.querySelector('.hero')?.offsetHeight || 0;
            
            if (scrolled < heroHeight) {
                const opacity = 1 - (scrolled / heroHeight);
                heroBadges.forEach(badge => {
                    badge.style.opacity = Math.max(0.3, opacity);
                });
            }
        });
    }
}

/**
 * Add dynamic CSS for animations
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0) rotate(0deg);
        }
        50% {
            transform: translateY(-20px) rotate(180deg);
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .char-counter {
        font-size: 0.85rem;
        color: var(--text-muted);
        text-align: right;
        margin-top: var(--space-1);
    }
    
    .char-counter span {
        font-weight: 600;
        color: var(--accent-primary);
    }
    
    .char-limit-exceeded span {
        color: var(--accent-error) !important;
    }
    
    .error-message {
        color: var(--accent-error);
        font-size: 0.85rem;
        margin-top: var(--space-1);
        display: flex;
        align-items: center;
        gap: var(--space-1);
    }
    
    .error-message::before {
        content: '⚠';
    }
    
    input.error,
    textarea.error,
    select.error {
        border-color: var(--accent-error) !important;
        box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1) !important;
    }
    
    .form-message {
        padding: var(--space-4);
        border-radius: var(--radius-md);
        margin-bottom: var(--space-4);
        display: flex;
        align-items: center;
        gap: var(--space-2);
        font-weight: 500;
    }
    
    .success-message {
        background-color: rgba(16, 185, 129, 0.1);
        border: 1px solid var(--accent-success);
        color: var(--accent-success);
    }
    
    .error-message {
        background-color: rgba(239, 68, 68, 0.1);
        border: 1px solid var(--accent-error);
        color: var(--accent-error);
    }
    
    .fade-out {
        opacity: 0;
        transform: translateY(-10px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    /* Enhanced button animations */
    .cta-button {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Enhanced card animations */
    .service, .feature, .contact-card, .testimonial {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Smooth scrolling for the entire page */
    html {
        scroll-behavior: smooth;
    }
`;
document.head.appendChild(style);

/**
 * Initialize Mobile Navigation
 * Handle hamburger menu toggle for mobile devices
 */
function initMobileNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const navLinksItems = navLinks.querySelectorAll('.nav-link');
    
    if (!navToggle || !navLinks) return;
    
    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking on a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

