// DOM elements
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav__link');
const portfolioCards = document.querySelectorAll('.portfolio-card');
const videoModal = document.getElementById('videoModal');
const videoPlayer = document.getElementById('videoPlayer');
const closeModal = document.getElementById('closeModal');
const contactForm = document.getElementById('contactForm');

// Navigation functionality
let lastScrollY = 0;

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for fixed nav
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Update active navigation link
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

// Handle scroll effects
function handleScroll() {
    const currentScrollY = window.scrollY;

    // Add scrolled class to navigation
    if (currentScrollY > 50) {
        nav.classList.add('nav--scrolled');
    } else {
        nav.classList.remove('nav--scrolled');
    }

    // Update active navigation
    updateActiveNav();

    // Parallax effects for hero section
    const heroGrid = document.querySelector('.hero__grid');
    if (heroGrid && currentScrollY < window.innerHeight) {
        const parallaxSpeed = currentScrollY * 0.3;
        heroGrid.style.transform = `translate(${40 + parallaxSpeed * 0.1}px, ${40 + parallaxSpeed * 0.1}px)`;
    }

    lastScrollY = currentScrollY;
}

// Mobile navigation toggle
function toggleMobileNav() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Close mobile nav when link is clicked
function closeMobileNav() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    document.body.style.overflow = '';
}

