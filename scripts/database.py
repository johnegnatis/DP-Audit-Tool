from json import load, dumps
def open_database():
    base_prod = './build/databases/database.json'
    base_dev = './public/databases/database.json'
    test_dev = '../public/databases/database.json'

    try:
        try:
            f = open(base_prod)
        except Exception as e:
            try:
                f = open(base_dev)
            except Exception as e:
                f = open(test_dev)
        return load(f)
    except Exception as e:
        print(e)
        raise Exception("Error: Open Database was unsuccessful. Check that databases/database.json exists and try again.")

def get_options_for_frontend():
    database = open_database()
    return dumps(database)