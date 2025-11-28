// js/main.js - Versión corregida y simplificada
class UNIAJCEducaDigital {
    constructor() {
        this.recursos = [];
        this.filtrosActivos = {
            facultad: null,
            tipo: null, 
            nivel: null,
            busqueda: ''
        };
        
        this.init();
    }

    async init() {
        console.log('🚀 Inicializando UNIAJC Educa Digital...');
        await this.cargarRecursos();
        this.configurarEventListeners();
        console.log('✅ Aplicación inicializada');
    }

    async cargarRecursos() {
    try {
        console.log('📥 Cargando recursos...');
        
        // PRIMERO: Intentar cargar del localStorage (recursos subidos)
        const recursosSubidos = this.cargarRecursosDeLocalStorage();
        
        // SEGUNDO: Cargar del JSON (recursos base)
        const recursosJSON = await this.cargarRecursosDeJSON();
        
        // COMBINAR: Los recursos subidos tienen prioridad
        this.recursos = [...recursosSubidos, ...recursosJSON];
        
        console.log(`✅ Total recursos: ${this.recursos.length} (${recursosSubidos.length} subidos + ${recursosJSON.length} base)`);
        this.mostrarRecursos(this.recursos);
        
    } catch (error) {
        console.error('❌ Error cargando recursos:', error);
        this.mostrarRecursos([]);
    }
}

    cargarRecursosDeLocalStorage() {
        try {
            const recursosGuardados = localStorage.getItem('recursos_uniajc');
            if (recursosGuardados) {
                const recursos = JSON.parse(recursosGuardados);
                console.log(`📦 Recursos cargados de localStorage: ${recursos.length}`);
                return recursos;
            }
        } catch (error) {
            console.error('Error cargando de localStorage:', error);
        }
        return [];
    }

    async cargarRecursosDeJSON() {
        try {
            const response = await fetch('./data/recursos.json');
            if (!response.ok) throw new Error('HTTP error');
            
            const data = await response.json();
            console.log(`📄 Recursos cargados de JSON: ${data.recursos?.length || 0}`);
            return data.recursos || [];
        } catch (error) {
            console.error('Error cargando de JSON:', error);
            return [];
        }
    }

