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

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
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

