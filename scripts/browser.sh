#!/bin/sh

function stop_browser()
{
  if [ -f /etc/WPEFramework/plugins/RDKShell.json ]; then
    curl -v --header "Content-Type:application/json" --request POST http://127.0.0.1:9998/jsonrpc --data-raw "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"org.rdk.RDKShell.1.destroy\", \"params\":{ \"callsign\": \"WebKitBrowser\"} }"
  else
    curl -X PUT http://127.0.0.1/Service/Controller/Deactivate/WebKitBrowser
  fi
  exit
}

if [ -f /etc/WPEFramework/plugins/RDKShell.json ]; then
  curl -v --header "Content-Type:application/json" --request POST http://127.0.0.1:9998/jsonrpc --data-raw "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"org.rdk.RDKShell.1.launch\", \"params\":{ \"callsign\": \"WebKitBrowser\", \"uri\":\"$1\" } }"
else
  curl -X PUT http://127.0.0.1/Service/Controller/Activate/WebKitBrowser
  curl -d "{\"url\":\"$1\"}" http://127.0.0.1/Service/WebKitBrowser/URL
fi

trap stop_browser SIGINT SIGTERM
while true
do
    sleep 1
done
