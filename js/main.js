// Definición de películas disponibles
const allMovies = [
    
    // Transformers
    { 
        title: "Transformers 1", 
        img: "imagenes/trans1.webp", 
        link: "peliculas/transformers/trans1.html",
        category: "transformers"
    },
    { 
        title: "Transformers 2", 
        img: "imagenes/trans2.webp", 
        link: "peliculas/transformers/trans2.html",
        category: "transformers"
    },
    { 
        title: "Transformers 3", 
        img: "imagenes/trans3.webp", 
        link: "peliculas/transformers/trans3.html",
        category: "transformers"
    },
    { 
        title: "Transformers 4", 
        img: "imagenes/trans4.webp", 
        link: "peliculas/transformers/trans4.html",
        category: "transformers"
    },
    { 
        title: "Transformers 5", 
        img: "imagenes/trans5.webp", 
        link: "peliculas/transformers/trans5.html",
        category: "transformers"
    },
    
    // Jurassic World
    { 
        title: "Jurassic World 2", 
        img: "imagenes/jurassic_world_2.webp", 
        link: "peliculas\jurassic-world\jurassic-world-2.html",
        category: "jurassic"
    },
    { 
        title: "Jurassic World Dominio", 
        img: "imagenes/jurassic_world_dominio.webp", 
        link: "peliculas\jurassic-world\jurassic-world-dominio.html",
        category: "jurassic"
    }
];

// Función para obtener películas relacionadas
function getRelatedMovies(currentMovie, category, count = 3) {
    return allMovies
        .filter(movie => movie.category === category && movie.title !== currentMovie)
        .slice(0, count);
}

// Obtener películas por categoría
function getMoviesByCategory(category) {
    return allMovies.filter(movie => movie.category === category);
}

// Inicializar sitio
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar paginación si estamos en la página principal
    if (document.getElementById('movieContainer')) {
        initializePagination(allMovies);
    }
    
    // Configurar navegación global
    setupNavigation();
    
    // Mostrar películas relacionadas en páginas de detalle
    setupRelatedMovies();
});

// Configurar navegación
function setupNavigation() {
    const header = document.querySelector('header');
    
    // Solo agregar navegación si no estamos en una página de detalle
    if (header && !document.querySelector('.movie-poster')) {
        const nav = document.createElement('nav');
        nav.className = 'main-nav';
        
        nav.innerHTML = `
            <a href="index.html">Inicio</a>
            <a href="#" id="transformersLink">Transformers</a>
            <a href="#" id="jurassicLink">Jurassic World</a>
        `;
        
        header.parentNode.insertBefore(nav, header.nextSibling);
        
        // Configurar eventos para filtrar por categoría
        document.getElementById('transformersLink').addEventListener('click', function(e) {
            e.preventDefault();
            filterByCategory('transformers');
        });
        
        document.getElementById('jurassicLink').addEventListener('click', function(e) {
            e.preventDefault();
            filterByCategory('jurassic');
        });
    }
}

// Filtrar películas por categoría
function filterByCategory(category) {
    if (document.getElementById('movieContainer')) {
        // Actualizar categoría activa
        currentCategory = category;
        currentPage = 1;
        
        // Actualizar botones de categoría
        const categoryButtons = document.querySelectorAll('.category-button');
        categoryButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-category') === category);
        });
        
        // Renderizar películas filtradas
        renderMovies(allMovies, document.getElementById('movieContainer'));
    } else {
        // Si no estamos en la página principal, redirigir
        window.location.href = 'index.html?category=' + category;
    }
}

// Configurar películas relacionadas
function setupRelatedMovies() {
    const movieTitle = document.querySelector('.movie-title');
    
    // Si estamos en una página de detalle de película
    if (movieTitle && document.querySelector('.movie-poster')) {
        // Determinar la categoría de la película actual basada en la URL
        let category = 'transformers';
        if (window.location.pathname.includes('jurassic')) {
            category = 'jurassic';
        }
        
        // Obtener películas relacionadas
        const relatedMovies = getRelatedMovies(movieTitle.textContent, category);
        
        // Mostrar películas relacionadas si hay alguna
        if (relatedMovies.length > 0) {
            const relatedContainer = document.createElement('div');
            relatedContainer.className = 'related-movies';
            
            let relatedHTML = '<h3>Películas relacionadas</h3><div class="related-movies-grid">';
            
            relatedMovies.forEach(movie => {
                relatedHTML += `
                    <a href="${movie.link}" class="related-movie-item">
                        <img src="../../${movie.img}" alt="${movie.title}">
                        <div class="related-movie-title">${movie.title}</div>
                    </a>
                `;
            });
            
            relatedHTML += '</div>';
            relatedContainer.innerHTML = relatedHTML;
            
            // Agregar al DOM
            document.querySelector('.container').appendChild(relatedContainer);
        }
    }
}

// Verificar categoría en URL al cargar
window.addEventListener('load', function() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    
    if (category) {
        filterByCategory(category);
    }
});