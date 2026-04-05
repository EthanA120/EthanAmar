/* --- Projects Data Array --- */
const projects = [
    {
        title: "E-Commerce System",
        description: "Full-stack online store with payment integration and admin dashboard.",
        category: "react",
        tags: ["React", "Node.js", "PostgreSQL"],
        image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800",
        demoLink: "#",
        repoLink: "#",
        downloadLink: "#"
    },
    {
        title: "Task Management API",
        description: "Scalable RESTful API for managing corporate team tasks and deadlines.",
        category: "node",
        tags: ["Node.js", "Express", "MongoDB"],
        image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800",
        demoLink: "#",
        repoLink: "#",
        downloadLink: "#"
    },
    {
        title: "E-Commerce System",
        description: "Full-stack online store with payment integration and admin dashboard.",
        category: "react",
        tags: ["React", "Node.js", "PostgreSQL"],
        image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800",
        demoLink: "#",
        repoLink: "#",
        downloadLink: "#"
    },
    {
        title: "Task Management API",
        description: "Scalable RESTful API for managing corporate team tasks and deadlines.",
        category: "node",
        tags: ["Node.js", "Express", "MongoDB"],
        image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800",
        demoLink: "#",
        repoLink: "#",
        downloadLink: "#"
    },
    {
        title: "E-Commerce System",
        description: "Full-stack online store with payment integration and admin dashboard.",
        category: "react",
        tags: ["React", "Node.js", "PostgreSQL"],
        image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800",
        demoLink: "#",
        repoLink: "#",
        downloadLink: "#"
    },
    {
        title: "Task Management API",
        description: "Scalable RESTful API for managing corporate team tasks and deadlines.",
        category: "node",
        tags: ["Node.js", "Express", "MongoDB"],
        image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800",
        demoLink: "#",
        repoLink: "#",
        downloadLink: "#"
    },
    {
        title: "E-Commerce System",
        description: "Full-stack online store with payment integration and admin dashboard.",
        category: "react",
        tags: ["React", "Node.js", "PostgreSQL"],
        image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800",
        demoLink: "#",
        repoLink: "#",
        downloadLink: "#"
    },
    {
        title: "Task Management API",
        description: "Scalable RESTful API for managing corporate team tasks and deadlines.",
        category: "node",
        tags: ["Node.js", "Express", "MongoDB"],
        image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800",
        demoLink: "#",
        repoLink: "#",
        downloadLink: "#"
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
                    
                    <div class="absolute inset-0 bg-primary/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                        <a href="${project.demoLink}" target="_blank" class="p-3 bg-surface rounded-full text-primary hover:scale-110 shadow-lg"><span class="material-symbols-outlined">visibility</span></a>
                        <a href="${project.repoLink}" target="_blank" class="p-3 bg-surface rounded-full text-primary hover:scale-110 shadow-lg"><span class="material-symbols-outlined">code</span></a>
                        <a href="${project.downloadLink}" target="_blank" class="p-3 bg-surface rounded-full text-primary hover:scale-110 shadow-lg"><span class="material-symbols-outlined">download</span></a>
                    </div>
                </div>

                <div class="p-6 text-right">
                    <div class="flex flex-row-reverse gap-2 mb-3">
                        ${project.tags.map(tag => `<span class="text-[10px] font-bold px-2 py-1 bg-primary/10 text-primary rounded-md uppercase">${tag}</span>`).join('')}
                    </div>
                    <h3 class="text-xl font-black text-on-surface mb-2">${project.title}</h3>
                    <p class="text-on-surface-variant text-sm leading-relaxed">${project.description}</p>
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