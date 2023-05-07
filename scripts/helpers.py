from os import getcwd

def get_server_path():
    server_name = '/build/server'
    return getcwd() + server_name

def get_naming_convention(name):
    # lastname, firstname
    name_list = name.split()
    new_name = name_list[-1] + ", " + " ".join(name_list[:-1])
    return new_name