// Portfolio video modal functionality
function openVideoModal(videoId) {
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    videoPlayer.src = embedUrl;
    videoModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    videoPlayer.src = '';
    videoModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// File upload handling
function initFileUpload() {
    const fileInput = document.getElementById('files');
    const fileList = document.getElementById('fileList');
    const maxFileSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!fileInput || !fileList) return;

    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop functionality
    const fileLabel = document.querySelector('.file-label');
    if (fileLabel) {
        fileLabel.addEventListener('dragover', handleDragOver);
        fileLabel.addEventListener('dragleave', handleDragLeave);
        fileLabel.addEventListener('drop', handleDrop);
    }

    function handleFileSelect(e) {
        const files = Array.from(e.target.files);
        processFiles(files);
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.style.borderColor = 'rgba(64, 37, 64, 0.8)';
        e.currentTarget.style.background = 'rgba(235, 219, 220, 0.1)';
    }

    function handleDragLeave(e) {
        e.preventDefault();
        e.currentTarget.style.borderColor = 'rgba(64, 37, 64, 0.3)';
        e.currentTarget.style.background = 'rgba(235, 219, 220, 0.02)';
    }

    function handleDrop(e) {
        e.preventDefault();
        e.currentTarget.style.borderColor = 'rgba(64, 37, 64, 0.3)';
        e.currentTarget.style.background = 'rgba(235, 219, 220, 0.02)';
        
        const files = Array.from(e.dataTransfer.files);
        processFiles(files);
    }

    function processFiles(files) {
        let totalSize = 0;
        const currentFiles = Array.from(fileInput.files);
        
        // Calculate current total size
        currentFiles.forEach(file => {
            totalSize += file.size;
        });

        files.forEach(file => {
            // Check file type
            if (!allowedTypes.includes(file.type)) {
                showFileError(`File "${file.name}" is not a supported format.`);
                return;
            }

            // Check file size
            if (file.size > maxFileSize) {
                showFileError(`File "${file.name}" is too large. Maximum size is 100MB.`);
                return;
            }

            // Check total size
            if (totalSize + file.size > maxFileSize) {
                showFileError(`Total file size cannot exceed 100MB.`);
                return;
            }

            totalSize += file.size;
            addFileToList(file);
        });
    }

    function addFileToList(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-item__info">
                <svg class="file-item__icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 4C4 2.9 4.9 2 6 2H14L18 6V16C18 17.1 17.1 18 16 18H6C4.9 18 4 17.1 4 16V4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="14,2 14,6 18,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <div>
                    <div class="file-item__name">${file.name}</div>
                    <div class="file-item__size">${formatFileSize(file.size)}</div>
                </div>
            </div>
            <button type="button" class="file-item__remove" onclick="removeFile(this)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        `;
        fileList.appendChild(fileItem);
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function showFileError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'file-error';
        errorDiv.style.cssText = `
            background: rgba(255, 84, 89, 0.1);
            border: 1px solid rgba(255, 84, 89, 0.3);
            color: #ff5459;
            padding: var(--space-8) var(--space-12);
            border-radius: var(--radius-sm);
            font-size: var(--font-size-sm);
            margin-top: var(--space-8);
        `;
        errorDiv.textContent = message;
        fileList.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Global function to remove files
window.removeFile = function(button) {
    const fileItem = button.closest('.file-item');
    fileItem.remove();
};

// Form validation
function validateForm(form) {
    const formData = new FormData(form);
    const errors = {};

    // Required field validation
    const requiredFields = ['firstName', 'lastName', 'email', 'service', 'message'];
    requiredFields.forEach(field => {
        if (!formData.get(field) || formData.get(field).trim() === '') {
            errors[field] = 'This field is required';
        }
    });

    // Email validation
    const email = formData.get('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        errors.email = 'Please enter a valid email address';
    }

    // Website validation
    const website = formData.get('website');
    if (website && website.trim() !== '') {
        const urlRegex = /^https?:\/\/.+/;
        if (!urlRegex.test(website)) {
            errors.website = 'Please enter a valid URL (starting with http:// or https://)';
        }
    }

    return errors;
}

// Display form errors
function displayFormErrors(errors) {
    // Clear previous errors
    document.querySelectorAll('.form-error').forEach(error => error.remove());
    document.querySelectorAll('.form-control.error').forEach(control => control.classList.remove('error'));

    // Display new errors
    Object.keys(errors).forEach(field => {
        const input = document.querySelector(`[name="${field}"]`);
        if (input) {
            input.classList.add('error');
            const errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            errorElement.textContent = errors[field];
            errorElement.style.color = 'var(--color-error, #ff5459)';
            errorElement.style.fontSize = 'var(--font-size-sm)';
            errorElement.style.marginTop = 'var(--space-4)';
            input.parentNode.appendChild(errorElement);
        }
    });
}

// Handle form submission
function handleFormSubmission(e) {
    e.preventDefault();
    
    const errors = validateForm(contactForm);
    
    if (Object.keys(errors).length > 0) {
        displayFormErrors(errors);
        return;
    }

    // Clear any existing errors
    displayFormErrors({});

    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="animation: spin 1s linear infinite;">
            <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-dasharray="32" stroke-dashoffset="16" fill="none"/>
        </svg>
        Sending...
    `;
    submitButton.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML = `
            <div style="
                background: rgba(64, 37, 64, 0.2);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(64, 37, 64, 0.4);
                border-radius: var(--radius-base);
                padding: var(--space-16);
                margin-bottom: var(--space-16);
                color: var(--color-white-coffee);
                display: flex;
                align-items: center;
                gap: var(--space-8);
            ">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M6 10L8.5 12.5L14 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Thank you! We'll get back to you within 24 hours.
            </div>
        `;

        contactForm.insertBefore(successMessage, contactForm.firstChild);

        // Reset form
        contactForm.reset();

        // Reset button
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;

        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);

    }, 2000); // Simulate 2 second delay
}

// Animate elements on scroll
function animateOnScroll() {
    const animatedElements = document.querySelectorAll('.feature-card, .service-card, .portfolio-card, .testimonial-card, .process-step, .cta-section');
    
    animatedElements.forEach((element, index) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100); // Stagger animation
        }
    });
}

// Initialize animations
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .service-card, .portfolio-card, .testimonial-card, .process-step, .cta-section');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
}

// Enhanced typing animation for hero title
function initHeroTypingAnimation() {
    const titleLines = document.querySelectorAll('.hero__title-line');
    titleLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.animation = `fadeInUp 0.8s ease-out ${0.2 + index * 0.2}s both`;
    });
}

// Advanced parallax effect for background elements
function initParallaxElements() {
    const parallaxElements = document.querySelectorAll('.hero__grid');
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translate(${40 + rate * 0.1}px, ${40 + rate * 0.1}px)`;
        });
    }
    
    window.addEventListener('scroll', updateParallax);
}

// Enhanced section reveals with intersection observer
function initSectionReveals() {
    const sections = document.querySelectorAll('section');
    
    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-revealed');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.1
    });
    
    sections.forEach(section => {
        section.classList.add('section-hidden');
        sectionObserver.observe(section);
    });
}

