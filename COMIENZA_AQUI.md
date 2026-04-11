#  PROYECTO LISTO PARA PROBAR EN ANDROID STUDIO



##  Ubicación de Archivos

### Android Studio Project
```
c:\Users\AURO\Desktop\MiRecordatorio-equipo4\android
```

### GitHub
```
https://github.com/Felix-Santos/MiRecordatorio-nequipo4
```

---

##  COMIENZA AQUÍ - 5 Pasos Simples

### PASO 1️: Android Studio Abriendo...
Android Studio está iniciando automáticamente. Puede tomar 1-2 minutos cargar.

**Cuando veas la pantalla de Android Studio:**
- Se mostrará la carpeta `android` abierta
- En la barra inferior verás: "Gradle sync in progress..."

### PASO 2️: Espera Gradle (2-5 minutos)
```
Bottom Bar: "Gradle sync in progress..."
         ↓
         [Esperando...]
         ↓
     "Gradle build finished"
```

Si tarda más de 5 minutos:
- Build → Clean Build Folder
- Espera a que termine

### PASO 3️: Selecciona Dispositivo
En de Android Studio, en la barra superior:

**Opción A: Emulador (Recomendado)**
```
Top Bar: [Device Manager] ← Click aquí
         ↓
    Crea uno o inicia existente
         ↓
    Click en "Play" verde
         ↓
    Espera a cargar (1-2 min)
```

**Opción B: Dispositivo Físico**
```
Conecta por USB
         ↓
Habilita "Depuración USB"
         ↓
Aparecerá en Device Manager
         ↓
Selecciona en dropdown superior
```

### PASO 4️: Ejecuta la App
```
Barra Superior: [Run] → Run 'app'
         o
Presiona: Shift + F10
         o
Botón Play verde
```

**Espera:**
- Compilación: 1-2 minutos
- Instalación: 30-60 segundos
- Carga de app: 5-10 segundos

**Deberías ver tu app en el dispositivo**

### PASO 5️: Prueba Notificaciones
```
En la app abierta:

1. Toca "➕" (Nueva Tarea)
         ↓
2. Rellena:
   - Título: "Prueba"
   - Fecha: Hoy en 3 minutos
   - Notificar: 1 minuto antes
   - Prioridad: Alta
         ↓
3. Toca "Guardar" (botón verde)
         ↓
4. Espera 2 minutos...
         ↓
5. ¡VES LA NOTIFICACIÓN! 
   "Prueba está por vencer"
```

---





### Test 1: Completar Tarea
```
1. Crea una tarea con notificación
2. En la lista, marca como completada ✓
3. En Logcat verás:
    Notificación cancelada para tarea 1
```

### Test 2: Eliminar Tarea
```
1. Crea una tarea
2. Click icono basura
3. En Logcat verás:
    Notificación cancelada para tarea X
```

### Test 3: Restaurar Tarea
```
1. Ve a Papelera
2. Restaura una tarea eliminada
3. En Logcat verás:
    Notificación programada nuevamente
```

---

