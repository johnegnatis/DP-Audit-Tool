import os
import sys
import http.server
import socketserver
import shutil
from scripts import get_server_path, get_server_name

class HTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        http.server.SimpleHTTPRequestHandler.end_headers(self)
        
def server(port):
    httpd = socketserver.TCPServer(('', port), HTTPRequestHandler)
    return httpd

def host_server(port):
    httpd = server(port)
    try:
        server_name = get_server_name()
        if not os.path.exists(server_name):
            os.makedirs(server_name)
        os.chdir(server_name)
        print("\nserving from build/ at localhost:" + str(port))
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n...shutting down http server")
        httpd.shutdown()
        sys.exit()