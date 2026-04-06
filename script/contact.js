/* --- Contact Form Logic with Formspree --- */
const contactForm = document.getElementById('contact-form');
const formBody = document.getElementById('form-body');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Get Form Data
        const formData = new FormData(contactForm);
        const clientName = formData.get('name'); // Extracts the name for the success message

        // 2. Visual Feedback: Loading state
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.innerHTML = `
            <span>שולח...</span>
            <i class="fa-solid fa-circle-notch animate-spin"></i>
        `;
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-80', 'cursor-not-allowed');

        try {
            // 3. Send Request to Formspree
            const response = await fetch('https://formspree.io/f/xnjjnlvy', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // 4. Success State: Replace form content
                formBody.classList.add('opacity-0');
                
                setTimeout(() => {
                    formBody.innerHTML = `
                        <div class="flex flex-col items-center justify-center h-full py-12 text-center">
                            <div class="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                                <i class="fa-solid fa-check text-4xl"></i>
                            </div>
                            <h3 class="text-3xl font-black text-on-surface mb-2">ההודעה נשלחה בהצלחה!</h3>
                            <p class="text-on-surface-variant text-lg max-w-sm">
                                תודה שפנית אליי, ${clientName || 'אורח'}. <br>
                                אני אעבור על הפרטים ואחזור אליך בהקדם האפשרי.
                            </p>
                            <div class="mt-8 w-16 h-1 bg-green-500/30 rounded-full"></div>
                        </div>
                    `;
                    formBody.classList.remove('opacity-0');
                    formBody.classList.add('opacity-100', 'transition-opacity', 'duration-500');
                }, 300);

            } else {
                throw new Error('שגיאה בשליחה');
            }
        } catch (error) {
            // 5. Error State
            alert('אופס! הייתה בעיה בשליחת הטופס. נסה שוב מאוחר יותר.');
            submitBtn.innerHTML = originalBtnContent;
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-80', 'cursor-not-allowed');
        }
    });
}