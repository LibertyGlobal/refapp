if exist static rd /s /q static
mkdir static
xcopy "./src/cache" "./static" /E
lng build
