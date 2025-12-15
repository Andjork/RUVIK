// js/detalle-recurso.js - Gestión de la página de detalle
class GestorDetalleRecurso {
    constructor() {
        this.recurso = null;
        this.pasoActual = 1;
        this.init();
    }

    async init() {
        console.log('🚀 Inicializando gestor de detalle...');
        await this.cargarRecursoDetalle();
        this.configurarNavegacion();
    }

    cargarRecursoDetalle() {
        // Cargar recurso de sessionStorage
        const recursoData = sessionStorage.getItem('recursoSeleccionado');

        if (!recursoData) {
            this.mostrarError('No se ha seleccionado ningún recurso.');
            setTimeout(() => window.location.href = 'recursos.html', 2000);
            return;
        }

        this.recurso = JSON.parse(recursoData);
        console.log('📖 Recurso cargado:', this.recurso);

        this.mostrarDetalleRecurso();
        this.incrementarVisitas();
    }

    mostrarDetalleRecurso() {
        if (!this.recurso) return;

        // Header del recurso
        document.getElementById('breadcrumb-titulo').textContent = this.recurso.titulo;
        document.getElementById('recurso-titulo').textContent = this.recurso.titulo;
        document.getElementById('recurso-autor').textContent = this.recurso.autor;
        document.getElementById('recurso-fecha').textContent = this.formatearFecha(this.recurso.fecha_creacion);
        document.getElementById('recurso-duracion').textContent = this.recurso.contenido.duracion;
        document.getElementById('recurso-visitas').textContent = this.recurso.metadata.visitas || 0;
        document.getElementById('facultad-recurso').textContent = this.recurso.facultad;

        // Badge tipo
        const badge = document.getElementById('badge-tipo');
        badge.className = `badge badge-${this.recurso.contenido.tipo}`;
        badge.innerHTML = `<i class="fas fa-${this.obtenerIconoTipo(this.recurso.contenido.tipo)}"></i> ${this.recurso.contenido.tipo}`;

        // Paso 1: Objetivo
        document.getElementById('objetivo-titulo').textContent = 'Objetivo de Aprendizaje';
        document.getElementById('objetivo-descripcion').textContent = this.recurso.objetivo.descripcion;

        const competenciasGrid = document.getElementById('competencias-grid');
        competenciasGrid.innerHTML = this.recurso.objetivo.competencias.map(comp => `
            <div class="competencia-item">
                <i class="fas fa-check-circle"></i>
                <span>${comp}</span>
            </div>
        `).join('');

        // Paso 2: Contenido
        document.getElementById('info-tipo').textContent = this.recurso.contenido.tipo;
        document.getElementById('info-duracion').textContent = this.recurso.contenido.duracion;
        document.getElementById('info-formato').textContent = this.recurso.contenido.formato || 'No especificado';

        this.mostrarContenidoPrincipal();

        // Paso 3: Implementación
        document.getElementById('guia-docente').textContent = this.recurso.implementacion.guia_docente || 'No disponible';
        document.getElementById('guia-estudiante').textContent = this.recurso.implementacion.guia_estudiante;

        const materialesList = document.getElementById('materiales-list');
        materialesList.innerHTML = this.recurso.implementacion.materiales_necesarios.map(material => `
            <div class="material-item">
                <i class="fas fa-check"></i>
                <span>${material}</span>
            </div>
        `).join('');

        // Paso 4: Evaluación
        this.mostrarEvaluacion();

        // Recursos relacionados
        this.mostrarRecursosRelacionados();
    }

