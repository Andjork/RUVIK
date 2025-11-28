// js/recursos.js
class RecursoEducativo {
    constructor(datos) {
        this.id = datos.id;
        this.titulo = datos.titulo;
        this.facultad = datos.facultad;
        this.programa = datos.programa;
        this.nivel = datos.nivel;
        this.autor = datos.autor;
        this.objetivo = datos.objetivo;
        this.contenido = datos.contenido;
        this.implementacion = datos.implementacion;
        this.evaluacion = datos.evaluacion;
        this.metadata = datos.metadata;
    }
    
    // Métodos para gestionar el recurso
    calcularValoracion() { /* ... */ }
    incrementarVisitas() { /* ... */ }
}
// js/recursos.js - Gestión específica de recursos educativos

class GestorRecursos {
    constructor(app) {
        this.app = app;
        this.recursos = [];
    }

    cargarRecursosDesdeJSON(data) {
        this.recursos = data.recursos.map(recursoData => new RecursoEducativo(recursoData));
        return this.recursos;
    }

    obtenerRecursosDestacados() {
        return this.recursos.filter(recurso => recurso.metadata.destacado);
    }

    obtenerRecursosPorFacultad(facultad) {
        return this.recursos.filter(recurso => recurso.facultad === facultad);
    }

    obtenerRecursosPorTipo(tipo) {
        return this.recursos.filter(recurso => recurso.contenido.tipo === tipo);
    }

    buscarRecursos(termino) {
        const terminoLower = termino.toLowerCase();
        return this.recursos.filter(recurso => {
            return (
                recurso.titulo.toLowerCase().includes(terminoLower) ||
                recurso.objetivo.descripcion.toLowerCase().includes(terminoLower) ||
                recurso.metadata.etiquetas.some(etiqueta => 
                    etiqueta.toLowerCase().includes(terminoLower)
                ) ||
                recurso.autor.toLowerCase().includes(terminoLower)
            );
        });
    }

    obtenerRecursoPorId(id) {
        return this.recursos.find(recurso => recurso.id === id);
    }

    incrementarVisitas(id) {
        const recurso = this.obtenerRecursoPorId(id);
        if (recurso) {
            recurso.metadata.visitas++;
            // En una aplicación real, aquí se guardaría en la base de datos
            this.guardarEstadisticas();
        }
    }

    guardarEstadisticas() {
        // En una aplicación real, se enviarían las estadísticas al servidor
        console.log('Estadísticas actualizadas:', this.recursos);
    }
}

class RecursoEducativo {
    constructor(datos) {
        this.id = datos.id;
        this.titulo = datos.titulo;
        this.facultad = datos.facultad;
        this.programa = datos.programa;
        this.nivel = datos.nivel;
        this.autor = datos.autor;
        this.fecha_creacion = datos.fecha_creacion;
        this.objetivo = datos.objetivo;
        this.contenido = datos.contenido;
        this.implementacion = datos.implementacion;
        this.evaluacion = datos.evaluacion;
        this.metadata = datos.metadata;
    }

    esReciente() {
        const fechaCreacion = new Date(this.fecha_creacion);
        const hace30Dias = new Date();
        hace30Dias.setDate(hace30Dias.getDate() - 30);
        return fechaCreacion > hace30Dias;
    }

    tieneEvaluacion() {
        return this.evaluacion && this.evaluacion.tipo !== 'ninguna';
    }

    puedeSerDescargado() {
        return this.contenido.formato !== 'video' || 
               this.contenido.tipo !== 'simulacion';
    }

    generarMetadatosSEO() {
        return {
            title: `${this.titulo} - UNIAJC Educa Digital`,
            description: this.objetivo.descripcion.substring(0, 160),
            keywords: this.metadata.etiquetas.join(', '),
            author: this.autor
        };
    }
}

// Funciones de utilidad para recursos
const UtilidadesRecursos = {
    formatearDuracion(duracion) {
        if (!duracion) return 'Duración variable';
        
        // Asumir formato "XX:XX" para videos
        if (duracion.includes(':')) {
            const [minutos, segundos] = duracion.split(':');
            return `${minutos} min ${segundos} seg`;
        }
        
        return duracion;
    },

    obtenerColorFacultad(facultad) {
        const colores = {
            'Ingeniería': 'var(--uniajc-blue)',
            'Ciencias de la Salud': 'var(--uniajc-red)',
            'Educación': 'var(--success)',
            'Administración': 'var(--warning)',
            'Derecho': 'var(--info)'
        };
        return colores[facultad] || 'var(--uniajc-gray)';
    },

    validarNuevoRecurso(datosRecurso) {
        const errores = [];

        if (!datosRecurso.titulo || datosRecurso.titulo.length < 5) {
            errores.push('El título debe tener al menos 5 caracteres');
        }

        if (!datosRecurso.objetivo?.descripcion) {
            errores.push('La descripción del objetivo es obligatoria');
        }

        if (!datosRecurso.contenido?.tipo) {
            errores.push('Debe especificar el tipo de contenido');
        }

        if (!datosRecurso.autor) {
            errores.push('El autor es obligatorio');
        }

        return errores;
    },

    generarIdRecurso() {
        const timestamp = new Date().getTime().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `REC-${timestamp}-${random}`.toUpperCase();
    }
};

// Exportar para uso global
window.GestorRecursos = GestorRecursos;
window.RecursoEducativo = RecursoEducativo;
window.UtilidadesRecursos = UtilidadesRecursos;