    mostrarRecursos(recursos) {
    const container = document.getElementById('recursos-grid');
    if (!container) {
        console.error('❌ No se encontró #recursos-grid');
        return;
    }

    console.log(`🖥️ Mostrando ${recursos.length} recursos`);

    if (recursos.length === 0) {
        container.innerHTML = `
            <div class="no-results text-center">
                <i class="fas fa-search fa-3x mb-3"></i>
                <h3>No se encontraron recursos</h3>
                <p>Intenta con otros términos de búsqueda o filtros</p>
            </div>
        `;
        return;
    }

    container.innerHTML = recursos.map(recurso => {
            const esDestacado = recurso.metadata.destacado;
            
            return `
                <div class="recurso-card ${esDestacado ? 'card-hover' : ''}" data-id="${recurso.id}">
                    <div class="recurso-header">
                        <span class="badge badge-${recurso.contenido.tipo}">
                            <i class="fas fa-${this.obtenerIconoFontAwesome(recurso.contenido.tipo)}"></i>
                            ${recurso.contenido.tipo}
                        </span>
                        <h3 class="recurso-title">${recurso.titulo}</h3>
                        <div class="recurso-meta">
                            <span><i class="fas fa-graduation-cap"></i> ${recurso.facultad}</span>
                            <span><i class="fas fa-clock"></i> ${recurso.contenido.duracion}</span>
                        </div>
                    </div>
                    
                    <div class="recurso-body">
                        <p class="recurso-descripcion">${recurso.objetivo.descripcion}</p>
                        
                        ${recurso.objetivo.competencias && recurso.objetivo.competencias.length > 0 ? `
                            <div class="recurso-competencias">
                                ${recurso.objetivo.competencias.slice(0, 3).map(comp => `
                                    <span class="competencia-tag">${comp}</span>
                                `).join('')}
                                ${recurso.objetivo.competencias.length > 3 ? `
                                    <span class="competencia-tag">+${recurso.objetivo.competencias.length - 3} más</span>
                                ` : ''}
                            </div>
                        ` : ''}
                        
                        <div class="recurso-stats">
                            <span class="recurso-stat">
                                <i class="fas fa-eye"></i> ${recurso.metadata.visitas || 0}
                            </span>
                            <span class="recurso-stat">
                                <i class="fas fa-star"></i> ${recurso.metadata.valoracion || 0}
                            </span>
                            <span class="recurso-stat">
                                <i class="fas fa-download"></i> ${recurso.metadata.descargas || 0}
                            </span>
                        </div>
                    </div>
                    
                    <div class="recurso-footer">
                        <div class="recurso-author">
                            <i class="fas fa-user"></i> ${recurso.autor}
                        </div>
                        <button class="btn btn-primary btn-sm" onclick="app.verRecurso('${recurso.id}')">
                            Ver Detalles
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        this.actualizarContadorResultados(recursos.length);
    }

    obtenerIconoFontAwesome(tipo) {
        const iconos = {
            'video': 'play-circle',
            'infografia': 'chart-pie', 
            'pdf': 'file-pdf',
            'documento': 'file-alt',
            'simulacion': 'cogs',
            'presentacion': 'presentation'
        };
        return iconos[tipo] || 'file';
    }

    obtenerIconoTipo(tipo) {
        const iconos = {
            'video': '🎬',
            'infografia': '📊', 
            'pdf': '📄',
            'documento': '📝'
        };
        return iconos[tipo] || '📁';
    }

    actualizarContadorResultados(cantidad) {
        const contador = document.getElementById('contadorRecursos');
        if (contador) {
            contador.textContent = `${cantidad} recurso${cantidad !== 1 ? 's' : ''} encontrado${cantidad !== 1 ? 's' : ''}`;
        }
    }

    configurarEventListeners() {
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filtrarYMostrarRecursos();
            });
        }
    }

    filtrarYMostrarRecursos() {
    const searchInput = document.querySelector('.search-bar input');
    const busqueda = searchInput ? searchInput.value.toLowerCase() : '';
    
    let recursosFiltrados = this.recursos.filter(recurso => {
            // Filtro por búsqueda
            if (busqueda) {
                const enTitulo = recurso.titulo.toLowerCase().includes(busqueda);
                const enDescripcion = recurso.objetivo.descripcion.toLowerCase().includes(busqueda);
                const enEtiquetas = recurso.metadata.etiquetas?.some(etiqueta => 
                    etiqueta.toLowerCase().includes(busqueda)
                ) || false;
                
                if (!(enTitulo || enDescripcion || enEtiquetas)) {
                    return false;
                }
            }

            // Filtro por facultad
            if (this.filtrosActivos.facultad) {
                const facultadMap = {
                    'ingenieria': 'Ingeniería',
                    'salud': 'Ciencias de la Salud', 
                    'educacion': 'Educación'
                };
                
                if (recurso.facultad !== facultadMap[this.filtrosActivos.facultad]) {
                    return false;
                }
            }

            // Filtro por tipo
            if (this.filtrosActivos.tipo && recurso.contenido.tipo !== this.filtrosActivos.tipo) {
                return false;
            }

            // Filtro por nivel
            if (this.filtrosActivos.nivel && recurso.nivel !== this.filtrosActivos.nivel) {
                return false;
            }

            return true;
        });
        
        this.mostrarRecursos(recursosFiltrados);
        this.actualizarContadorResultados(recursosFiltrados.length);
    }

    aplicarFiltroFacultad(facultad) {
        this.filtrosActivos.facultad = facultad || null;
        this.filtrarYMostrarRecursos();
    }

    aplicarFiltroTipo(tipo) {
        this.filtrosActivos.tipo = tipo || null;
        this.filtrarYMostrarRecursos();
    }

    aplicarFiltroNivel(nivel) {
        this.filtrosActivos.nivel = nivel || null;
        this.filtrarYMostrarRecursos();
    }

    limpiarFiltros() {
        this.filtrosActivos = {
            facultad: null,
            tipo: null,
            nivel: null,
            busqueda: ''
        };
        
        // Limpiar inputs
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) searchInput.value = '';
        
        document.getElementById('filtroFacultad').value = '';
        document.getElementById('filtroTipo').value = '';
        document.getElementById('filtroNivel').value = '';
        
        this.filtrarYMostrarRecursos();
    }

    verRecurso(id) {
        console.log('🔍 Navegando a recurso:', id);
        
        // Guardar el recurso seleccionado para la página de detalle
        const recurso = this.recursos.find(r => r.id === id);
        if (recurso) {
            // Guardar en sessionStorage para la página de detalle
            sessionStorage.setItem('recursoSeleccionado', JSON.stringify(recurso));
            
            // Redirigir a la página de detalle
            window.location.href = `recurso-detalle.html?id=${id}`;
        } else {
            this.mostrarError('Recurso no encontrado');
        }
    }

    mostrarError(mensaje) {
        console.error('Error:', mensaje);
        // Puedes mostrar un alert temporal
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 1rem;
            border-radius: 5px;
            z-index: 1000;
        `;
        errorDiv.textContent = mensaje;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    }

    configurarActualizacionesAutomaticas() {
        // Escuchar mensajes de actualización
        window.addEventListener('message', (event) => {
            if (event.data && event.data.tipo === 'recursosActualizados') {
                console.log('🔄 Actualizando recursos por mensaje...');
                this.cargarRecursos();
            }
        });
        
        // Verificar si hubo actualizaciones recientes
        window.addEventListener('focus', () => {
            const ultimaActualizacion = sessionStorage.getItem('ultimaActualizacion');
            if (ultimaActualizacion) {
                console.log('🔄 Recursos actualizados recientemente, recargando...');
                this.cargarRecursos();
                sessionStorage.removeItem('ultimaActualizacion');
            }
        });
    }

}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    window.app = new UNIAJCEducaDigital();
});