    mostrarContenidoPrincipal() {
        const container = document.getElementById('contenido-principal');
        const tipo = this.recurso.contenido.tipo;

        switch (tipo) {
            case 'video':
                container.innerHTML = `
                    <div class="video-container">
                        <video controls width="100%" poster="${this.recurso.contenido.thumbnail || ''}">
                            <source src="${this.recurso.contenido.url}" type="video/mp4">
                            Tu navegador no soporta el elemento video.
                        </video>
                    </div>
                `;
                break;

            case 'pdf':
                container.innerHTML = `
                    <div class="pdf-container">
                        <iframe src="${this.recurso.contenido.url}" width="100%" height="500px">
                            Tu navegador no soporta iframes.
                        </iframe>
                    </div>
                `;
                break;

            case 'infografia':
                container.innerHTML = `
                    <div class="infografia-container">
                        <img src="${this.recurso.contenido.thumbnail || this.recurso.contenido.url}" 
                             alt="${this.recurso.titulo}" 
                             class="responsive-img">
                        <div class="text-center mt-3">
                            <a href="${this.recurso.contenido.url}" 
                               target="_blank" 
                               class="btn btn-primary">
                                <i class="fas fa-external-link-alt"></i> Ver Infografía Completa
                            </a>
                        </div>
                    </div>
                `;
                break;

            case 'genially':
                // Priorizar iframe si está disponible, sino usar URL
                if (this.recurso.contenido.iframe && this.recurso.contenido.iframe.trim()) {
                    container.innerHTML = `
                        <div class="genially-container">
                            <div class="genially-embed">
                                ${this.recurso.contenido.iframe}
                            </div>
                            ${this.recurso.contenido.url ? `
                                <div class="text-center mt-3">
                                    <a href="${this.recurso.contenido.url}" 
                                       target="_blank" 
                                       class="btn btn-outline">
                                        <i class="fas fa-external-link-alt"></i> Abrir en Genially
                                    </a>
                                </div>
                            ` : ''}
                        </div>
                    `;
                } else if (this.recurso.contenido.url) {
                    container.innerHTML = `
                        <div class="genially-container">
                            <iframe src="${this.recurso.contenido.url}" width="100%" height="500px" allowfullscreen>
                                Tu navegador no soporta iframes.
                            </iframe>
                            <div class="text-center mt-3">
                                <a href="${this.recurso.contenido.url}" 
                                   target="_blank" 
                                   class="btn btn-primary">
                                    <i class="fas fa-external-link-alt"></i> Abrir en Genially
                                </a>
                            </div>
                        </div>
                    `;
                } else {
                    container.innerHTML = `
                        <div class="contenido-placeholder">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p>No se ha proporcionado contenido de Genially</p>
                        </div>
                    `;
                }
                break;

            case 'enlace':
                container.innerHTML = `
                    <div class="enlace-container">
                        <div class="enlace-preview">
                            ${this.recurso.contenido.thumbnail ? `
                                <img src="${this.recurso.contenido.thumbnail}" 
                                     alt="${this.recurso.titulo}" 
                                     class="responsive-img">
                            ` : `
                                <div class="enlace-icon">
                                    <i class="fas fa-link fa-5x"></i>
                                </div>
                            `}
                        </div>
                        <div class="text-center mt-3">
                            <h4>Recurso Externo</h4>
                            <p>Este recurso se encuentra en un sitio externo</p>
                            <a href="${this.recurso.contenido.url}" 
                               target="_blank" 
                               class="btn btn-primary btn-lg">
                                <i class="fas fa-external-link-alt"></i> Ir al Recurso
                            </a>
                        </div>
                    </div>
                `;
                break;

            default:
                container.innerHTML = `
                    <div class="contenido-placeholder">
                        <i class="fas fa-file"></i>
                        <p>Contenido no disponible para previsualización</p>
                        <a href="${this.recurso.contenido.url}" 
                           target="_blank" 
                           class="btn btn-primary">
                            <i class="fas fa-external-link-alt"></i> Abrir Contenido
                        </a>
                    </div>
                `;
        }
    }

    mostrarEvaluacion() {
        const evaluacion = this.recurso.evaluacion;
        const container = document.getElementById('contenido-evaluacion');
        const placeholder = document.getElementById('evaluacion-placeholder');

        if (evaluacion.tipo === 'ninguna' || !evaluacion.tipo) {
            placeholder.style.display = 'block';
            document.getElementById('evaluacion-descripcion').textContent =
                'No hay evaluación disponible para este recurso.';
            return;
        }

        placeholder.style.display = 'none';
        document.getElementById('evaluacion-descripcion').textContent =
            'Demuestra lo que has aprendido completando esta evaluación.';

        document.getElementById('puntaje-minimo').textContent =
            evaluacion.puntaje_aprobacion ? `${evaluacion.puntaje_aprobacion}%` : '70%';

        if (evaluacion.tipo === 'cuestionario' && evaluacion.preguntas) {
            container.innerHTML = this.generarCuestionario(evaluacion.preguntas);
        } else {
            container.innerHTML = this.generarActividad(evaluacion);
        }
    }

