/* Initialize AOS library */
AOS.init({
    duration: 800, // Animation duration in ms
    once: true,    // Whether animation should happen only once
    offset: 100    // Offset from the original trigger point
});


/* ---------------- Navigation ---------------- */
/* --- Dark/Light Mode Theme Toggle Logic --- */
const themeToggleBtn = document.getElementById('theme-toggle');
const darkIcon = document.getElementById('theme-dark-icon');
const lightIcon = document.getElementById('theme-light-icon');
const htmlElement = document.documentElement;

// Initialize theme based on local storage or system preference
const savedTheme = localStorage.getItem('color-theme');
const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
    htmlElement.classList.add('light');
    htmlElement.classList.remove('dark');
    darkIcon.hidden = false;
    lightIcon.hidden = true;
} else {
    htmlElement.classList.add('dark');
    htmlElement.classList.remove('light');
    darkIcon.hidden = true;
    lightIcon.hidden = false;
}

// Handle theme toggle click
themeToggleBtn.addEventListener('click', () => {
    darkIcon.hidden = !darkIcon.hidden;
    lightIcon.hidden = !lightIcon.hidden;

    if (htmlElement.classList.contains('dark')) {
        htmlElement.classList.replace('dark', 'light');
        localStorage.setItem('color-theme', 'light');
    } else {
        htmlElement.classList.replace('light', 'dark');
        localStorage.setItem('color-theme', 'dark');
    }
});

/* --- Mobile Menu Logic --- */
/* --- Mobile Menu Logic --- */
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = mobileMenuBtn.querySelector('.material-symbols-outlined');

mobileMenuBtn.addEventListener('click', () => {
    // Check if the menu is currently hidden (using the opacity class)
    const isOpen = mobileMenu.classList.contains('opacity-100');

    if (isOpen) {
        // Closing: Fade-up and hide
        mobileMenu.classList.replace('opacity-100', 'opacity-0');
        mobileMenu.classList.replace('visible', 'invisible');
        mobileMenu.classList.replace('translate-y-0', '-translate-y-4');
        menuIcon.textContent = 'menu';
    } else {
        // Opening: Fade-down and show
        mobileMenu.classList.replace('opacity-0', 'opacity-100');
        mobileMenu.classList.replace('invisible', 'visible');
        mobileMenu.classList.replace('-translate-y-4', 'translate-y-0');
        menuIcon.textContent = 'close';
    }
});

// Close menu when a link is clicked
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.replace('opacity-100', 'opacity-0');
        mobileMenu.classList.replace('visible', 'invisible');
        mobileMenu.classList.replace('translate-y-0', '-translate-y-4');
        menuIcon.textContent = 'menu';
    });
});
