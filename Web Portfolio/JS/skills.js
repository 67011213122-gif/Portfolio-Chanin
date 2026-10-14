// Animate skill progress bars on scroll / load
(function () {
    const bars = document.querySelectorAll(".skill-progress");
    if (!bars.length) return;

    // Map percentage classes
    const targetWidths = {
        html: "60%",
        css: "50%",
        javascript: "30%",
        csharp: "75%",
        illustrator: "65%",
        photoshop: "50%"
    };

    function triggerBars() {
        bars.forEach(bar => {
            // Find class matching targetWidths
            for (const [key, val] of Object.entries(targetWidths)) {
                if (bar.classList.contains(key)) {
                    bar.style.width = "0%";
                    setTimeout(() => {
                        bar.style.width = val;
                    }, 150);
                    break;
                }
            }
        });
    }

    if ("IntersectionObserver" in window) {
        const skillsSec = document.querySelector(".skills-section");
        if (skillsSec) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    triggerBars();
                    observer.unobserve(skillsSec);
                }
            }, { threshold: 0.2 });
            observer.observe(skillsSec);
            return;
        }
    }

    // Fallback
    window.addEventListener("DOMContentLoaded", triggerBars);
})();