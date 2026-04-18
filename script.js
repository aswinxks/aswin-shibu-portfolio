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
                    const musicIcon = document.querySelector('#music-toggle i');
                    if (musicIcon) {
                        musicIcon.setAttribute('data-lucide', 'volume-2');
                        lucide.createIcons();
                    }
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
            const icon = musicToggle.querySelector('i');
            if (bgMusic.paused) {
                bgMusic.play();
                musicPlayer.classList.add('playing');
                icon.setAttribute('data-lucide', 'volume-2');
            } else {
                bgMusic.pause();
                musicPlayer.classList.remove('playing');
                icon.setAttribute('data-lucide', 'volume-x');
            }
            lucide.createIcons();
        });
    }

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenu.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenu.querySelector('i').setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            });
        });
    }

    // Connect Modal Logic
    const connectModal = document.getElementById('connect-modal');
    const connectBtns = document.querySelectorAll('#connect-nav-btn, .connect-trigger, a[href="#contact"]');
    const closeModal = document.getElementById('close-modal');

    const openModal = (e) => {
        if (e) e.preventDefault();
        connectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const hideModal = () => {
        connectModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    connectBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', openModal);
    });

    if (closeModal) closeModal.addEventListener('click', hideModal);

    window.addEventListener('click', (e) => {
        if (e.target === connectModal) hideModal();
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#contact-btn' || href === '#contact') return; // Handled by modal
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
