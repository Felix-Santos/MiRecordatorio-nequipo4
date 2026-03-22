# 📱 Mi Recordatorio – Equipo 4

##  Descripción General

**Mi Recordatorio** es una aplicación móvil desarrollada con el objetivo de facilitar la gestión de tareas académicas y personales. La aplicación permite a los usuarios organizar sus actividades de manera eficiente, priorizando tareas, estableciendo fechas y llevando un control claro de su estado.

---

## Objetivo de la Aplicación

Proporcionar a los usuarios una herramienta intuitiva y funcional que les permita:

- Gestionar tareas de forma sencilla
- Mantener un seguimiento de actividades pendientes y completadas
- Organizar su tiempo mediante fechas y prioridades
- Visualizar información de manera clara y estructurada

---

## ⚙️ Funcionalidades Implementadas

Hasta el momento, la aplicación cuenta con las siguientes funcionalidades:

Pantallas de la aplicación.
La aplicación contará con las siguientes pantallas principales, diseñadas para ofrecer una experiencia de usuario clara, intuitiva y eficiente:
Pantalla de lista de tareas.
Será la pantalla principal de la aplicación, donde el usuario podrá visualizar todas las tareas registradas junto con su prioridad, fecha límite y estado. Además, permitirá acceder rápidamente a funciones como agregar, editar, completar o eliminar tareas mediante botones e iconos interactivos.
Pantalla para agregar tarea.
Permitirá registrar nuevas tareas mediante un formulario estructurado que incluirá campos como descripción, fecha límite, prioridad y categoría. También incorporará la opción de entrada por voz para facilitar el registro rápido de información.
Pantalla para editar tarea.
Permitirá modificar la información de una tarea previamente creada, incluyendo la actualización de su contenido, cambio de prioridad o categoría, así como la opción de eliminarla o marcarla como completada.
Pantalla de calendario.
Permitirá visualizar las tareas organizadas según su fecha límite dentro de una estructura de calendario, facilitando la planificación y el seguimiento temporal de las actividades.
Pantalla de papelera de tareas
Permitirá visualizar las tareas eliminadas temporalmente, brindando la posibilidad de restaurarlas o eliminarlas de forma definitiva, evitando pérdidas accidentales de información.
Pantalla de historial.
Mostrará un registro detallado de las acciones realizadas sobre las tareas, tales como creación, modificación, eliminación y finalización, permitiendo al usuario llevar un control de sus actividades.
Pantalla de inicio de sesión.
Permitirá al usuario autenticarse mediante el ingreso de credenciales, garantizando el acceso seguro a su información personal dentro de la aplicación.

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

## Tecnologías Utilizadas.

El desarrollo de la aplicación se ha realizado utilizando un conjunto de tecnologías modernas orientadas al desarrollo de aplicaciones móviles híbridas:

- **Ionic Framework** – Framework principal para la construcción de interfaces móviles multiplataforma.
- **Angular** – Estructura y arquitectura de la aplicación, manejo de componentes y navegación.
- **TypeScript** – Lenguaje de programación tipado utilizado para la lógica del sistema.
- **HTML5** – Estructura de las vistas de la aplicación.
- **SCSS (CSS avanzado)** – Diseño visual, estilos personalizados y responsividad.
- **Capacitor** – Plataforma que permite la ejecución de la aplicación como app móvil nativa (Android/iOS).
- **Node.js** – Entorno de ejecución utilizado para la gestión de dependencias del proyecto.
- **NPM** – Gestor de paquetes para instalar y administrar librerías.
- **Ionic CLI** – Herramienta de línea de comandos utilizada para crear, ejecutar y construir la aplicación.

---

## 🧑‍💻 Equipo de Desarrollo

**Equipo 4**

- Félix María Santos García  
- Juan Luis Dias.
- William Antonio.
- Eric Arturo.
- Leonardo Terrero.

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
