/* --- Projects Data Array --- */
const projects = [
    {
        title: "סודוקו",
        description: "סודוקו קלאסי עם דרגות קושי שונות",
        category: "JS",
        tags: ["JavaScript", "Game", "API"],
        image: "./projects/Sudoku/sudoku.png",
        demoLink: "./projects/Sudoku/index.html",
        repoLink: "https://github.com/EthanA120/EthanAmar/tree/main/projects/Sudoku",
        downloadLink: "./projects/Sudoku/Sudoku.rar"
    },
    {
        title: "פקמן",
        description: "משחק הרטרו בגירסאת הדפדפן, לא תצליחו להפסיק לשחק",
        category: "JS",
        tags: ["JavaScript", "Game"],
        image: "./projects/Pacman/pacman.png",
        demoLink: "./projects/Pacman/index.html",
        repoLink: "https://github.com/EthanA120/EthanAmar/tree/main/projects/Pacman",
        downloadLink: "./projects/Pacman/Pacman.rar"
    },
    {
        title: "איקס עיגול",
        description: "המשחק הקלאסי שכולנו מכירים בגירסאת הדפדפן",
        category: "JS",
        tags: ["JavaScript", "Game"],
        image: "./projects/Tic Tac Toe/ticTacToe.png",
        demoLink: "./projects/Tic Tac Toe/index.html",
        repoLink: "https://github.com/EthanA120/EthanAmar/tree/main/projects/Tic%20Tac%20Toe",
        downloadLink: "./projects/Tic Tac Toe/Tic Tac Toe.rar"
    },
    {
        title: "רשימת משימות",
        description: "אפליקציה קטנה לכתיבת רשימה",
        category: "JS",
        tags: ["JavaScript", "App"],
        image: "./projects/ToDo List/toDoList.png",
        demoLink: "./projects/ToDo List/index.html",
        repoLink: "https://github.com/EthanA120/EthanAmar/tree/main/projects/ToDo%20List",
        downloadLink: "./projects/ToDo List/ToDo List.rar"
    },
    {
        title: "מדינות העולם",
        description: "אפליקציה שמאפשרת חיפוש והצגה של מידע כללי על מדינות העולם",
        category: "JS",
        tags: ["JavaScript", "App", "API"],
        image: "./projects/Countries/countries.png",
        demoLink: "./projects/Countries/index.html",
        repoLink: "https://github.com/EthanA120/EthanAmar/tree/main/projects/Countries",
        downloadLink: "./projects/Countries/Countries.rar"
    },
];

/* --- Global State for Pagination --- */
let currentPage = 0;
let currentFilter = "all";
const getItemsPerPage = () => window.innerWidth <= 768 ? 1 : 6;

/**
 * Renders the projects gallery based on current filter and page.
 * Handles sliding animation based on direction.
 */
function renderProjects(direction = 'none') {
    const grid = document.getElementById('projects-grid');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('pagination-info');
    
    if (!grid) return;

    // Filter logic
    const filtered = currentFilter === "all" 
        ? projects 
        : projects.filter(p => p.category === currentFilter);

    const itemsPerPage = getItemsPerPage();

    // Pagination calculation
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    
    // Ensure currentPage is within bounds after filter change
    if (currentPage >= totalPages && totalPages > 0) currentPage = totalPages - 1;
    if (totalPages === 0) currentPage = 0;

    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filtered.slice(start, end);

    // Prepare HTML content
    const htmlContent = pageItems.map(project => `
        <div class="group relative bg-surface-container rounded-[2rem] overflow-hidden border border-on-surface/5 shadow-lg transition-all md:hover:-translate-y-2">
            <div class="relative aspect-video overflow-hidden">
                <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                <div class="absolute inset-0 bg-primary/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <a href="${project.demoLink}" target="_blank" aria-label="צפייה בדמו" class="p-2 bg-surface rounded-full text-primary hover:scale-110 shadow-lg"><span class="material-symbols-outlined project-button">play_circle</span></a>
                    <a href="${project.repoLink}" target="_blank" aria-label="קוד מקור ב-GitHub" class="p-2 bg-surface rounded-full text-primary hover:scale-110 shadow-lg"><span class="material-symbols-outlined project-button">folder_code</span></a>
                    <a href="${project.downloadLink}" target="_blank" download aria-label="הורדת פרויקט" class="p-2 bg-surface rounded-full text-primary hover:scale-110 shadow-lg"><span class="material-symbols-outlined project-button">download</span></a>
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
    `).join('');

    // Handle Sliding Animation
    if (direction !== 'none') {
        grid.style.opacity = '0';
        grid.style.transform = direction === 'next' ? 'translateX(30px)' : 'translateX(-30px)';
        
        setTimeout(() => {
            grid.innerHTML = htmlContent;
            grid.style.transform = direction === 'next' ? 'translateX(-30px)' : 'translateX(30px)';
            grid.offsetHeight; // Force reflow
            grid.style.opacity = '1';
            grid.style.transform = 'translateX(0)';
        }, 250);
    } else {
        grid.innerHTML = htmlContent;
    }

    // Update Pagination UI
    if (pageInfo) pageInfo.textContent = `עמוד ${currentPage + 1} מתוך ${totalPages || 1}`;
    
    // Handle disabled states for arrows
    if (prevBtn) {
        prevBtn.disabled = currentPage === 0;
    }
    if (nextBtn) {
        nextBtn.disabled = (currentPage >= totalPages - 1) || filtered.length <= itemsPerPage;
    }
}

/* --- Event Listeners for Navigation --- */
const handlePrev = () => {
    if (currentPage > 0) {
        currentPage--;
        renderProjects('prev');
    }
};

document.getElementById('prev-page')?.addEventListener('click', handlePrev);

const handleNext = () => {
    const filtered = currentFilter === "all" ? projects : projects.filter(p => p.category === currentFilter);
    const itemsPerPage = getItemsPerPage();
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage < totalPages - 1) {
        currentPage++;
        renderProjects('next');
    }
};

document.getElementById('next-page')?.addEventListener('click', handleNext);

/* --- Touch Swipe Logic for Mobile --- */
let touchStartX = 0;
let touchEndX = 0;

const gridElement = document.getElementById('projects-grid');
if (gridElement) {
    gridElement.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    gridElement.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX - touchStartX > swipeThreshold) {
        // Swipe Left -> Next
        handleNext();
    } else if (touchStartX - touchEndX > swipeThreshold) {
        // Swipe Right -> Prev
        handlePrev();
    }
}

// Re-render on resize to update itemsPerPage
window.addEventListener('resize', () => {
    renderProjects();
});

/* --- Filter Tab Logic --- */
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Reset page to 0 when filter changes
        currentPage = 0;
        currentFilter = btn.dataset.filter;

        // Update UI state for all other buttons
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('bg-primary', 'text-surface', 'border-primary');
            b.classList.add('text-on-surface-variant', 'border-on-surface/10', 'hover:border-primary', 'hover:text-primary');
        });
        // Update UI state for currently active button
        btn.classList.add('bg-primary', 'text-surface', 'border-primary');
        btn.classList.remove('hover:border-primary', 'hover:text-primary');
        
        // Filter projects according to "data-filter" button's attribute
        renderProjects();
    });
});

// Initial Render
renderProjects();