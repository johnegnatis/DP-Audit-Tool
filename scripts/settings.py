from tinydb import TinyDB, Query
import json

def open_settings():
    try:
        base_prod = './build/databases/settings.json'
        base_dev = './public/databases/settings.json'
        test_dev = '../public/databases/settings.json'

        try:
            db = TinyDB(base_prod)
        except:
            try:
                db = TinyDB(base_dev)
            except:
                db = TinyDB(test_dev)
        return db
    except:
        raise Exception("Error: Error opening settings.json file.")

def get_all_settings():
    db = open_settings()
    return db.all()

def insert_settings(settings=[]):
    db = open_settings()
    db.truncate()    
    for row in settings:
        db.insert(row)

def settings(action, payload=[]):
    try:
        if action == "save":
            insert_settings(payload)
        elif action == "get":
            return get_all_settings()
        else:
            raise Exception("Error: Unsupported settings action.")
    except:
        raise Exception("Error: Database interaction failed.")

# find keys in frontend constants.js
def get_setting(key):
    try:
        db = open_settings()
        query = Query()
        query_result = db.search(query.key == key)
        query_result = query_result[0]
        return query_result['value']
    except Exception as e:
        return None