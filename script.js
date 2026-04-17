document.addEventListener('DOMContentLoaded', () => {
    // Experience Overlay Logic
    const overlay = document.getElementById('experience-overlay');
    const activateBtn = document.getElementById('activate-btn');
    const bgMusic = document.getElementById('bg-music');
    const musicPlayer = document.getElementById('music-player');

    if (activateBtn && overlay) {
        activateBtn.addEventListener('click', () => {
            overlay.classList.add('hidden');
            // Try to play music after interaction
            if (bgMusic) {
                bgMusic.volume = 0.3;
                bgMusic.play().then(() => {
                    musicPlayer.classList.add('playing');
                }).catch(err => console.log("Audio play blocked or failed:", err));
            }
        });
    }

    // Cursor Glow Effect
    const cursorGlow = document.getElementById('cursor-glow');
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Music Player Toggle
    const musicToggle = document.getElementById('music-toggle');
    if (musicToggle && bgMusic) {
        musicToggle.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play();
                musicPlayer.classList.add('playing');
            } else {
                bgMusic.pause();
                musicPlayer.classList.remove('playing');
            }
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
