/**
 * Web Portfolio - Main Interactive Script
 * Features:
 * 1. Ultra-smooth Futuristic Page Transitions (Zero flash, responsive, bfcache-safe)
 * 2. Interactive Cyber Canvas Particle Network (Constellation, mouse reaction, 60fps)
 * 3. Dynamic Cursor Spotlight (Flashlight illumination)
 * 4. Responsive Mobile Navigation Menu
 * 5. Automatic Active Navigation Link Sync
 */

(function () {
    "use strict";

    /* ==========================================================================
       1. PAGE TRANSITION SYSTEM
       ========================================================================== */
    function initPageTransitions() {
        // Ensure curtain element exists in DOM
        let curtain = document.getElementById("pageCurtain");
        if (!curtain) {
            curtain = document.createElement("div");
            curtain.id = "pageCurtain";
            curtain.className = "page-curtain is-entering";
            curtain.innerHTML = `
                <div class="curtain-panel curtain-top"></div>
                <div class="curtain-panel curtain-bottom"></div>
                <div class="curtain-laser"></div>
                <div class="curtain-content">
                    <div class="curtain-hud">
                        <div class="curtain-spinner"></div>
                        <div class="curtain-badge">SYSTEM LOADING</div>
                        <div class="curtain-bar"><div class="curtain-fill"></div></div>
                    </div>
                </div>
            `;
            document.body.prepend(curtain);
        }

        // Trigger entrance transition once DOM is ready
        requestAnimationFrame(() => {
            // Give browser a moment to paint the entering curtain then open it
            setTimeout(() => {
                curtain.classList.remove("is-entering");
                curtain.classList.add("is-opened");
                document.body.classList.add("page-ready");
            }, 60);
        });

        // Handle bfcache (browser back/forward button restore)
        window.addEventListener("pageshow", (event) => {
            if (event.persisted || curtain.classList.contains("is-exiting")) {
                curtain.classList.remove("is-exiting");
                curtain.classList.remove("is-entering");
                curtain.classList.add("is-opened");
                document.body.classList.add("page-ready");
            }
        });

        // Intercept internal link clicks for smooth transitions
        document.addEventListener("click", (e) => {
            const link = e.target.closest("a");
            if (!link) return;

            const href = link.getAttribute("href");
            if (!href) return;

            // Check if link is external or special
            if (
                href.startsWith("#") ||
                href.startsWith("javascript:") ||
                href.startsWith("mailto:") ||
                href.startsWith("tel:") ||
                link.target === "_blank" ||
                link.hasAttribute("download") ||
                e.ctrlKey ||
                e.metaKey ||
                e.shiftKey ||
                e.altKey ||
                e.button !== 0
            ) {
                return;
            }

            // Check if external domain
            try {
                const targetUrl = new URL(link.href, window.location.href);
                if (targetUrl.origin !== window.location.origin) return;

                // If pointing to current page exactly
                const currentPath = window.location.pathname.split("/").pop() || "index.html";
                const targetPath = targetUrl.pathname.split("/").pop() || "index.html";
                if (currentPath.toLowerCase() === targetPath.toLowerCase() && !targetUrl.hash) {
                    e.preventDefault();
                    return;
                }

                // Prevent default and play exit transition
                e.preventDefault();

                curtain.classList.remove("is-opened");
                curtain.classList.add("is-exiting");
                document.body.classList.remove("page-ready");
                document.body.classList.add("page-leaving");

                setTimeout(() => {
                    window.location.href = targetUrl.href;
                }, 380);
            } catch (err) {
                // In case of URL parse error, fallback to default behavior
            }
        });
    }

    /* ==========================================================================
       2. INTERACTIVE CYBER CANVAS PARTICLE NETWORK
       ========================================================================== */
    function initCanvasBackground() {
        let canvas = document.getElementById("bg-canvas");
        if (!canvas) {
            canvas = document.createElement("canvas");
            canvas.id = "bg-canvas";
            canvas.className = "bg-canvas";
            document.body.prepend(canvas);
        }

        const ctx = canvas.getContext("2d");
        let width = 0;
        let height = 0;
        let particles = [];
        let animationFrameId = null;
        let isTabActive = true;

        // Mouse tracking for interactive network
        const mouse = {
            x: null,
            y: null,
            radius: 140
        };

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        }

        function initParticles() {
            particles = [];
            // Particle density proportional to screen area
            const count = Math.min(Math.floor((width * height) / 14000), 85);
            const colors = [
                "rgba(0, 255, 153,",   // Neon Green
                "rgba(0, 220, 255,",   // Cyber Cyan
                "rgba(255, 255, 255,"   // Tech White
            ];

            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.75,
                    vy: (Math.random() - 0.5) * 0.75,
                    radius: Math.random() * 1.8 + 0.8,
                    baseAlpha: Math.random() * 0.5 + 0.3,
                    alpha: Math.random() * 0.5 + 0.3,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    pulseSpeed: Math.random() * 0.02 + 0.01
                });
            }
        }

        function draw() {
            if (!isTabActive) return;

            ctx.clearRect(0, 0, width, height);

            // Update & draw particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Movement
                p.x += p.vx;
                p.y += p.vy;

                // Screen bounce
                if (p.x < 0) { p.x = 0; p.vx *= -1; }
                else if (p.x > width) { p.x = width; p.vx *= -1; }
                if (p.y < 0) { p.y = 0; p.vy *= -1; }
                else if (p.y > height) { p.y = height; p.vy *= -1; }

                // Mouse interaction - gentle attraction / push
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < mouse.radius) {
                        // Gentle connection line to mouse
                        const mouseAlpha = (1 - dist / mouse.radius) * 0.45;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 255, 153, ${mouseAlpha})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();

                        // Gentle push
                        const force = (mouse.radius - dist) / mouse.radius;
                        p.x -= (dx / dist) * force * 0.6;
                        p.y -= (dy / dist) * force * 0.6;
                    }
                }

                // Breathing alpha pulse
                p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.005;
                const finalAlpha = Math.max(0.1, Math.min(0.9, p.alpha));

                // Draw node
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `${p.color} ${finalAlpha})`;
                ctx.shadowBlur = 8;
                ctx.shadowColor = "#00ff99";
                ctx.fill();
                ctx.shadowBlur = 0;

                // Connect with nearby particles (Constellation)
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    const maxDist = 110;

                    if (dist < maxDist) {
                        const lineAlpha = (1 - dist / maxDist) * 0.22;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 255, 153, ${lineAlpha})`;
                        ctx.lineWidth = 0.75;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        }

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener("mouseleave", () => {
            mouse.x = null;
            mouse.y = null;
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                isTabActive = false;
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
            } else {
                isTabActive = true;
                animationFrameId = requestAnimationFrame(draw);
            }
        });

        resize();
        animationFrameId = requestAnimationFrame(draw);
    }

    /* ==========================================================================
       3. MOUSE SPOTLIGHT (Flashlight Glow Effect)
       ========================================================================== */
    function initMouseSpotlight() {
        let spotlight = document.getElementById("cursorSpotlight");
        if (!spotlight) {
            spotlight = document.createElement("div");
            spotlight.id = "cursorSpotlight";
            spotlight.className = "cursor-spotlight";
            document.body.prepend(spotlight);
        }

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let currentX = mouseX;
        let currentY = mouseY;

        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
            document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
        });

        // Smooth spotlight following
        function renderSpotlight() {
            currentX += (mouseX - currentX) * 0.15;
            currentY += (mouseY - currentY) * 0.15;
            spotlight.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            requestAnimationFrame(renderSpotlight);
        }
        requestAnimationFrame(renderSpotlight);
    }

    /* ==========================================================================
       4. AMBIENT GLOW ORBS & GRID BACKGROUND
       ========================================================================== */
    function initBackgroundDecorations() {
        let bgOrbs = document.getElementById("bgOrbs");
        if (!bgOrbs) {
            bgOrbs = document.createElement("div");
            bgOrbs.id = "bgOrbs";
            bgOrbs.className = "bg-orbs-container";
            bgOrbs.innerHTML = `
                <div class="ambient-orb orb-1"></div>
                <div class="ambient-orb orb-2"></div>
                <div class="ambient-orb orb-3"></div>
                <div class="cyber-grid-overlay"></div>
                <div class="cyber-scanlines"></div>
            `;
            document.body.prepend(bgOrbs);
        }
    }

    /* ==========================================================================
       5. ACTIVE NAVIGATION SYNC & MOBILE TOGGLE
       ========================================================================== */
    function initNavigation() {
        const header = document.querySelector("header");
        if (!header) return;

        // Add mobile hamburger button if not present
        let nav = header.querySelector("nav");
        let toggle = header.querySelector(".nav-toggle");
        if (nav && !toggle) {
            toggle = document.createElement("button");
            toggle.className = "nav-toggle";
            toggle.setAttribute("aria-label", "Toggle navigation");
            toggle.innerHTML = `<span></span><span></span><span></span>`;
            header.appendChild(toggle);

            toggle.addEventListener("click", () => {
                header.classList.toggle("nav-open");
                document.body.classList.toggle("menu-lock");
            });

            // Close mobile menu when clicking any nav link
            nav.querySelectorAll("a").forEach(a => {
                a.addEventListener("click", () => {
                    header.classList.remove("nav-open");
                    document.body.classList.remove("menu-lock");
                });
            });
        }

        // Active link sync
        const currentPath = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
        if (nav) {
            const links = nav.querySelectorAll("a");
            links.forEach(link => {
                const href = (link.getAttribute("href") || "").toLowerCase();
                const linkFileName = href.split("/").pop();

                if (linkFileName === currentPath || (currentPath === "" && linkFileName === "index.html")) {
                    link.classList.add("active");
                } else if (href && !href.startsWith("#")) {
                    link.classList.remove("active");
                }
            });
        }

        // Header scroll effect
        window.addEventListener("scroll", () => {
            if (window.scrollY > 30) {
                header.classList.add("header-scrolled");
            } else {
                header.classList.remove("header-scrolled");
            }
        }, { passive: true });
    }

    /* ==========================================================================
       6. INTERSECTION OBSERVER FOR CARDS & STAGGER ENTRANCES
       ========================================================================== */
    function initScrollReveal() {
        const targets = document.querySelectorAll(
            ".edu-card, .activity-card, .portfolio-card, .contact-card, .contact-form, .skill-item, .about-info, .about-image"
        );

        if (!("IntersectionObserver" in window)) {
            targets.forEach(t => t.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -40px 0px"
        });

        targets.forEach(target => observer.observe(target));
    }

    // Initialize all modules
    document.addEventListener("DOMContentLoaded", () => {
        initBackgroundDecorations();
        initCanvasBackground();
        initMouseSpotlight();
        initPageTransitions();
        initNavigation();
        initScrollReveal();
    });

})();

