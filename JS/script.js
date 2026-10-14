// Typing Effect Animation
(function () {
    const text = [
        "Game Designer",
        "Web Developer",
        "Video Editor"
    ];

    let index = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typing = document.getElementById("typing");

    if (!typing) return;

    function type() {
        const currentText = text[index];

        if (isDeleting) {
            typing.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typing.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 60 : 110;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 1800; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            index = (index + 1) % text.length;
            typeSpeed = 400; // Pause before typing new word
        }

        setTimeout(type, typeSpeed);
    }

    type();
})();