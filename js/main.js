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
            console.warn('⚠️ No se pudo cargar recursos.json (probablemente usando file://), usando datos inline');
            // Datos inline como fallback para cuando se abre desde file://
            return [
                {
                    "id": "REC-001",
                    "titulo": "Introducción a la Programación en Java",
                    "facultad": "Ingeniería",
                    "programa": "Ingeniería de Sistemas",
                    "nivel": "Pregrado",
                    "autor": "Prof. Carlos Mendoza",
                    "fecha_creacion": "2024-01-15",
                    "objetivo": {
                        "descripcion": "Comprender los fundamentos de la programación orientada a objetos usando Java como lenguaje de programación",
                        "competencias": ["Variables y tipos de datos", "Estructuras de control", "POO básica", "Métodos y clases"]
                    },
                    "contenido": {
                        "tipo": "video",
                        "url": "assets/videos/java-intro.mp4",
                        "duracion": "15:30",
                        "formato": "MP4",
                        "thumbnail": "assets/images/java-thumb.jpg"
                    },
                    "implementacion": {
                        "guia_docente": "Este recurso puede utilizarse en las primeras semanas del curso de Programación I. Se recomienda complementar con ejercicios prácticos en clase.",
                        "guia_estudiante": "Ver el video completo y luego realizar los ejercicios propuestos en la plataforma. Duración estimada: 2 horas.",
                        "tiempo_estimado": "2 horas",
                        "materiales_necesarios": ["Computador", "JDK 11+", "IDE (Eclipse o IntelliJ)"],
                        "prerrequisitos": ["Conocimientos básicos de informática"]
                    },
                    "evaluacion": {
                        "tipo": "cuestionario",
                        "preguntas": [
                            {
                                "pregunta": "¿Qué es una clase en Java?",
                                "opciones": [
                                    "Un tipo de dato primitivo",
                                    "Una plantilla para crear objetos",
                                    "Un método especial",
                                    "Una variable global"
                                ],
                                "respuesta_correcta": 1
                            }
                        ],
                        "puntaje_aprobacion": 70
                    },
                    "metadata": {
                        "visitas": 150,
                        "valoracion": 4.5,
                        "descargas": 89,
                        "etiquetas": ["programación", "java", "poo", "ingeniería"],
                        "destacado": true
                    }
                },
                {
                    "id": "REC-002",
                    "titulo": "Anatomía del Sistema Cardiovascular",
                    "facultad": "Ciencias de la Salud",
                    "programa": "Enfermería",
                    "nivel": "Pregrado",
                    "autor": "Dra. María Rodríguez",
                    "fecha_creacion": "2024-01-10",
                    "objetivo": {
                        "descripcion": "Identificar las estructuras y funciones del sistema cardiovascular humano",
                        "competencias": ["Anatomía cardíaca", "Vasos sanguíneos", "Fisiología cardiovascular", "Sistema de conducción"]
                    },
                    "contenido": {
                        "tipo": "infografia",
                        "url": "assets/docs/cardiovascular-infografia.pdf",
                        "duracion": "25 minutos",
                        "formato": "PDF",
                        "thumbnail": "assets/images/cardio-thumb.jpg"
                    },
                    "implementacion": {
                        "guia_docente": "Utilizar como material de apoyo en clases de anatomía. Puede proyectarse y explicarse sección por sección.",
                        "guia_estudiante": "Estudiar la infografía y realizar el esquema propuesto. Repasar antes del examen práctico.",
                        "tiempo_estimado": "45 minutos",
                        "materiales_necesarios": ["Tablet o computador", "Software para PDF"],
                        "prerrequisitos": ["Conocimientos básicos de biología"]
                    },
                    "evaluacion": {
                        "tipo": "actividad",
                        "descripcion": "Crear un esquema del sistema cardiovascular identificando al menos 10 estructuras principales",
                        "puntaje_aprobacion": 80
                    },
                    "metadata": {
                        "visitas": 203,
                        "valoracion": 4.8,
                        "descargas": 145,
                        "etiquetas": ["anatomía", "cardiovascular", "enfermería", "salud"],
                        "destacado": true
                    }
                }
            ];
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
            'presentacion': 'presentation',
            'enlace': 'link',
            'genially': 'chalkboard-teacher'
        };
        return iconos[tipo] || 'file';
    }

    obtenerIconoTipo(tipo) {
        const iconos = {
            'video': '🎬',
            'infografia': '📊',
            'pdf': '📄',
            'documento': '📝',
            'enlace': '🔗',
            'genially': '🎨'
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