    generarCuestionario(preguntas) {
        return `
            <div class="cuestionario">
                <h4>Cuestionario de Evaluación</h4>
                <form id="form-cuestionario">
                    ${preguntas.map((pregunta, index) => `
                        <div class="pregunta-evaluacion">
                            <h5>${index + 1}. ${pregunta.pregunta}</h5>
                            <div class="opciones-evaluacion">
                                ${pregunta.opciones.map((opcion, opcionIndex) => `
                                    <label class="opcion-evaluacion">
                                        <input type="radio" name="pregunta-${index}" value="${opcionIndex}">
                                        <span>${opcion}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                    <div class="text-center mt-4">
                        <button type="button" class="btn btn-primary" onclick="app.enviarCuestionario()">
                            <i class="fas fa-paper-plane"></i> Enviar Respuestas
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    generarActividad(evaluacion) {
        return `
            <div class="actividad-evaluacion">
                <h4>${evaluacion.tipo === 'actividad' ? 'Actividad Práctica' : 'Proyecto'}</h4>
                <p>${evaluacion.descripcion || 'Complete la actividad según las instrucciones proporcionadas.'}</p>
                
                ${evaluacion.requisitos && evaluacion.requisitos.length > 0 ? `
                    <div class="requisitos-actividad">
                        <h5>Requisitos:</h5>
                        <ul>
                            ${evaluacion.requisitos.map(req => `<li>${req}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="subir-actividad mt-4">
                    <h5>Subir Trabajo</h5>
                    <textarea placeholder="Describa su trabajo o pegue el enlace..." rows="4"></textarea>
                    <button class="btn btn-primary mt-2">
                        <i class="fas fa-upload"></i> Subir Entrega
                    </button>
                </div>
            </div>
        `;
    }

    mostrarRecursosRelacionados() {
        // En una implementación real, cargaríamos recursos de la misma facultad
        const container = document.getElementById('recursos-relacionados');
        container.innerHTML = `
            <div class="no-results">
                <p>No hay recursos relacionados disponibles en este momento.</p>
            </div>
        `;
    }

    // Navegación entre pasos
    siguientePaso(pasoActual) {
        const pasoElement = document.getElementById(`paso-${pasoActual}`);
        const siguientePaso = document.getElementById(`paso-${pasoActual + 1}`);

        if (pasoElement && siguientePaso) {
            pasoElement.classList.remove('active');
            siguientePaso.classList.add('active');

            // Scroll al siguiente paso
            siguientePaso.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    comenzarRecurso() {
        // Ir al primer paso
        document.getElementById('paso-1').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    descargarRecurso() {
        if (this.recurso && this.recurso.contenido.url) {
            window.open(this.recurso.contenido.url, '_blank');
        } else {
            this.mostrarError('No hay archivo disponible para descargar.');
        }
    }

    compartirRecurso() {
        if (navigator.share) {
            navigator.share({
                title: this.recurso.titulo,
                text: this.recurso.objetivo.descripcion,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            this.mostrarExito('Enlace copiado al portapapeles');
        }
    }

    incrementarVisitas() {
        if (this.recurso) {
            this.recurso.metadata.visitas = (this.recurso.metadata.visitas || 0) + 1;
            // En una app real, actualizaríamos en el servidor
            console.log('📈 Visitas incrementadas:', this.recurso.metadata.visitas);
        }
    }

    enviarCuestionario() {
        this.mostrarExito('¡Cuestionario enviado correctamente!');
    }

    finalizarRecurso() {
        this.mostrarExito('¡Recurso completado exitosamente!');
        setTimeout(() => {
            window.location.href = 'recursos.html';
        }, 2000);
    }

    // Utilidades
    obtenerIconoTipo(tipo) {
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

    formatearFecha(fechaStr) {
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    configurarNavegacion() {
        // Configurar eventos adicionales si es necesario
    }

    mostrarError(mensaje) {
        alert('❌ ' + mensaje);
    }

    mostrarExito(mensaje) {
        alert('✅ ' + mensaje);
    }
}

// Inicializar la aplicación de detalle
document.addEventListener('DOMContentLoaded', () => {
    window.app = new GestorDetalleRecurso();
});