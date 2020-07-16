if [ -d "static" ]
then
  rm -r "static"
fi
mkdir static
cp -r "./src/cache/." "./static/"
