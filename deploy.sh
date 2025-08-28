#!/bin/bash

# Script de deploy para Liga de Billar Rock & Cocktails
# Asegúrate de tener Firebase CLI instalado y configurado

echo \"🎱 Iniciando deploy de Liga de Billar Rock & Cocktails...\"

# Verificar que Firebase CLI esté instalado
if ! command -v firebase &> /dev/null; then
    echo \"❌ Firebase CLI no está instalado. Instalando...\"
    npm install -g firebase-tools
fi

# Verificar que el usuario esté logueado
echo \"🔐 Verificando autenticación de Firebase...\"
firebase projects:list > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo \"❌ No estás logueado en Firebase. Ejecutando login...\"
    firebase login
fi

# Instalar dependencias
echo \"📦 Instalando dependencias...\"
npm install

# Build del proyecto
echo \"🏗️ Construyendo proyecto para producción...\"
npm run build

# Verificar que el build fue exitoso
if [ $? -ne 0 ]; then
    echo \"❌ Error en el build. Deploy cancelado.\"
    exit 1
fi

# Deploy a Firebase
echo \"🚀 Deploying a Firebase...\"
firebase deploy

if [ $? -eq 0 ]; then
    echo \"✅ Deploy completado exitosamente!\"
    echo \"🌐 Tu aplicación está disponible en: https://tu-project-id.web.app\"
    echo \"🎉 ¡La liga está lista para competir!\"
else
    echo \"❌ Error durante el deploy.\"
    exit 1
fi