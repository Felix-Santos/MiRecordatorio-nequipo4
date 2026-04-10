# Guía Completa: Notificaciones en Android

## Estado Actual de tu App

Las notificaciones de tareas próximas a vencer ahora están **totalmente implementadas** usando el plugin `@capacitor/local-notifications` de Capacitor.

---

## Paso 1: Compilar la Aplicación

### En una terminal, corre:
```bash
cd c:\Users\AURO\Desktop\MiRecordatorio-equipo4
npm run build
npx cap sync
```

Esto actualizará todos los archivos de la app en el proyecto Android.

---

## Paso 2: Abrir Android Studio

### Opción A: Desde línea de comandos
```bash
npx cap open android
```

### Opción B: Manualmente
1. Abre Android Studio
2. File → Open → `c:\Users\AURO\Desktop\MiRecordatorio-equipo4\android`
3. Espera a que Gradle sincronice

---

## Paso 3: Esperar a Gradle Sync

Una vez abierto Android Studio:
- En la parte inferior aparecerá "Gradle sync in progress..."
- **Espera a que termine** (puede tomar 2-5 minutos)
- Cuando termine, verás "Gradle build finished"

---

## Paso 4: Configurar Emulador o Dispositivo

### OPCIÓN A: Usar Emulador (Más Fácil para Pruebas)

1. **Seleccionar emulador en Android Studio**:
   - En el toolbar: Device Manager (icono de teléfono)
   - O: Tools → Device Manager
   - Crea uno si no tienes: "Create Device" → Selecciona "Pixel 6" → Android 13+

2. **Iniciar emulador**:
   - Click en flecha "Play" junto al emulador
   - Espera a que cargue completamente (puede tomar 1-2 min)

### OPCIÓN B: Usar Dispositivo Físico (Android Recomendado)

1. **Conectar USB**:
   - Conecta tu teléfono Android con USB
   - Habilita "Opciones de Desarrollador":
     - Configuración → Información del teléfono
     - Toca "Número de compilación" 7 veces
     - Vuelve atrás → Opciones de desarrollador
     - Activa "Depuración USB"

2. **Verificar conexión en Android Studio**:
   - Tools → Device Manager
   - Tu dispositivo debe aparecer en la lista
   - Si no aparece, reinicia ADB: Tools → SDK Manager → (busca adb)

---

## Paso 5: Compilar y Ejecutar

### En Android Studio:

1. **Clean Build** (importante para la primera vez):
   - Build → Clean Build Folder
   - Espera a que termine

2. **Run**:
   - Run → Run 'app' (o presiona Shift+F10)
   - Selecciona tu dispositivo/emulador cuando lo pida
   - La app instalará y ejecutará automáticamente

### O desde línea de comandos:
```bash
cd c:\Users\AURO\Desktop\MiRecordatorio-equipo4\android
gradlew installDebug
```

---

## Paso 6: Probar Notificaciones

### Prueba 1: Ver Notificaciones de Prueba (5 segundos)

1. **Abre la consola de Android Studio**:
   - View → Tool Windows → Logcat
   
2. **En la app abierta, abre la lista de tareas**

3. **En la consola TypeScript (F12 en web), ejecuta**:
   ```javascript
   // Busca el servicio de notificaciones
   // Ejecuta en la consola del navegador si está en web
   ```

4. **Deberías ver una notificación "NOTIFICACIÓN DE PRUEBA" después de 5 segundos**

### Prueba 2: Crear una Tarea con Notificación

1. **En la app, ve a "Nueva Tarea"** (+)

2. **Rellena los campos**:
   - Título: "Reunión importante"
   - Fecha: Hoy en 2 minutos
   - Notificar antes: 1 minuto (importante: que sea menos que el tiempo hasta la tarea)
   - Prioridad: Alta

3. **Guarda la tarea** (botón verde)

4. **Espera el tiempo configurado**:
   - Si programaste "1 minuto antes", verás la notificación en 1 minuto
   - La notificación dirá: "Reunión importante está por vencer"

### Prueba 3: Verificar Notificaciones Pendientes

1. **Abre Logcat en Android Studio**

2. **El log mostrará algo como**:
   ```
   ✅ Notificación programada para tarea 1 a las 2026-04-10 16:30:00
   ```

