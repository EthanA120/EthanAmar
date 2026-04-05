/* --- Contact Form Logic --- */
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Save original button content
        const originalContent = submitBtn.innerHTML;

        // Visual Feedback: Loading state
        submitBtn.innerHTML = `
            <span>שולח...</span>
            <span class="material-symbols-outlined animate-spin">refresh</span>
        `;
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-80', 'cursor-not-allowed');

        // Simulate API call (Replace with Formspree / EmailJS / etc.)
        setTimeout(() => {
            // Success State
            submitBtn.innerHTML = `
                <span>הודעה נשלחה!</span>
                <span class="material-symbols-outlined">check_circle</span>
            `;
            submitBtn.classList.remove('bg-hero-grad');
            submitBtn.classList.add('bg-green-500');

            // Reset Form
            contactForm.reset();

            // Revert back after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.classList.remove('bg-green-500', 'opacity-80', 'cursor-not-allowed');
                submitBtn.classList.add('bg-hero-grad');
                submitBtn.disabled = false;
            }, 3000);
            
        }, 1800);
    });
}