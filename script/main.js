// Theme Toggle Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const darkIcon = document.getElementById('theme-dark-icon');
const lightIcon = document.getElementById('theme-light-icon');

// Check initial theme
console.log(localStorage.getItem('color-theme'));
if (localStorage.getItem('color-theme') === 'light' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches)) {
    document.documentElement.classList.add('light');
    darkIcon.classList.remove('hidden');
    lightIcon.classList.add('hidden');
} else {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
    darkIcon.classList.add('hidden');
    lightIcon.classList.remove('hidden');
}

themeToggleBtn.addEventListener('click', function () {
    // Toggle icons
    darkIcon.classList.toggle('hidden');
    lightIcon.classList.toggle('hidden');

    // Toggle theme
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
    }
});
