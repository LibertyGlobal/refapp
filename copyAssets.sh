if [ -d "static" ]
then
  rm -r "static"
fi
mkdir static
cp -r "./src/config.ssm.json" "./static/config.ssm.json"
cp -r "./src/cache/." "./static/"
cp -r "./src/img/." "./static/images"
