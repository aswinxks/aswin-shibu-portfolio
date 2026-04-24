document.addEventListener('DOMContentLoaded', () => {
    // Add Custom Cursor Elements
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    const follower = document.createElement('div');
    follower.className = 'cursor-follower';
    document.body.appendChild(cursor);
    document.body.appendChild(follower);

    // Interaction restrictions
    document.body.classList.add('no-inspect');
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && (e.key === 'u' || e.key === 'i' || e.key === 'j' || e.key === 's' || e.key === 'h')) {
            e.preventDefault();
        }
        if (e.key === 'F12') e.preventDefault();
    });

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
                bgMusic.volume = 0.05; // Set initial volume to 5%
                if (volumeSlider) volumeSlider.value = 0.05;
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

    // Volume Slider Logic
    const volumeSlider = document.getElementById('volume-slider');
    if (volumeSlider && bgMusic) {
        bgMusic.volume = 0.05;
        volumeSlider.addEventListener('input', (e) => {
            bgMusic.volume = e.target.value;
            const icon = document.getElementById('music-icon');
            if (bgMusic.volume === 0) {
                icon.setAttribute('data-lucide', 'volume-x');
            } else if (bgMusic.volume < 0.5) {
                icon.setAttribute('data-lucide', 'volume-1');
            } else {
                icon.setAttribute('data-lucide', 'volume-2');
            }
            lucide.createIcons();
        });
    }

    // Cursor Glow & Custom Cursor Logic
    const cursorGlow = document.getElementById('cursor-glow');
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
        
        if (cursorGlow) {
            cursorGlow.style.left = mouseX + 'px';
            cursorGlow.style.top = mouseY + 'px';
        }
    });

    const animateCursor = () => {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Cursor Interacting State
    const interactiveElements = document.querySelectorAll('a, button, input, .cert-card, .project-card, .gh-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('interacting'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('interacting'));
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

    // System Dashboard & Visitor Tracking
    const ipElement = document.getElementById('user-ip');
    const locElement = document.getElementById('user-location');
    const timerElement = document.getElementById('session-timer');
    const countElement = document.getElementById('visitor-count');
    const historyList = document.getElementById('access-history');

    // Visitor Counter (Local Storage Simulation)
    let totalViews = localStorage.getItem('total_views') || Math.floor(Math.random() * 500) + 1248;
    totalViews = parseInt(totalViews) + 1;
    localStorage.setItem('total_views', totalViews);
    if (countElement) countElement.innerText = totalViews.toLocaleString();

    // Session Timer
    let timerSecs = 0;
    setInterval(() => {
        timerSecs++;
        const hrs = String(Math.floor(timerSecs / 3600)).padStart(2, '0');
        const mins = String(Math.floor((timerSecs % 3600) / 60)).padStart(2, '0');
        const secs = String(timerSecs % 60).padStart(2, '0');
        if (timerElement) timerElement.innerText = `${hrs}:${mins}:${secs}`;
    }, 1000);

    // Fetch IP and Location
    const fetchSystemData = async () => {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            if (ipElement) ipElement.innerText = data.ip || '127.0.0.1';
            if (locElement) locElement.innerText = `${data.city}, ${data.country_name}` || 'UNKNOWN_COORD';
            
            // Add to history
            const now = new Date();
            const timeStr = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
            const entry = document.createElement('li');
            entry.innerText = `[${now.toLocaleDateString()}] ACCESS_FROM_${data.city || 'REMOTE'}_AT_${timeStr}`;
            if (historyList) historyList.prepend(entry);
        } catch (err) {
            if (ipElement) ipElement.innerText = 'ENCRYPTED_IP';
            if (locElement) locElement.innerText = 'SECURE_PROXY';
        }
    };
    fetchSystemData();

    // Globe DDoS Animation (Dots & Lines)
    const earthConnections = document.querySelector('.earth-connections');
    if (earthConnections) {
        setInterval(() => {
            // Create Pulse Dot
            const dot = document.createElement('div');
            dot.style.position = 'absolute';
            dot.style.width = '3px';
            dot.style.height = '3px';
            dot.style.background = '#06b6d4';
            dot.style.borderRadius = '50%';
            dot.style.boxShadow = '0 0 10px #06b6d4';
            dot.style.top = Math.random() * 100 + '%';
            dot.style.left = Math.random() * 100 + '%';
            dot.style.opacity = '0';
            dot.style.animation = 'attackPulse 2s forwards';
            
            earthConnections.appendChild(dot);
            setTimeout(() => dot.remove(), 2000);

            // Create Beam Line
            const beam = document.createElement('div');
            beam.className = 'connection-beam';
            beam.style.top = Math.random() * 100 + '%';
            beam.style.left = Math.random() * 100 + '%';
            beam.style.width = (Math.random() * 100 + 50) + 'px';
            beam.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            earthConnections.appendChild(beam);
            setTimeout(() => beam.remove(), 2000);
        }, 1000);
    }
});


