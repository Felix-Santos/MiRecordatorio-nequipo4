# Guía de Despliegue (Android/iOS)

Pasos completos para compilar y desplegar **Mi Recordatorio** en Android e iOS usando Capacitor.

## Requisitos previos

### Android

- **Android Studio** instalado (versión 2023.1+)
- **JDK 11+** (generalmente incluido con Android Studio)
- **SDK Platform** API 33+ instalado
- **Android Emulator** o dispositivo físico con USB debug enabled

### iOS

- **Mac con Xcode 14+** instalado
- **CocoaPods** instalado: `sudo gem install cocoapods`
- **iOS deployment target** mínimo 13.0

### General

- **Node.js 16+** y **npm** instalados
- Repositorio clonado localmente
- `npm install` ejecutado

## Pasos generales (Web y Native)

### 1. Instalar dependencias

```bash
cd MiRecordatorio-equipo4
npm install
npm install @capacitor-community/sqlite
```

### 2. Build web

```bash
npm run build
```

Esto genera la carpeta `www/` con el código compilado.

### 3. Sincronizar con Capacitor

```bash
npx cap sync
```

Copia el código web a los proyectos nativos (android/, ios/).

## Despliegue en Android

### Paso 1: Abrir en Android Studio

```bash
npx cap open android
```

Se abrirá Android Studio con el proyecto nativo.

### Paso 2: Seleccionar dispositivo/emulador

En Android Studio:
- Click en **Select Run Device** (o AVD dropdown)
- Crear emulador si no existe: **Device Manager > Create Virtual Device**
- Seleccionar el emulador creado

### Paso 3: Compilar y ejecutar

- Click en **Run 'app'** (o presionar `Shift+F10`)
- Esperar a que compile (`gradle build`) y se instale en el emulador

### Paso 4: Generar APK para distribución

Para crear un APK firmado (producción):

1. En Android Studio, ir a **Build > Build Bundle(s) / APK(s) > Build APK(s)**
2. Esperar a que compile
3. El APK se guardará en `android/app/release/` (unsigned por defecto)

**Para firmar con clave privada** (recomendado para Play Store):

```bash
# crear keystore (una sola vez)
keytool -genkey -v -keystore mi-recordatorio-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias mi-recordatorio

# firmar APK
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore mi-recordatorio-key.keystore app-release-unsigned.apk mi-recordatorio
```

### Configuración de Capacitor (Android)

En `android/app/src/main/AndroidManifest.xml`, asegúrate de que contenga los permisos necesarios:

```xml
<!-- Almacenamiento -->
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />

<!-- Internet -->
<uses-permission android:name="android.permission.INTERNET" />
```

### Validar persistencia SQLite

1. Ejecutar la app en el emulador
2. Crear usuario y tareas
3. En Android Studio: **View > Tool Windows > Device File Explorer**
4. Navegar a `/data/data/io.ionic.starter/databases/`
5. Buscar el archivo `mi_recordatorio_db` (creado por Ionic Storage + SQLite)

## Despliegue en iOS

### Paso 1: Abrir en Xcode

```bash
npx cap open ios
```

Se abrirá Xcode con el workspace iOS.

### Paso 2: Configurar equipo de desarrollador

En Xcode:
- Select **MiRecordatorio > Signing & Capabilities**
- En **Team**, selecciona tu equipo Apple Developer (si no aparece, añádelo en Xcode preferences)

### Paso 3: Seleccionar simulador o dispositivo

- En Xcode, arriba a la izquierda, selecciona el **scheme** y **device/simulator**
- Para simulador: elige un iPhone model (ej. iPhone 15 Pro)
- Para dispositivo físico: conecta via USB y selecciona

### Paso 4: Compilar y ejecutar

- Click en **▶ Play** (o `Cmd+R`)
- Esperar a que compile y se instale

### Configuración de Capacitor (iOS)

En `ios/App/Podfile`, verifica que contenga las dependencias:

```podfile
pod 'CapacitorSqlite'
pod 'CapacitorCore'
```

Si cambias dependencias, ejecuta:

```bash
cd ios/App
pod install --repo-update
cd ../..
```