// Add advanced CSS for premium animations
function addAdvancedStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .section-hidden {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .section-revealed {
            opacity: 1;
            transform: translateY(0);
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .form-control.error {
            border-color: #ff5459;
            box-shadow: 0 0 0 3px rgba(255, 84, 89, 0.1);
        }
        
        .nav__toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav__toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav__toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        /* Premium glass morphism effects */
        .feature-card, .service-card, .portfolio-card, .testimonial-card, .process-step__content, .contact__form, .cta-section__content {
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .feature-card:hover, .service-card:hover, .testimonial-card:hover {
            transform: translateY(-12px) rotateX(5deg);
            box-shadow: 0 25px 50px rgba(64, 37, 64, 0.5);
        }
        
        .portfolio-card:hover {
            transform: translateY(-15px) scale(1.02);
            box-shadow: 0 30px 60px rgba(21, 1, 91, 0.4);
        }
        
        /* Advanced button effects */
        .btn--primary {
            background: linear-gradient(135deg, #402540, #15015B);
            box-shadow: 0 8px 25px rgba(64, 37, 64, 0.4);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .btn--primary:hover {
            transform: translateY(-4px);
            box-shadow: 0 15px 40px rgba(64, 37, 64, 0.6);
            background: linear-gradient(135deg, #4d2e4d, #1a0170);
        }
        
        .btn--outline {
            background: rgba(235, 219, 220, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(64, 37, 64, 0.4);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .btn--outline:hover {
            background: rgba(64, 37, 64, 0.2);
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(64, 37, 64, 0.3);
        }
        
        /* Enhanced CTA section animation */
        .cta-section__content {
            animation: pulseGlow 3s ease-in-out infinite alternate;
        }
        
        @keyframes pulseGlow {
            0% {
                box-shadow: 0 0 20px rgba(64, 37, 64, 0.3);
            }
            100% {
                box-shadow: 0 0 40px rgba(64, 37, 64, 0.6), 0 0 80px rgba(21, 1, 91, 0.3);
            }
        }
        
        /* Custom scrollbar with brand colors */
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: rgba(10, 10, 15, 0.8);
        }
        
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #402540, #15015B);
            border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #4d2e4d, #1a0170);
        }
        
        /* Advanced grid animation for hero */
        .hero__grid {
            animation: gridMove 20s linear infinite, gridPulse 4s ease-in-out infinite alternate;
        }
        
        @keyframes gridPulse {
            0% { opacity: 0.3; }
            100% { opacity: 0.6; }
        }
        
        /* Floating elements effect */
        .hero__badge {
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        /* Enhanced modal with glass effect */
        .modal__content {
            backdrop-filter: blur(20px);
            border: 1px solid rgba(64, 37, 64, 0.3);
        }
        
        /* Form enhancements */
        .form-control {
            backdrop-filter: blur(10px);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .form-control:focus {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(64, 37, 64, 0.3);
        }
    `;
    document.head.appendChild(style);
}

// Enhanced card interactions with 3D effects
function initAdvancedCardEffects() {
    const cards = document.querySelectorAll('.feature-card, .service-card, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            card.style.transform = 'translateY(-12px) rotateX(5deg)';
            card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        
        card.addEventListener('mouseleave', (e) => {
            card.style.transform = 'translateY(0) rotateX(0)';
        });
        
        // Add subtle mouse tracking effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `translateY(-12px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });
}

// Handle form submission
function initFormHandling() {
    const form = document.querySelector('form[data-netlify="true"]');
    if (form) {
        form.addEventListener('submit', function(e) {
            // Show success message after a short delay
            setTimeout(() => {
                // Create success notification
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #4CAF50, #45a049);
                    color: white;
                    padding: 16px 24px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    z-index: 10000;
                    font-weight: 500;
                    animation: slideIn 0.3s ease-out;
                `;
                notification.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M16.67 6L7.5 15.17L3.33 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Thank you! We'll get back to you within 24 hours.
                    </div>
                `;
                
                // Add animation styles
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
                
                document.body.appendChild(notification);
                
                // Remove notification after 5 seconds
                setTimeout(() => {
                    notification.style.animation = 'slideIn 0.3s ease-out reverse';
                    setTimeout(() => notification.remove(), 300);
                }, 5000);
            }, 100);
        });
    }
}

// Initialize everything when DOM is loaded
function initializeApp() {
    // Add advanced styles
    addAdvancedStyles();
    
    // Initialize animations
    initializeAnimations();
    initHeroTypingAnimation();
    initParallaxElements();
    initSectionReveals();
    initAdvancedCardEffects();
    
    // Set up event listeners (scroll handled by throttled version below)
    
    // Navigation event listeners
    navToggle.addEventListener('click', toggleMobileNav);
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
            closeMobileNav();
        });
    });
    
    // Portfolio modal event listeners
    portfolioCards.forEach(card => {
        card.addEventListener('click', () => {
            const videoId = card.dataset.video;
            if (videoId) {
                openVideoModal(videoId);
            }
        });
    });
    
    // Modal close event listeners
    if (closeModal) {
        closeModal.addEventListener('click', closeVideoModal);
    }
    
    if (videoModal) {
        const backdrop = videoModal.querySelector('.modal__backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', closeVideoModal);
        }
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal && !videoModal.classList.contains('hidden')) {
            closeVideoModal();
        }
    });
    
    // Contact form event listener
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
    }
    
    // Initialize file upload
    initFileUpload();
    
    // Hero action buttons
    document.querySelectorAll('.hero__actions .btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.textContent.includes('Start Your Project')) {
                scrollToSection('contact');
            } else if (btn.textContent.includes('View Our Work')) {
                scrollToSection('portfolio');
            }
        });
    });
    
    // Add smooth reveal for hero elements
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero__badge, .hero__subtitle, .hero__actions, .hero__stats');
        heroElements.forEach((element, index) => {
            if (element) {
                element.style.animationDelay = `${0.6 + index * 0.2}s`;
            }
        });
    }, 100);
    
    // Initialize scroll indicator animation
    const scrollIndicator = document.querySelector('.hero__scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            scrollToSection('features');
        });
        scrollIndicator.style.cursor = 'pointer';
    }
    
    // Add loading states to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            if (!btn.disabled) {
                btn.style.transform = 'translateY(-2px)';
            }
        });
        
        btn.addEventListener('mouseleave', () => {
            if (!btn.disabled) {
                btn.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Performance optimization: throttle scroll events
    let scrollTimeout;
    function throttledScrollHandler() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                handleScroll();
                animateOnScroll();
                scrollTimeout = null;
            }, 16); // ~60fps throttling
        }
    }
    
    window.removeEventListener('scroll', throttledScrollHandler);
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    // Initialize enhanced client logos
    initClientLogos();
    
    // Initialize form handling
    initFormHandling();
    
    // Initialize performance monitoring
    initPerformanceMonitoring();
    
    // Initialize lazy loading
    initLazyLoading();
    
    // Initialize PWA features
    initServiceWorker();
    initOfflineFormHandling();
    
    // Initial calls
    handleScroll();
    animateOnScroll();
    updateActiveNav();
    
    console.log('PixelWave website initialized successfully! ✨ Where pixels meet imagination.');
}

