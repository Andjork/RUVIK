// js/upload.js - Sistema completo para subir recursos educativos

class GestorSubidaRecursos {
    constructor() {
        this.competencias = [];
        this.materiales = [];
        this.requisitos = [];
        this.preguntas = [];
        this.archivoSeleccionado = null;

        this.init();
    }

    init() {
        this.configurarEventListeners();
        this.configurarDragAndDrop();
        this.mostrarCamposContenido();
        this.mostrarCamposEvaluacion();
    }

    configurarEventListeners() {
        // Form submission
        const form = document.getElementById('form-subir-recurso');
        if (form) {
            form.addEventListener('submit', (e) => this.procesarEnvio(e));
        }

        // File input change
        const fileInput = document.getElementById('archivo-recurso');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.manejarSeleccionArchivo(e));
        }

        // Validación en tiempo real
        this.configurarValidacionTiempoReal();
    }

    configurarDragAndDrop() {
        const uploadArea = document.getElementById('upload-area');

        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--uniajc-blue)';
                uploadArea.style.background = 'var(--uniajc-light)';
            });

            uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '#d1d5db';
                uploadArea.style.background = 'transparent';
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '#d1d5db';
                uploadArea.style.background = 'transparent';

                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.manejarArchivo(files[0]);
                }
            });

            uploadArea.addEventListener('click', () => {
                document.getElementById('archivo-recurso').click();
            });
        }
    }

    configurarValidacionTiempoReal() {
        const camposRequeridos = [
            'titulo', 'autor', 'facultad', 'nivel',
            'objetivo-descripcion', 'guia-estudiante',
            'etiquetas'
        ];

        camposRequeridos.forEach(campoId => {
            const elemento = document.getElementById(campoId);
            if (elemento) {
                elemento.addEventListener('blur', () => this.validarCampo(elemento));
                elemento.addEventListener('input', () => this.limpiarError(elemento));
            }
        });

        // Validación específica para etiquetas
        const etiquetasInput = document.getElementById('etiquetas');
        if (etiquetasInput) {
            etiquetasInput.addEventListener('input', () => {
                this.validarEtiquetasEnTiempoReal();
            });
        }
    }

    // Gestión de competencias
    agregarCompetencia() {
        const input = document.getElementById('nueva-competencia');
        const competencia = input.value.trim();

        if (competencia && !this.competencias.includes(competencia)) {
            this.competencias.push(competencia);
            this.actualizarListaCompetencias();
            input.value = '';
            this.limpiarError(input);
        } else if (competencia) {
            this.mostrarError(input, 'Esta competencia ya fue agregada');
        }
    }

    eliminarCompetencia(index) {
        this.competencias.splice(index, 1);
        this.actualizarListaCompetencias();
    }

    actualizarListaCompetencias() {
        const container = document.getElementById('competencias-list');
        container.innerHTML = this.competencias.map((competencia, index) => `
            <div class="competencia-tag-form">
                <span>${competencia}</span>
                <button type="button" onclick="gestorSubida.eliminarCompetencia(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    // Gestión de materiales
    agregarMaterial() {
        const input = document.getElementById('nuevo-material');
        const material = input.value.trim();

        if (material && !this.materiales.includes(material)) {
            this.materiales.push(material);
            this.actualizarListaMateriales();
            input.value = '';
            this.limpiarError(input);
        } else if (material) {
            this.mostrarError(input, 'Este material ya fue agregado');
        }
    }

    eliminarMaterial(index) {
        this.materiales.splice(index, 1);
        this.actualizarListaMateriales();
    }

    actualizarListaMateriales() {
        const container = document.getElementById('materiales-list');
        container.innerHTML = this.materiales.map((material, index) => `
            <div class="material-tag">
                <span>${material}</span>
                <button type="button" onclick="gestorSubida.eliminarMaterial(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    // Gestión de evaluación
    mostrarCamposContenido() {
        const tipoContenido = document.getElementById('tipo-contenido').value;
        const camposContenido = document.getElementById('campos-contenido');
        const geniallyIframeGroup = document.getElementById('genially-iframe-group');
        const urlHelpText = document.getElementById('url-help-text');

        if (camposContenido) {
            camposContenido.style.display = tipoContenido ? 'block' : 'none';
        }

        // Mostrar/ocultar campo de iframe de Genially
        if (geniallyIframeGroup) {
            geniallyIframeGroup.style.display = tipoContenido === 'genially' ? 'block' : 'none';
        }

        // Actualizar texto de ayuda según el tipo de contenido
        if (urlHelpText) {
            if (tipoContenido === 'genially') {
                urlHelpText.textContent = 'URL de tu presentación de Genially (opcional si usas el código embed)';
            } else if (tipoContenido === 'enlace') {
                urlHelpText.textContent = 'URL del enlace externo';
            } else {
                urlHelpText.textContent = 'Enlace directo al recurso o archivo';
            }
        }
    }

    mostrarCamposEvaluacion() {
        const tipoEvaluacion = document.getElementById('tipo-evaluacion').value;
        const camposEvaluacion = document.getElementById('campos-evaluacion');
        const seccionPreguntas = document.getElementById('seccion-preguntas');
        const seccionActividad = document.getElementById('seccion-actividad');
        const requisitosContainer = document.getElementById('requisitos-container');

        if (camposEvaluacion) {
            camposEvaluacion.style.display = tipoEvaluacion !== 'ninguna' ? 'block' : 'none';
        }

        if (seccionPreguntas) {
            seccionPreguntas.classList.toggle('hidden', tipoEvaluacion !== 'cuestionario');
        }

        if (seccionActividad) {
            seccionActividad.classList.toggle('hidden',
                tipoEvaluacion !== 'actividad' && tipoEvaluacion !== 'proyecto');
        }

        if (requisitosContainer) {
            requisitosContainer.style.display = tipoEvaluacion === 'proyecto' ? 'block' : 'none';
        }
    }

    // Gestión de preguntas del cuestionario
    agregarPregunta() {
        const nuevaPregunta = {
            pregunta: '',
            opciones: ['', '', '', ''],
            respuesta_correcta: 0
        };

        this.preguntas.push(nuevaPregunta);
        this.actualizarListaPreguntas();
    }

    eliminarPregunta(index) {
        this.preguntas.splice(index, 1);
        this.actualizarListaPreguntas();
    }

    actualizarPregunta(index, campo, valor) {
        if (this.preguntas[index]) {
            this.preguntas[index][campo] = valor;
        }
    }

    actualizarOpcion(preguntaIndex, opcionIndex, valor) {
        if (this.preguntas[preguntaIndex] && this.preguntas[preguntaIndex].opciones[opcionIndex]) {
            this.preguntas[preguntaIndex].opciones[opcionIndex] = valor;
        }
    }

    actualizarListaPreguntas() {
        const container = document.getElementById('preguntas-list');
        container.innerHTML = this.preguntas.map((pregunta, index) => `
            <div class="pregunta-item-form">
                <div class="pregunta-header-form">
                    <span class="pregunta-numero-form">${index + 1}</span>
                    <input type="text" 
                           class="pregunta-texto-form" 
                           placeholder="Texto de la pregunta..."
                           value="${pregunta.pregunta}"
                           onchange="gestorSubida.actualizarPregunta(${index}, 'pregunta', this.value)">
                </div>
                
                <div class="opciones-list-form">
                    ${pregunta.opciones.map((opcion, opcionIndex) => `
                        <label class="opcion-item-form">
                            <input type="radio" 
                                   name="pregunta-${index}" 
                                   value="${opcionIndex}"
                                   ${opcionIndex === pregunta.respuesta_correcta ? 'checked' : ''}
                                   onchange="gestorSubida.actualizarPregunta(${index}, 'respuesta_correcta', ${opcionIndex})">
                            <input type="text" 
                                   placeholder="Opción ${opcionIndex + 1}..."
                                   value="${opcion}"
                                   onchange="gestorSubida.actualizarOpcion(${index}, ${opcionIndex}, this.value)">
                        </label>
                    `).join('')}
                </div>
                
                <div class="pregunta-actions">
                    <button type="button" class="btn btn-sm btn-outline" 
                            onclick="gestorSubida.eliminarPregunta(${index})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Gestión de requisitos para proyectos
    agregarRequisito() {
        const input = document.getElementById('nuevo-requisito');
        const requisito = input.value.trim();

        if (requisito && !this.requisitos.includes(requisito)) {
            this.requisitos.push(requisito);
            this.actualizarListaRequisitos();
            input.value = '';
            this.limpiarError(input);
        } else if (requisito) {
            this.mostrarError(input, 'Este requisito ya fue agregado');
        }
    }

    eliminarRequisito(index) {
        this.requisitos.splice(index, 1);
        this.actualizarListaRequisitos();
    }

    actualizarListaRequisitos() {
        const container = document.getElementById('requisitos-list');
        container.innerHTML = this.requisitos.map((requisito, index) => `
            <div class="requisito-tag">
                <span>${requisito}</span>
                <button type="button" onclick="gestorSubida.eliminarRequisito(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    // Gestión de archivos
    manejarSeleccionArchivo(event) {
        const file = event.target.files[0];
        this.manejarArchivo(file);
    }

    manejarArchivo(file) {
        if (!file) return;

        // Validar tipo de archivo
        const tiposPermitidos = [
            'video/mp4',
            'application/pdf',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png'
        ];

        if (!tiposPermitidos.includes(file.type)) {
            this.mostrarErrorGlobal('Tipo de archivo no permitido. Use MP4, PDF, PPT, DOC, JPG o PNG.');
            return;
        }

        // Validar tamaño (100MB)
        const maxSize = 100 * 1024 * 1024; // 100MB en bytes
        if (file.size > maxSize) {
            this.mostrarErrorGlobal('El archivo es demasiado grande. Tamaño máximo: 100MB.');
            return;
        }

        this.archivoSeleccionado = file;
        this.mostrarInfoArchivo(file);
    }

    mostrarInfoArchivo(file) {
        const uploadArea = document.getElementById('upload-area');
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);

        uploadArea.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file-upload"></i>
                <h4>Archivo seleccionado</h4>
                <p><strong>Nombre:</strong> ${file.name}</p>
                <p><strong>Tamaño:</strong> ${sizeMB} MB</p>
                <p><strong>Tipo:</strong> ${file.type}</p>
                <button type="button" class="btn btn-sm btn-outline" onclick="gestorSubida.removerArchivo()">
                    <i class="fas fa-times"></i> Remover archivo
                </button>
            </div>
        `;
    }

    removerArchivo() {
        this.archivoSeleccionado = null;
        const fileInput = document.getElementById('archivo-recurso');
        fileInput.value = '';

        const uploadArea = document.getElementById('upload-area');
        uploadArea.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <h4>O sube tu archivo directamente</h4>
            <p>Arrastra el archivo aquí o haz clic para seleccionar</p>
            <input type="file" id="archivo-recurso" 
                   accept=".mp4,.pdf,.ppt,.pptx,.doc,.docx,.jpg,.png">
            <div class="upload-info">
                <span>Tamaño máximo: 100MB</span>
                <span>Formatos permitidos: MP4, PDF, PPT, DOC, JPG, PNG</span>
            </div>
        `;

        // Reconfigurar event listeners
        this.configurarDragAndDrop();
    }

    // VALIDACIÓN MEJORADA - NUEVA VERSIÓN
    validarFormulario(paraPrevisualizacion = false) {
        let esValido = true;
        this.limpiarTodosLosErrores();

        // 1. Validar campos de texto requeridos
        const camposRequeridos = [
            { id: 'titulo', mensaje: 'El título es obligatorio' },
            { id: 'autor', mensaje: 'El autor es obligatorio' },
            { id: 'facultad', mensaje: 'La facultad es obligatoria' },
            { id: 'nivel', mensaje: 'El nivel educativo es obligatorio' },
            { id: 'objetivo-descripcion', mensaje: 'La descripción del objetivo es obligatoria' },
            { id: 'guia-estudiante', mensaje: 'La guía para el estudiante es obligatoria' },
            { id: 'tipo-contenido', mensaje: 'El tipo de contenido es obligatorio' },
            { id: 'duracion', mensaje: 'La duración estimada es obligatoria' }
        ];

        camposRequeridos.forEach(({ id, mensaje }) => {
            const elemento = document.getElementById(id);
            if (elemento && !elemento.value.trim()) {
                this.mostrarError(elemento, mensaje);
                esValido = false;
            }
        });

        // 2. Validar competencias (mínimo 2 para envío, 1 para previsualización)
        if (this.competencias.length < 1) {
            this.mostrarErrorGlobal('Debe agregar al menos 1 competencia');
            esValido = false;
        } else if (!paraPrevisualizacion && this.competencias.length < 2) {
            this.mostrarErrorGlobal('Debe agregar al menos 2 competencias para publicar');
            esValido = false;
        }

        // 3. Validar URL O Archivo (no ambos necesariamente) - solo para envío final
        if (!paraPrevisualizacion) {
            const urlContenido = document.getElementById('url-contenido').value;
            const tieneURL = urlContenido && urlContenido.trim().length > 0;
            const tieneArchivo = this.archivoSeleccionado !== null;

            if (!tieneURL && !tieneArchivo) {
                this.mostrarError(
                    document.getElementById('url-contenido'),
                    'Debe proporcionar una URL de contenido O subir un archivo'
                );
                esValido = false;
            }
        }

        // 4. Validar etiquetas (más flexible)
        const etiquetasInput = document.getElementById('etiquetas');
        const etiquetas = etiquetasInput.value.trim();

        if (!etiquetas) {
            this.mostrarError(etiquetasInput, 'Las etiquetas son obligatorias');
            esValido = false;
        } else {
            const etiquetasArray = etiquetas.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

            if (etiquetasArray.length === 0) {
                this.mostrarError(etiquetasInput, 'Agregue al menos 1 etiqueta válida');
                esValido = false;
            } else if (!paraPrevisualizacion && etiquetasArray.length < 2) {
                // Solo 2 etiquetas mínimas para envío final
                this.mostrarError(etiquetasInput, 'Mínimo 2 etiquetas para publicar el recurso');
                esValido = false;
            }
        }

        return esValido;
    }

    limpiarTodosLosErrores() {
        // Limpiar errores de campos
        document.querySelectorAll('.form-group').forEach(grupo => {
            const input = grupo.querySelector('input, select, textarea');
            if (input) {
                this.limpiarError(input);
            }
        });

        // Limpiar notificaciones globales
        document.querySelectorAll('.notificacion-global').forEach(notif => {
            notif.remove();
        });
    }

    validarEtiquetasEnTiempoReal() {
        const etiquetasInput = document.getElementById('etiquetas');
        const etiquetas = etiquetasInput.value;

        if (!etiquetas.trim()) {
            this.mostrarError(etiquetasInput, 'Las etiquetas son obligatorias');
            return false;
        }

        const etiquetasArray = etiquetas.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

        if (etiquetasArray.length === 0) {
            this.mostrarError(etiquetasInput, 'Agregue al menos 1 etiqueta');
            return false;
        }

        this.limpiarError(etiquetasInput);
        return true;
    }

    // Procesamiento de envío MEJORADO
    // Después de guardar exitosamente en localStorage:
    async procesarEnvio(event) {
        event.preventDefault();

        console.log('=== INICIANDO ENVÍO ===');

        // Validación estricta para envío final
        if (!this.validarFormulario(false)) {
            this.mostrarErrorGlobal('❌ Hay errores en el formulario. Revise los campos marcados en rojo.');

            // Scroll al primer error
            const primerError = document.querySelector('.error-message');
            if (primerError) {
                primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        try {
            const notificacion = this.mostrarCarga('⏳ Subiendo recurso educativo...');

            // RECOPILAR DATOS DEL FORMULARIO
            const recursoData = this.recopilarDatosRecurso();
            console.log('📦 Datos a guardar:', recursoData);

            // GUARDAR EN LOCALSTORAGE
            const recursosExistentes = JSON.parse(localStorage.getItem('recursos_uniajc') || '[]');
            recursosExistentes.push(recursoData);
            localStorage.setItem('recursos_uniajc', JSON.stringify(recursosExistentes));

            console.log('✅ Recurso guardado en localStorage');
            console.log('📊 Total de recursos subidos:', recursosExistentes.length);

            notificacion.remove();
            this.mostrarExito('✅ ¡Recurso subido exitosamente! Será revisado por el equipo académico.');

            // 🔄 NOTIFICAR ACTUALIZACIÓN
            this.notificarActualizacion();

            // Redirigir después de 2 segundos
            setTimeout(() => {
                window.location.href = 'recursos.html';
            }, 2000);

        } catch (error) {
            console.error('Error en envío:', error);
            this.mostrarErrorGlobal('❌ Error al subir el recurso: ' + error.message);
        }
    }

    notificarActualizacion() {
        // Enviar mensaje para que la página de recursos se actualice
        if (window.opener) {
            window.opener.postMessage({ tipo: 'recursosActualizados' }, '*');
        }

        // También guardar en sessionStorage para detectar cambios
        sessionStorage.setItem('ultimaActualizacion', new Date().toISOString());
    }

    recopilarDatosRecurso() {
        const formData = new FormData(document.getElementById('form-subir-recurso'));

        // Limpiar y procesar etiquetas
        const etiquetasInput = formData.get('etiquetas') || '';
        const etiquetasLimpias = etiquetasInput.split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        return {
            id: this.generarIdRecurso(),
            titulo: formData.get('titulo'),
            facultad: formData.get('facultad'),
            programa: formData.get('programa'),
            nivel: formData.get('nivel'),
            autor: formData.get('autor'),
            fecha_creacion: new Date().toISOString().split('T')[0],

            objetivo: {
                descripcion: formData.get('objetivo-descripcion'),
                competencias: this.competencias
            },

            contenido: {
                tipo: formData.get('tipo-contenido'),
                url: formData.get('url-contenido'),
                duracion: formData.get('duracion'),
                formato: formData.get('formato'),
                thumbnail: formData.get('thumbnail'),
                iframe: formData.get('genially-iframe') // Código iframe para Genially
            },

            implementacion: {
                guia_docente: formData.get('guia-docente'),
                guia_estudiante: formData.get('guia-estudiante'),
                tiempo_estimado: formData.get('tiempo-estimado'),
                materiales_necesarios: this.materiales,
                prerrequisitos: formData.get('prerrequisitos')
            },

            evaluacion: this.generarDatosEvaluacion(formData),

            metadata: {
                visitas: 0,
                valoracion: 0,
                descargas: 0,
                etiquetas: etiquetasLimpias,
                destacado: formData.get('destacado') === 'on',
                publico: formData.get('publico') === 'on'
            }
        };
    }

    generarDatosEvaluacion(formData) {
        const tipoEvaluacion = formData.get('tipo-evaluacion');

        if (tipoEvaluacion === 'ninguna') {
            return { tipo: 'ninguna' };
        }

        const datosBase = {
            tipo: tipoEvaluacion,
            puntaje_aprobacion: parseInt(formData.get('puntaje-aprobacion')) || 70
        };

        if (tipoEvaluacion === 'cuestionario') {
            return {
                ...datosBase,
                preguntas: this.preguntas
            };
        } else {
            return {
                ...datosBase,
                descripcion: formData.get('descripcion-evaluacion'),
                requisitos: tipoEvaluacion === 'proyecto' ? this.requisitos : undefined
            };
        }
    }

    generarIdRecurso() {
        const timestamp = new Date().getTime().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `REC-${timestamp}-${random}`.toUpperCase();
    }

    async simularSubida(recursoData) {
        return new Promise((resolve, reject) => {
            // Simular proceso de subida más realista
            let progreso = 0;
            const intervalo = setInterval(() => {
                progreso += 20;
                console.log(`Progreso de subida: ${progreso}%`);

                if (progreso >= 100) {
                    clearInterval(intervalo);

                    // Validación final simulada
                    if (!recursoData.titulo || !recursoData.autor) {
                        reject(new Error('Datos incompletos del recurso'));
                    } else {
                        // Guardar en localStorage temporal para pruebas
                        try {
                            const recursosExistentes = JSON.parse(localStorage.getItem('recursos_uniajc') || '[]');
                            recursosExistentes.push(recursoData);
                            localStorage.setItem('recursos_uniajc', JSON.stringify(recursosExistentes));

                            console.log('✅ Recurso guardado en localStorage:', recursoData);
                            resolve(recursoData);
                        } catch (error) {
                            reject(new Error('Error al guardar en base de datos local: ' + error.message));
                        }
                    }
                }
            }, 300);
        });
    }

    // Previsualización
    previsualizarRecurso() {
        // Usar validación relajada para previsualización
        if (!this.validarFormulario(true)) {
            this.mostrarErrorGlobal('Complete los campos requeridos para previsualizar');
            return;
        }

        const recursoData = this.recopilarDatosRecurso();
        this.mostrarPrevisualizacion(recursoData);
    }

    mostrarPrevisualizacion(recursoData) {
        const modalBody = document.getElementById('modal-previsualizacion-body');

        modalBody.innerHTML = `
            <div class="previsualizacion-recurso">
                <div class="preview-header">
                    <span class="badge badge-${recursoData.contenido.tipo}">
                        ${this.obtenerIconoTipo(recursoData.contenido.tipo)} ${recursoData.contenido.tipo}
                    </span>
                    <h3>${recursoData.titulo}</h3>
                </div>
                
                <div class="preview-meta">
                    <p><strong>Autor:</strong> ${recursoData.autor}</p>
                    <p><strong>Facultad:</strong> ${recursoData.facultad}</p>
                    <p><strong>Duración:</strong> ${recursoData.contenido.duracion}</p>
                </div>
                
                <div class="preview-section">
                    <h4>🎯 Objetivo</h4>
                    <p>${recursoData.objetivo.descripcion}</p>
                    
                    <h5>Competencias:</h5>
                    <div class="preview-competencias">
                        ${recursoData.objetivo.competencias.map(comp => `
                            <span class="competencia-tag">${comp}</span>
                        `).join('')}
                    </div>
                </div>
                
                <div class="preview-section">
                    <h4>📚 Contenido</h4>
                    <p><strong>Tipo:</strong> ${recursoData.contenido.tipo}</p>
                    <p><strong>Formato:</strong> ${recursoData.contenido.formato || 'No especificado'}</p>
                    ${recursoData.contenido.url ? `<p><strong>URL:</strong> ${recursoData.contenido.url}</p>` : ''}
                </div>
                
                <div class="preview-section">
                    <h4>🛠️ Implementación</h4>
                    <p><strong>Guía estudiante:</strong> ${recursoData.implementacion.guia_estudiante}</p>
                    <p><strong>Tiempo estimado:</strong> ${recursoData.implementacion.tiempo_estimado}</p>
                </div>
                
                ${recursoData.evaluacion.tipo !== 'ninguna' ? `
                    <div class="preview-section">
                        <h4>✅ Evaluación</h4>
                        <p><strong>Tipo:</strong> ${recursoData.evaluacion.tipo}</p>
                        <p><strong>Puntaje mínimo:</strong> ${recursoData.evaluacion.puntaje_aprobacion}%</p>
                    </div>
                ` : ''}
                
                <div class="preview-section">
                    <h4>🏷️ Metadatos</h4>
                    <div class="preview-etiquetas">
                        ${recursoData.metadata.etiquetas.map(tag => `
                            <span class="etiqueta-tag">#${tag}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        this.mostrarModal();
    }

    // MÉTODO DE PRUEBA RÁPIDA
    probarCargaRapida() {
        // Llenar automáticamente el formulario para pruebas
        document.getElementById('titulo').value = 'Recurso de Prueba - ' + new Date().toLocaleTimeString();
        document.getElementById('autor').value = 'Profesor de Prueba';
        document.getElementById('facultad').value = 'Ingeniería';
        document.getElementById('programa').value = 'Ingeniería de Sistemas';
        document.getElementById('nivel').value = 'Pregrado';
        document.getElementById('objetivo-descripcion').value = 'Este es un recurso de prueba para validar el funcionamiento del sistema. Los estudiantes aprenderán los conceptos fundamentales a través de este material.';
        document.getElementById('guia-estudiante').value = '1. Revisar el material completo 2. Realizar los ejercicios propuestos 3. Participar en el foro de discusión 4. Completar la evaluación final';
        document.getElementById('tipo-contenido').value = 'pdf';
        document.getElementById('duracion').value = '45 minutos';
        document.getElementById('formato').value = 'PDF';
        document.getElementById('url-contenido').value = 'https://ejemplo.com/recurso.pdf';
        document.getElementById('tiempo-estimado').value = '2 horas';
        document.getElementById('etiquetas').value = 'prueba, sistema, validación, uniajc';

        // Agregar competencias automáticamente
        this.competencias = ['Competencia técnica 1', 'Competencia analítica 2', 'Competencia práctica 3'];
        this.actualizarListaCompetencias();

        // Agregar materiales automáticamente  
        this.materiales = ['Computador', 'Conexión a internet', 'Software específico'];
        this.actualizarListaMateriales();

        this.mostrarExito('✅ Formulario llenado automáticamente para pruebas. Ahora puedes previsualizar o enviar.');
    }

    // Utilidades
    obtenerIconoTipo(tipo) {
        const iconos = {
            'video': 'fas fa-play-circle',
            'infografia': 'fas fa-chart-pie',
            'pdf': 'fas fa-file-pdf',
            'simulacion': 'fas fa-cogs',
            'presentacion': 'fas fa-presentation',
            'documento': 'fas fa-file-alt'
        };
        return `<i class="${iconos[tipo] || 'fas fa-file'}"></i>`;
    }

    mostrarModal() {
        document.getElementById('modal-previsualizacion').classList.remove('hidden');
    }

    cerrarModal() {
        document.getElementById('modal-previsualizacion').classList.add('hidden');
    }

    limpiarFormulario() {
        document.getElementById('form-subir-recurso').reset();
        this.competencias = [];
        this.materiales = [];
        this.requisitos = [];
        this.preguntas = [];
        this.archivoSeleccionado = null;

        this.actualizarListaCompetencias();
        this.actualizarListaMateriales();
        this.actualizarListaRequisitos();
        this.actualizarListaPreguntas();
        this.removerArchivo();
    }

    // Manejo de errores y mensajes
    validarCampo(elemento) {
        if (!elemento.value.trim()) {
            this.mostrarError(elemento, 'Este campo es obligatorio');
        } else {
            this.limpiarError(elemento);
        }
    }

    mostrarError(elemento, mensaje) {
        elemento.style.borderColor = 'var(--danger)';

        let errorElement = elemento.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            elemento.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = mensaje;
    }

    limpiarError(elemento) {
        elemento.style.borderColor = '#e5e7eb';

        const errorElement = elemento.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    mostrarErrorGlobal(mensaje) {
        this.mostrarNotificacion(mensaje, 'error');
    }

    mostrarExito(mensaje) {
        this.mostrarNotificacion(mensaje, 'success');
    }

    mostrarCarga(mensaje) {
        return this.mostrarNotificacion(mensaje, 'loading');
    }

    mostrarNotificacion(mensaje, tipo) {
        // Remover notificaciones existentes
        const notificacionesExistentes = document.querySelectorAll('.notificacion-global');
        notificacionesExistentes.forEach(notif => notif.remove());

        const notificacion = document.createElement('div');
        notificacion.className = `notificacion-global notificacion-${tipo}`;
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;

        const colores = {
            error: 'var(--danger)',
            success: 'var(--success)',
            loading: 'var(--uniajc-blue)',
            warning: 'var(--warning)'
        };

        const iconos = {
            error: 'fas fa-exclamation-triangle',
            success: 'fas fa-check-circle',
            loading: 'fas fa-spinner fa-spin',
            warning: 'fas fa-exclamation-circle'
        };

        notificacion.style.background = colores[tipo];
        notificacion.innerHTML = `
            <i class="${iconos[tipo]}"></i>
            <span>${mensaje}</span>
        `;

        document.body.appendChild(notificacion);

        if (tipo !== 'loading') {
            setTimeout(() => {
                notificacion.remove();
            }, 5000);
        }

        return notificacion;
    }
}

// Funciones globales para uso en HTML
function agregarCompetencia() {
    gestorSubida.agregarCompetencia();
}

function agregarMaterial() {
    gestorSubida.agregarMaterial();
}

function agregarPregunta() {
    gestorSubida.agregarPregunta();
}

function agregarRequisito() {
    gestorSubida.agregarRequisito();
}

function mostrarCamposContenido() {
    gestorSubida.mostrarCamposContenido();
}

function mostrarCamposEvaluacion() {
    gestorSubida.mostrarCamposEvaluacion();
}

function previsualizarRecurso() {
    gestorSubida.previsualizarRecurso();
}

function cerrarModal() {
    gestorSubida.cerrarModal();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.gestorSubida = new GestorSubidaRecursos();
});