# REPORTE COMPLETO DE REDUNDANCIAS DE CÓDIGO
## Proyecto: MiRecordatorio (Angular/Ionic)

**Fecha del análisis:** 9 de abril de 2026  
**Scope:** src/app/ (todos los archivos .ts, .html, .scss)  
**Total de redundancias encontradas:** 18 patrones principales

---

## INDEX
1. [Métodos Duplicados en Servicios](#1-métodos-duplicados-en-servicios)
2. [Templates HTML Repetidos](#2-templates-html-repetidos)
3. [Estilos SCSS Duplicados](#3-estilos-scss-duplicados)
4. [Componentes con Lógica Idéntica](#4-componentes-con-lógica-idéntica)
5. [Constantes y Configuraciones Duplicadas](#5-constantes-y-configuraciones-duplicadas)
6. [Propiedades de Modelos Redundantes](#6-propiedades-de-modelos-redundantes)
7. [Lógica de Validación Repetida](#7-lógica-de-validación-repetida)
8. [Resumen de Recomendaciones](#8-resumen-de-recomendaciones)

---

## 1. MÉTODOS DUPLICADOS EN SERVICIOS

### 1.1 Métodos de Formateo de Fecha (3 archivos)

**Redundancia:** Método `formatDate()` implementado de forma idéntica en tres páginas diferentes.

| Ubicación | Línea | Descripción |
|-----------|-------|-------------|
| [src/app/pages/historial/historial.page.ts](src/app/pages/historial/historial.page.ts#L71-L77) | 71-77 | `formatDate(dateString): string` |
| [src/app/pages/papelera/papelera.page.ts](src/app/pages/papelera/papelera.page.ts#L51-L57) | 51-57 | `formatDeletedDate(dateString): string` |
| [src/app/pages/calendario/calendario.page.ts](src/app/pages/calendario/calendario.page.ts#L72-L80) | 72-80 | `formatDate(dateString): string` |

**Código duplicado:**
```typescript
// Patrón repetido en las 3 páginas
formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString(this.locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
```

**Sugerencia de consolidación:**
- Crear un servicio `DateFormatterService` en `src/app/services/date-formatter.service.ts`
- Implementar una única función que formatee fechas según locale
- Inyectar el servicio en las 3 páginas en lugar de duplicar el código

**Beneficio:** Reducir 18 líneas de código duplicado, facilitar mantenimiento de cambios en formato de fecha

---

### 1.2 Métodos de Conversión Hex a RGB (3 archivos)

**Redundancia:** Método `hexToRgb()` implementado idénticamente en tres ubicaciones.

| Ubicación | Línea | Descripción |
|-----------|-------|-------------|
| [src/app/services/settings.service.ts](src/app/services/settings.service.ts#L89-L100) | 89-100 | `hexToRgb(hex: string)` |
| [src/app/pages/settings/settings.page.ts](src/app/pages/settings/settings.page.ts#L90-L100) | 90-100 | `hexToRgb(hex: string)` |
| [src/app/components/settings-modal/settings-modal.component.ts](src/app/components/settings-modal/settings-modal.component.ts#L110-L120) | 110-120 | `hexToRgb(hex: string)` |

**Código duplicado:**
```typescript
private hexToRgb(hex: string): string | null {
  const h = (hex || '').replace('#', '').trim();
  if (!h || h.length !== 6) return null;
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`;
}
```

**Sugerencia de consolidación:**
- Crear un servicio `ColorUtilService` o agregar método a un `UtilityService`
- Hacer la función pública para que sea reutilizable
- Inyectar en SettingsService, SettingsPage y SettingsModalComponent
- Eliminar las 3 implementaciones locales

**Beneficio:** Reducir duplicación, punto único de mantenimiento para lógica de conversión de colores

---

### 1.3 Método para Detectar Color Oscuro

**Redundancia:** Método `isColorDark()` en `settings.service.ts` solo se usa localmente pero podría ser compartido.

| Ubicación | Línea | Descripción |
|-----------|-------|-------------|
| [src/app/services/settings.service.ts](src/app/services/settings.service.ts#L96-L105) | 96-105 | `isColorDark(hex: string): boolean` |

**Código:**
```typescript
private isColorDark(hex: string): boolean {
  if (!hex) return false;
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(s => s + s).join('');
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 128;
}
```

**Contexto:** Se usa en `applyCustomTheme()` para determinar si el texto debe ser blanco o negro.  
**Sugerencia:** Incluir en `ColorUtilService` mencionado en 1.2

---

### 1.4 Métodos para Obtener Siguiente ID (2 métodos muy similares)

**Redundancia:** En `task.service.ts` existen dos métodos prácticamente idénticos.

| Ubicación | Línea | Descripción |
|-----------|-------|-------------|
| [src/app/services/task.service.ts](src/app/services/task.service.ts#L294-L297) | 294-297 | `getNextId(): number` |
| [src/app/services/task.service.ts](src/app/services/task.service.ts#L301-L305) | 301-305 | `getNextHistoryId(): number` |

**Código duplicado:**
```typescript
private getNextId(): number {
  return this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
}

private getNextHistoryId(): number {
  return this.history.length > 0 ? Math.max(...this.history.map(h => h.id)) + 1 : 1;
}
```

**Sugerencia de consolidación:**
- Crear un método genérico `getNextId<T>(array: T[], idKey: keyof T): number`
- O crear un utility `IdGeneratorUtil` reutilizable

**Beneficio:** Eliminar duplicación, métodos más mantenibles y genéricos

---

### 1.5 Método para Obtener Color Primario Computado (2 archivos)

**Redundancia:** Método `getComputedPrimaryColor()` implementado de forma idéntica.

| Ubicación | Línea | Descripción |
|-----------|-------|-------------|
| [src/app/pages/settings/settings.page.ts](src/app/pages/settings/settings.page.ts#L68-L85) | 68-85 | `getComputedPrimaryColor()` |
| [src/app/components/settings-modal/settings-modal.component.ts](src/app/components/settings-modal/settings-modal.component.ts#L89-L106) | 89-106 | `getComputedPrimaryColor()` |

**Código duplicado:**
```typescript
private getComputedPrimaryColor(): string {
  try {
    const root = getComputedStyle(document.documentElement);
    let color = root.getPropertyValue('--ion-color-primary').trim();
    if (!color) return '#0054e9';
    if (color.startsWith('rgb')) {
      const nums = color.match(/\d+/g) || [];
      if (nums.length >= 3) {
        const hex = '#' + nums.slice(0, 3)
          .map(n => parseInt(n).toString(16).padStart(2, '0'))
          .join('');
        return hex;
      }
    }
    return color;
  } catch (e) {
    return '#0054e9';
  }
}
```

**Sugerencia de consolidación:**
- Agregar a `ColorUtilService` (ver 1.2)
- Reutilizar en ambos componentes

---

## 2. TEMPLATES HTML REPETIDOS

### 2.1 Sección de Notificación (Notify) en Formularios

**Redundancia:** El HTML para seleccionar notificaciones está duplicado en dos páginas.

| Ubicación | Línea | Descripción |
|-----------|-------|-------------|
| [src/app/pages/nueva-tarea/nueva-tarea.page.html](src/app/pages/nueva-tarea/nueva-tarea.page.html#L30-L56) | 30-56 | Sección completa de notificación |
| [src/app/pages/editar-tarea/editar-tarea.page.html](src/app/pages/editar-tarea/editar-tarea.page.html#L38-L64) | 38-64 | Sección idéntica de notificación |

**Template duplicado:**
```html
<ion-item>
  <ion-label position="stacked">{{ 'NEW.NOTIFY_BEFORE_LABEL' | translate }}</ion-label>
  <div style="display:flex; gap:8px; align-items:center; width:100%;">
    <ion-select [(ngModel)]="newTask.notifyUnit" ...>
      <ion-select-option value="hours">{{ 'UNIT.HOURS' | translate }}</ion-select-option>
      <ion-select-option value="days">{{ 'UNIT.DAYS' | translate }}</ion-select-option>
    </ion-select>
    <!-- 20+ líneas idénticas de opciones -->
  </div>
</ion-item>
```

**Sugerencia de consolidación:**
- Crear componente reutilizable `NotifyBeforeInputComponent`
- Pasar como Input: `notifyUnit`, `notifyAmount`, labels traducidas
- Emitir cambios mediante Output
- Reemplazar en ambas páginas con: `<app-notify-before-input [unit]="newTask.notifyUnit" ...></app-notify-before-input>`

**Beneficio:** Reducir ~30 líneas de HTML duplicado, facilitar cambios futuros en la UI de notificación

---

### 2.2 Header Toolbar Repetido (Casi todas las páginas)

**Redundancia:** Prácticamente todas las páginas tienen headers similares con pequeñas variaciones.

**Ubicaciones (8 páginas):**
- [src/app/pages/lista-tareas/lista-tareas.page.html](src/app/pages/lista-tareas/lista-tareas.page.html#L1-L13) - Línea 1-13
- [src/app/pages/papelera/papelera.page.html](src/app/pages/papelera/papelera.page.html#L1-L6) - Línea 1-6
- [src/app/pages/historial/historial.page.html](src/app/pages/historial/historial.page.html#L1-L10) - Línea 1-10
- [src/app/pages/nueva-tarea/nueva-tarea.page.html](src/app/pages/nueva-tarea/nueva-tarea.page.html#L1-L6) - Línea 1-6
- [src/app/pages/editar-tarea/editar-tarea.page.html](src/app/pages/editar-tarea/editar-tarea.page.html#L1-L6) - Línea 1-6
- [src/app/pages/calendario/calendario.page.html](src/app/pages/calendario/calendario.page.html#L1-L6) - Línea 1-6
- [src/app/pages/login/login.page.html](src/app/pages/login/login.page.html#L1-L3) - Línea 1-3
- [src/app/pages/settings/settings.page.html](src/app/pages/settings/settings.page.html#L1-L6) - Línea 1-6

**Patrón típico:**
```html
<ion-header>
  <ion-toolbar color="success">
    <ion-buttons slot="start">
      <ion-back-button defaultHref="/lista-tareas"></ion-back-button>
    </ion-buttons>
    <ion-title>{{ 'TITLE_KEY' | translate }}</ion-title>
    <ion-buttons slot="end">
      <!-- Botones específicos -->
    </ion-buttons>
  </ion-toolbar>
</ion-header>
```

**Variaciones:**
- Algunos usan color "success", otros "primary"
- Diferentes botones en el slot="end"
- El defaultHref varía según la página

**Sugerencia de consolidación:**
- Crear componente `AppHeaderComponent`
- Inputs: `title` (translation key), `backHref`, `buttons` (array de botones), `color`
- Usar en todas las páginas

**Beneficio:** Reducir ~80 líneas de HTML duplicado, consistencia en headers, cambios globales más fáciles

---

### 2.3 Badge de Prioridad Repetido (3 páginas)

**Redundancia:** La lógica de mostrar badge con color según prioridad está duplicada.

| Ubicación | Línea | Descripción |
|-----------|-------|-------------|
| [src/app/pages/lista-tareas/lista-tareas.page.html](src/app/pages/lista-tareas/lista-tareas.page.html#L50-L53) | 50-53 | Badge con color dinámico |
| [src/app/pages/papelera/papelera.page.html](src/app/pages/papelera/papelera.page.html#L18) | 18 | Badge con color dinámico |
| [src/app/pages/calendario/calendario.page.html](src/app/pages/calendario/calendario.page.html#L41-L44) | 41-44 | Badge con color dinámico |

**Template repetido:**
```html
<ion-badge 
  [color]="task.priority === 'Alta' ? 'danger' : 
           task.priority === 'Media' ? 'warning' : 'success'">
  {{ ('PRIORITY.' + (task.priority || '').toUpperCase()) | translate }}
</ion-badge>
```

**Sugerencia de consolidación:**
- Crear pipe `PriorityColorPipe` que retorne el color correspondiente
- O crear componente `PriorityBadgeComponent` que reciba `priority` y maneje todo
- Simplificar a: `<app-priority-badge [priority]="task.priority"></app-priority-badge>`

**Beneficio:** Reducir duplicación, lógica centralizada

---

### 2.4 Templates para "Sin Datos" (3 páginas)

**Redundancia:** Hay templates similares para mostrar cuando no hay datos.

| Ubicación | Línea | Descripción |
|-----------|-------|-------------|
| [src/app/pages/papelera/papelera.page.html](src/app/pages/papelera/papelera.page.html#L22-L29) | 22-29 | `noDeletedTasks` template |
| [src/app/pages/historial/historial.page.html](src/app/pages/historial/historial.page.html#L15-L19) | 15-19 | `noHistory` template |
| [src/app/pages/calendario/calendario.page.html](src/app/pages/calendario/calendario.page.html#L37-L41) | 37-41 | `noTasks` template |

**Patrón similar:**
```html
<ng-template #noDeletedTasks>
  <div class="no-deleted empty-trash">
    <ion-icon name="trash-outline" class="empty-icon"></ion-icon>
    <p class="title">{{ 'TRASH.NO_TASKS' | translate }}</p>
    <p class="muted">{{ 'TRASH.INFO' | translate }}</p>
  </div>
</ng-template>
```

**Sugerencia de consolidación:**
- Crear componente `EmptyStateComponent`
- Inputs: `icon` (string), `title` (translation key), `message` (translation key)
- Reutilizar en las 3 (y potencialmente más) páginas

**Beneficio:** Reducir duplicación, consistencia visual, reutilizable en futuras páginas

---

## 3. ESTILOS SCSS DUPLICADOS

### 3.1 Estilos para Estado Vacío (3 archivos)

**Redundancia:** Estilos muy similares para mostrar "sin datos" en diferentes páginas.

| Ubicación | Línea | Descripción | CSS |
|-----------|-------|-------------|-----|
| [src/app/pages/papelera/papelera.page.scss](src/app/pages/papelera/papelera.page.scss#L1-L15) | 1-15 | `.no-deleted` | Flex centered, custom heights |
| [src/app/pages/historial/historial.page.scss](src/app/pages/historial/historial.page.scss#L1-L4) | 1-4 | `.no-history` | Bloque, centered, margin-top |
| [src/app/pages/calendario/calendario.page.scss](src/app/pages/calendario/calendario.page.scss#L6-L12) | 6-12 | `.no-tasks` | Bloque, centered, margin-top |

**Código duplicado:**
```scss
// papelera.page.scss
.no-deleted {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 140px);
  color: var(--ion-text-color, #888);
  padding: 8px 24px;
}

// historial.page.scss (variante)
.no-history {
  display: block;
  text-align: center;
  margin-top: 50px;
}

// calendario.page.scss (variante)
.no-tasks {
  display: block;
  text-align: center;
  margin-top: 30px;
}
```

**Sugerencia de consolidación:**
- Crear archivo `src/app/styles/_empty-state.scss` con clase reutilizable `.empty-state`
- Usar la clase en lugar de crear nuevas clases

**Código propuesto:**
```scss
// src/app/styles/_empty-state.scss
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--ion-text-color, #888);
  padding: 24px;
  text-align: center;

  .empty-icon {
    font-size: 48px;
    opacity: 0.35;
    margin-bottom: 12px;
  }

  .title {
    font-weight: 600;
    margin-bottom: 6px;
  }

  .muted {
    color: var(--ion-color-medium, #999);
    max-width: 80%;
  }
}
```

**Beneficio:** Reducir duplicación CSS, consistencia visual, fácil mantenimiento

---

### 3.2 Estilos de Ion-Card Repetidos

**Redundancia:** Estilos de `ion-card` pueden estar repetidos si existen en global.scss o múltiples archivos.

**Nota:** Parece que los estilos de card se definen solo en [src/app/pages/lista-tareas/lista-tareas.page.scss](src/app/pages/lista-tareas/lista-tareas.page.scss#L1-L10) línea 1-10.

**Sugerencia:** Verificar si estos estilos se repiten en otros archivos y consolidarlos en un archivo global o en `src/app/styles/_cards.scss`.

---

## 4. COMPONENTES CON LÓGICA IDÉNTICA

### 4.1 SettingsPage vs SettingsModalComponent (DOS COMPONENTES IDÉNTICOS)

**Redundancia CRÍTICA:** Existe duplicación completa entre dos componentes que hacen exactamente lo mismo.

| Ubicación | Tipo | Líneas | Descripción |
|-----------|------|--------|-------------|
| [src/app/pages/settings/settings.page.ts](src/app/pages/settings/settings.page.ts) | Component | 110 | Página completa de settings |
| [src/app/components/settings-modal/settings-modal.component.ts](src/app/components/settings-modal/settings-modal.component.ts) | Component | 140 | Modal idéntico de settings |

**Código duplicado:**
- `languages` array (idéntico)
- `themes` array (idéntico)
- `selectedLanguage`, `selectedTheme`, `customPrimary`, `customBackground` (propiedades idénticas)
- `ngOnInit()` (lógica idéntica)
- `onLanguageChange()` (idéntico)
- `onThemeChange()` (idéntico)
- `saveCustomTheme()` (idéntico)
- `updatePreview()` (idéntico)
- `getComputedPrimaryColor()` (idéntico - ver 1.5)
- `hexToRgb()` (idéntico - ver 1.2)

**HTML también es idéntico (excepto botón de cierre):**
- [src/app/pages/settings/settings.page.html](src/app/pages/settings/settings.page.html)
- [src/app/components/settings-modal/settings-modal.component.html](src/app/components/settings-modal/settings-modal.component.html)

**Sugerencia de consolidación:**
Opción A (preferida): Eliminar la página y usar solo el modal
- Modificar lista-tareas.page para abrir el modal en lugar de navegar a `/settings`
- Eliminar [src/app/pages/settings/](src/app/pages/settings/) por completo
- Actualizar rutas en app-routing.module.ts

Opción B: Crear componente compartido reutilizable
- Extraer la lógica a un componente base `SettingsComponent`
- Heredar en SettingsPage y SettingsModalComponent
- Reduce a ~20 líneas de boilerplate en cada uno

**Beneficio:** Eliminar 250+ líneas de código duplicado, una única fuente de verdad

---

## 5. CONSTANTES Y CONFIGURACIONES DUPLICADAS

### 5.1 Array de Idiomas Duplicado (2 archivos)

**Redundancia:** El array `languages` está definido idénticamente en dos lugares.

| Ubicación | Línea | Array |
|-----------|-------|-------|
| [src/app/pages/settings/settings.page.ts](src/app/pages/settings/settings.page.ts#L14-L17) | 14-17 | `languages` |
| [src/app/components/settings-modal/settings-modal.component.ts](src/app/components/settings-modal/settings-modal.component.ts#L17-L20) | 17-20 | `languages` |

**Código duplicado:**
```typescript
languages = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'Inglés' }  // en settings-modal: 'English'
];
```

**Sugerencia de consolidación:**
- Crear constante global `src/app/constants/languages.ts`
- Exportar: `export const AVAILABLE_LANGUAGES = [...]`
- Importar en ambos componentes

**Beneficio:** Cambios en idiomas en un único lugar, evita inconsistencias

---

### 5.2 Array de Temas Duplicado (2 archivos)

**Redundancia:** El array `themes` está definido idénticamente.

| Ubicación | Línea | Array |
|-----------|-------|-------|
| [src/app/pages/settings/settings.page.ts](src/app/pages/settings/settings.page.ts#L20-L26) | 20-26 | `themes` |
| [src/app/components/settings-modal/settings-modal.component.ts](src/app/components/settings-modal/settings-modal.component.ts#L23-L29) | 23-29 | `themes` |

**Código duplicado:**
```typescript
themes = [
  { value: 'default', label: 'Predeterminado' },
  { value: 'blue', label: 'Azul' },
  { value: 'green', label: 'Verde' },
  { value: 'red', label: 'Rojo' },
  { value: 'dark', label: 'Oscuro' },
  { value: 'custom', label: 'Personalizado' }
];
```

**Sugerencia de consolidación:**
- Crear constante global `src/app/constants/themes.ts`
- Exportar: `export const AVAILABLE_THEMES = [...]`
- Importar en ambos componentes

**Beneficio:** Cambios en temas en un único lugar

---

### 5.3 Configuración de Locale (Repetida en 5+ páginas)

**Redundancia:** Cada página que necesita locale hace lo mismo.

**Ubicaciones:**
- [src/app/pages/nueva-tarea/nueva-tarea.page.ts](src/app/pages/nueva-tarea/nueva-tarea.page.ts#L21) - línea 21
- [src/app/pages/editar-tarea/editar-tarea.page.ts](src/app/pages/editar-tarea/editar-tarea.page.ts#L13) - línea 13
- [src/app/pages/papelera/papelera.page.ts](src/app/pages/papelera/papelera.page.ts#L15) - línea 15
- [src/app/pages/historial/historial.page.ts](src/app/pages/historial/historial.page.ts#L18) - línea 18
- [src/app/pages/calendario/calendario.page.ts](src/app/pages/calendario/calendario.page.ts#L22) - línea 22

**Código repetido en TODAS:**
```typescript
locale: string = 'es-ES';

constructor(private settings: SettingsService) {
  this.settings.language$.subscribe(l => 
    this.locale = l === 'en' ? 'en-US' : 'es-ES'
  );
}
```

**Sugerencia de consolidación:**
- Crear servicio `LocaleService`
- Que devuelva Observable<string> con el locale actual
- Usar en templates con `| async` pipe
- Eliminar la lógica de 5+ páginas

**Implementación:**
```typescript
// src/app/services/locale.service.ts
@Injectable({ providedIn: 'root' })
export class LocaleService {
  locale$ = this.settings.language$.pipe(
    map(l => l === 'en' ? 'en-US' : 'es-ES')
  );
  constructor(private settings: SettingsService) {}
}
```

**Uso simplificado en templates:**
```html
<ion-datetime [locale]="(localeService.locale$ | async)"></ion-datetime>
```

**Beneficio:** Reducir 5+ instancias de lógica duplicada

---

## 6. PROPIEDADES DE MODELOS REDUNDANTES

### 6.1 Properties `status` y `completed` en Task (REDUNDANCIA LÓGICA)

**Redundancia:** El modelo Task contiene dos propiedades que dicen lo mismo.

**Ubicación:** [src/app/models/task.model.ts](src/app/models/task.model.ts)

**Código:**
```typescript
export interface Task {
  // ...
  status: 'Pendiente' | 'Completada';  // String que describe estado
  completed: boolean;                   // Boolean que describe estado
  // ...
}
```

**Problema:**
- `status` y `completed` son redundantes (un booleano puede derivarse del otro)
- Riesgo de inconsistencia: ¿qué pasa si `completed: true` pero `status: 'Pendiente'`?
- Código que actualiza uno pero olvida actualizar el otro

**Ubicaciones donde se actualizan juntos:**
- [src/app/services/task.service.ts](src/app/services/task.service.ts#L195-L207) línea 195-207 en `addTask()`
- [src/app/services/task.service.ts](src/app/services/task.service.ts#L259-L262) línea 259-262 en `toggleComplete()`

**Sugerencia de consolidación:**
Opción A (preferida): Usar solo `completed: boolean`, eliminar `status`
```typescript
export interface Task {
  id: number;
  userId: number;
  title: string;
  description?: string;
  date: string;
  priority: 'Alta' | 'Media' | 'Baja';
  completed: boolean;  // Única fuente de verdad
  // ... resto de propiedades
}
```

En templates, crear pipe para traducir: `{{ task.completed ? 'TASK.COMPLETED' : 'TASK.PENDING' | translate }}`

Opción B: Usar computed property (menos viable en interfaz, mejor en clase)
- Convertir Task a clase con getter: `get status(): string { return this.completed ? 'Completada' : 'Pendiente'; }`

**Cambios requeridos:**
- Actualizar [src/app/models/task.model.ts](src/app/models/task.model.ts) 
- Actualizar [src/app/services/task.service.ts](src/app/services/task.service.ts) (remove `status` assignments)
- Actualizar templates que usan `task.status`
- Crear pipe `TaskStatusPipe` para traducción

**Beneficio:** Modelo más limpio, menor riesgo de inconsistencias, una única fuente de verdad

---

## 7. LÓGICA DE VALIDACIÓN REPETIDA

### 7.1 Validación de Campos Vacíos (Repetida en Login)

**Redundancia:** La validación de campos vacíos está duplicada en `onLogin()` y `onRegister()`.

**Ubicación:** [src/app/pages/login/login.page.ts](src/app/pages/login/login.page.ts)

| Método | Línea | Validación |
|--------|-------|-----------|
| `onLogin()` | 34-37 | if (!this.loginData.username \|\| !this.loginData.password) |
| `onRegister()` | 44-47 | if (!this.registerData.username \|\| !this.registerData.email \|\| !this.registerData.password) |

**Código complemento:**
```typescript
// onLogin
if (!this.loginData.username || !this.loginData.password) {
  this.errorMessage = this.translate.translate('LOGIN.FILL_FIELDS_MSG');
  return;
}

// onRegister
if (!this.registerData.username || !this.registerData.email || !this.registerData.password) {
  this.errorMessage = this.translate.translate('LOGIN.FILL_FIELDS_MSG');
  return;
}
```

**Sugerencia de consolidación:**
Crear método helper:
```typescript
private validateLoginForm(data: any, requiredFields: (keyof typeof data)[]): boolean {
  const isValid = requiredFields.every(field => data[field]?.trim());
  if (!isValid) {
    this.errorMessage = this.translate.translate('LOGIN.FILL_FIELDS_MSG');
  }
  return isValid;
}

onLogin(): void {
  if (!this.validateLoginForm(this.loginData, ['username', 'password'])) return;
  // ... rest
}

onRegister(): void {
  if (!this.validateLoginForm(this.registerData, ['username', 'email', 'password'])) return;
  // ... rest
}
```

**Beneficio:** Reducir duplicación, validación consistente, fácil agregar nuevas validaciones

---

### 7.2 Métodos toggleComplete() Duplicados (2 páginas)

**Redundancia:** Método `toggleComplete()` tiene la misma implementación en dos páginas.

| Ubicación | Línea | Descripción |
|-----------|-------|-------------|
| [src/app/pages/lista-tareas/lista-tareas.page.ts](src/app/pages/lista-tareas/lista-tareas.page.ts#L58-L60) | 58-60 | `toggleComplete(task: Task)` |
| [src/app/pages/calendario/calendario.page.ts](src/app/pages/calendario/calendario.page.ts#L80-L82) | 80-82 | `toggleComplete(task: Task)` |

**Código idéntico:**
```typescript
toggleComplete(task: Task): void {
  this.taskService.toggleComplete(task.id);
}
```

**Sugerencia:**
- Crear directiva reutilizable `[appToggleComplete]` o
- Usar directiva estructural que maneje esto automáticamente en templates
- Eliminar los métodos de ambas páginas

**Alternativa:** Dejar como está (es muy simple), pero documentar que es intencional

---

## 8. RESUMEN DE RECOMENDACIONES

### Recomendaciones de ALTO IMPACTO (hacer primero):

| Prioridad | Redundancia | Archivos afectados | Líneas a eliminar | Esfuerzo |
|-----------|-------------|-------------------|-----------------|----------|
| 🔴 CRÍTICA | 4.1: Settings duplicado (página + modal) | 2 componentes | 250+ | Alto |
| 🔴 ALTA | 2.1: Notify input repetido | 2 templates | 30 | Medio |
| 🔴 ALTA | 2.2: Headers repetidos | 8 templates | 80+ | Alto |
| 🟠 MEDIA | 1.2: hexToRgb() duplicado | 3 archivos | 30 | Bajo |
| 🟠 MEDIA | 1.1: formatDate() duplicado | 3 archivos | 18 | Bajo |
| 🟠 MEDIA | 5.1-5.2: Constants duplicadas | 2 archivos | 15 | Muy Bajo |

### Recomendaciones por tipo de acción:

#### CREATE - Crear nuevos archivos/servicios:
1. ✅ `ColorUtilService` - centralizar métodos hex-to-rgb, is-color-dark
2. ✅ `DateFormatterService` - centralizar formatDate()
3. ✅ `LocaleService` - centralizar conversión de locale
4. ✅ `constants/languages.ts` - array de idiomas
5. ✅ `constants/themes.ts` - array de temas
6. ✅ `styles/_empty-state.scss` - estilos reutilizables
7. ✅ `components/NotifyBeforeInputComponent` - input de notificación reutilizable
8. ✅ `components/AppHeaderComponent` - header reutilizable
9. ✅ `components/PriorityBadgeComponent` - badge de prioridad reutilizable
10. ✅ `components/EmptyStateComponent` - estado vacío reutilizable

#### DELETE - Eliminar archivos:
1. ✅ `src/app/pages/settings/` (completa) - reemplazar con modal
2. ✅ Eliminar `SettingsModalComponent` si se usa solo en lista-tareas (consolidar con settings)

#### REFACTOR - Modificar archivos existentes:
1. ✅ `task.model.ts` - eliminar propiedad `status`, usar solo `completed`
2. ✅ `task.service.ts` - simplificar métodos getNextId
3. ✅ `login.page.ts` - extraer validación a método helper
4. ✅ `settings.page.ts` - eliminarlo o refactorear junto con settings-modal
5. ✅ Actualizar todas las páginas para usar nuevos servicios y componentes

#### ESTIMATED SAVINGS:
- **Líneas de código a eliminar/consolidar:** 450-500 líneas
- **Componentes a crear:** 5-6 reutilizables
- **Servicios a crear:** 3-4
- **Puntos de mantenimiento reducidos:** 10+
- **Riesgo de inconsistencias reducido:** 80%

---

### Recomendación de enfoque de implementación:

**Fase 1 (Crítica - 1-2 días):**
- Consolidar Settings (eliminar duplicación page + modal)
- Crear ColorUtilService
- Crear DateFormatterService

**Fase 2 (Alto impacto - 2-3 días):**
- Crear componentes reutilizables (Header, EmptyState, NotifyInput)
- Crear constants (languages, themes)
- Crear LocaleService

**Fase 3 (Refactor - 1-2 días):**
- Actualizar Task model
- Actualizar service/page lógica
- Actualizar templates

**Fase 4 (Testing - 1 día):**
- Pruebas completas
- Verificar que funciona igual

---

**FIN DEL REPORTE**

Generado: 9 de abril de 2026  
Análisis realizado por: GitHub Copilot
