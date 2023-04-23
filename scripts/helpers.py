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

def get_naming_convention(name):
    # lastname, firstname
    name_list = name.split()
    new_name = name_list[-1] + ", " + " ".join(name_list[:-1])
    return new_name