#!/bin/sh

function stop_browser()
{
  curl -X PUT http://127.0.0.1/Service/Controller/Deactivate/WebKitBrowser
  exit
}

curl -X PUT http://127.0.0.1/Service/Controller/Activate/WebKitBrowser
curl -d "{\"url\":\"$1\"}" http://127.0.0.1/Service/WebKitBrowser/URL
trap stop_browser SIGKILL SIGINT SIGTERM
while true
do
    sleep 1
done
