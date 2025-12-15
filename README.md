# REDA - Plataforma de Recursos Educativos Digitales Abiertos

Plataforma web para la **Universidad Antonio José Camacho (UNIAJC)** diseñada para compartir, gestionar y evaluar recursos educativos digitales.

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Funcionalidades Principales](#-funcionalidades-principales)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Páginas y Ubicaciones](#-páginas-y-ubicaciones)
- [Componentes JavaScript](#-componentes-javascript)
- [Estructura de Datos](#-estructura-de-datos)
- [Instalación y Uso](#-instalación-y-uso)
- [Próximos Pasos](#-próximos-pasos)

---

## 🎯 Descripción General

REDA (Recursos Educativos Digitales Abiertos) es una plataforma educativa que permite a docentes y estudiantes:
- Explorar recursos educativos organizados por facultades
- Subir y compartir materiales educativos
- Evaluar el aprendizaje mediante cuestionarios y actividades
- Filtrar y buscar recursos por diferentes criterios

---

## ✨ Funcionalidades Principales

### 1. **Catálogo de Recursos** 
📍 **Ubicación**: `recursos.html` + `js/recursos.js`

- **Búsqueda de recursos**: Barra de búsqueda en tiempo real
- **Filtros avanzados**:
  - Por facultad/sección (Ingeniería, Salud, Educación, etc.)
  - Por tipo de contenido (Video, PDF, Infografía, Simulación)
  - Por nivel educativo (Pregrado, Posgrado, Educación Continua)
- **Visualización en grid**: Cards con información resumida
- **Contador de resultados**: Muestra cantidad de recursos encontrados
- **Botón limpiar filtros**: Resetea todos los filtros aplicados

### 2. **Detalle de Recursos**
📍 **Ubicación**: `recurso-detalle.html` + `js/detalle-recurso.js`

- **Información completa del recurso**:
  - Título, autor, facultad, programa, nivel
  - Objetivos de aprendizaje y competencias
  - Contenido multimedia (video, PDF, etc.)
  - Guías para docentes y estudiantes
  - Materiales necesarios y prerrequisitos
- **Sistema de valoración**: Estrellas y comentarios
- **Estadísticas**: Visitas, descargas, valoración promedio
- **Sistema de evaluación integrado**: Cuestionarios interactivos

### 3. **Subir Recursos** (Formulario Multi-paso)
📍 **Ubicación**: `subir-recurso.html` + `js/upload.js`

#### **Paso 1: Objetivo de Aprendizaje**
- Descripción del objetivo educativo
- Competencias a desarrollar (lista dinámica)

#### **Paso 2: Contenido Principal**
- Tipo de contenido (Video, Infografía, PDF, Simulación, etc.)
- Duración estimada
- Formato del archivo
- URL del contenido o subida directa de archivos
- Miniatura/thumbnail (opcional)
- **Drag & Drop**: Área de arrastre para subir archivos
- **Validación de archivos**: Tamaño máximo 100MB

#### **Paso 3: Guía de Implementación**
- Guía para el docente (cómo usar en clase)
- Guía para el estudiante (aprendizaje autónomo)
- Tiempo estimado de uso
- Materiales necesarios (lista dinámica)
- Prerrequisitos

#### **Paso 4: Sistema de Evaluación**
- **Tipos de evaluación**:
  - Cuestionario (preguntas de opción múltiple)
  - Actividad práctica
  - Proyecto
  - Sin evaluación
- **Para cuestionarios**: Agregar preguntas con 4 opciones
- **Para actividades/proyectos**: Descripción y requisitos
- Puntaje mínimo de aprobación

#### **Metadatos**
- Etiquetas (tags) para búsqueda
- Descripción corta (SEO)
- Marcar como destacado
- Visibilidad (público/privado)

#### **Funciones adicionales**:
- **Previsualización**: Ver cómo se verá el recurso antes de publicar
- **Validación de formulario**: Campos requeridos marcados con *

### 4. **Página Principal (Home)**
📍 **Ubicación**: `index.html` + `js/main.js`

- **Hero Section**: 
  - Barra de búsqueda principal
  - Estadísticas (500+ recursos, 8 secciones, 150+ docentes)
- **Secciones/Facultades**: Grid con tarjetas de facultades
  - Ingeniería
  - Ciencias de la Salud
  - Educación
  - Administración
  - Derecho
- **Recursos Destacados**: Muestra recursos marcados como destacados
- **Navegación**: Header con menú a todas las secciones

### 5. **Secciones por Facultad**
📍 **Ubicación**: `secciones.html`

- Vista organizada por facultades
- Programas académicos por facultad
- Contador de recursos por sección

### 6. **Comunidad**
📍 **Ubicación**: `comunidad.html`

- Espacio para interacción entre usuarios
- Compartir experiencias y recursos

### 7. **Sistema de Evaluación Interactivo**
📍 **Ubicación**: `js/evaluacion.js`

- **Cuestionarios de opción múltiple**:
  - Preguntas con 4 opciones
  - Validación de respuestas
  - Cálculo de puntaje
  - Retroalimentación inmediata
- **Actividades prácticas**: Descripción y entrega
- **Proyectos**: Con requisitos específicos

---

## 📁 Estructura del Proyecto

```
RUVIK/
├── index.html                 # Página principal
├── recursos.html              # Catálogo de recursos
├── recurso-detalle.html       # Vista detallada de recurso
├── subir-recurso.html         # Formulario de subida
├── secciones.html             # Vista por facultades
├── comunidad.html             # Sección de comunidad
├── css/
│   ├── styles.css             # Estilos principales
│   ├── components.css         # Componentes reutilizables
│   └── responsive.css         # Media queries y responsive
├── js/
│   ├── main.js                # Funcionalidad general y navegación
│   ├── recursos.js            # Lógica del catálogo y filtros
│   ├── detalle-recurso.js     # Vista detallada de recursos
│   ├── evaluacion.js          # Sistema de evaluación/cuestionarios
│   └── upload.js              # Formulario de subida de recursos
├── data/
│   └── recursos.json          # Base de datos de recursos (JSON)
└── assets/
    ├── images/                # Imágenes y thumbnails
    ├── docs/                  # Documentos PDF
    └── videos/                # Videos educativos
```

---

## 🗂️ Páginas y Ubicaciones

| Página | Archivo | Funcionalidad Principal |
|--------|---------|------------------------|
| **Inicio** | `index.html` | Hero, búsqueda, facultades, recursos destacados |
| **Catálogo** | `recursos.html` | Listado completo con filtros y búsqueda |
| **Detalle** | `recurso-detalle.html` | Información completa, evaluación, valoración |
| **Subir** | `subir-recurso.html` | Formulario multi-paso para crear recursos |
| **Secciones** | `secciones.html` | Vista organizada por facultades |
| **Comunidad** | `comunidad.html` | Interacción entre usuarios |

---

## 🔧 Componentes JavaScript

### `main.js` (12.4 KB)
- Navegación general
- Funciones compartidas
- Inicialización de la aplicación
- Manejo de eventos globales

### `recursos.js` (5.7 KB)
- Carga de recursos desde JSON
- Filtrado por facultad, tipo y nivel
- Búsqueda en tiempo real
- Renderizado de cards de recursos
- Gestión del contador de resultados

### `detalle-recurso.js` (13.4 KB)
- Carga de información detallada
- Sistema de valoración (estrellas)
- Gestión de comentarios
- Estadísticas de uso
- Integración con evaluación

### `evaluacion.js` (17.5 KB)
- Cuestionarios interactivos
- Validación de respuestas
- Cálculo de puntajes
- Retroalimentación
- Gestión de actividades y proyectos

### `upload.js` (35.8 KB)
- Formulario multi-paso
- Validación de campos
- Gestión de listas dinámicas (competencias, materiales, etc.)
- Drag & Drop para archivos
- Previsualización de recursos
- Generación de JSON para nuevos recursos

---

## 📊 Estructura de Datos

### Formato de Recurso en `data/recursos.json`

```json
{
  "id": "REC-001",
  "titulo": "Título del recurso",
  "facultad": "Ingeniería",
  "programa": "Ingeniería de Sistemas",
  "nivel": "Pregrado",
  "autor": "Prof. Nombre",
  "fecha_creacion": "2024-01-15",
  "objetivo": {
    "descripcion": "Descripción del objetivo",
    "competencias": ["Competencia 1", "Competencia 2"]
  },
  "contenido": {
    "tipo": "video",
    "url": "assets/videos/recurso.mp4",
    "duracion": "15:30",
    "formato": "MP4",
    "thumbnail": "assets/images/thumb.jpg"
  },
  "implementacion": {
    "guia_docente": "Instrucciones para docentes",
    "guia_estudiante": "Instrucciones para estudiantes",
    "tiempo_estimado": "2 horas",
    "materiales_necesarios": ["Material 1", "Material 2"],
    "prerrequisitos": ["Prerrequisito 1"]
  },
  "evaluacion": {
    "tipo": "cuestionario",
    "preguntas": [...],
    "puntaje_aprobacion": 70
  },
  "metadata": {
    "visitas": 150,
    "valoracion": 4.5,
    "descargas": 89,
    "etiquetas": ["tag1", "tag2"],
    "destacado": true
  }
}
```

---

## 🚀 Instalación y Uso

### Opción 1: Servidor Local Simple
```bash
# Abrir directamente index.html en el navegador
# (doble clic en el archivo)
```

### Opción 2: Live Server (Recomendado)
```bash
# Si usas VS Code con la extensión Live Server
# Click derecho en index.html > "Open with Live Server"
```

### Opción 3: Python HTTP Server
```bash
# Navegar a la carpeta RUVIK
cd RUVIK

# Python 3
python -m http.server 8000

# Abrir en navegador: http://localhost:8000
```

### Opción 4: Node.js HTTP Server
```bash
# Instalar http-server globalmente
npm install -g http-server

# Ejecutar en la carpeta RUVIK
http-server

# Abrir en navegador: http://localhost:8080
```

---

## 🔮 Próximos Pasos

### Backend y Base de Datos
- [ ] Conectar con API REST para persistencia de datos
- [ ] Implementar autenticación de usuarios (docentes/estudiantes)
- [ ] Base de datos (MySQL, PostgreSQL o MongoDB)
- [ ] Sistema de gestión de archivos (AWS S3, Firebase Storage)

### Funcionalidades Adicionales
- [ ] Sistema de comentarios y valoraciones persistente
- [ ] Notificaciones para nuevos recursos
- [ ] Dashboard de estadísticas para docentes
- [ ] Sistema de favoritos/marcadores
- [ ] Exportar recursos a diferentes formatos
- [ ] Integración con LMS (Moodle, Canvas)

### Mejoras de UI/UX
- [ ] Modo oscuro/claro
- [ ] Animaciones y transiciones
- [ ] Accesibilidad (ARIA labels, navegación por teclado)
- [ ] PWA (Progressive Web App)
- [ ] Versión móvil nativa

### Optimización
- [ ] Minificación de CSS/JS
- [ ] Lazy loading de imágenes
- [ ] Caché de recursos
- [ ] SEO optimization
- [ ] Performance testing

### Control de Versiones
- [ ] Inicializar repositorio Git
- [ ] Crear `.gitignore`
- [ ] Documentar commits y versiones

---

## 📝 Notas Técnicas

- **Framework**: Vanilla JavaScript (sin dependencias externas)
- **Estilos**: CSS3 personalizado con diseño responsive
- **Iconos**: Font Awesome 6.4.0
- **Datos**: JSON local (temporal, migrar a base de datos)
- **Compatibilidad**: Navegadores modernos (Chrome, Firefox, Safari, Edge)

---

## 👥 Contribución

Para contribuir al proyecto:
1. Familiarízate con la estructura de archivos
2. Revisa las funcionalidades existentes en este README
3. Mantén la consistencia en el código
4. Documenta nuevas funcionalidades

---

## 📄 Licencia

Proyecto educativo para la Universidad Antonio José Camacho (UNIAJC)

---

**Última actualización**: Diciembre 2024