### Validar persistencia SQLite

1. Ejecutar la app en el simulador
2. Crear usuario y tareas
3. En Xcode: **Debug > View Hierarchy** (para explorar almacenamiento)
4. O usar el **Firebug** de Safari en Simulator para inspecccionar.

## Publicación en Play Store (Android)

### Requisitos

- Cuenta Google Play Developer ($25 una sola vez)
- APK firmado (ver sección Android anterior)
- Icono de app (192×192 PNG mín.)
- Screenshots
- Descripción y políticas de privacidad

### Pasos resumidos

1. Crear "New App" en Google Play Console
2. Completar formulario: nombre, categoría, calificación
3. Subir APK firmado en **Release > Production**
4. Rellenar Store Listing: descripción, screenshots, ícono, etc.
5. Enviar a revisión (**Submit release**)
6. Google revisa (~2-4 horas)
7. Publicar cuando sea aprobado

## Publicación en App Store (iOS)

### Requisitos

- Cuenta Apple Developer ($99/año)
- Certificado de distribución (en Developer Account)
- App ID en Apple Developer

### Pasos resumidos

1. En Xcode, selecciona **Product > Archive**
2. En **Window > Organizer**, verifica el archivo y click **Distribute App**
3. Selecciona **App Store Connect**
4. Sigue el flujo: elegir certificados, completar datos de la app, etc.
5. TestFlight: puedes probar en dispositivos beta antes de publicar
6. Enviar a App Store para revisión
7. Apple revisa (~24-48 horas)
8. Publicar cuando sea aprobado

## Variables de entorno y configuración

Para diferencias entre desarrollo y producción, crea un archivo `.env` (o usa variables del sistema):

```bash
# .env (no subir a git)
PRODUCTION_API_URL=https://api.mirecordatorio.com
PRODUCTION_SQLITE_DB=mi_recordatorio_prod
```

En TypeScript, leer variables:

```typescript
const apiUrl = process.env['PRODUCTION_API_URL'] || 'http://localhost:3000';
```

## Troubleshooting del despliegue

### Android: "Build Failed" com.android.build.gradle.internal.tasks...

**Causa**: Gradle cache corrupto
**Solución**:
```bash
cd android
./gradlew clean
cd ..
npx cap open android
```

### iOS: "Podfile not found"

**Causa**: CocoaPods no sincronizado
**Solución**:
```bash
cd ios/App
pod install
cd ../..
npx cap open ios
```

### APK/IPA grande (>100 MB)

**Causa**: Dependencias/assets sin comprimir
**Solución**:
- Minificar en `ng build --prod --optimization`
- Remover assets no utilizados en `src/assets/`

### Storage no persiste en nativo

**Causa**: SQLite driver no inicializado
**Verificación**:
```typescript
import { Storage } from '@ionic/storage-angular';

constructor(private storage: Storage) {
  this.storage.create().then(() => {
    console.log('Storage driver ready');
  });
}
```

## Certificados y firmas

### Android: Crear keystore (una sola vez)

```bash
keytool -genkey -v \
  -keystore mi-recordatorio-release.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias mi-recordatorio
```

Guarda el keystore en un lugar seguro (NO en el repo).

### iOS: Certificado de distribución

En Apple Developer Account:
1. Create Certificate > App Store
2. Generar CSR en Xcode (Xcode > Preferences > Accounts)
3. Descargar certificado y agregar a Keychain
4. En Xcode, verifica en Signing & Capabilities

## Monitoreo en producción

Una vez publicada la app:

- **Android**: Google Play Console → Android vitals (crashlytics, performance).
- **iOS**: App Store Connect → App Analytics.

Integra un servicio de logging (Sentry, LogRocket, etc.) para rastrear errores en handlers:

```typescript
catch (error) {
  console.error('Error:', error);
  // sendToMonitoringService(error);  // Aquí reportar
}
```

---

Para más detalles:
- [Capacitor Android docs](https://capacitorjs.com/docs/guides/deploying-android)
- [Capacitor iOS docs](https://capacitorjs.com/docs/guides/deploying-ios)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://help.apple.com/app-store-connect)
