@echo off
echo 🚀 Starting build process...

echo 📦 Installing dependencies...
npm install

echo 🔨 Building frontend...
cd Frontend
npm install
npm run build
cd ..

echo 📁 Creating dist directory if needed...
if not exist "dist" mkdir dist

echo 📋 Copying built files...
xcopy /E /I /Y Frontend\dist\* dist\

echo ✅ Build completed successfully!
echo 📂 Built files are in the dist/ directory
