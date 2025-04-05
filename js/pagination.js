// Configuración de paginación
const moviesPerPage = 4;
let currentPage = 1;
let currentCategory = 'all';

// Función para renderizar las películas
function renderMovies(movies, container) {
    container.innerHTML = "";
    
    // Filtrar por categoría si es necesario
    let filteredMovies = movies;
    if (currentCategory !== 'all') {
        filteredMovies = movies.filter(movie => movie.category === currentCategory);
    }
    
    // Calcular películas para la página actual
    const start = (currentPage - 1) * moviesPerPage;
    const end = start + moviesPerPage;
    const paginatedMovies = filteredMovies.slice(start, end);
    
    // Mostrar mensaje si no hay películas
    if (paginatedMovies.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No hay películas disponibles en esta categoría.";
        container.appendChild(message);
        return;
    }
    
    // Crear elementos para cada película
    paginatedMovies.forEach(movie => {
        const movieItem = document.createElement("div");
        movieItem.className = "movie-item";
        
        const anchor = document.createElement("a");
        anchor.href = movie.link;
        
        const img = document.createElement("img");
        img.src = movie.img;
        img.alt = movie.title;
        
        const title = document.createElement("div");
        title.className = "movie-title";
        title.textContent = movie.title;
        
        anchor.appendChild(img);
        movieItem.appendChild(anchor);
        movieItem.appendChild(title);
        container.appendChild(movieItem);
    });
    
    // Actualizar estado de botones de paginación
    updatePaginationButtons(filteredMovies.length);
}

// Actualizar estado de botones de paginación
function updatePaginationButtons(totalMovies) {
    const prevButton = document.getElementById("prevPage");
    const nextButton = document.getElementById("nextPage");
    
    if (prevButton && nextButton) {
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage * moviesPerPage >= totalMovies;
    }
}

// Inicializar paginación y eventos
function initializePagination(movies) {
    const movieContainer = document.getElementById("movieContainer");
    const prevButton = document.getElementById("prevPage");
    const nextButton = document.getElementById("nextPage");
    
    if (!movieContainer) return;
    
    // Renderizar películas iniciales
    renderMovies(movies, movieContainer);
    
    // Configurar eventos de botones de paginación
    if (prevButton) {
        prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderMovies(movies, movieContainer);
                // Desplazar hacia arriba para mostrar contenido nuevo
                window.scrollTo({ top: movieContainer.offsetTop - 20, behavior: 'smooth' });
            }
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener("click", () => {
            const filteredMovies = currentCategory === 'all' 
                ? movies 
                : movies.filter(movie => movie.category === currentCategory);
                
            if (currentPage * moviesPerPage < filteredMovies.length) {
                currentPage++;
                renderMovies(movies, movieContainer);
                // Desplazar hacia arriba para mostrar contenido nuevo
                window.scrollTo({ top: movieContainer.offsetTop - 20, behavior: 'smooth' });
            }
        });
    }
    
    // Configurar eventos para filtrado por categoría
    const categoryButtons = document.querySelectorAll('.category-button');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            
            // Actualizar categoría activa y botones
            currentCategory = category;
            currentPage = 1; // Volver a la primera página
            
            // Actualizar estado de botones de categoría
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Renderizar películas filtradas
            renderMovies(movies, movieContainer);
        });
    });
}