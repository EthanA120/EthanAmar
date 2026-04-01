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
    grid.innerHTML = ""; // Clear current projects

    // If "all" is choosen get all projects, else choose projects by filtered category
    const filtered = filter === "all" ? projects : projects.filter(project => project.category === filter);

    filtered.forEach((project, index) => {
        const card = `
            <div class="group relative bg-surface-container rounded-[2rem] overflow-hidden border border-on-surface/5 shadow-lg transition-all hover:-translate-y-2" data-aos="fade-up" data-aos-delay="${index * 100}">
                
                <div class="relative aspect-video overflow-hidden">
                    <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                    
                    <div class="absolute inset-0 bg-primary/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                        <a href="${project.demoLink}" class="p-3 bg-surface rounded-full text-primary hover:scale-110 transition-transform shadow-lg" title="Live Demo">
                            <span class="material-symbols-outlined">visibility</span>
                        </a>
                        <a href="${project.repoLink}" class="p-3 bg-surface rounded-full text-primary hover:scale-110 transition-transform shadow-lg" title="GitHub Repo">
                            <span class="material-symbols-outlined">code</span>
                        </a>
                        <a href="${project.downloadLink}" class="p-3 bg-surface rounded-full text-primary hover:scale-110 transition-transform shadow-lg" title="Download Code">
                            <span class="material-symbols-outlined">download</span>
                        </a>
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
    });
}

/* --- Filter Tab Logic --- */
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (btnEvent) => {
        // Update UI active state
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('bg-primary', 'text-surface', 'border-primary');
            b.classList.add('text-on-surface-variant', 'border-on-surface/10');
        });
        btnEvent.target.classList.add('bg-primary', 'text-surface', 'border-primary');
        
        // Filter projects according to "data-filter" button's attribute
        renderProjects(btnEvent.target.dataset.filter);
    });
});

// Initial Render
renderProjects();