3. **Busca en los logs**:
   ```
   filter: "Notificación programada"
   ```

---

## Debugging: Ver Logs en Consola

### En Android Studio (Logcat):

1. **Filter**:
   - Escribe en el field "Filter" cualquiera de:
     - `NotificationService` - Logs del servicio
     - `Capacitor` - Logs de Capacitor
     - `taskId` - Para buscar tareas específicas

2. **Nivel de log**:
   - Selecciona en el menú: "Verbose" para ver todo
   
3. **Buscar errores**:
   - Filtra por "error" o "Error"

### Ejemplo de logs exitosos:
```
I NotificationService: ✅ Notificación programada para tarea 1 a las 2026-04-10T16:35:00.000Z
I TaskService: 🔄 Reprogramando todas las notificaciones...
I NotificationService: ✅ Se reprogramaron 3 notificaciones
```

---

## Si las Notificaciones NO Funcionan

### 1. Verifica Permisos:
```bash
# En Android Studio Terminal:
adb shell pm grant io.ionic.starter android.permission.POST_NOTIFICATIONS
```

### 2. Reinicia el dispositivo/emulador:
```bash
adb reboot
```

### 3. Limpia la app:
```bash
adb shell pm clear io.ionic.starter
```

### 4. Desinstala e instala de nuevo:
- En Android Studio: Build → Clean Build Folder
- Run → Run 'app' (esto reinstalará)

### 5. Revisa que la fecha sea correcta:
- Las notificaciones NO se programan si la fecha de ejecución ya pasó
- Cada tarea debe: `date - notifyBeforeMinutes > now()`

### 6. Verifica los logs:
```bash
# Filtrar notificaciones
adb logcat | grep -i notification
```

---

## Checklist para Producción

- [ ] Cambiaste el appId de `io.ionic.starter` a tu ID único
- [ ] Las notificaciones funcionan en dispositivo físico
- [ ] Las notificaciones funcionan en emulador
- [ ] Los logs muestran "Notificación programada" cuando creas tareas
- [ ] Las notificaciones aparecen en la hora correcta
- [ ] Cuando completar una tarea, la notificación se cancela
- [ ] Cuando restaurar una tarea, la notificación se reprograma

---

## Cómo Funcionan las Notificaciones

```
Usuario crea tarea:
  ↓
  Fecha: 2026-04-10 16:35
  Notificar antes: 5 minutos
  ↓
  Se programa notificación para: 16:30
  ↓
  Android la mantiene en queue
  ↓
  Cuando llega la hora (16:30):
    - Si app está abierta: aparece notificación
    - Si app está cerrada: notificación en bandeja
```

---

## Funcionalidades Extras Disponibles

### En tu código TypeScript (si necesitas):

```typescript
// Mostrar notificación de prueba (en 5 segundos)
this.notificationService.showTestNotification();

// Ver notificaciones pendientes
const pending = await this.notificationService.getPendingNotifications();
console.log('Notificaciones pendientes:', pending);

// Cancelar todas las notificaciones
await this.notificationService.cancelAllNotifications();
```

---

## Solución Rápida de Problemas

| Problema | Solución |
|----------|----------|
| Notificaciones no aparecen | Verifica permisos con `adb shell pm grant...` |
| App se congela | Haz Clean Build y reinstala |
| Emulador lento | Uso API 31+ y sube RAM a 2GB |
| Permisos denegados | Abre Configuración → Aplicaciones → Mi Recordatorio → Permisos |
| Logs vacíos | Reinicia logcat o usa `adb logcat -c` |

---

## Documentación Oficial

- [Capacitor Local Notifications](https://capacitorjs.com/docs/apis/local-notifications)
- [Android Notifications Developer Guide](https://developer.android.com/develop/ui/views/notifications)
- [Permisos en Android 13+](https://developer.android.com/about/versions/13/changes/notification-permission)

---

## Conclusión

Tu aplicación ahora tiene un sistema completo de notificaciones que:
- Funciona en emulador y dispositivos
- Programa automáticamente con Capacitor
- Se cancela cuando completas tareas
- Se reprograma si editas la tarea
- Tiene permisos configurados en Android

**¡Estás listo para probar en dispositivo!**

