import os

def get_server_name():
    return 'server';

def get_server_path():
    return os.getcwd() + '/' + get_server_name()

def tree_printer():
    root = '.'
    for root, dirs, files in os.walk(root):
        for d in dirs:
            print(os.path.join(root, d))    
        for f in files:
            print(os.path.join(root, f))