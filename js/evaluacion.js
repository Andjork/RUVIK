// js/evaluacion.js - Sistema de evaluación interactivo para recursos

class SistemaEvaluacion {
    constructor() {
        this.evaluacionActual = null;
        this.respuestasUsuario = [];
        this.pasoActual = 1;
        this.puntajeTotal = 0;
        this.evaluacionCompletada = false;
    }

    // Cargar evaluación desde el recurso actual
    cargarEvaluacion(recurso) {
        if (!recurso.evaluacion || recurso.evaluacion.tipo === 'ninguna') {
            this.mostrarSinEvaluacion();
            return;
        }

        this.evaluacionActual = recurso.evaluacion;
        this.respuestasUsuario = [];
        this.puntajeTotal = 0;
        this.evaluacionCompletada = false;

        this.mostrarEvaluacion();
    }

    mostrarEvaluacion() {
        const container = document.getElementById('evaluacion-container');
        
        switch (this.evaluacionActual.tipo) {
            case 'cuestionario':
                this.mostrarCuestionario(container);
                break;
            case 'actividad':
                this.mostrarActividad(container);
                break;
            case 'proyecto':
                this.mostrarProyecto(container);
                break;
            default:
                this.mostrarSinEvaluacion();
        }
    }

    mostrarCuestionario(container) {
        const preguntas = this.evaluacionActual.preguntas || [];
        
        container.innerHTML = `
            <div class="cuestionario">
                <div class="cuestionario-header">
                    <h3>📝 Cuestionario de Evaluación</h3>
                    <div class="cuestionario-info">
                        <span>${preguntas.length} pregunta${preguntas.length !== 1 ? 's' : ''}</span>
                        <span>Puntaje mínimo: ${this.evaluacionActual.puntaje_aprobacion}%</span>
                    </div>
                </div>
                
                <form id="form-cuestionario" class="cuestionario-form">
                    ${preguntas.map((pregunta, index) => this.generarPreguntaHTML(pregunta, index)).join('')}
                </form>
                
                <div class="cuestionario-actions">
                    <button type="button" class="btn btn-primary" onclick="sistemaEvaluacion.enviarCuestionario()">
                        <i class="fas fa-paper-plane"></i> Enviar Respuestas
                    </button>
                </div>
            </div>
        `;
    }

    generarPreguntaHTML(pregunta, index) {
        return `
            <div class="pregunta-item" data-pregunta="${index}">
                <div class="pregunta-header">
                    <span class="pregunta-numero">${index + 1}</span>
                    <h4 class="pregunta-texto">${pregunta.pregunta}</h4>
                </div>
                
                <div class="opciones-list">
                    ${pregunta.opciones.map((opcion, opcionIndex) => `
                        <label class="opcion-item">
                            <input type="radio" 
                                   name="pregunta-${index}" 
                                   value="${opcionIndex}"
                                   onchange="sistemaEvaluacion.registrarRespuesta(${index}, ${opcionIndex})">
                            <span class="opcion-texto">${opcion}</span>
                        </label>
                    `).join('')}
                </div>
                
                <div class="pregunta-feedback" id="feedback-${index}"></div>
            </div>
        `;
    }

