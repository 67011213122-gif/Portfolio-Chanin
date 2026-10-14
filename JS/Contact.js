// Contact page form submission & card entrance
(function () {
    // Staggered reveal for contact cards & form
    const cards = document.querySelectorAll(".contact-card");
    cards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition = "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";

        setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, 100 + index * 120);
    });

    const formContainer = document.querySelector(".contact-form");
    if (formContainer) {
        formContainer.style.opacity = "0";
        formContainer.style.transform = "translateY(30px)";
        formContainer.style.transition = "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s";

        setTimeout(() => {
            formContainer.style.opacity = "1";
            formContainer.style.transform = "translateY(0)";
        }, 200);
    }

    // Form submission
    const form = document.getElementById("contactForm");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const submitBtn = form.querySelector("button[type='submit']");
            const originalContent = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ส่งข้อความ...`;

            setTimeout(() => {
                alert("✨ ส่งข้อความเรียบร้อยแล้ว! ขอบคุณที่ติดต่อเรา");
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalContent;
                form.reset();
            }, 700);
        });
    }
})();