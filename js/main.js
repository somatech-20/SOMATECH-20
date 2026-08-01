document.addEventListener('DOMContentLoaded', () => {
    // ===== Initialize =====
    // Add loading state
    document.body.classList.add('loaded');

    // Trigger initial animations
    setTimeout(() => {
        reveal();
        checkCounters();
    }, 100);

    // ===== Custom Cursor =====
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-tag');

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Smooth cursor following
        cursorX += (mouseX - cursorX) * 0.5;
        cursorY += (mouseY - cursorY) * 0.5;
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hover effects for interactive elements
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        });
    });

    // ===== Navigation =====
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile navigation toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile nav on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // ===== Smooth Scroll =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== Reveal on Scroll =====
    function reveal() {
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    // Add reveal class to elements
    document.querySelectorAll('.project-card, .stat, .about-text, .contact-info, .contact-form').forEach(el => {
        el.classList.add('reveal');
    });

    const reveals = document.querySelectorAll('.reveal');

    window.addEventListener('scroll', reveal);
    reveal(); // Trigger once on load

    // ===== Animated Counter =====
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    function animateCounters() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(animateCounters, 20);
            } else {
                counter.innerText = target + '+';
            }
        });
    }

    // Trigger counter animation when in view
    const statsSection = document.querySelector('.about-stats');
    let counted = false;

    function checkCounters() {
        if (!statsSection || counted) return;

        const rect = statsSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight - 100) {
            animateCounters();
            counted = true;
        }
    }

    window.addEventListener('scroll', checkCounters);

    // ===== Contact Form =====
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Here you would typically send the data to a server
            console.log('Form submitted:', data);

            // Show success message
            const btn = contactForm.querySelector('.btn');
            const originalText = btn.innerText;
            btn.innerText = 'Message Sent!';
            btn.style.background = '#22c55e';

            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = '';
                contactForm.reset();
            }, 3000);
        });
    }

    // ===== Parallax Effect for Hero Image =====
    const heroImage = document.querySelector('.hero-image');

    window.addEventListener('scroll', () => {
        if (!heroImage) return;

        const scrolled = window.scrollY;
        const heroSection = document.querySelector('.hero');
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;

        if (scrolled < heroBottom) {
            const parallaxSpeed = scrolled * 0.3;
            heroImage.style.transform = `translateY(${parallaxSpeed}px)`;
        }
    });

    // ===== Active Navigation Link =====
    const sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink?.classList.add('active');
            } else {
                navLink?.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    // ===== Performance Optimization =====
    // Debounce function for scroll events
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

    // Use debounced scroll handler
    const debouncedScrollHandler = debounce(() => {
        reveal();
        checkCounters();
        highlightNavLink();
    }, 10);

    window.addEventListener('scroll', debouncedScrollHandler);
});