    mostrarActividad(container) {
        container.innerHTML = `
            <div class="actividad-evaluacion">
                <div class="actividad-header">
                    <h3>🎯 Actividad Práctica</h3>
                    <p>${this.evaluacionActual.descripcion}</p>
                </div>
                
                <div class="actividad-instructions">
                    <h4>Instrucciones:</h4>
                    <ul>
                        <li>Completa la actividad según las especificaciones</li>
                        <li>Guarda tu trabajo en el formato requerido</li>
                        <li>Sube el archivo para su revisión</li>
                    </ul>
                </div>
                
                <div class="actividad-upload">
                    <h4>Subir Actividad:</h4>
                    <div class="upload-area">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <p>Arrastra tu archivo aquí o haz clic para seleccionar</p>
                        <input type="file" id="archivo-actividad" accept=".pdf,.doc,.docx,.zip">
                        <button class="btn btn-outline" onclick="sistemaEvaluacion.subirActividad()">
                            <i class="fas fa-upload"></i> Subir Archivo
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    mostrarProyecto(container) {
        container.innerHTML = `
            <div class="proyecto-evaluacion">
                <div class="proyecto-header">
                    <h3>🚀 Proyecto Final</h3>
                    <p>${this.evaluacionActual.descripcion}</p>
                </div>
                
                <div class="proyecto-requirements">
                    <h4>Requisitos del Proyecto:</h4>
                    <div class="requirements-list">
                        ${this.evaluacionActual.requisitos.map(req => `
                            <div class="requirement-item">
                                <i class="fas fa-check-circle"></i>
                                <span>${req}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="proyecto-submission">
                    <h4>Entrega del Proyecto:</h4>
                    <textarea id="proyecto-descripcion" 
                              placeholder="Describe tu proyecto, incluye enlaces o información relevante..."
                              rows="6"></textarea>
                    <button class="btn btn-primary" onclick="sistemaEvaluacion.enviarProyecto()">
                        <i class="fas fa-rocket"></i> Enviar Proyecto
                    </button>
                </div>
            </div>
        `;
    }

    mostrarSinEvaluacion() {
        const container = document.getElementById('evaluacion-container');
        container.innerHTML = `
            <div class="sin-evaluacion">
                <i class="fas fa-check-circle"></i>
                <h4>¡Recurso Completado!</h4>
                <p>Has terminado de revisar este recurso educativo. No hay evaluación disponible para este material.</p>
                <button class="btn btn-primary" onclick="app.finalizarRecurso()">
                    <i class="fas fa-trophy"></i> Finalizar Recurso
                </button>
            </div>
        `;
    }

    // Métodos para gestionar respuestas
    registrarRespuesta(preguntaIndex, respuestaIndex) {
        this.respuestasUsuario[preguntaIndex] = respuestaIndex;
        
        // Mostrar feedback inmediato si está configurado
        if (this.evaluacionActual.feedback_inmediato) {
            this.mostrarFeedbackInmediato(preguntaIndex, respuestaIndex);
        }
    }

    mostrarFeedbackInmediato(preguntaIndex, respuestaIndex) {
        const pregunta = this.evaluacionActual.preguntas[preguntaIndex];
        const feedbackElement = document.getElementById(`feedback-${preguntaIndex}`);
        const esCorrecta = respuestaIndex === pregunta.respuesta_correcta;
        
        feedbackElement.innerHTML = `
            <div class="feedback ${esCorrecta ? 'feedback-correcto' : 'feedback-incorrecto'}">
                <i class="fas fa-${esCorrecta ? 'check' : 'times'}"></i>
                ${esCorrecta ? '¡Correcto!' : 'Incorrecto. Intenta nuevamente.'}
            </div>
        `;
    }

    // Envío y evaluación
    enviarCuestionario() {
        const preguntas = this.evaluacionActual.preguntas;
        let respuestasCorrectas = 0;
        
        // Verificar que todas las preguntas tengan respuesta
        const preguntasSinResponder = preguntas.filter((_, index) => 
            this.respuestasUsuario[index] === undefined
        );
        
        if (preguntasSinResponder.length > 0) {
            this.mostrarError(`Tienes ${preguntasSinResponder.length} pregunta(s) sin responder.`);
            return;
        }
        
        // Calcular puntaje
        preguntas.forEach((pregunta, index) => {
            if (this.respuestasUsuario[index] === pregunta.respuesta_correcta) {
                respuestasCorrectas++;
            }
        });
        
        this.puntajeTotal = (respuestasCorrectas / preguntas.length) * 100;
        this.mostrarResultadosCuestionario(respuestasCorrectas, preguntas.length);
    }

    mostrarResultadosCuestionario(correctas, total) {
        const aprobado = this.puntajeTotal >= this.evaluacionActual.puntaje_aprobacion;
        const container = document.getElementById('evaluacion-container');
        
        container.innerHTML = `
            <div class="resultados-evaluacion ${aprobado ? 'aprobado' : 'reprobado'}">
                <div class="resultado-header">
                    <i class="fas fa-${aprobado ? 'trophy' : 'redo'}"></i>
                    <h3>${aprobado ? '¡Felicidades!' : 'Intenta Nuevamente'}</h3>
                </div>
                
                <div class="resultado-stats">
                    <div class="stat-resultado">
                        <span class="stat-number">${correctas}/${total}</span>
                        <span class="stat-label">Respuestas correctas</span>
                    </div>
                    <div class="stat-resultado">
                        <span class="stat-number">${Math.round(this.puntajeTotal)}%</span>
                        <span class="stat-label">Puntaje obtenido</span>
                    </div>
                    <div class="stat-resultado">
                        <span class="stat-number">${this.evaluacionActual.puntaje_aprobacion}%</span>
                        <span class="stat-label">Mínimo para aprobar</span>
                    </div>
                </div>
                
                <div class="resultado-detalle">
                    <h4>Detalle de respuestas:</h4>
                    ${this.evaluacionActual.preguntas.map((pregunta, index) => {
                        const respuestaUsuario = this.respuestasUsuario[index];
                        const esCorrecta = respuestaUsuario === pregunta.respuesta_correcta;
                        
                        return `
                            <div class="detalle-pregunta ${esCorrecta ? 'correcta' : 'incorrecta'}">
                                <div class="pregunta-info">
                                    <span class="pregunta-num">${index + 1}</span>
                                    <span class="pregunta-text">${pregunta.pregunta}</span>
                                </div>
                                <div class="respuesta-info">
                                    <span>Tu respuesta: ${pregunta.opciones[respuestaUsuario]}</span>
                                    ${!esCorrecta ? `
                                        <span class="respuesta-correcta">
                                            Respuesta correcta: ${pregunta.opciones[pregunta.respuesta_correcta]}
                                        </span>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="resultado-actions">
                    ${aprobado ? `
                        <button class="btn btn-success" onclick="app.finalizarRecurso()">
                            <i class="fas fa-check"></i> Continuar
                        </button>
                    ` : `
                        <button class="btn btn-primary" onclick="sistemaEvaluacion.reintentarCuestionario()">
                            <i class="fas fa-redo"></i> Reintentar
                        </button>
                    `}
                </div>
            </div>
        `;
        
        this.evaluacionCompletada = true;
    }

    reintentarCuestionario() {
        this.respuestasUsuario = [];
        this.mostrarCuestionario(document.getElementById('evaluacion-container'));
    }

    subirActividad() {
        const archivoInput = document.getElementById('archivo-actividad');
        const archivo = archivoInput.files[0];
        
        if (!archivo) {
            this.mostrarError('Por favor selecciona un archivo para subir.');
            return;
        }
        
        // Simular subida de archivo
        this.mostrarCarga('Subiendo actividad...');
        
        setTimeout(() => {
            this.mostrarResultadoActividad(true);
        }, 2000);
    }

    mostrarResultadoActividad(exitoso) {
        const container = document.getElementById('evaluacion-container');
        
        container.innerHTML = `
            <div class="resultado-actividad ${exitoso ? 'exitoso' : 'fallido'}">
                <div class="resultado-header">
                    <i class="fas fa-${exitoso ? 'check-circle' : 'exclamation-circle'}"></i>
                    <h3>${exitoso ? 'Actividad Enviada' : 'Error al Subir'}</h3>
                </div>
                
                <div class="resultado-mensaje">
                    <p>${exitoso ? 
                        'Tu actividad ha sido enviada exitosamente. Será revisada por el docente.' : 
                        'Hubo un problema al subir tu actividad. Intenta nuevamente.'
                    }</p>
                </div>
                
                <div class="resultado-actions">
                    <button class="btn btn-primary" onclick="app.finalizarRecurso()">
                        <i class="fas fa-check"></i> Continuar
                    </button>
                </div>
            </div>
        `;
        
        this.evaluacionCompletada = true;
    }

    enviarProyecto() {
        const descripcion = document.getElementById('proyecto-descripcion').value;
        
        if (!descripcion.trim()) {
            this.mostrarError('Por favor describe tu proyecto.');
            return;
        }
        
        this.mostrarCarga('Enviando proyecto...');
        
        setTimeout(() => {
            this.mostrarResultadoProyecto(true);
        }, 2000);
    }

    mostrarResultadoProyecto(exitoso) {
        const container = document.getElementById('evaluacion-container');
        
        container.innerHTML = `
            <div class="resultado-proyecto ${exitoso ? 'exitoso' : 'fallido'}">
                <div class="resultado-header">
                    <i class="fas fa-${exitoso ? 'rocket' : 'exclamation-triangle'}"></i>
                    <h3>${exitoso ? 'Proyecto Enviado' : 'Error al Enviar'}</h3>
                </div>
                
                <div class="resultado-mensaje">
                    <p>${exitoso ? 
                        'Tu proyecto ha sido enviado exitosamente. Será revisado por el docente.' : 
                        'Hubo un problema al enviar tu proyecto. Intenta nuevamente.'
                    }</p>
                </div>
                
                <div class="resultado-actions">
                    <button class="btn btn-primary" onclick="app.finalizarRecurso()">
                        <i class="fas fa-check"></i> Finalizar
                    </button>
                </div>
            </div>
        `;
        
        this.evaluacionCompletada = true;
    }

    // Utilidades
    mostrarCarga(mensaje) {
        const container = document.getElementById('evaluacion-container');
        container.innerHTML = `
            <div class="carga-evaluacion">
                <div class="spinner"></div>
                <p>${mensaje}</p>
            </div>
        `;
    }

    mostrarError(mensaje) {
        // Crear notificación de error temporal
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message-evaluacion';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--danger);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 300px;
        `;
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            ${mensaje}
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Inicializar sistema de evaluación
const sistemaEvaluacion = new SistemaEvaluacion();