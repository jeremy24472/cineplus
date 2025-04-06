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
    
    // Jurassic World - Corregido uso de barras invertidas a barras normales
    { 
        title: "Jurassic World 2", 
        img: "imagenes/jurassic_world_2.webp", 
        link: "peliculas/jurassic-world/jurassic-world-2.html",
        category: "jurassic"
    },
    { 
        title: "Jurassic World Dominio", 
        img: "imagenes/jurassic_world_dominio.webp", 
        link: "peliculas/jurassic-world/jurassic-world-dominio.html",
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

// Función para resolver rutas relativas correctamente
function resolveRelativePath(path) {
    // Detectar si estamos en una página de detalle de película (mayor profundidad)
    const isDetailPage = window.location.pathname.includes('/peliculas/');
    
    // Si estamos en una página de detalle (profundidad 2), necesitamos volver dos niveles hacia arriba
    if (isDetailPage) {
        // Reemplazar la ruta relativa con la ruta absoluta desde la raíz del sitio
        return '../../' + path;
    }
    
    // Si estamos en la página principal o paginación, la ruta es directa
    return path;
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
    
    // Verificar si hay un parámetro de página en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    if (pageParam && !isNaN(parseInt(pageParam))) {
        currentPage = parseInt(pageParam);
        // Renderizar películas con la página actualizada
        if (document.getElementById('movieContainer')) {
            renderMovies(allMovies, document.getElementById('movieContainer'));
        }
    }
});

// Configurar navegación
function setupNavigation() {
    const header = document.querySelector('header');
    
    // Solo agregar navegación si no estamos en una página de detalle
    if (header && !document.querySelector('.movie-poster')) {
        const nav = document.createElement('nav');
        nav.className = 'main-nav';
        
        nav.innerHTML = `
            <a href="${resolveRelativePath('index.html')}">Inicio</a>
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
        window.location.href = resolveRelativePath('index.html') + '?category=' + category;
    }
}

// Configurar películas relacionadas
function setupRelatedMovies() {
    const movieTitle = document.querySelector('.movie-title');
    
    // Si estamos en una página de detalle de película
    if (movieTitle && document.querySelector('.movie-poster')) {
        // Determinar la categoría de la película actual basada en la URL de manera más robusta
        let category = 'transformers';
        const pathname = window.location.pathname;
        
        if (pathname.includes('jurassic-world')) {
            category = 'jurassic';
        } else if (pathname.includes('transformers')) {
            category = 'transformers';
        }
        
        // Obtener películas relacionadas
        const relatedMovies = getRelatedMovies(movieTitle.textContent, category);
        
        // Mostrar películas relacionadas si hay alguna
        if (relatedMovies.length > 0) {
            const relatedContainer = document.createElement('div');
            relatedContainer.className = 'related-movies';
            
            let relatedHTML = '<h3>Películas relacionadas</h3><div class="related-movies-grid">';
            
            relatedMovies.forEach(movie => {
                // Crear rutas correctas para enlaces y imágenes
                // Los enlaces ya contienen las rutas correctas desde la raíz del sitio
                // Solo necesitamos ajustar la ruta desde la ubicación actual
                
                // Extraer el nombre de archivo de la URL actual
                const currentFilename = pathname.substring(pathname.lastIndexOf('/') + 1);
                
                // Construir la ruta relativa al archivo actual
                const relativePath = movie.link.replace('peliculas/', '../');
                
                // Ruta relativa para la imagen
                const imageRelativePath = '../../' + movie.img;
                
                relatedHTML += `
                    <a href="${relativePath}" class="related-movie-item">
                        <img src="${imageRelativePath}" alt="${movie.title}">
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