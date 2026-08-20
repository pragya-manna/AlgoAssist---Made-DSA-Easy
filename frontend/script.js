/**
 * AlgoAssist - Made DSA easy
 * Professional and attractive website interactions.
 * Designed to evoke an "earning platform" feel through dynamic interactions.
 *
 * This script provides all client-side interactivity using pure vanilla JavaScript.
 * It assumes corresponding HTML elements and CSS classes are defined to support these interactions.
 *
 * Features:
 * - Navbar toggle for mobile devices.
 * - Smooth scrolling for anchor links.
 * - Dynamic ripple effect on button clicks.
 * - Fade-in animations for elements as they scroll into view.
 * - Simple background parallax effect.
 * - Dynamic highlight for navigation based on scroll position.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Feature 1: Navbar Toggle on Mobile ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const navbarMenu = document.getElementById('navbar-menu');
    const navLinks = document.querySelectorAll('#navbar-menu a'); // For closing menu on link click

    if (mobileMenuButton && navbarMenu) {
        mobileMenuButton.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
            mobileMenuButton.classList.toggle('is-active'); // For animating hamburger icon
        });

        // Close menu when a navigation link is clicked (on mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarMenu.classList.contains('active')) {
                    navbarMenu.classList.remove('active');
                    mobileMenuButton.classList.remove('is-active');
                }
            });
        });
    }

    // --- Feature 2: Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Use scrollIntoView with smooth behavior for modern browsers
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' // Aligns the top of the element with the top of the viewport
                });
            }
        });
    });

    // --- Feature 3: Button Click Ripple Effect ---
    document.querySelectorAll('.btn, .ripple-effect').forEach(button => {
        button.addEventListener('click', function (e) {
            const buttonRect = this.getBoundingClientRect();
            const x = e.clientX - buttonRect.left;
            const y = e.clientY - buttonRect.top;

            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            // Calculate the diameter for the ripple
            const diameter = Math.max(buttonRect.width, buttonRect.height);
            ripple.style.width = `${diameter * 2}px`;
            ripple.style.height = `${diameter * 2}px`;

            this.appendChild(ripple);

            // Add the 'animating' class to trigger CSS animation
            // Use setTimeout to ensure the DOM has time to render the element before adding class
            setTimeout(() => {
                ripple.classList.add('animating');
            }, 0);


            // Remove ripple after animation completes (adjust time to match CSS animation duration)
            ripple.addEventListener('animationend', () => {
                ripple.remove();
            }, { once: true });
        });
    });

    // --- Feature 4a: Fade-in Animation on Scroll ---
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
    const scrollObserverOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of element is visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, scrollObserverOptions);

    animateOnScrollElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // --- Feature 4b: Simple Background Parallax Effect ---
    const parallaxElements = document.querySelectorAll('.parallax-bg');

    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
            const scrollPos = window.pageYOffset;

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallaxSpeed) || 0.5; // Default speed
                const yPos = -(scrollPos * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // --- Feature 4c: Active Navigation Link Highlight on Scroll ---
    const sections = document.querySelectorAll('section'); // Assuming your content is in <section> tags
    const navMenuItems = document.querySelectorAll('#navbar-menu a');

    const highlightNavOnScroll = () => {
        let currentActiveSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Check if section is in viewport + a buffer
            if (window.pageYOffset >= sectionTop - sectionHeight * 0.3) { // Adjust 0.3 for sensitivity
                currentActiveSection = section.getAttribute('id');
            }
        });

        navMenuItems.forEach(item => {
            item.classList.remove('active-nav-link');
            if (item.getAttribute('href').includes(currentActiveSection)) {
                item.classList.add('active-nav-link');
            }
        });
    };

    // Initial highlight on load
    highlightNavOnScroll();
    window.addEventListener('scroll', highlightNavOnScroll);


    // --- General Utility: Debounce for performance ---
    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }

    // Example of using debounce for scroll events if needed for other features:
    // window.addEventListener('scroll', debounce(() => {
    //     // Perform heavy calculations here
    //     console.log('Scroll event debounced!');
    // }, 100));


    // --- Example of a simple interactive element: Animated Counter ---
    const counterElements = document.querySelectorAll('.animated-counter');

    const counterObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.8 // Trigger when 80% of counter is visible
    };

    const animateCounter = (entry, observer) => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const targetValue = parseInt(target.dataset.target, 10);
            let currentValue = 0;
            const duration = 2000; // milliseconds
            const increment = Math.ceil(targetValue / (duration / 10)); // Calculate step

            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= targetValue) {
                    currentValue = targetValue;
                    clearInterval(timer);
                }
                target.textContent = currentValue.toLocaleString(); // Format with commas
            }, 10);
            observer.unobserve(target); // Stop observing once counted
        }
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => animateCounter(entry, observer));
    }, counterObserverOptions);

    counterElements.forEach(el => {
        counterObserver.observe(el);
    });

    // --- Dynamic Card Hover Effect (Purely CSS-driven, but JS could add/remove classes) ---
    // Assuming CSS handles the actual hover effect for elements with a class like 'interactive-card'
    // JS would only be needed if the hover effect was more complex or involved manipulating multiple elements.
    // For now, it's illustrative that the design implicitly expects CSS-driven hover effects for "earning platform" feel.
    // Example:
    // document.querySelectorAll('.interactive-card').forEach(card => {
    //     card.addEventListener('mouseenter', () => card.classList.add('hovered'));
    //     card.addEventListener('mouseleave', () => card.classList.remove('hovered'));
    // });

});

// --- End of JavaScript ---