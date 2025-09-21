// Global Variables
let currentProjectSlide = 0;
const totalProjectSlides = 2;
let countersAnimated = false;
let educationAnimated = false;

// DOM Elements - cached for performance
let navbar, navLinks, sections;
let projectsCarousel, projectsSlides, projectsDots;

/**
 * Initialize all functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements for better performance
    initializeDOMElements();
    
    // Initialize all functionality modules
    initNavbar();
    initProjectsCarousel();
    initModals();
    initScrollAnimations();
    initFormHandling();
    initEducationAnimations();
    initScrollIndicator();
    initBackToTop();
    
    console.log('Ziyi Chen Portfolio - Initialized successfully!');
});

/**
 * Cache DOM elements to avoid repeated queries
 */
function initializeDOMElements() {
    navbar = document.getElementById('navbar');
    navLinks = document.querySelectorAll('.nav-link');
    sections = document.querySelectorAll('.section');
    
    // Projects carousel elements
    projectsCarousel = document.getElementById('projects-carousel');
    projectsSlides = document.querySelectorAll('.projects-slide');
    projectsDots = document.querySelectorAll('.projects-carousel-dots .dot');
}

/**
 * Initialize navigation functionality
 * Handles navbar resizing, position indicators, and smooth scrolling
 */
function initNavbar() {
    if (!navbar || !navLinks.length) return;
    
    // Handle navbar link clicks for smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                scrollToSection(targetSection);
                closeHamburgerMenu(); // clicking a nav link to close the hamburger menu
            }
            this.blur(); // Remove focus for better UX
        });
    });
    
    // Handle scroll events with throttling for better performance
    window.addEventListener('scroll', throttle(handleScroll, 10), { passive: true });

    // Initialize hamburger menu functionality
    initHamburgerMenuOnce();
}

function initHamburgerMenuOnce() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.onclick = function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    };
    
    document.onclick = function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    };
}


function closeHamburgerMenu() {
    if (window.closeDropdownMenu) {
        window.closeDropdownMenu();
    }
}


/**
 * Handle all scroll-related functionality
 * - Navbar resizing
 * - Position indicator updates
 * - Counter animations
 * - Education animations
 */
function handleScroll() {
    if (!navbar) return;
    
    const scrollPosition = window.scrollY;
    
    // Navbar resizing based on scroll position
    if (scrollPosition > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active navigation link based on current section
    updateActiveNavLink();
    
    // Trigger animations when sections come into view
    animateCountersOnScroll();
    animateEducationOnScroll();
}

/**
 * Update active navigation link based on scroll position
 * Highlights the nav link corresponding to the current section
 */
function updateActiveNavLink() {
    if (!navbar || !navLinks.length || !sections.length) return;
    
    const scrollPosition = window.scrollY;
    const navbarHeight = navbar.offsetHeight;
    
    sections.forEach((section) => {
        const sectionTop = section.offsetTop - navbarHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            // Remove active class from all nav links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to current nav link
            const correspondingNavLink = document.querySelector(`a[href="#${section.id}"]`);
            if (correspondingNavLink) {
                correspondingNavLink.classList.add('active');
            }
        }
    });
    
    // Special case: highlight last item when at bottom of page
    if (window.innerHeight + scrollPosition >= document.body.offsetHeight - 10) {
        navLinks.forEach(link => link.classList.remove('active'));
        const lastNavLink = document.querySelector('a[href="#contact"]');
        if (lastNavLink) {
            lastNavLink.classList.add('active');
        }
    }
}

/**
 * Smooth scroll to target section with navbar offset
 * @param {Element} targetSection - The section element to scroll to
 */
