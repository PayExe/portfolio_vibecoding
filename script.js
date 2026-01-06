// ===== VISIT COUNTER =====
function initVisitCounter() {
    let visits = localStorage.getItem('visitCount');
    visits = visits ? parseInt(visits) + 1 : 1;
    localStorage.setItem('visitCount', visits);
    document.getElementById('visit-count').textContent = visits;
}

// ===== THEME TOGGLE (DARK/LIGHT MODE) =====
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ===== PROJECT CAROUSEL =====
class ProjectCarousel {
    constructor() {
        this.currentIndex = 0;
        this.allProjects = Array.from(document.querySelectorAll('.projects-carousel .project-card'));
        this.filteredProjects = [...this.allProjects];
        this.carousel = document.querySelector('.projects-carousel');
        this.prevBtn = document.querySelector('.carousel-prev');
        this.nextBtn = document.querySelector('.carousel-next');
        this.indicatorsContainer = document.querySelector('.carousel-indicators');
        
        this.init();
    }
    
    init() {
        this.updateCarousel();
        this.createIndicators();
        
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // Auto-advance every 5 seconds
        this.autoPlay = setInterval(() => this.next(), 5000);
        
        // Pause on hover
        this.carousel.addEventListener('mouseenter', () => clearInterval(this.autoPlay));
        this.carousel.addEventListener('mouseleave', () => {
            this.autoPlay = setInterval(() => this.next(), 5000);
        });
    }
    
    updateCarousel() {
        // Masquer tous les projets d'abord
        this.allProjects.forEach(card => {
            card.classList.remove('active', 'prev');
            card.classList.add('hidden');
            card.style.display = 'none';
        });
        
        // Afficher uniquement les projets filtrés
        this.filteredProjects.forEach((card, index) => {
            card.style.display = 'block';
            card.classList.remove('hidden');
            
            if (index === this.currentIndex) {
                card.classList.add('active');
            } else if (index < this.currentIndex) {
                card.classList.add('prev');
            }
        });
        
        this.updateButtons();
        this.updateIndicators();
    }
    
    updateButtons() {
        this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
        this.prevBtn.style.cursor = this.currentIndex === 0 ? 'not-allowed' : 'pointer';
        this.nextBtn.style.opacity = this.currentIndex === this.filteredProjects.length - 1 ? '0.5' : '1';
        this.nextBtn.style.cursor = this.currentIndex === this.filteredProjects.length - 1 ? 'not-allowed' : 'pointer';
    }
    
    createIndicators() {
        this.indicatorsContainer.innerHTML = '';
        this.filteredProjects.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (index === this.currentIndex) indicator.classList.add('active');
            indicator.addEventListener('click', () => this.goTo(index));
            this.indicatorsContainer.appendChild(indicator);
        });
    }
    
    updateIndicators() {
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    next() {
        if (this.currentIndex < this.filteredProjects.length - 1) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }
    
    goTo(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }
    
    filter(category) {
        if (category === 'all') {
            this.filteredProjects = [...this.allProjects];
        } else {
            this.filteredProjects = this.allProjects.filter(card => 
                card.dataset.categories.includes(category)
            );
        }
        
        this.currentIndex = 0;
        this.updateCarousel();
        this.createIndicators();
    }
}

// ===== PROJECT FILTERS =====
const carousel = new ProjectCarousel();
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        carousel.filter(filter);
    });
});

// ===== FORM VALIDATION =====
const formInputs = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    subject: document.getElementById('subject'),
    message: document.getElementById('message')
};

const formErrors = {
    name: document.getElementById('name-error'),
    email: document.getElementById('email-error'),
    subject: document.getElementById('subject-error'),
    message: document.getElementById('message-error')
};

function validateField(field, value) {
    switch(field) {
        case 'name':
            if (value.length < 2) {
                return 'Le nom doit contenir au moins 2 caractères';
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return 'Veuillez entrer une adresse email valide';
            }
            break;
        case 'subject':
            if (value.length < 3) {
                return 'Le sujet doit contenir au moins 3 caractères';
            }
            break;
        case 'message':
            if (value.length < 10) {
                return 'Le message doit contenir au moins 10 caractères';
            }
            break;
    }
    return '';
}

function showError(field, message) {
    formInputs[field].classList.add('error');
    formInputs[field].classList.remove('valid');
    formErrors[field].textContent = message;
    formErrors[field].classList.add('show');
}

function showValid(field) {
    formInputs[field].classList.remove('error');
    formInputs[field].classList.add('valid');
    formErrors[field].classList.remove('show');
}

// Real-time validation
Object.keys(formInputs).forEach(field => {
    formInputs[field].addEventListener('input', (e) => {
        const value = e.target.value.trim();
        const error = validateField(field, value);
        
        if (error) {
            showError(field, error);
        } else if (value) {
            showValid(field);
        }
    });
    
    formInputs[field].addEventListener('blur', (e) => {
        const value = e.target.value.trim();
        const error = validateField(field, value);
        
        if (error && value) {
            showError(field, error);
        }
    });
});

// ===== CONTACT FORM SUBMISSION =====
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    Object.keys(formInputs).forEach(field => {
        const value = formInputs[field].value.trim();
        const error = validateField(field, value);
        
        if (error) {
            showError(field, error);
            isValid = false;
        }
    });
    
    if (!isValid) {
        formStatus.textContent = 'Veuillez corriger les erreurs avant d\'envoyer';
        formStatus.className = 'error';
        formStatus.style.display = 'block';
        setTimeout(() => formStatus.style.display = 'none', 3000);
        return;
    }
    
    const formData = {
        name: formInputs.name.value,
        email: formInputs.email.value,
        subject: formInputs.subject.value,
        message: formInputs.message.value
    };
    
    // Create mailto link
    const mailtoLink = `mailto:paolo.antonini.dev@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
        `Nom: ${formData.name}\n` +
        `Email: ${formData.email}\n\n` +
        `Message:\n${formData.message}`
    )}`;
    
    window.location.href = mailtoLink;
    
    formStatus.textContent = 'Votre client mail par défaut va s\'ouvrir. Si cela ne fonctionne pas, envoyez un email directement à paolo.antonini.dev@gmail.com';
    formStatus.className = 'success';
    formStatus.style.display = 'block';
    
    contactForm.reset();
    Object.keys(formInputs).forEach(field => {
        formInputs[field].classList.remove('error', 'valid');
    });
    
    setTimeout(() => formStatus.style.display = 'none', 8000);
});

// ===== SMOOTH SCROLLING =====
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

// ===== NAVBAR SCROLL EFFECT =====
let lastScroll = 0;
const navbar = document.querySelector('.navbar');
let navbarTicking = false;

function updateNavbar() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
    }
    
    lastScroll = currentScroll;
    navbarTicking = false;
}

window.addEventListener('scroll', () => {
    if (!navbarTicking) {
        window.requestAnimationFrame(updateNavbar);
        navbarTicking = true;
    }
}, { passive: true });

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Animer les skill-cards en cascade
            if (entry.target.classList.contains('skills-category')) {
                const skillCards = entry.target.querySelectorAll('.skill-card');
                skillCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 50);
                });
            }
            
            // Arrêter d'observer une fois animé
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observer les sections et conteneurs principaux, pas chaque skill-card
document.querySelectorAll('.about-card, .skills-category, .contact-info, .contact-form-wrapper').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Préparer les skill-cards pour l'animation en cascade
document.querySelectorAll('.skill-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

let ticking = false;

function updateActiveNavLink() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateActiveNavLink);
        ticking = true;
    }
});

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    initVisitCounter();
});
