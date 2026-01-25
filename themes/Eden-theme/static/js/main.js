document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector(".mobile-nav-toggle");
    const primaryNav = document.querySelector("#primary-navigation");

    if (navToggle && primaryNav) {
        navToggle.addEventListener("click", () => {
            const isOpened = navToggle.getAttribute("aria-expanded") === "true";
            navToggle.setAttribute("aria-expanded", !isOpened);
            primaryNav.classList.toggle("opened");
            document.body.classList.toggle("no-scroll");
        });

        // Close menu when clicking a link
        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                navToggle.setAttribute("aria-expanded", "false");
                primaryNav.classList.remove("opened");
                document.body.classList.remove("no-scroll");
            });
        });
    }
});
