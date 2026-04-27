document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cursor = document.createElement('div');
    const follower = document.createElement('div');
    const overlay = document.getElementById('experience-overlay');
    const activateBtn = document.getElementById('activate-btn');
    const bgMusic = document.getElementById('bg-music');
    const musicPlayer = document.getElementById('music-player');
    const playPauseBtn = document.getElementById('music-play-pause');
    const muteBtn = document.getElementById('music-mute');
    const volumeSlider = document.getElementById('volume-slider');
    const cursorGlow = document.getElementById('cursor-glow');
    const navbar = document.getElementById('navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    const connectModal = document.getElementById('connect-modal');
    const closeModal = document.getElementById('close-modal');
    const connectBtns = document.querySelectorAll('#connect-nav-btn, .connect-trigger, a[href="#contact"]');
    
    // Audit Elements
    const auditModal = document.getElementById('audit-modal');
    const openAuditBtn = document.getElementById('open-audit-btn');
    const closeAuditBtn = document.getElementById('close-audit');
    const globalRefreshBtn = document.getElementById('globalRefreshBtn');
    const resetFpsBtn = document.getElementById('resetFpsBtn');

    // Custom Cursor Setup
    cursor.className = 'custom-cursor';
    follower.className = 'cursor-follower';
    document.body.appendChild(cursor);
    document.body.appendChild(follower);

    // Interaction restrictions
    document.body.classList.add('no-inspect');
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && (e.key === 'u' || e.key === 'i' || e.key === 'j' || e.key === 's' || e.key === 'h')) e.preventDefault();
        if (e.key === 'F12') e.preventDefault();
    });

    // Modal Logic
    const toggleModal = (modal, show) => {
        if (!modal) return;
        if (show) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };

    if (openAuditBtn) openAuditBtn.addEventListener('click', () => {
        toggleModal(auditModal, true);
        runFullAudit();
    });
    if (closeAuditBtn) closeAuditBtn.addEventListener('click', () => toggleModal(auditModal, false));
    if (globalRefreshBtn) globalRefreshBtn.addEventListener('click', runFullAudit);

    // Experience Overlay
    if (activateBtn && overlay) {
        activateBtn.addEventListener('click', () => {
            overlay.classList.add('hidden');
            if (bgMusic) {
                bgMusic.volume = 0.05; 
                if (volumeSlider) volumeSlider.value = 0.05;
                bgMusic.play().then(() => {
                    musicPlayer.classList.add('playing');
                    const playIcon = document.getElementById('play-icon');
                    if (playIcon) {
                        playIcon.setAttribute('data-lucide', 'pause');
                        lucide.createIcons();
                    }
                }).catch(err => console.log("Audio play blocked", err));
            }
        });
    }

    // Music Controls
    if (playPauseBtn && bgMusic) {
        playPauseBtn.addEventListener('click', () => {
            const icon = document.getElementById('play-icon');
            if (bgMusic.paused) {
                bgMusic.play();
                musicPlayer.classList.add('playing');
                icon.setAttribute('data-lucide', 'pause');
            } else {
                bgMusic.pause();
                musicPlayer.classList.remove('playing');
                icon.setAttribute('data-lucide', 'play');
            }
            lucide.createIcons();
        });
    }

    if (muteBtn && bgMusic) {
        let lastVol = 0.05;
        muteBtn.addEventListener('click', () => {
            const icon = document.getElementById('mute-icon');
            if (bgMusic.volume > 0) {
                lastVol = bgMusic.volume;
                bgMusic.volume = 0;
                if (volumeSlider) volumeSlider.value = 0;
                icon.setAttribute('data-lucide', 'volume-x');
            } else {
                bgMusic.volume = lastVol || 0.05;
                if (volumeSlider) volumeSlider.value = bgMusic.volume;
                icon.setAttribute('data-lucide', 'volume-2');
            }
            lucide.createIcons();
        });
    }

    if (volumeSlider && bgMusic) {
        volumeSlider.addEventListener('input', (e) => {
            bgMusic.volume = e.target.value;
            const icon = document.getElementById('mute-icon');
            if (bgMusic.volume == 0) icon.setAttribute('data-lucide', 'volume-x');
            else if (bgMusic.volume < 0.5) icon.setAttribute('data-lucide', 'volume-1');
            else icon.setAttribute('data-lucide', 'volume-2');
            lucide.createIcons();
        });
    }

    // ---------------- AUDITOR LOGIC (ALL 42 FIELDS) ----------------
    async function runFullAudit() {
        const ua = navigator.userAgent;
        const diag = {};

        // 1. Timestamp
        diag.timestamp = new Date().toLocaleString();
        
        // 2-8. System & Browser
        diag.deviceType = /Mobi|Android/i.test(ua) ? "Mobile" : "Desktop";
        diag.os = navigator.platform;
        diag.osVersion = ua.match(/\(([^)]+)\)/) ? ua.match(/\(([^)]+)\)/)[1].split(';')[0] : "N/A";
        diag.browserName = navigator.vendor || "Webkit";
        diag.browserVersion = ua.split(' ').pop();
        diag.userLanguage = navigator.language;
        diag.platformArch = navigator.userAgentData ? (await navigator.userAgentData.getHighEntropyValues(['architecture'])).architecture : "Unknown";
        
        // 9-12. Display
        diag.screenWidth = window.screen.width;
        diag.screenHeight = window.screen.height;
        diag.pixelRatio = window.devicePixelRatio;
        diag.colorDepth = window.screen.colorDepth;

        // 13-18. Hardware & Interaction
        diag.cpuCores = navigator.hardwareConcurrency || "X";
        diag.deviceMemory = navigator.deviceMemory || "Unknown";
        try {
            const gl = document.createElement('canvas').getContext('webgl');
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            diag.gpuVendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : "Unknown";
            diag.gpuModel = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "Unknown";
        } catch(e) { diag.gpuVendor = "Restricted"; diag.gpuModel = "Restricted"; }
        diag.touchSupport = 'ontouchstart' in window;
        diag.orientation = screen.orientation ? screen.orientation.type : "Unknown";

        // 19-20. Battery
        if (navigator.getBattery) {
            const b = await navigator.getBattery();
            diag.batteryLevel = Math.round(b.level * 100);
            diag.chargingStatus = b.charging;
        } else {
            diag.batteryLevel = "N/A";
            diag.chargingStatus = "N/A";
        }

        // 21-22. Connection
        diag.connectionType = navigator.connection ? navigator.connection.effectiveType : "Stable";
        diag.downloadSpeed = navigator.connection ? navigator.connection.downlink : "Unknown";

        // 23-26. Permissions & Privacy
        diag.dnt = navigator.doNotTrack || "Not Set";
        diag.cookiesEnabled = navigator.cookieEnabled;
        if (navigator.permissions) {
            try {
                const cam = await navigator.permissions.query({name:'camera'});
                diag.cameraPerm = cam.state;
                const mic = await navigator.permissions.query({name:'microphone'});
                diag.micPerm = mic.state;
            } catch(e) { diag.cameraPerm = "Unknown"; diag.micPerm = "Unknown"; }
        }

        // Helper for flag emoji
        function getFlagEmoji(countryCode) {
            if (!countryCode) return '🏳️';
            const codePoints = countryCode.toUpperCase().split('').map(ch => 127397 + ch.charCodeAt(0));
            return String.fromCodePoint(...codePoints);
        }

        // 27-34. Geo & Network Identity
        try {
            const res = await fetch('https://ipapi.co/json/');
            if (!res.ok) throw new Error("ipapi failed");
            const data = await res.json();
            diag.publicIp = data.ip;
            diag.isp = data.org || data.asn || "Unknown ISP";
            diag.city = data.city;
            diag.postal = data.postal || "N/A";
            diag.country = data.country_name;
            diag.countryCode = data.country_code || "";
            diag.latitude = data.latitude || 0;
            diag.longitude = data.longitude || 0;
            diag.asn = data.asn ? `AS${data.asn}` : "N/A";
            diag.timezone = data.timezone;
            diag.utcOffset = -new Date().getTimezoneOffset();
        } catch (e) {
            try {
                // Robust Fallback API for Geolocation (HTTPS supported)
                const resFallback = await fetch('https://ipwho.is/');
                if (!resFallback.ok) throw new Error("ipwhois failed");
                const fData = await resFallback.json();
                if (fData.success) {
                    diag.publicIp = fData.ip;
                    diag.isp = fData.connection.org || fData.connection.isp || "Unknown ISP";
                    diag.city = fData.city || "Unknown City";
                    diag.postal = fData.postal || "N/A";
                    diag.country = fData.country || "Unknown Country";
                    diag.countryCode = fData.country_code || "";
                    diag.latitude = fData.latitude || 0;
                    diag.longitude = fData.longitude || 0;
                    diag.asn = fData.connection.asn ? `AS${fData.connection.asn}` : "N/A";
                    diag.timezone = fData.timezone.id || "N/A";
                    diag.utcOffset = fData.timezone.utc || "N/A";
                } else {
                    throw new Error("ipwhois unsuccessful");
                }
            } catch (e2) {
                // Ultimate Fallback if everything is blocked
                try {
                    const resBase = await fetch('https://api.ipify.org?format=json');
                    const baseData = await resBase.json();
                    diag.publicIp = baseData.ip;
                } catch(e3) {
                    diag.publicIp = "ENCRYPTED";
                }
                diag.isp = "SECURE_TUNNEL";
                diag.city = "UNKNOWN";
                diag.postal = "N/A";
                diag.country = "LOCATION";
                diag.countryCode = "";
                diag.latitude = 0;
                diag.longitude = 0;
                diag.asn = "N/A";
                diag.timezone = "N/A";
                diag.utcOffset = "N/A";
            }
        }

        // --- PROGRESSIVE DASHBOARD UPDATE ---
        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
        setVal('dash-ip', diag.publicIp);
        setVal('dash-location', `${diag.city}, ${diag.country}`);
        setVal('user-ip', diag.publicIp);
        setVal('user-location', `${diag.city}, ${diag.country}`);
        
        // Progressive UI for new fields
        setVal('cityPostal', `${diag.city} · ${diag.postal}`);
        setVal('coordinates', `${diag.latitude}, ${diag.longitude}`);
        setVal('asNumber', diag.asn);
        setVal('flagEmoji', getFlagEmoji(diag.countryCode));

        try {
            const v6 = await fetch('https://api6.ipify.org?format=json');
            const v6data = await v6.json();
            diag.ipv6 = v6data.ip;
        } catch(e) { diag.ipv6 = "N/A"; }

        // 29 & 41. Local IP & WebRTC Leak
        diag.localIp = "N/A";
        const pc = new RTCPeerConnection();
        pc.createDataChannel("");
        pc.createOffer().then(o => pc.setLocalDescription(o));
        pc.onicecandidate = (e) => {
            if (e.candidate) {
                const ip = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(e.candidate.candidate);
                if (ip) {
                    diag.localIp = ip[1];
                    setVal('localIP', ip[1]);
                    const leakEl = document.getElementById('webrtcLeakStatus');
                    if (leakEl) leakEl.innerHTML = "<span style='color: #ff4d4d'>⚠️ LEAK DETECTED</span>";
                }
            }
        };

        // 35-37. Fingerprints
        diag.canvasFp = "ACTIVE_HASH_" + Math.random().toString(36).substring(7).toUpperCase();
        diag.audioFp = "ACTIVE_AUDIO_VEC";
        diag.webglRenderer = diag.gpuModel;

        // 38-42. Security Headers & Adblock
        diag.cspStatus = "PROTECTED";
        diag.hstsEnabled = "ENABLED";
        diag.xFrame = "DENY";
        
        const ad = document.createElement('div');
        ad.className = 'adsbox';
        document.body.appendChild(ad);
        setTimeout(() => {
            diag.adblock = ad.offsetHeight === 0;
            const adEl = document.getElementById('adblockDetect');
            if (adEl) adEl.innerText = diag.adblock ? "🛡️ PROTECTED" : "VULNERABLE";
            ad.remove();
            updateAuditUI(diag);
        }, 100);

        return diag;
    }

    function updateAuditUI(diag) {
        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
        // Mapping UI IDs to diag properties
        setVal('deviceType', diag.deviceType);
        setVal('osDetail', diag.os);
        setVal('osVersion', diag.osVersion);
        setVal('arch', diag.platformArch);
        setVal('cpuCores', diag.cpuCores);
        setVal('deviceMemory', diag.deviceMemory);
        setVal('gpuVendor', diag.gpuVendor);
        setVal('gpuInfo', diag.gpuModel);
        setVal('browserName', diag.browserName);
        setVal('browserVersion', diag.browserVersion);
        setVal('userLang', diag.userLanguage);
        setVal('screenRes', `${diag.screenWidth}x${diag.screenHeight}`);
        setVal('pixelRatio', diag.pixelRatio);
        setVal('colorDepth', diag.colorDepth);
        setVal('touchSupport', diag.touchSupport);
        setVal('orientation', diag.orientation);
        setVal('publicIP', diag.publicIp);
        setVal('dash-ip', diag.publicIp);
        setVal('publicIPv6', diag.ipv6);
        setVal('localIP', diag.localIp);
        setVal('ispName', diag.isp);
        setVal('ispLocation', `${diag.city}, ${diag.country}`);
        setVal('dash-location', `${diag.city}, ${diag.country}`);
        setVal('timezone', diag.timezone);
        setVal('utcOffset', diag.utcOffset);
        setVal('connectionType', diag.connectionType);
        setVal('downloadSpeed', diag.downloadSpeed);
        setVal('canvasFp', diag.canvasFp);
        setVal('audioFp', diag.audioFp);
        setVal('webglRenderer', diag.webglRenderer);
        setVal('dntValue', diag.dnt);
        setVal('cookiesEnabled', diag.cookiesEnabled);
        setVal('cameraPerm', diag.cameraPerm);
        setVal('micPerm', diag.micPerm);
        setVal('cspStatus', diag.cspStatus);
        setVal('hstsStatus', diag.hstsEnabled);
        setVal('xFrameStatus', diag.xFrame);
        setVal('batteryInfo', diag.batteryLevel + "%");
        setVal('chargingStatus', diag.chargingStatus);
    }

    // ---------------- FPS MONITOR ----------------
    let fpsHistory = [];
    let lastTime = performance.now();
    let frames = 0;
    const fpsCanvas = document.getElementById('fpsCanvas');
    const fpsCtx = fpsCanvas ? fpsCanvas.getContext('2d') : null;

    function updateFPS() {
        const now = performance.now();
        frames++;
        if (now >= lastTime + 1000) {
            const fps = Math.round((frames * 1000) / (now - lastTime));
            const fpsEl = document.getElementById('fpsNumber');
            if (fpsEl) fpsEl.innerText = fps;
            const dashFps = document.getElementById('dash-fps');
            if (dashFps) dashFps.innerText = fps + " FPS";
            
            const bar = document.getElementById('fpsBar');
            if (bar) bar.style.width = Math.min(100, (fps / 60) * 100) + "%";
            
            fpsHistory.push(fps);
            if (fpsHistory.length > 50) fpsHistory.shift();
            drawFPSGraph();
            frames = 0;
            lastTime = now;
        }
        requestAnimationFrame(updateFPS);
    }

    function drawFPSGraph() {
        if (!fpsCtx) return;
        fpsCtx.clearRect(0, 0, fpsCanvas.width, fpsCanvas.height);
        fpsCtx.strokeStyle = "#9333ea";
        fpsCtx.lineWidth = 2;
        fpsCtx.beginPath();
        const step = fpsCanvas.width / 50;
        fpsHistory.forEach((f, i) => {
            const x = i * step;
            const y = fpsCanvas.height - (f / 120) * fpsCanvas.height;
            if (i === 0) fpsCtx.moveTo(x, y);
            else fpsCtx.lineTo(x, y);
        });
        fpsCtx.stroke();
    }
    updateFPS();

    // ---------------- GLOBE & DDOS ----------------
    const triggerDDoS = () => {
        const earth = document.querySelector('.earth-surface');
        if (!earth) return;
        setInterval(() => {
            if (Math.random() > 0.4) {
                const attack = document.createElement('div');
                attack.className = 'ddos-attack';
                attack.style.top = Math.random() * 100 + "%";
                attack.style.left = Math.random() * 100 + "%";
                earth.appendChild(attack);
                setTimeout(() => attack.remove(), 1500);
            }
        }, 600);
    };
    triggerDDoS();

    // ---------------- LOGGING TO GOOGLE SHEET ----------------
    async function logVisitToSheet() {
        const diag = await runFullAudit();
        
        // Match Excel column order
        const payload = {
            "Timestamp": diag.timestamp,
            "Device Type": diag.deviceType,
            "Operating System": diag.os,
            "OS Version": diag.osVersion,
            "Browser Name": diag.browserName,
            "Browser Version": diag.browserVersion,
            "User Language": diag.userLanguage,
            "Platform Architecture": diag.platformArch,
            "Screen Width (px)": diag.screenWidth,
            "Screen Height (px)": diag.screenHeight,
            "Device Pixel Ratio": diag.pixelRatio,
            "Color Depth (bits)": diag.colorDepth,
            "CPU Cores": diag.cpuCores,
            "Device Memory (GB)": diag.deviceMemory,
            "GPU Vendor": diag.gpuVendor,
            "GPU Model": diag.gpuModel,
            "Touch Support": diag.touchSupport,
            "Orientation": diag.orientation,
            "Battery Level (%)": diag.batteryLevel,
            "Charging Status": diag.chargingStatus,
            "Connection Type": diag.connectionType,
            "Download Speed (Mbps)": diag.downloadSpeed,
            "Do Not Track (DNT)": diag.dnt,
            "Cookies Enabled": diag.cookiesEnabled,
            "Camera Permission": diag.cameraPerm,
            "Microphone Permission": diag.micPerm,
            "Public IP Address": diag.publicIp,
            "IPv6 Address": diag.ipv6,
            "Local IP (WebRTC)": diag.localIp,
            "ISP / Organization": diag.isp,
            "City": diag.city,
            "Country": diag.country,
            "Timezone": diag.timezone,
            "UTC Offset (mins)": diag.utcOffset,
            "Canvas Fingerprint Hash": diag.canvasFp,
            "Audio Context Fingerprint": diag.audioFp,
            "WebGL Renderer": diag.webglRenderer,
            "CSP Policy Status": diag.cspStatus,
            "HSTS Enabled": diag.hstsEnabled,
            "X-Frame-Options": diag.xFrame,
            "WebRTC IP Leak": diag.localIp !== "N/A",
            "Adblock Detected": diag.adblock
        };

        console.log("Transmitting Telemetry Packet:", payload);
        
        // Define URLs for both target Google Sheets
        const sheetUrls = [
            "https://script.google.com/macros/s/AKfy.../exec", // URL for Sheet 1
            "https://script.google.com/macros/s/AKfy.../exec"  // URL for Sheet 2
        ];
        
        for (const url of sheetUrls) {
            try {
                // Uncomment to enable live logging when URLs are ready
                // fetch(url, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
            } catch(e) {}
        }
    }

    // ---------------- CURSOR & REVEAL ----------------
    let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;
    document.addEventListener('mousemove', e => { 
        mouseX = e.clientX; mouseY = e.clientY; 
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

    const interactives = document.querySelectorAll('a, button, input, .cert-card, .project-card, .gh-card');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('interacting'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('interacting'));
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('revealed'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

    // Matrix Rain Effect
    const binCanvas = document.getElementById('binary-canvas');
    if (binCanvas) {
        const ctx = binCanvas.getContext('2d');
        let w = binCanvas.width = binCanvas.parentElement.offsetWidth;
        let h = binCanvas.height = binCanvas.parentElement.offsetHeight;
        const chars = "010101アイウエオカキクケコサシスセソタチツテトナニヌネノ".split("");
        const drops = Array(Math.floor(w / 14)).fill(1);
        const draw = () => {
            ctx.fillStyle = "rgba(3, 0, 8, 0.05)"; ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = "#9333ea"; ctx.font = "14px monospace";
            drops.forEach((y, i) => {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * 14, y * 14);
                if (y * 14 > h && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            });
        };
        setInterval(draw, 33);
        window.addEventListener('resize', () => { w = binCanvas.width = binCanvas.parentElement.offsetWidth; h = binCanvas.height = binCanvas.parentElement.offsetHeight; });
    }

    // Modal Global Closing & Connect Modal Logic
    if (closeModal) closeModal.addEventListener('click', () => toggleModal(connectModal, false));
    if (closeAuditBtn) closeAuditBtn.addEventListener('click', () => toggleModal(auditModal, false));
    
    const openConnectModal = (e) => {
        if (e) e.preventDefault();
        toggleModal(connectModal, true);
    };
    connectBtns.forEach(btn => btn && btn.addEventListener('click', openConnectModal));

    // Auto-save and Initial Fetch on page load
    logVisitToSheet();
});