// (Client portal removed)

// Enhanced Client Logos Strip functionality
function initClientLogos() {
    const container = document.querySelector('.clients__strip');
    const track = document.getElementById('clientsLogos');
    if (!container || !track) return;

    const baseItems = Array.from(track.querySelectorAll('.client-logo'));
    if (!baseItems.length) return;

    // Ensure accessibility attributes
    for (const el of baseItems) {
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
        const brandName = (el.dataset.brand || 'Client').replace(/(^|[-_])([a-z])/g, (_, __, c) => c.toUpperCase());
        if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', brandName);
    }

    function buildLoop() {
        // Remove prior clones
        track.querySelectorAll('[data-clone="true"]').forEach(n => n.remove());

        // Measure original sequence width including gaps
        const styles = getComputedStyle(track);
        const gapPx = parseFloat(styles.gap || '0');
        const itemWidths = baseItems.map(el => el.getBoundingClientRect().width);
        const firstPassWidth = itemWidths.reduce((sum, w) => sum + w, 0) + gapPx * Math.max(0, baseItems.length - 1);

        // Clone until content covers at least 2x container width for smooth loop
        let contentWidth = track.scrollWidth;
        let safety = 0;
        while (contentWidth < container.clientWidth * 2 && safety < 50) {
            for (const el of baseItems) {
                const clone = el.cloneNode(true);
                clone.dataset.clone = 'true';
                track.appendChild(clone);
            }
            contentWidth = track.scrollWidth;
            safety++;
        }

        // Set runtime CSS vars for distance and speed
        const pxPerSecond = 120; // perceived speed target
        const duration = Math.max(16, Math.round(firstPassWidth / pxPerSecond));
        track.style.setProperty('--loop-distance', `${firstPassWidth}px`);
        track.style.setProperty('--logo-speed', `${duration}s`);
        track.style.setProperty('--logo-speed-md', `${Math.round(duration * 1.2)}s`);
        track.style.setProperty('--logo-speed-sm', `${Math.round(duration * 1.4)}s`);
    }

    // Hover pause via CSS class
    track.addEventListener('mouseenter', () => track.classList.add('paused'));
    track.addEventListener('mouseleave', () => track.classList.remove('paused'));

    // Keyboard activation
    track.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.classList && e.target.classList.contains('client-logo')) {
            e.preventDefault();
            e.target.click();
        }
    });

    // Click tracking (retain existing analytics behavior)
    track.querySelectorAll('.client-logo').forEach(logo => {
        logo.addEventListener('click', () => {
            const brand = logo.dataset.brand;
            const industry = logo.dataset.industry;
            if (typeof gtag !== 'undefined') {
                gtag('event', 'client_logo_clicked', {
                    brand_name: brand,
                    industry: industry
                });
            }
            console.log(`Clicked on ${brand} (${industry})`);
        });
    });

    // Recompute on resize
    const ro = new ResizeObserver(() => buildLoop());
    ro.observe(container);
    buildLoop();
}