function scrollToSection(targetSection) {
    if (!navbar || !targetSection) return;
    
    const navbarHeight = navbar.offsetHeight;
    const targetPosition = targetSection.offsetTop - navbarHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

/**
 * Initialize projects carousel functionality
 * Sets up slide navigation, touch support, and keyboard controls
 */
function initProjectsCarousel() {
    if (!projectsCarousel || !projectsSlides.length) return;
    
    // Show initial slide
    showProjectSlide(currentProjectSlide);
    
    // Add touch support for mobile devices
    addProjectsCarouselTouchSupport();
}

/**
 * Change project slide in carousel
 * @param {number} direction - Direction to move (-1 for previous, 1 for next)
 */
function changeProjectSlide(direction) {
    currentProjectSlide += direction;
    
    // Handle wraparound
    if (currentProjectSlide >= totalProjectSlides) {
        currentProjectSlide = 0;
    } else if (currentProjectSlide < 0) {
        currentProjectSlide = totalProjectSlides - 1;
    }
    
    showProjectSlide(currentProjectSlide);
}

/**
 * Jump to specific project slide
 * @param {number} slideIndex - Index of slide to show (1-based)
 */
function currentProjectSlideFunc(slideIndex) {
    currentProjectSlide = slideIndex - 1;
    showProjectSlide(currentProjectSlide);
}

/**
 * Display the specified project slide and update indicators
 * @param {number} slideIndex - Index of slide to show (0-based)
 */
function showProjectSlide(slideIndex) {
    if (!projectsSlides.length) return;
    
    // Hide all slides
    projectsSlides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Show current slide
    if (projectsSlides[slideIndex]) {
        projectsSlides[slideIndex].classList.add('active');
    }
    
    // Update dot indicators
    if (projectsDots.length) {
        projectsDots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === slideIndex) {
                dot.classList.add('active');
            }
        });
    }
}

/**
 * Add touch/swipe support for projects carousel
 * Enables mobile-friendly navigation
 */
function addProjectsCarouselTouchSupport() {
    if (!projectsCarousel) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Track touch start position
    projectsCarousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    // Handle swipe gesture on touch end
    projectsCarousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleProjectSwipe();
    }, { passive: true });
    
    /**
     * Process swipe gesture and change slides accordingly
     */
    function handleProjectSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                changeProjectSlide(1); // Swipe left - next slide
            } else {
                changeProjectSlide(-1); // Swipe right - previous slide
            }
        }
    }
}

// Expose carousel functions globally for button clicks
window.changeProjectSlide = changeProjectSlide;
window.currentProjectSlide = currentProjectSlideFunc;

/**
 * Initialize education cards animation setup
 * Prepares cards for scroll-triggered animations
 */
function initEducationAnimations() {
    const educationCards = document.querySelectorAll('.edu-item');
    
    // Only set initial hidden state if cards exist
    if (educationCards.length > 0) {
        educationCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
        });
    }
}



/**
 * Animate education cards when section comes into view
 * Uses staggered animation timing for visual appeal
 */
function animateEducationOnScroll() {
    if (educationAnimated) return;
    
    const educationSection = document.getElementById('education');
    if (!educationSection) return;
    
    // Use a more lenient viewport check for education section
    const rect = educationSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isVisible) {
        educationAnimated = true;
        const educationCards = document.querySelectorAll('.edu-item');
        
        // Stagger animations for better visual effect
        educationCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
}


function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                scrollToSection(aboutSection);
            }
        });
    
        scrollIndicator.style.cursor = 'pointer';
    }
}


/**
 * Initialize modal functionality
 * Handles opening, closing, and keyboard/click events
 */
function initModals() {
    // Close modal when clicking outside of content
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });
}

/**
 * Open a modal by ID
 * @param {string} modalId - ID of the modal to open
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

/**
 * Close a modal by ID
 * @param {string} modalId - ID of the modal to close
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

/**
 * Close all open modals
 */
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// Expose modal functions globally
window.openModal = openModal;
window.closeModal = closeModal;

/**
 * Animate stat counters when about section comes into view
 * Creates counting animation effect for statistics
 */
function animateCountersOnScroll() {
    if (countersAnimated) return;
    
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;
    
    if (isElementInViewport(aboutSection)) {
        countersAnimated = true;
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const targetText = counter.textContent;
            const target = parseFloat(targetText.replace(/[^\d.]/g, ''));
            const duration = 800; // Animation duration in milliseconds
            const increment = target / (duration / 16); // 60 FPS
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Preserve original suffix (like '+' symbol)
                const suffix = targetText.includes('+') ? '+' : '';
                if (targetText.includes('.')) {
                    counter.textContent = current.toFixed(1) + suffix;
                } else {
                    counter.textContent = Math.floor(current) + suffix;
                }
            }, 16);
        });
    }
}

/**
 * Initialize scroll-triggered animations using Intersection Observer
 * More performant than scroll event listeners for animations
 */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.animate-fade-in, .animate-slide-up, .animate-bounce');
    
    // Use Intersection Observer for better performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '50px' // Trigger animation slightly before element is visible
    });
    
    // Set initial state and observe elements
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
}


