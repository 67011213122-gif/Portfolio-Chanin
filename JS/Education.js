// Staggered reveal for education cards
(function () {
    const cards = document.querySelectorAll(".edu-card");
    if (!cards.length) return;

    cards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition = "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";

        setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, 120 + index * 160);
    });
})();