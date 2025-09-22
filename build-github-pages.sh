#!/bin/bash

# Script para construir la aplicación para GitHub Pages
# Repository: timer

echo "🏗️  Construyendo FitTimer Pro para GitHub Pages..."

# Construir la aplicación
echo "📦 Ejecutando build de Vite..."
cd client && npm run build

# Crear directorio de deployment si no existe
mkdir -p ../github-pages-deploy

# Copiar archivos de build al directorio de deployment
echo "📁 Copiando archivos de build..."
cp -r ../dist/public/* ../github-pages-deploy/

# Copiar el 404.html original con script de redirección SPA
echo "🔧 Configurando SPA routing para GitHub Pages..."
cp ../client/public/404.html ../github-pages-deploy/404.html

# Actualizar rutas en index.html para usar base path correcto
echo "🔗 Actualizando rutas para base path '/timer/'..."

# Crear archivo temporal con las rutas corregidas
sed 's|="/|="/timer/|g' ../github-pages-deploy/index.html > ../github-pages-deploy/index_tmp.html
mv ../github-pages-deploy/index_tmp.html ../github-pages-deploy/index.html

sed 's|="/|="/timer/|g' ../github-pages-deploy/404.html > ../github-pages-deploy/404_tmp.html
mv ../github-pages-deploy/404_tmp.html ../github-pages-deploy/404.html

echo "✅ Build completado!"
echo "📂 Archivos listos en: github-pages-deploy/"
echo "📋 Pasos siguientes:"
echo "   1. Copia todo el contenido de 'github-pages-deploy/' a la rama gh-pages"
echo "   2. Haz push de la rama gh-pages a GitHub"
echo "   3. Configura GitHub Pages para usar la rama gh-pages"