// Performance monitoring
function initPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData && typeof gtag !== 'undefined') {
                gtag('event', 'page_performance', {
                    load_time: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                    dom_ready: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                    first_paint: Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0)
                });
            }
        });
    }
}

// Lazy loading for images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// PWA Service Worker Registration
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered successfully:', registration.scope);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New content is available, show update notification
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        });
    }
}

// Show update notification
function showUpdateNotification() {
    if (confirm('A new version of PixelWave is available. Would you like to update?')) {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then(registration => {
                if (registration && registration.waiting) {
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                }
            });
        }
    }
}

// Offline form handling
function initOfflineFormHandling() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    // Store form data when offline
    contactForm.addEventListener('submit', (e) => {
        if (!navigator.onLine) {
            e.preventDefault();
            storeFormDataOffline(new FormData(contactForm));
            showOfflineMessage();
        }
    });
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
        console.log('Connection restored');
        submitOfflineForms();
    });
    
    window.addEventListener('offline', () => {
        console.log('Connection lost');
    });
}

// Store form data offline
function storeFormDataOffline(formData) {
    const data = Object.fromEntries(formData.entries());
    data.timestamp = Date.now();
    
    if ('indexedDB' in window) {
        const request = indexedDB.open('PixelWaveOffline', 1);
        request.onerror = () => console.error('Failed to open IndexedDB');
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['forms'], 'readwrite');
            const store = transaction.objectStore('forms');
            store.add(data);
        };
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains('forms')) {
                db.createObjectStore('forms', { keyPath: 'id', autoIncrement: true });
            }
        };
    }
}

// Submit offline forms when back online
function submitOfflineForms() {
    if ('indexedDB' in window) {
        const request = indexedDB.open('PixelWaveOffline', 1);
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['forms'], 'readwrite');
            const store = transaction.objectStore('forms');
            const getAllRequest = store.getAll();
            
            getAllRequest.onsuccess = () => {
                const forms = getAllRequest.result;
                forms.forEach(form => {
                    fetch('/api/contact', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(form)
                    }).then(response => {
                        if (response.ok) {
                            store.delete(form.id);
                        }
                    });
                });
            };
        };
    }
}

// Show offline message
function showOfflineMessage() {
    const message = document.createElement('div');
    message.className = 'offline-message';
    message.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #ff6b6b; color: white; padding: 16px; border-radius: 8px; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
            <strong>Offline</strong><br>
            Your message has been saved and will be sent when you're back online.
        </div>
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 5000);
}

// Global function for button clicks (accessible from HTML)
window.scrollToSection = scrollToSection;
// (Client portal export removed)

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
    
    // Recalculate positions for scroll effects
    updateActiveNav();
}, { passive: true });

// Preload critical resources for better performance
function preloadResources() {
    // Preload YouTube embed iframe for faster modal loading
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = 'https://www.youtube.com';
    document.head.appendChild(link);
    
    // Preload brand font if needed
    const fontLink = document.createElement('link');
    fontLink.rel = 'preconnect';
    fontLink.href = 'https://fonts.googleapis.com';
    document.head.appendChild(fontLink);
}

