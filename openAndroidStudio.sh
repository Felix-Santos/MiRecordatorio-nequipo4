#!/bin/bash
# Script para abrir Android Studio con el proyecto

# Opción 1: Desde línea de comandos (ya ejecutado)
cd "c:\Users\AURO\Desktop\MiRecordatorio-equipo4"
npx cap open android

# Opción 2: Manualmente
# 1. Abre Android Studio
# 2. File → Open
# 3. Navega a: c:\Users\AURO\Desktop\MiRecordatorio-equipo4\android
# 4. Click en carpeta "android" y selecciona
# 5. Click "Open"

# La app debería abrirse automáticamente
echo "✅ android proyecto abierto en Android Studio"
echo "⏳ Espera a que Gradle sincronice (2-5 minutos)"
echo "📱 Selecciona dispositivo/emulador"
echo "▶️  Ejecuta con Shift+F10"
