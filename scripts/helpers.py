import os

def get_server_path():
    server_name = '/build/server'
    return os.getcwd() + server_name

def tree_printer():
    root = '.'
    for root, dirs, files in os.walk(root):
        for d in dirs:
            print(os.path.join(root, d))    
        for f in files:
            print(os.path.join(root, f))