/**
 * Display notification message to user
 * @param {string} message - Message to display
 * @param {string} type - Type of notification ('success', 'error', 'info')
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1';
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 2001;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        max-width: 300px;
        font-size: 14px;
        animation: slideInFromRight 0.3s ease;
        word-wrap: break-word;
    `;
    
    notification.innerHTML = `
        <i class="fas ${icon}" style="margin-right: 10px;"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutToRight 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

/**
 * Check if element is visible in viewport
 * @param {Element} el - Element to check
 * @returns {boolean} - True if element is in viewport
 */
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top < window.innerHeight && 
        rect.bottom > 0
    );
}

/**
 * Throttle function execution for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Throttled function
 */
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Debounce function execution for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Handle window load event
 * Initialize final loading animations and states
 */
window.addEventListener('load', function() {
    // Trigger initial scroll handler to set correct states
    handleScroll();
    
    // Animate hero content on load
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }
});

/**
 * Handle window resize events
 * Update navigation and layout as needed
 */
window.addEventListener('resize', debounce(() => {
    updateActiveNavLink();
}, 250));

/**
 * Handle keyboard navigation for accessibility
 */
document.addEventListener('keydown', function(e) {
    // Projects carousel keyboard navigation when focused
    const projectsCarouselHovered = document.querySelector('.projects-carousel-container:hover');
    if (projectsCarouselHovered) {
        if (e.key === 'ArrowLeft') {
            changeProjectSlide(-1);
            e.preventDefault();
        } else if (e.key === 'ArrowRight') {
            changeProjectSlide(1);
            e.preventDefault();
        }
    }
    
    // Modal escape key handling
    if (e.key === 'Escape') {
        closeAllModals();
    }
    
    // Navigation shortcuts (optional enhancement)
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                scrollToSection(document.getElementById('home'));
                break;
            case '2':
                e.preventDefault();
                scrollToSection(document.getElementById('about'));
                break;
            case '3':
                e.preventDefault();
                scrollToSection(document.getElementById('hobbies'));
                break;
            case '4':
                e.preventDefault();
                scrollToSection(document.getElementById('education'));
                break;
            case '5':
                e.preventDefault();
                scrollToSection(document.getElementById('projects'));
                break;
            case '6':
                e.preventDefault();
                scrollToSection(document.getElementById('contact'));
                break;
        }
    }
});

/**
 * Add dynamic CSS animations for notifications
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInFromRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutToRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    /* Enhanced hover effects for better UX */
    .edu-item:hover {
        transform: translateY(-8px) !important;
    }
    
    .project-card:hover {
        transform: translateY(-5px) !important;
    }
    
    .hobby-card:hover,
    
    .profile-image:hover {
        transform: scale(1.05) !important;
    }
    
    /* Focus styles for accessibility */
    .cta-button:focus,
    .submit-btn:focus,
    .projects-carousel-btn:focus {
        outline: 3px solid rgba(99, 102, 241, 0.5);
        outline-offset: 2px;
    }
    
    .nav-link:focus {
        outline: 2px solid rgba(99, 102, 241, 0.5);
        outline-offset: 2px;
        border-radius: 4px;
    }
    
    /* Loading state for form submission */
    .contact-form.loading {
        opacity: 0.6;
        pointer-events: none;
    }
    
    .contact-form.loading .submit-btn::after {
        content: '';
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-left: 10px;
        border: 2px solid transparent;
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

/**
 * Error handling for better user experience
 */
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
    // Could show user-friendly error message here if needed
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // Could show user-friendly error message here if needed
});


/**
 * Initialize back to top button
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }, 100));
    
    // Click handler for smooth scroll to top
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.onsubmit = handleFormSubmit;
        console.log('Form handler set');
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const name = form.querySelector('input').value;
    const email = form.querySelector('input[type="email"]').value;
    const message = form.querySelector('textarea').value;
    
    if (name && email && message) {
        alert('Message sent!');
        form.reset();
    } else {
        alert('Please fill all fields');
    }
    return false;
}

/**
 * Initialize all enhancements
 */


// Initialize enhancements when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEnhancements);
} else {
    initEnhancements();
}

console.log('Ziyi Chen Portfolio - All scripts loaded successfully with enhanced features!');