import json
def open_database():
    base_prod = './build/databases/database.json'
    base_dev = './public/databases/database.json'
    test_dev = '../public/databases/database.json'

    try:
        f = open(base_prod)
    except:
        try:
            f = open(base_dev)
        except:
            f = open(test_dev)
    return json.load(f)

def get_options_for_frontend():
    database = open_database()
    return json.dumps(database)