// Advanced intersection observer for better performance
function initAdvancedObservers() {
    // Lazy load non-critical elements
    const lazyElements = document.querySelectorAll('.testimonial-card, .process-step');
    
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                lazyObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    lazyElements.forEach(element => {
        lazyObserver.observe(element);
    });
}

// Initialize advanced features
setTimeout(() => {
    preloadResources();
    initAdvancedObservers();
}, 1000);

// Enhanced error handling
window.addEventListener('error', (e) => {
    console.warn('PixelWave: Minor issue detected, but site continues to function normally.');
});

// Add loading indicator for slow connections
function showLoadingIndicator() {
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'loading-indicator';
    loadingIndicator.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #402540, #15015B);
            transform: translateX(-100%);
            animation: loading 2s ease-in-out;
            z-index: 9999;
        "></div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes loading {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(loadingIndicator);
    
    setTimeout(() => {
        if (loadingIndicator.parentNode) {
            loadingIndicator.remove();
        }
    }, 2000);
}

// Show loading indicator on slower connections
if (navigator.connection && navigator.connection.effectiveType === 'slow-2g') {
    showLoadingIndicator();
}

// PixelWave Canvas Animation (White Neon Version)
    class PixelWaveCanvas {
    constructor() {
        this.canvas = document.getElementById("pixelCanvas");
        this.ctx = this.canvas?.getContext("2d");
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.animationId = null;
        this.prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        this.lastFrameTime = 0;
        this.targetFPS = 30;
        this.frameInterval = 1000 / this.targetFPS;

        // Disable canvas animation on mobile for better performance
        const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (this.canvas && !this.prefersReducedMotion && !isMobile) {
        this.initCanvas();
        this.createPixels();
        this.setupMouse();
        this.animate();
        }
    }

    setupMouse() {
        document.addEventListener("mousemove", (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        });
    }

    initCanvas() {
        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createPixels() {
        // Reduced particle count for better performance
        const pixelCount = Math.min(80, Math.floor((this.canvas.width * this.canvas.height) / 25000));
        this.particles = [];

        for (let i = 0; i < pixelCount; i++) {
        this.particles.push({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            baseX: Math.random() * this.canvas.width,
            baseY: Math.random() * this.canvas.height,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.6 + 0.2,
            speed: Math.random() * 0.5 + 0.1,
            angle: Math.random() * Math.PI * 2,
            wave: Math.random() * 0.02 + 0.01,
        });
        }
    }

    animate() {
        if (!this.ctx || !this.canvas) return;

        // Frame rate limiting for better performance
        const now = performance.now();
        if (now - this.lastFrameTime < this.frameInterval) {
            this.animationId = requestAnimationFrame(() => this.animate());
            return;
        }
        this.lastFrameTime = now;

        // Clear canvas with dark background
        this.ctx.fillStyle = "rgba(15, 13, 52, 1)"; // dark navy background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Soft glow area following mouse
        const gradient = this.ctx.createRadialGradient(
        this.mouseX,
        this.mouseY,
        0,
        this.mouseX,
        this.mouseY,
        250
        );
        gradient.addColorStop(0, "rgba(255,255,255,0.15)");
        gradient.addColorStop(1, "rgba(255,255,255,0.03)");
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw particles
        this.particles.forEach((particle) => {
        const dx = this.mouseX - particle.x;
        const dy = this.mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
            const force = (150 - distance) / 150;
            particle.x += dx * force * 0.02;
            particle.y += dy * force * 0.02;
        } else {
            particle.x += (particle.baseX - particle.x) * 0.02;
            particle.y += (particle.baseY - particle.y) * 0.02;
            particle.angle += particle.wave;
            particle.x += Math.sin(particle.angle) * 0.5;
            particle.y += Math.cos(particle.angle) * 0.3;
        }

        // White neon-glow ball
        this.ctx.save();
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
        this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
        });

        // Connect lines between nearby particles (neon white glow)
        for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
            const dx = this.particles[i].x - this.particles[j].x;
            const dy = this.particles[i].y - this.particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
            this.ctx.save();
            this.ctx.globalAlpha = ((100 - dist) / 100) * 0.15;
            this.ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
            this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
            this.ctx.stroke();
            this.ctx.restore();
            }
        }
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }
    }

    // Initialize only the canvas animation
    document.addEventListener("DOMContentLoaded", () => {
    new PixelWaveCanvas();
    });
