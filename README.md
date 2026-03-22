# 📱 Mi Recordatorio – Equipo 4

## 📌 Descripción General

**Mi Recordatorio** es una aplicación móvil desarrollada con el objetivo de facilitar la gestión de tareas académicas y personales. La aplicación permite a los usuarios organizar sus actividades de manera eficiente, priorizando tareas, estableciendo fechas y llevando un control claro de su estado.

Este proyecto ha sido desarrollado como parte de una actividad académica, aplicando buenas prácticas de desarrollo de software, diseño de interfaces móviles y organización de proyectos.

---

## 🎯 Objetivo de la Aplicación

Proporcionar a los usuarios una herramienta intuitiva y funcional que les permita:

- Gestionar tareas de forma sencilla
- Mantener un seguimiento de actividades pendientes y completadas
- Organizar su tiempo mediante fechas y prioridades
- Visualizar información de manera clara y estructurada

---

## ⚙️ Funcionalidades Implementadas

Hasta el momento, la aplicación cuenta con las siguientes funcionalidades:

### 📝 Gestión de Tareas
- Creación de nuevas tareas
- Edición de tareas existentes
- Eliminación de tareas
- Marcado de tareas como completadas

### 📊 Organización
- Clasificación por prioridad (Alta, Media, Baja)
- Visualización del estado de cada tarea (Pendiente / Completada)
- Segmentación de tareas (todas, prioridad, completadas)

### 🗂️ Módulos adicionales
- 📅 **Calendario:** selección de fechas para tareas
- 🗑️ **Papelera:** gestión de tareas eliminadas (recuperar o eliminar definitivamente)
- 📜 **Historial:** registro de acciones realizadas en la aplicación

### 🔐 Acceso
- Pantalla de inicio de sesión (interfaz implementada)

---

## 🧱 Estado Actual del Proyecto

El proyecto se encuentra en una fase funcional intermedia, donde:

- Se ha completado la estructura principal de la aplicación
- Se han diseñado e implementado las interfaces de usuario
- Se ha logrado la navegación entre todas las pantallas
- Se han integrado funcionalidades básicas de interacción

🔄 **Pendiente (mejoras futuras):**
- Persistencia de datos (almacenamiento real)
- Integración con base de datos o almacenamiento local
- Validaciones avanzadas
- Optimización de experiencia de usuario

---

## 🛠️ Tecnologías Utilizadas

El desarrollo de la aplicación se ha realizado utilizando las siguientes tecnologías:

- **Ionic Framework** – Desarrollo de aplicaciones móviles híbridas
- **Angular** – Estructura y lógica de la aplicación
- **TypeScript** – Lenguaje principal de programación
- **HTML5** – Estructura de las interfaces
- **CSS / SCSS** – Estilos y diseño visual

---

## 🧑‍💻 Equipo de Desarrollo

**Equipo 4**

- Félix María Santos García  
- (Agregar nombres de los demás integrantes)

---

## 📁 Estructura del Proyecto

El proyecto está organizado siguiendo una estructura modular que facilita su mantenimiento:
src/
├── app/
│ ├── pages/ (pantallas de la aplicación)
│ ├── components/ (componentes reutilizables)
│ ├── services/ (lógica y manejo de datos)
│
├── assets/ (recursos estáticos)
├── theme/ (estilos globales)


---

## 🚀 Ejecución del Proyecto

Para ejecutar la aplicación en un entorno local:

```bash
npm install
ionic serve
