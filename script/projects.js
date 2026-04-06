/* --- Projects Data Array --- */
const projects = [
    {
        title: "איקס עיגול",
        description: "המשחק הקלאסי שכולנו מכירים בגירסאת הדפדפן",
        category: "JS",
        tags: ["HTML", "CSS", "JavaScript"],
        image: "./projects/Tic Tac Toe/tic-tac-toe.svg",
        demoLink: "./projects/Tic Tac Toe/index.html",
        repoLink: "https://github.com/EthanA120/EthanAmar/tree/main/projects/Tic%20Tac%20Toe",
        downloadLink: "./projects/Tic Tac Toe/Tic Tac Toe.rar"
    },
];

/* --- Render Projects Function --- */
function renderProjects(filter = "all") {
    const grid = document.getElementById('projects-grid');
    const dotsContainer = document.getElementById('carousel-dots');
    grid.innerHTML = ""; 
    if(dotsContainer) dotsContainer.innerHTML = "";

    const filtered = filter === "all" 
        ? projects 
        : projects.filter(p => p.category === filter);

    filtered.forEach((project, index) => {
        const card = `
            <div class="group relative bg-surface-container rounded-[2rem] overflow-hidden border border-on-surface/5 shadow-lg transition-all md:hover:-translate-y-2">
                
                <div class="relative aspect-video overflow-hidden">
                    <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                    
                    <div class="absolute inset-0 bg-primary/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                        <a href="${project.demoLink}" target="_blank" class="p-2 bg-surface rounded-full text-primary hover:scale-110 shadow-lg"><span class="material-symbols-outlined project-button">play_circle</span></a>
                        <a href="${project.repoLink}" target="_blank" class="p-2 bg-surface rounded-full text-primary hover:scale-110 shadow-lg"><span class="material-symbols-outlined project-button">folder_code</span></a>
                        <a href="${project.downloadLink}" target="_blank" download class="p-2 bg-surface rounded-full text-primary hover:scale-110 shadow-lg"><span class="material-symbols-outlined project-button">download</span></a>
                    </div>
                </div>

                <div class="p-6 text-right">
                    <div class="flex flex-row-reverse gap-2 mb-3">
                        ${project.tags.map(tag => `<span class="text-md font-bold px-2 py-1 bg-primary/10 text-primary rounded-md uppercase">${tag}</span>`).join('')}
                    </div>
                    <h3 class="text-xl font-black text-on-surface mb-2">${project.title}</h3>
                    <p class="text-on-surface-variant text-lg leading-relaxed">${project.description}</p>
                </div>
            </div>
        `;
        grid.innerHTML += card;

        // Add dot for each project on mobile
        if(dotsContainer) {
            const dot = document.createElement('div');
            dot.className = `w-2 h-2 rounded-full transition-all ${index === 0 ? 'bg-primary w-4' : 'bg-on-surface/20'}`;
            dotsContainer.appendChild(dot);
        }
    });

    // Update dots on scroll
    grid.addEventListener('scroll', () => {
        const scrollIndex = Math.round(grid.scrollLeft / (window.innerWidth * 0.85));
        const dots = dotsContainer.querySelectorAll('div');
        dots.forEach((dot, i) => {
            if(i === Math.abs(scrollIndex)) {
                dot.classList.add('bg-primary', 'w-4');
                dot.classList.remove('bg-on-surface/20');
            } else {
                dot.classList.remove('bg-primary', 'w-4');
                dot.classList.add('bg-on-surface/20');
            }
        });
    });
}

/* --- Filter Tab Logic --- */
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (btnEvent) => {
        // Update UI state for all other buttons
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('bg-primary', 'text-surface', 'border-primary');
            b.classList.add('text-on-surface-variant', 'border-on-surface/10', 'hover:border-primary', 'hover:text-primary');
        });
        // Update UI state for currently active button
        btnEvent.target.classList.add('bg-primary', 'text-surface', 'border-primary'); // Add primary colors and effects
        btnEvent.target.classList.remove('hover:border-primary', 'hover:text-primary'); // Remove hover effects
        
        // Filter projects according to "data-filter" button's attribute
        renderProjects(btnEvent.target.dataset.filter);
    });
});

// Initial Render
renderProjects();