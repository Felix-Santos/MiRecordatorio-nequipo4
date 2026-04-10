# Guía de Compilación Android - Mi Recordatorio

## Flujo de Trabajo Capacitor → Android Studio

### Fase 1: Desarrollo
```bash
# Iniciar servidor de desarrollo
npm start

# Compilar cambios
npm run build

# Sincronizar cambios con Android
npx cap sync
```

### Fase 2: Compilación APK (Desarrollo)
Desde Android Studio:
1. **Build** → **Build Bundles(s) / APK(s)** → **Build APK(s)**
2. APK se genera en: `android/app/build/outputs/apk/debug/app-debug.apk`

### Fase 3: Compilación de Producción (Play Store)
**Opción A: Signed Bundle (Recomendado)**
1. **Build** → **Generate Signed Bundle / APK**
2. Crear/Seleccionar keystore
3. Seleccionar "Bundle (Google Play)"
4. Genera: `.aab` (Android App Bundle)

**Opción B: Signed APK**
1. **Build** → **Generate Signed Bundle / APK**
2. Seleccionar "APK"

---

## Cambios Antes de Play Store

### 1. Actualizar `capacitor.config.ts`
```typescript
const config: CapacitorConfig = {
  appId: 'com.tuempresa.mirecordatorio',  // ← CAMBIAR ESTO
  appName: 'Mi Recordatorio',              // ← OPCIONAL
  webDir: 'www'
};
```

### 2. Sincronizar
```bash
npx cap sync
```

### 3. Revisar `android/app/build.gradle`
```gradle
versionCode 1         // Incrementar en cada release
versionName "1.0.0"   // Formato: major.minor.patch
```

### 4. Generar Signed Build
- Create new keystore (guardar en lugar seguro)
- Passwords fuertes
- Validez mínimo 25 años (para Play Store)

---

## Keystore Management

### Generar Keystore (primera vez)
```bash
keytool -genkey -v -keystore mi-recordatorio.keystore -keyalg RSA -keysize 2048 -validity 10000
```

### Usar Keystore existente
```bash
keytool -list -v -keystore mi-recordatorio.keystore
```

---

## Testing en Dispositivo

### Via Android Studio
```
Run → Run 'app'  (Ctrl+F9)
```

### Via Línea de Comandos
```bash
cd android
gradlew installDebug
```

---

## Tamaño de la App

**Componentes actuales**:
- Main bundle: 623 kB (JavaScript + Angular)
- Styles: 42 kB (CSS)
- Plugins: ~50 kB (Capacitor plugins)
- **APK final**: ~10-15 MB (depende de compresión)
- **AAB optimizado**: ~8-12 MB (Play Store)

---

## Checklist Pre-Release

- [ ] Cambiar `appId` a identificador único
- [ ] Probar en dispositivo físico
- [ ] Revisar permisos en AndroidManifest.xml
- [ ] Implementar autenticación segura
- [ ] Probar todas las características
- [ ] Verificar consumo de batería
- [ ] Generar Screenshots para Play Store
- [ ] Escribir descripción de la app
- [ ] Crear Signed Bundle para Play Store
- [ ] Enviar a Play Console

---

## Troubleshooting

### Errores de Gradle
```bash
cd android
gradlew clean
gradlew build
```

### Sincronización fallida
```bash
npx cap sync --production
```

### Plugins no funcionan
```bash
npx cap sync --prod
gradlew clean
```

### Build lento
- Aumentar memoria: `export _JAVA_OPTIONS="-Xmx4096m"`
- Usar gradle.properties: `org.gradle.jvmargs=-Xmx4096m`

---

## Información de Compilación

**Dispositivo objetivo**: Android 11+
**Compilación contra**: Android 35 (esquema Capacitor)
**Mínimo requerido**: Android 8.0

---

## Próximos Pasos

1. Abrir `android/` en Android Studio (ya hecho)
2. [ ] Esperar a que sync complete (gradle)
3. [ ] Build → Clean Build
4. [ ] Run en dispositivo/emulador
5. [ ] Probar funcionalidades
6. [ ] Preparar Signed Bundle
7. [ ] Subir a Play Console


