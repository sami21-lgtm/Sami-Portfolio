/* ============================
   INTERACTIVE SPIDER-WEB PARTICLES
   ============================ */
const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse movement
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Interactive repulsion from cursor
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let angle = Math.atan2(dy, dx);
                    let force = (mouse.radius - dist) / mouse.radius;
                    this.x -= Math.cos(angle) * force * 2;
                    this.y -= Math.sin(angle) * force * 2;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(140, 130, 255, 0.7)';
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        // Calculate particle density based on screen size
        const particleCount = Math.floor((canvas.width * canvas.height) / 11000);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                // Draw spider-web connecting lines between close particles
                if (dist < 120) {
                    let opacity = 1 - (dist / 120);
                    ctx.strokeStyle = `rgba(108, 99, 255, ${opacity * 0.25})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }

            // Connect nearby particles directly to mouse cursor
            if (mouse.x !== null && mouse.y !== null) {
                let dx = particles[a].x - mouse.x;
                let dy = particles[a].y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let opacity = 1 - (dist / mouse.radius);
                    ctx.strokeStyle = `rgba(0, 212, 170, ${opacity * 0.4})`;
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    initParticles();
    window.addEventListener('resize', initParticles);

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}

/* ============================
   NAVBAR
   ============================ */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

/* ============================
   ACTIVE NAV LINK ON SCROLL
   ============================ */
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink && scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

/* ============================
   TYPEWRITER EFFECT
   ============================ */
const typewriterElement = document.getElementById('typewriter');
const texts = [
    'Front-End Developer',
    'Software Engineering Student',
    'Competitive Programmer',
    'Robotics Enthusiast',
    'Glassmorphism Designer',
    'Fitness Enthusiast'
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeWriter() {
    const currentText = texts[textIndex];

    if (isDeleting) {
        typewriterElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typewriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
    }

    setTimeout(typeWriter, typeSpeed);
}

if (typewriterElement) typeWriter();

/* ============================
   COUNTER ANIMATION
   ============================ */
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        };

        update();
    });
}

const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const heroSection = document.getElementById('home');
if (heroSection) heroObserver.observe(heroSection);

/* ============================
   SKILL BARS ANIMATION
   ============================ */
function animateSkillBars() {
    const skillFills = document.querySelectorAll('.skill-fill');
    skillFills.forEach(fill => {
        const width = fill.getAttribute('data-width');
        fill.style.width = width + '%';
    });
}

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillBars();
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillsObserver.observe(skillsSection);

/* ============================
   PROJECT FILTER
   ============================ */
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

/* ============================
   SCROLL REVEAL
   ============================ */
const revealElements = document.querySelectorAll(
    '.section-header, .about-grid, .experience-card, .skill-card, .project-card, .cert-card, .service-card, .cp-card, .contact-grid'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* ============================
   BACK TO TOP
   ============================ */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================
   CONTACT FORM
   ============================ */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        const mailtoLink = `mailto:samiemtiaz38@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\n${message}`
        )}`;

        window.open(mailtoLink);

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
        submitBtn.style.background = 'linear-gradient(135deg, #00d4aa, #00b894)';

        setTimeout(() => {
            submitBtn.innerHTML = originalHTML;
            submitBtn.style.background = '';
            contactForm.reset();
        }, 3000);
    });
}

/* ============================
   SMOOTH SCROLL FOR NAV LINKS
   ============================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ============================
   TILT EFFECT ON CARDS
   ============================ */
document.querySelectorAll('.project-card, .service-card, .experience-card, .cert-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

console.log('🚀 Portfolio loaded successfully — MD. Emtiaz Hossain Sami');
