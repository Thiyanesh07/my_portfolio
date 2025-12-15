// ==================== 3D PARTICLE BACKGROUND ====================
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('canvas3d');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;
        this.connectionDistance = 150;
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((particle, i) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off walls
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 212, 255, 0.5)';
            this.ctx.fill();
            
            // Draw connections
            this.particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.connectionDistance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${1 - distance / this.connectionDistance})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ==================== CURSOR GLOW ====================
function initCursorGlow() {
    const glow = document.querySelector('.cursor-glow');
    if (!glow) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        
        requestAnimationFrame(animateGlow);
    }
    
    animateGlow();
}

// ==================== SCROLL PROGRESS ====================
function updateScrollProgress() {
    const progress = document.querySelector('.scroll-progress');
    if (!progress) return;
    
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    progress.style.width = scrolled + '%';
}

// ==================== NAVIGATION ====================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        updateScrollProgress();
        updateActiveLink();
    });
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Active link on scroll
    function updateActiveLink() {
        let current = '';
        const sections = document.querySelectorAll('.section, .hero');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }
}

// ==================== SMOOTH SCROLL ====================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== TYPEWRITER EFFECT ====================
function initTypewriter() {
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;
    
    const words = ['Machine Learning', 'Deep Learning', 'Computer Vision', 'Natural Language Processing', 'Data Science'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    type();
}

// ==================== SCROLL ANIMATIONS (AOS) ====================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                
                // Stagger children animations
                const children = entry.target.querySelectorAll('[data-aos]');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('aos-animate');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

// ==================== BACK TO TOP ====================
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== CONTACT FORM ====================
function initContactForm() {
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate
        if (!data.name || !data.email || !data.message) {
            showFormStatus('Please fill in all required fields.', 'error');
            return;
        }
        
        // Show loading
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;
        
        // Check if EmailJS is loaded
        if (typeof emailjs === 'undefined') {
            showFormStatus('Email service not loaded. Please refresh the page.', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        // Send email using EmailJS
        try {
            console.log('Attempting to send email...', {
                name: data.name,
                email: data.email,
                subject: data.subject
            });
            
            const response = await emailjs.send(
                'service_71jbyvm',      // Your EmailJS Service ID
                'template_s6s6yro',     // Your EmailJS Template ID
                {
                    from_name: data.name,
                    from_email: data.email,
                    subject: data.subject,
                    message: data.message,
                    to_name: 'Thiyanesh',
                }
            );
            
            console.log('Email sent successfully:', response);
            showFormStatus('Message sent successfully! I\'ll get back to you soon. ✓', 'success');
            form.reset();
            
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        } catch (error) {
            console.error('EmailJS Error Details:', error);
            let errorMessage = 'Failed to send message. ';
            
            if (error.text) {
                errorMessage += error.text;
            } else if (error.message) {
                errorMessage += error.message;
            } else {
                errorMessage += 'Please try again or email directly at thiyanesh7777@gmail.com';
            }
            
            showFormStatus(errorMessage, 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    function showFormStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
    }
}

// ==================== FLOATING CARDS PARALLAX ====================
function initFloatingCards() {
    const floatingCards = document.querySelectorAll('.float-card');
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        floatingCards.forEach((card, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed * 50;
            const y = (mouseY - 0.5) * speed * 50;
            
            card.style.transform = `translate(${x}px, ${y}px) rotate(${x * 0.1}deg)`;
        });
    });
}

// ==================== 3D TILT EFFECT ====================
function init3DTilt() {
    // Disabled - no 3D tilt effect
}

// ==================== PRELOADER ====================
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 300);
        }, 1000);
    }
}

// ==================== PERFORMANCE: DEBOUNCE ====================
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

// ==================== INITIALIZE ALL ====================
function init() {
    // Core features
    new ParticleSystem();
    initCursorGlow();
    initNavigation();
    initSmoothScroll();
    initTypewriter();
    initScrollAnimations();
    initBackToTop();
    initContactForm();
    
    // Enhanced features
    setTimeout(() => {
        initFloatingCards();
        init3DTilt();
    }, 500);
    
    hidePreloader();
    
    // Success message
    console.log('%c🚀 3D Portfolio Loaded', 'color: #00d4ff; font-size: 16px; font-weight: bold;');
    console.log('%c✨ Semi-Dark Theme | 3D Animated | Professional', 'color: #6366f1; font-size: 12px;');
}

// ==================== START APPLICATION ====================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ==================== HANDLE RESIZE ====================
window.addEventListener('resize', debounce(() => {
    const navMenu = document.getElementById('navMenu');
    if (window.innerWidth > 968 && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        document.getElementById('navToggle').classList.remove('active');
        document.body.style.overflow = '';
    }
}, 250));

// ==================== KEYBOARD NAVIGATION ====================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// ==================== DISABLE RIGHT CLICK (OPTIONAL) ====================
// Uncomment if you want to protect images
// document.addEventListener('contextmenu', (e) => e.preventDefault());
