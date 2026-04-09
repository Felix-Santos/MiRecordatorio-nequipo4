
 # Mi Recordatorio — Documentación del proyecto

 Última actualización: 9 de abril de 2026

 ## Resumen

 Mi Recordatorio es una aplicación móvil/web de gestión de tareas desarrollada con Ionic + Angular y Capacitor. Permite registrar usuarios, crear y administrar tareas (con historial y papelera) y personalizar la apariencia (tema/color). El proyecto incluye una implementación de persistencia local lista para producción mediante `@ionic/storage-angular` con preferencia por driver SQLite en entornos nativos, y fallback a IndexedDB/localStorage en navegadores.

 ## Tecnologías utilizadas

 - **Ionic Framework** (Ionic Angular)
 - **Angular 20**
 - **Capacitor** (v8)
 - **@ionic/storage-angular** (persistencia)
 - **@capacitor-community/sqlite** (opcional, recomendado en móviles)
 - **RxJS** (BehaviorSubject, Observables)
 - **TypeScript, SCSS, HTML**

 ## Estructura principal del repositorio

 - `src/app/` — código Angular / Ionic (páginas, servicios, modelos)
	 - `pages/` — vistas (login, lista-tareas, nueva-tarea, settings, etc.)
	 - `services/` — servicios principales: autenticación, tareas, settings, storage, translate
	 - `models/` — modelos TypeScript (Task, TaskHistory, etc.)
 - `src/global.scss` — variables y estilos globales (tema por defecto)
 - `src/theme/variables.scss` — variables temáticas usadas por Ionic

 ## Cómo ejecutar (desarrollo)

 ```bash
 npm install
 npm start      # usa `ng serve` (ver package.json)
 ```

 Abrir en navegador: `http://localhost:4200`.

 Build de producción (web):

 ```bash
 npm run build
 ```

 Para ejecutar en dispositivo/emulador (Capacitor):

 ```bash
 npm install @capacitor-community/sqlite
 npx cap sync
 npx cap open android   # o ios
 ```

 ## Persistencia y configuración para producción

 El proyecto usa `@ionic/storage-angular` con `driverOrder` preferente `['sqlite','indexeddb','localstorage']`. En entornos nativos (Android/iOS) se recomienda instalar el plugin nativo `@capacitor-community/sqlite` para persistencia robusta y rendimiento.

 - Configuración en: [src/app/app.module.ts](src/app/app.module.ts)
 - Enlace del plugin SQLite: `npm install @capacitor-community/sqlite` y luego `npx cap sync`.

 Fallback: si la creación del driver de Ionic Storage falla, el `StorageService` implementa un fallback a `localStorage` para garantizar que los datos no se pierdan.

 ## Servicios clave (explicación y uso)

 A continuación se describe la responsabilidad y las funciones principales de cada servicio importante.

 **AuthService** — Gestión de usuarios y sesión
 - Archivo: [src/app/services/auth.service.ts](src/app/services/auth.service.ts)
 - Qué hace: registra usuarios, realiza login/logout y expone `currentUser$` (Observable) para que la UI reaccione a cambios de sesión.
 - API importante:
	 - `register(username, email, password): Observable<boolean>` — crea usuario (demo: contraseñas en texto plano, no apto para producción)
	 - `login(username, password): Observable<boolean>` — valida credenciales y guarda sesión
	 - `logout()` — cierra sesión
	 - `getCurrentUser()` / `isAuthenticated()`
 - Persistencia: usa `StorageService` para persistir la lista de usuarios y la sesión actual.
 - Nota de seguridad: actualmente guarda contraseñas en texto plano (solo demo). En producción hay que mover autenticación a un backend y almacenar hashes.

 **TaskService** — Gestión de tareas y historial
 - Archivo: [src/app/services/task.service.ts](src/app/services/task.service.ts)
 - Qué hace: mantiene un array de tareas y de historial, expone `tasks$` y `deletedTasks$` como BehaviorSubjects.
 - API importante:
	 - `getTasks()` / `getDeletedTasks()` / `getHistory()`
	 - `addTask(taskData)` — crea tarea vinculada al usuario actual
	 - `updateTask(id, updates)` — edita tarea
	 - `deleteTask(id)` — soft-delete (papelera)
	 - `restoreTask(id)` — restaura desde papelera
	 - `permanentlyDeleteTask(id)` — borra definitivamente
	 - `toggleComplete(id)` — marca/completa tarea
 - Persistencia: guarda `tasks` e `history` en `StorageService`.
 - Observabilidad: `TaskService` se suscribe a `AuthService.currentUser$` para filtrar las tareas del usuario autenticado y actualizar la UI cuando cambia la sesión.

 **SettingsService** — Idioma y tema
 - Archivo: [src/app/services/settings.service.ts](src/app/services/settings.service.ts)
 - Qué hace: administra `language$` y `theme$` (BehaviorSubjects), aplica cambios al `document.documentElement` modificando variables CSS (`--ion-color-primary`, `--ion-background-color`, etc.).
 - Presets incluidos: `default`, `blue`, `green`, `red`, `dark`, `custom`.
 - Persistencia: guarda configuración en `StorageService`.
 - Cómo usar: `setTheme('green')` o `setCustomTheme({ primary, primaryRgb, contrast, background })`.

 **TranslateService** — Traducciones simples
 - Archivo: [src/app/services/translate.service.ts](src/app/services/translate.service.ts)
 - Qué hace: almacena un diccionario de traducciones en memoria (ES/EN) y expone `lang$` y `translate(key, params?)`.
 - Persistencia del idioma: usa `StorageService`.
 - Uso en plantillas: hay un `TranslatePipe` que utiliza `TranslateService` para resolver claves.

 **StorageService** — Envoltorio de persistencia
 - Archivo: [src/app/services/storage.service.ts](src/app/services/storage.service.ts)
 - Qué hace: crea y expone métodos `ready()`, `set(key,value)`, `get(key)`, `remove(key)`.
 - Driver preferente: intenta crear el driver de Ionic Storage (con la configuración de `AppModule`). Si falla, usa `localStorage` como fallback para asegurar persistencia en navegador.

 ## Páginas / Vistas importantes

 - `src/app/pages/login/` — login y registro de usuario
 - `src/app/pages/lista-tareas/` — lista principal de tareas (filtrado por usuario autenticado)
 - `src/app/pages/nueva-tarea/` — formulario para crear tareas
 - `src/app/pages/editar-tarea/` — editar tarea existente
 - `src/app/pages/papelera/` — tareas eliminadas
 - `src/app/pages/historial/` — historial de acciones
 - `src/app/pages/settings/` — configuración (idioma + tema) — archivos: [src/app/pages/settings/settings.page.ts](src/app/pages/settings/settings.page.ts), [src/app/pages/settings/settings.page.html](src/app/pages/settings/settings.page.html)

 ## Theming (cambiar color de la app)

 - Variables principales: `--ion-color-primary`, `--ion-background-color`, `--ion-text-color` definidas en [src/global.scss](src/global.scss) y [src/theme/variables.scss](src/theme/variables.scss).
 - Valor por defecto actual: `#0054e9` (variable `--ion-color-primary` en `src/global.scss`).
 - La pantalla de Ajustes permite escoger presets, y también crear un tema `custom` con `primary` y `background` en hex. La opción **Predeterminado** aplica el color actual (lee `--ion-color-primary`).

 ## Seguridad y recomendaciones para producción

 - NO almacenar contraseñas en texto plano. Migrar autenticación a un backend que devuelva tokens (JWT) y almacenar solo tokens en almacenamiento seguro.
 - Para móviles, usar `@capacitor-community/sqlite` y/o plugins de almacenamiento seguro para tokens/credenciales.
 - Forzar HTTPS en backend y usar CORS correctamente.
 - Validar entradas de usuario y sanitizar datos que puedan mostrarse en la UI.

 ## Extensiones y mejoras sugeridas

 - Conectar con backend real (Node/Express + PostgreSQL, o Firebase Auth + Firestore).
 - Implementar manejo de usuarios remotos (servicio REST) y sincronización offline/online.
 - Añadir tests unitarios (Jasmine/Karma o Jest) para servicios críticos (`AuthService`, `TaskService`).
 - Usar Secure Storage para tokens (`@ionic-native/secure-storage-echo` o soluciones nativas en Capacitor).

 ## Troubleshooting

 - Si los datos no persisten en navegador:
	 - Verifica en DevTools → Application → IndexedDB / LocalStorage las claves `users`, `tasks`, `taskHistory`, `app_language`, `app_theme`.
	 - Si hay tema guardado previamente, borra almacenamiento o `localStorage.clear()` para forzar reset.
 - Si `@ionic/storage-angular` no crea el driver, el `StorageService` usa `localStorage` como fallback.
 - Si la ruta de Ajustes no aparece, revisa `src/app/app-routing.module.ts` (la ruta `/settings` fue añadida).

 ## Referencias de archivos (lectura rápida)

 - `App Module`: [src/app/app.module.ts](src/app/app.module.ts)
 - `Storage wrapper`: [src/app/services/storage.service.ts](src/app/services/storage.service.ts)
 - `Auth service`: [src/app/services/auth.service.ts](src/app/services/auth.service.ts)
 - `Task service`: [src/app/services/task.service.ts](src/app/services/task.service.ts)
 - `Settings service`: [src/app/services/settings.service.ts](src/app/services/settings.service.ts)
 - `Translate service`: [src/app/services/translate.service.ts](src/app/services/translate.service.ts)
 - `Settings page`: [src/app/pages/settings/settings.page.ts](src/app/pages/settings/settings.page.ts)
 - `Global styles`: [src/global.scss](src/global.scss)

 ## Comandos útiles

 ```bash
 # instalar dependencias
 npm install

 # desarrollo
 npm start

 # build web
 npm run build

 # instalar plugin sqlite nativo (recomendado)
 npm install @capacitor-community/sqlite
 npx cap sync
 npx cap open android   # o ios
 ```

 ---

 Si quieres, puedo:
 - Añadir un archivo `docs/ARCHITECTURE.md` con diagramas y flujos.
 - Generar comentarios en línea más detallados para cada archivo del `src/app/services`.
 - Crear una guía de despliegue paso a paso para Android/iOS (incluyendo permisos y configuración SQLite).

 Dime qué prefieres que haga a continuación.
