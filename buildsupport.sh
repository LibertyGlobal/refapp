mkdir build/img
mkdir build/cache

cp -avr ./src/img/. build/img/.
cp -avr ./src/cache/. build/cache/.
cp ./src/config.json build/config.json
sed -i '31d' ./build/startApp.js
sed -i "31 a style.sheet.insertRule('@media all { html {height: 100%; width: 100%;} *,body {margin:0; padding:0;opacity: 0.99 } canvas { position: absolute; z-index: 2; } body { width: 100%; height: 100%;} }');" ./build/startApp.js
