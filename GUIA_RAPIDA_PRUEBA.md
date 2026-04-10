# 🚀 GUÍA RÁPIDA DE PRUEBA - Android Studio

## ✅ Estado Actual

- ✅ GitHub: Código subido
- ✅ Android Studio: Abierto
- ✅ Proyecto: Listo para probar

---

## 📱 Pasos Rápidos (5 minutos)

### 1️⃣ Android Studio se abrió automáticamente
   - Espera a que termine de cargar (muestra banner "Gradle sync in progress...")
   - **Puede tomar 2-5 minutos** la primera vez

### 2️⃣ Verifica que Gradle se sincronizó
   - En la barra inferior debe decir: ✅ "Gradle build finished"
   - Si da error, intenta: Build → Clean Build Folder

### 3️⃣ Selecciona dispositivo/emulador
   - **Opción A (Emulador - Más fácil)**:
     - Device Manager (icono de teléfono en toolbar)
     - Crea uno si no tienes
     - Click en "Play" verde
   
   - **Opción B (Dispositivo físico)**:
     - Conecta por USB
     - Habilita "Depuración USB" en Configuración del teléfono
     - Debe aparecer en Device Manager

### 4️⃣ Ejecuta la app
   - Botón: **Run 'app'** (Shift+F10) o Run → Run 'app'
   - O desde terminal:
     ```bash
     cd android
     gradlew installDebug
     ```
   - Espera a que instale y se abra la app

### 5️⃣ Prueba las notificaciones

**Test 1: Crear tarea con notificación**
   1. Toca **"+"** para nueva tarea
   2. Rellena:
      - Título: "Prueba Notificación"
      - Fecha: **HOY en 3 minutos**
      - Notificar: **1 minuto antes**
      - Prioridad: Alta
   3. **Guarda** (botón verde)
   4. Espera 2 minutos
   5. **¡Deberías ver la notificación!** 🔔

**Test 2: Ver logs**
   1. View → Tool Windows → Logcat
   2. Filter: `NotificationService`
   3. Deberías ver:
      ```
      ✅ Notificación programada para tarea 1 a...
      ```

**Test 3: Completar tarea**
   1. Marca la tarea como completada ✓
   2. En Logcat verás:
      ```
      ❌ Notificación cancelada para tarea 1
      ```

---

## 🛠️ Si Algo No Funciona

### "Gradle sync in progress..." no termina
```bash
# En Android Studio terminal:
gradlew clean
gradlew build
```

### La app no instala
```bash
# Limpia y reinstala:
Build → Clean Build Folder
Run → Run 'app'
```

### No ves notificaciones (en emulador)
```bash
# Dale permisos de notificación:
adb shell pm grant io.ionic.starter android.permission.POST_NOTIFICATIONS

# Reinicia el emulador:
adb reboot
```

### Los logs están vacíos
- Asegúrate que Logcat tiene "Filter" en "Verbose" (no en "Info")
- Busca por "Notification" en el campo de búsqueda

---

## 📊 Checklist de Prueba

- [ ] Android Studio abierto
- [ ] Gradle sincronizado (Gradle build finished)
- [ ] Emulador/Dispositivo conectado
- [ ] App instalada y se ejecuta
- [ ] Puedes crear una tarea
- [ ] Creaste una tarea con notificación
- [ ] Viste la notificación al tiempo programado
- [ ] Los logs muestran "Notificación programada"
- [ ] Completaste la tarea y viste "Notificación cancelada"

---

## 🎯 Resultado Esperado

**Si todo funciona:**
1. Creas una tarea para dentro de 3 minutos
2. A los 2 minutos (1 minuto antes) ves una notificación: 
   ```
   ⏰ Recordatorio de Tarea
   "Prueba Notificación" está por vencer
   ```
3. En Android Studio Logcat ves:
   ```
   ✅ Notificación programada para tarea X a las 2026-04-10T...
   ```

---

## 🔗 GitHub

Tu código está en:
```
https://github.com/Felix-Santos/MiRecordatorio-nequipo4
```

Últimos cambios:
- ✅ NotificationService implementado
- ✅ TaskService integrado
- ✅ Permisos en AndroidManifest.xml
- ✅ Documentación completa
- ✅ Proyecto Android listo

---

## 📚 Documentación en el Proyecto

Dentro del proyecto encontrarás:
- `GUIA_NOTIFICACIONES_ANDROID.md` - Guía completa
- `RESUMEN_NOTIFICACIONES.md` - Resumen y checklist
- `GUIA_COMPILACION_ANDROID.md` - Build y compilación

---

## ⏱️ Timings Esperados

| Acción | Tiempo |
|--------|--------|
| Gradle sync inicial | 2-5 min |
| Build de la app | 1-2 min |
| Instalación en emulador | 30-60 seg |
| Primera ejecución | 5-10 seg |
| Programación de notificación | Inmediato |
| Aparición de notificación | En el tiempo programado |

---

## 🆘 Ayuda Rápida

**¿Las notificaciones no aparecen pero la app va bien?**
- Crea una tarea para AHORA con 1 minuto antes
- O crea para dentro de 30 segundos
- Asegúrate que es: `taskDate - notifyBeforeMinutes > now()`

**¿No ves logs en Logcat?**
- Filtro debe ser: búsqueda por "Notification"
- Nivel de log: "Verbose" o "Debug"

**¿El dispositivo no aparece en Device Manager?**
```bash
adb kill-server
adb start-server
```

---

## 🎉 ¡Estás Listo!

Tu aplicación completa está lista para probar con:
✅ Notificaciones automáticas
✅ Proyector Android configurado
✅ Documentación completa
✅ Código en GitHub

**¡Ahora abre Android Studio y prueba!** 🚀

